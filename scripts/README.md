# Database Population Scripts

This directory contains scripts to populate your MongoDB database with dummy data from `dummyData.json` using API calls.

## Files

- **`populateDatabase.js`** - Basic population script with retry logic
- **`populateDatabaseEnhanced.js`** - Enhanced script with batch processing and detailed reporting
- **`config.json`** - Configuration file for API endpoints and options
- **`README.md`** - This documentation file

## Prerequisites

1. **Backend API Server Running**: Make sure your backend API server is running and accessible
2. **Node.js Dependencies**: The scripts use `axios` and `fs` modules
3. **API Endpoints**: Your backend should have endpoints for:
   - `POST /api/users` - Create users
   - `POST /api/grievances` - Create grievances
   - `GET /api/health` - Health check (optional)

## Configuration

Edit `config.json` to match your API setup:

```json
{
  "apiConfig": {
    "baseUrl": "http://localhost:3001/api",
    "endpoints": {
      "users": "/users",
      "grievances": "/grievances",
      "health": "/health"
    },
    "timeout": 10000,
    "retryAttempts": 3,
    "retryDelay": 1000
  },
  "options": {
    "batchSize": 10,
    "delayBetweenRequests": 100,
    "verbose": true
  }
}
```

### Configuration Options

- **`baseUrl`**: Your backend API base URL
- **`endpoints`**: API endpoint paths
- **`timeout`**: Request timeout in milliseconds
- **`retryAttempts`**: Number of retry attempts for failed requests
- **`retryDelay`**: Delay between retries in milliseconds
- **`batchSize`**: Number of items to process in parallel
- **`delayBetweenRequests`**: Delay between individual requests
- **`verbose`**: Enable detailed logging

## Usage

### Basic Script

```bash
# From the civicChain root directory
node scripts/populateDatabase.js

# Or with custom API URL
API_BASE_URL=http://your-api-server:3000/api node scripts/populateDatabase.js
```

### Enhanced Script (Recommended)

```bash
# From the civicChain root directory
node scripts/populateDatabaseEnhanced.js

# Or with custom API URL
API_BASE_URL=http://your-api-server:3000/api node scripts/populateDatabaseEnhanced.js
```

### Make Scripts Executable (Optional)

```bash
chmod +x scripts/populateDatabase.js
chmod +x scripts/populateDatabaseEnhanced.js

# Then run directly
./scripts/populateDatabaseEnhanced.js
```

## Features

### Basic Script (`populateDatabase.js`)
- ✅ Loads dummy data from `dummyData.json`
- ✅ Creates users and grievances via API calls
- ✅ Retry logic for failed requests
- ✅ Colored console output
- ✅ Error reporting and summary

### Enhanced Script (`populateDatabaseEnhanced.js`)
- ✅ All features from basic script
- ✅ Batch processing for better performance
- ✅ Configurable via `config.json`
- ✅ API connectivity testing
- ✅ Detailed progress reporting
- ✅ Performance metrics
- ✅ Graceful error handling
- ✅ Parallel processing within batches

## Expected API Schema

### User Object
```json
{
  "walletAddress": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  "fullName": "Priya Sharma",
  "dateOfBirth": "1995-03-15",
  "addressLine1": "Flat No. 101, Surya Apartments",
  "addressLine2": "Gandhi Nagar",
  "city": "Bengaluru",
  "state": "karnataka",
  "pincode": "560001",
  "phoneNumber": "9876543210",
  "registrationDate": "2023-01-10T10:00:00Z",
  "isVerified": true
}
```

### Grievance Object
```json
{
  "grievanceId": "GRV001",
  "walletAddress": "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
  "citizenName": "Priya Sharma",
  "citizenEmail": "priya.sharma@example.com",
  "citizenPhone": "9876543210",
  "citizenAddress": "Full address string",
  "description": "Grievance description",
  "department": "electricity",
  "state": "karnataka",
  "status": "raised",
  "priority": "high",
  "submittedAt": "2025-01-10T14:30:00Z",
  "transactionHash": "0x123...",
  "blockNumber": "123456",
  "gasUsed": "21000",
  "category": "Utilities",
  "timeline": [...]
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   Error: Cannot connect to API server
   ```
   - Make sure your backend server is running
   - Check the API URL in config.json
   - Verify the server is accessible

2. **Authentication Errors**
   ```
   Error: HTTP 401: Unauthorized
   ```
   - Check if your API requires authentication
   - Add authentication headers if needed

3. **Validation Errors**
   ```
   Error: HTTP 400: Bad Request
   ```
   - Check if your API schema matches the dummy data structure
   - Review error messages for specific validation issues

4. **Rate Limiting**
   ```
   Error: HTTP 429: Too Many Requests
   ```
   - Increase `delayBetweenRequests` in config.json
   - Reduce `batchSize` for slower processing

### Debugging

1. **Enable Verbose Mode**: Set `"verbose": true` in config.json
2. **Check API Logs**: Monitor your backend server logs
3. **Test Individual Endpoints**: Use tools like Postman or curl to test your API
4. **Network Issues**: Check firewall and network connectivity

## Sample Output

```
🚀 CivicChain Database Population Script v2.0
════════════════════════════════════════════════════════════
ℹ API Base URL: http://localhost:3001/api
ℹ Batch Size: 10
ℹ Retry Attempts: 3
ℹ Request Timeout: 10000ms
⏳ Loading dummy data...
✓ Loaded 25 users and 25 grievances
⏳ Testing API connection...
✓ API health check passed

📋 Processing 25 users in batches of 10
⏳ Processing batch 1/3 (10 items)
✓ Batch 1 completed: 10/10 successful
⏳ Processing batch 2/3 (10 items)
✓ Batch 2 completed: 10/10 successful
⏳ Processing batch 3/3 (5 items)
✓ Batch 3 completed: 5/5 successful

📋 Processing 25 grievances in batches of 10
⏳ Processing batch 1/3 (10 items)
✓ Batch 1 completed: 10/10 successful
⏳ Processing batch 2/3 (10 items)
✓ Batch 2 completed: 10/10 successful
⏳ Processing batch 3/3 (5 items)
✓ Batch 3 completed: 5/5 successful

📊 POPULATION SUMMARY
════════════════════════════════════════════════════════════
Execution Time: 12.34 seconds
Start Time: 2025-07-12T10:00:00.000Z
End Time: 2025-07-12T10:00:12.340Z

──────────────────────────────
Users:
  ✓ Successfully created: 25
  ✗ Failed: 0
  ℹ Success rate: 100.0%
Grievances:
  ✓ Successfully created: 25
  ✗ Failed: 0
  ℹ Success rate: 100.0%
──────────────────────────────
Total Summary:
  ✓ Total successful: 50
  ✗ Total failed: 0
  ℹ Overall success rate: 100.0%
  ℹ Processing speed: 4.05 items/second
════════════════════════════════════════════════════════════

🎉 Database population completed successfully!
```

## Data Overview

The dummy data includes:
- **25 Users** from different states across India
- **25 Grievances** with various statuses, departments, and priorities
- **Realistic Data** including wallet addresses, contact information, and detailed grievance descriptions

### States Covered
- Karnataka, Maharashtra, Tamil Nadu, Uttar Pradesh, Punjab, Delhi, Chandigarh

### Departments Included
- Electricity, Public Works, Water Supply, Education, Municipal Services
- Health & Medical, Police & Security, Social Welfare, Agriculture, Environment

### Grievance Statuses
- `raised` - Newly submitted
- `in_progress` - Being processed
- `resolved` - Successfully resolved
- `failed` - Could not be resolved

## Security Notes

- The scripts include sample wallet addresses for testing only
- Never use these wallet addresses in production
- Ensure your API has proper validation and security measures
- Consider using environment variables for sensitive configuration

## License

This script is part of the CivicChain project and follows the same license terms.
