#!/usr/bin/env node

/**
 * Enhanced Database Population Script with Configuration
 * 
 * This script reads dummy data and configuration to populate MongoDB
 * through API calls with better error handling and batch processing.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// Build API URLs
const API_BASE_URL = process.env.API_BASE_URL || config.apiConfig.baseUrl;
const USERS_ENDPOINT = `${API_BASE_URL}${config.apiConfig.endpoints.users}`;
const GRIEVANCES_ENDPOINT = `${API_BASE_URL}${config.apiConfig.endpoints.grievances}`;
const HEALTH_ENDPOINT = `${API_BASE_URL}${config.apiConfig.endpoints.health}`;

// Console colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Enhanced logger
const logger = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}${colors.bright}${msg}${colors.reset}`),
  progress: (msg) => console.log(`${colors.magenta}⏳ ${msg}${colors.reset}`)
};

/**
 * Load dummy data from JSON file
 */
function loadDummyData() {
  try {
    const dataPath = path.join(__dirname, '..', 'dummyData.json');
    logger.info(`Loading data from: ${dataPath}`);
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    logger.error(`Failed to load dummy data: ${error.message}`);
    throw error;
  }
}

/**
 * Make HTTP request with retry logic
 */
async function makeRequest(method, url, data = null) {
  const maxRetries = config.apiConfig.retryAttempts;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const requestConfig = {
        method,
        url,
        timeout: config.apiConfig.timeout,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'CivicChain-PopulateDB/1.0'
        }
      };
      
      if (data) {
        requestConfig.data = data;
      }
      
      const response = await axios(requestConfig);
      return response;
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = config.apiConfig.retryDelay * attempt;
      logger.warning(`Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Test API connectivity
 */
async function testApiConnection() {
  logger.progress('Testing API connection...');
  
  try {
    await makeRequest('GET', HEALTH_ENDPOINT);
    logger.success('API health check passed');
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.error('Cannot connect to API server. Make sure your backend server is running.');
      logger.info(`Expected API URL: ${API_BASE_URL}`);
      return false;
    } else if (error.response?.status === 404) {
      logger.warning('Health endpoint not found, but server is reachable. Continuing...');
      return true;
    } else {
      logger.warning(`Health check failed: ${error.message}. Attempting to continue...`);
      return true;
    }
  }
}

/**
 * Process data in batches
 */
async function processBatch(items, endpoint, itemType) {
  const batchSize = config.options.batchSize;
  const results = { success: 0, failed: 0, errors: [] };
  
  logger.header(`\n📋 Processing ${items.length} ${itemType}s in batches of ${batchSize}`);
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(items.length / batchSize);
    
    logger.progress(`Processing batch ${batchNum}/${totalBatches} (${batch.length} items)`);
    
    // Process batch items in parallel
    const promises = batch.map(async (item, index) => {
      const globalIndex = i + index + 1;
      const identifier = item.fullName || item.grievanceId || `Item ${globalIndex}`;
      
      try {
        if (config.options.verbose) {
          logger.info(`Creating ${itemType} ${globalIndex}/${items.length}: ${identifier}`);
        }
        
        const response = await makeRequest('POST', endpoint, item);
        
        if (response.status >= 200 && response.status < 300) {
          if (config.options.verbose) {
            logger.success(`${itemType} created: ${identifier}`);
          }
          return { success: true, item: identifier };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message;
        logger.error(`Failed to create ${itemType} ${identifier}: ${errorMsg}`);
        return { success: false, item: identifier, error: errorMsg };
      }
    });
    
    // Wait for batch to complete
    const batchResults = await Promise.all(promises);
    
    // Update results
    batchResults.forEach(result => {
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          item: result.item,
          error: result.error
        });
      }
    });
    
    logger.success(`Batch ${batchNum} completed: ${batchResults.filter(r => r.success).length}/${batchResults.length} successful`);
    
    // Delay between batches
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, config.options.delayBetweenRequests * 2));
    }
  }
  
  return results;
}

/**
 * Print detailed summary
 */
function printSummary(userResults, grievanceResults, startTime) {
  const endTime = new Date();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  logger.header('\n📊 POPULATION SUMMARY');
  console.log('═'.repeat(60));
  
  // Timing info
  console.log(`${colors.bright}Execution Time:${colors.reset} ${duration} seconds`);
  console.log(`${colors.bright}Start Time:${colors.reset} ${startTime.toISOString()}`);
  console.log(`${colors.bright}End Time:${colors.reset} ${endTime.toISOString()}`);
  
  console.log('\n' + '─'.repeat(30));
  
  // Users summary
  console.log(`${colors.bright}Users:${colors.reset}`);
  console.log(`  ${colors.green}✓ Successfully created: ${userResults.success}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${userResults.failed}${colors.reset}`);
  if (userResults.success > 0) {
    console.log(`  ${colors.blue}ℹ Success rate: ${((userResults.success / (userResults.success + userResults.failed)) * 100).toFixed(1)}%${colors.reset}`);
  }
  
  // Grievances summary
  console.log(`${colors.bright}Grievances:${colors.reset}`);
  console.log(`  ${colors.green}✓ Successfully created: ${grievanceResults.success}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${grievanceResults.failed}${colors.reset}`);
  if (grievanceResults.success > 0) {
    console.log(`  ${colors.blue}ℹ Success rate: ${((grievanceResults.success / (grievanceResults.success + grievanceResults.failed)) * 100).toFixed(1)}%${colors.reset}`);
  }
  
  // Total summary
  const totalSuccess = userResults.success + grievanceResults.success;
  const totalFailed = userResults.failed + grievanceResults.failed;
  const totalItems = totalSuccess + totalFailed;
  
  console.log('─'.repeat(30));
  console.log(`${colors.bright}Total Summary:${colors.reset}`);
  console.log(`  ${colors.green}✓ Total successful: ${totalSuccess}${colors.reset}`);
  console.log(`  ${colors.red}✗ Total failed: ${totalFailed}${colors.reset}`);
  console.log(`  ${colors.blue}ℹ Overall success rate: ${totalItems > 0 ? ((totalSuccess / totalItems) * 100).toFixed(1) : 0}%${colors.reset}`);
  
  // Performance metrics
  if (totalSuccess > 0) {
    const itemsPerSecond = (totalSuccess / parseFloat(duration)).toFixed(2);
    console.log(`  ${colors.blue}ℹ Processing speed: ${itemsPerSecond} items/second${colors.reset}`);
  }
  
  // Error summary
  if (userResults.errors.length > 0 || grievanceResults.errors.length > 0) {
    logger.header('\n❌ ERROR DETAILS');
    
    if (userResults.errors.length > 0) {
      console.log(`${colors.bright}User Creation Errors (${userResults.errors.length}):${colors.reset}`);
      userResults.errors.slice(0, 10).forEach((err, idx) => {
        console.log(`  ${idx + 1}. ${err.item}: ${err.error}`);
      });
      if (userResults.errors.length > 10) {
        console.log(`  ... and ${userResults.errors.length - 10} more errors`);
      }
    }
    
    if (grievanceResults.errors.length > 0) {
      console.log(`${colors.bright}Grievance Creation Errors (${grievanceResults.errors.length}):${colors.reset}`);
      grievanceResults.errors.slice(0, 10).forEach((err, idx) => {
        console.log(`  ${idx + 1}. ${err.item}: ${err.error}`);
      });
      if (grievanceResults.errors.length > 10) {
        console.log(`  ... and ${grievanceResults.errors.length - 10} more errors`);
      }
    }
  }
  
  console.log('═'.repeat(60));
}

/**
 * Main execution function
 */
async function main() {
  const startTime = new Date();
  
  try {
    logger.header('🚀 CivicChain Database Population Script v2.0');
    console.log('═'.repeat(60));
    
    // Display configuration
    logger.info(`API Base URL: ${API_BASE_URL}`);
    logger.info(`Batch Size: ${config.options.batchSize}`);
    logger.info(`Retry Attempts: ${config.apiConfig.retryAttempts}`);
    logger.info(`Request Timeout: ${config.apiConfig.timeout}ms`);
    
    // Load dummy data
    logger.progress('Loading dummy data...');
    const data = loadDummyData();
    logger.success(`Loaded ${data.users.length} users and ${data.grievances.length} grievances`);
    
    // Test API connection
    const apiAvailable = await testApiConnection();
    if (!apiAvailable) {
      logger.error('Cannot proceed without API connection. Please start your backend server.');
      process.exit(1);
    }
    
    // Process users
    const userResults = await processBatch(data.users, USERS_ENDPOINT, 'user');
    
    // Small delay between user and grievance creation
    logger.progress('Waiting before processing grievances...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Process grievances
    const grievanceResults = await processBatch(data.grievances, GRIEVANCES_ENDPOINT, 'grievance');
    
    // Print comprehensive summary
    printSummary(userResults, grievanceResults, startTime);
    
    // Determine exit code
    const totalFailed = userResults.failed + grievanceResults.failed;
    if (totalFailed === 0) {
      logger.success('\n🎉 Database population completed successfully!');
      process.exit(0);
    } else if (userResults.success > 0 || grievanceResults.success > 0) {
      logger.warning('\n⚠️ Database population completed with some errors.');
      process.exit(0); // Partial success is still OK
    } else {
      logger.error('\n💥 Database population failed completely.');
      process.exit(1);
    }
    
  } catch (error) {
    logger.error(`\n💥 Script execution failed: ${error.message}`);
    if (config.options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.warning('\n⚠️ Script interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.warning('\n⚠️ Script terminated');
  process.exit(1);
});

// Start the script
if (require.main === module) {
  main();
}

module.exports = {
  main,
  processBatch,
  loadDummyData,
  testApiConnection
};
