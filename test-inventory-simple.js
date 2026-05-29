const axios = require('axios');

async function testInventoryEndpoints() {
  const baseUrl = 'http://localhost:3001/api';
  
  console.log('🧪 Testing inventory endpoints...');
  
  // Test if server is running
  try {
    console.log('\n🔍 Testing server connectivity...');
    const healthResponse = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
    console.log('✅ Server is running');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running on port 3001');
      console.log('💡 Please start the server with: npm run start:dev');
      return;
    }
    console.log('⚠️ Server responded but /health endpoint might not exist');
  }
  
  // Test inventory endpoints
  const endpoints = [
    { path: '/admin/inventory', name: 'Get All Inventory' },
    { path: '/admin/inventory/stores', name: 'Get Stores' },
    { path: '/admin/inventory/products', name: 'Get Products' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint.name}`);
      console.log(`   URL: ${baseUrl}${endpoint.path}`);
      
      const response = await axios.get(`${baseUrl}${endpoint.path}`, {
        headers: {
          'Authorization': 'Bearer test-token'
        },
        timeout: 10000
      });
      
      console.log(`✅ ${endpoint.name}: ${response.status} - ${response.statusText}`);
      console.log(`   Data length: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log(`   Sample item:`, JSON.stringify(response.data[0], null, 2));
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.statusText}`);
        console.log(`   Error body:`, error.response.data);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
  }
}

testInventoryEndpoints().catch(console.error);
