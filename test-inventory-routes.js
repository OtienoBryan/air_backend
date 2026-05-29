const axios = require('axios');

async function testInventoryRoutes() {
  const baseUrl = 'http://localhost:3001/api';
  
  console.log('🧪 Testing inventory routes...');
  
  const routes = [
    '/admin/inventory',
    '/admin/inventory/stores', 
    '/admin/inventory/products'
  ];
  
  for (const route of routes) {
    try {
      console.log(`\n🔍 Testing: ${baseUrl}${route}`);
      const response = await axios.get(`${baseUrl}${route}`, {
        headers: {
          'Authorization': 'Bearer test-token'
        },
        timeout: 5000
      });
      console.log(`✅ ${route}: ${response.status} - ${response.statusText}`);
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${route}: ${error.response.status} - ${error.response.statusText}`);
        if (error.response.data) {
          console.log(`   Data: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        console.log(`❌ ${route}: ${error.message}`);
      }
    }
  }
}

testInventoryRoutes().catch(console.error);
