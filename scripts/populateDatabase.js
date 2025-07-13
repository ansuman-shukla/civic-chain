#!/usr/bin/env node

/**
 * Database Population Script
 * 
 * This script reads dummy data from dummyData.json and populates the MongoDB
 * database through API calls for testing purposes.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration - Update these URLs according to your backend API endpoints
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const GRIEVANCES_ENDPOINT = `${API_BASE_URL}/grievances`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Logger utility for better console output
 */
const logger = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

/**
 * Read and parse the dummy data file
 */
function loadDummyData() {
  try {
    const dataPath = path.join(__dirname, '..', 'dummyData.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    logger.error(`Failed to load dummy data: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Make a POST request with retry logic
 */
async function makePostRequest(url, data, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 seconds timeout
      });
      return response;
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      logger.warning(`Request failed, retrying... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
}

/**
 * Test API connectivity
 */
async function testConnection() {
  try {
    logger.info('Testing API connectivity...');
    const healthCheck = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    logger.success('API connection successful');
    return true;
  } catch (error) {
    logger.warning('Health check endpoint not available, proceeding with data insertion...');
    return true; // Continue anyway, health endpoint might not exist
  }
}

/**
 * Create users in the database
 */
async function createUsers(users) {
  logger.header('\n📋 Creating Users...');
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    try {
      logger.info(`Creating user ${i + 1}/${users.length}: ${user.fullName} (${user.walletAddress})`);
      
      const response = await makePostRequest(USERS_ENDPOINT, user);
      
      if (response.status >= 200 && response.status < 300) {
        logger.success(`User created: ${user.fullName}`);
        results.success++;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      results.failed++;
      const errorMsg = error.response?.data?.message || error.message;
      logger.error(`Failed to create user ${user.fullName}: ${errorMsg}`);
      results.errors.push({
        user: user.fullName,
        error: errorMsg
      });
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Create grievances in the database
 */
async function createGrievances(grievances) {
  logger.header('\n📝 Creating Grievances...');
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < grievances.length; i++) {
    const grievance = grievances[i];
    try {
      logger.info(`Creating grievance ${i + 1}/${grievances.length}: ${grievance.grievanceId} (${grievance.citizenName})`);
      
      const response = await makePostRequest(GRIEVANCES_ENDPOINT, grievance);
      
      if (response.status >= 200 && response.status < 300) {
        logger.success(`Grievance created: ${grievance.grievanceId}`);
        results.success++;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      results.failed++;
      const errorMsg = error.response?.data?.message || error.message;
      logger.error(`Failed to create grievance ${grievance.grievanceId}: ${errorMsg}`);
      results.errors.push({
        grievance: grievance.grievanceId,
        error: errorMsg
      });
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Print summary of results
 */
function printSummary(userResults, grievanceResults) {
  logger.header('\n📊 POPULATION SUMMARY');
  console.log('═'.repeat(50));
  
  // Users summary
  console.log(`${colors.bright}Users:${colors.reset}`);
  console.log(`  ${colors.green}✓ Successfully created: ${userResults.success}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${userResults.failed}${colors.reset}`);
  
  // Grievances summary
  console.log(`${colors.bright}Grievances:${colors.reset}`);
  console.log(`  ${colors.green}✓ Successfully created: ${grievanceResults.success}${colors.reset}`);
  console.log(`  ${colors.red}✗ Failed: ${grievanceResults.failed}${colors.reset}`);
  
  // Total summary
  const totalSuccess = userResults.success + grievanceResults.success;
  const totalFailed = userResults.failed + grievanceResults.failed;
  console.log('─'.repeat(30));
  console.log(`${colors.bright}Total:${colors.reset}`);
  console.log(`  ${colors.green}✓ Total successful: ${totalSuccess}${colors.reset}`);
  console.log(`  ${colors.red}✗ Total failed: ${totalFailed}${colors.reset}`);
  
  // Error details
  if (userResults.errors.length > 0 || grievanceResults.errors.length > 0) {
    logger.header('\n❌ ERROR DETAILS');
    
    if (userResults.errors.length > 0) {
      console.log(`${colors.bright}User Errors:${colors.reset}`);
      userResults.errors.forEach(err => {
        console.log(`  • ${err.user}: ${err.error}`);
      });
    }
    
    if (grievanceResults.errors.length > 0) {
      console.log(`${colors.bright}Grievance Errors:${colors.reset}`);
      grievanceResults.errors.forEach(err => {
        console.log(`  • ${err.grievance}: ${err.error}`);
      });
    }
  }
  
  console.log('═'.repeat(50));
}

/**
 * Main execution function
 */
async function main() {
  try {
    logger.header('🚀 CivicChain Database Population Script');
    console.log('═'.repeat(50));
    
    // Load dummy data
    logger.info('Loading dummy data...');
    const data = loadDummyData();
    logger.success(`Loaded ${data.users.length} users and ${data.grievances.length} grievances`);
    
    // Test API connection
    await testConnection();
    
    // Create users
    const userResults = await createUsers(data.users);
    
    // Create grievances
    const grievanceResults = await createGrievances(data.grievances);
    
    // Print summary
    printSummary(userResults, grievanceResults);
    
    if (userResults.failed === 0 && grievanceResults.failed === 0) {
      logger.success('\n🎉 Database population completed successfully!');
      process.exit(0);
    } else {
      logger.warning('\n⚠️ Database population completed with some errors.');
      process.exit(1);
    }
    
  } catch (error) {
    logger.error(`\n💥 Script execution failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.warning('\n⚠️ Script interrupted by user');
  process.exit(1);
});

// Start the script
if (require.main === module) {
  main();
}

module.exports = {
  main,
  createUsers,
  createGrievances,
  loadDummyData
};
