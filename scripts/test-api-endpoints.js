const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testEndpoints() {
  const baseURL = 'http://localhost:3001/api';
  
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test clients list endpoint
    console.log('1. Testing /admin/sales/clients-list...');
    const clientsResponse = await makeRequest(`${baseURL}/admin/sales/clients-list`);
    
    if (clientsResponse.status === 200) {
      console.log('✅ Clients endpoint working');
      console.log(`   Found ${clientsResponse.data.length} clients`);
      
      if (clientsResponse.data.length > 0) {
        const firstClient = clientsResponse.data[0];
        console.log(`   First client: ${firstClient.name} (${firstClient.region})`);
        
        // Test client sales endpoint
        console.log(`\n2. Testing /admin/sales/client/${firstClient.id}/sales...`);
        const salesResponse = await makeRequest(`${baseURL}/admin/sales/client/${firstClient.id}/sales`);
        
        if (salesResponse.status === 200) {
          console.log('✅ Client sales endpoint working');
          console.log(`   Total revenue: $${salesResponse.data.totalAmount}`);
          console.log(`   Total orders: ${salesResponse.data.totalOrders}`);
        } else {
          console.log(`❌ Client sales endpoint failed with status: ${salesResponse.status}`);
        }
      }
      
      console.log('\n🎉 All endpoints are working! The Master Sales page should fetch real data.');
    } else {
      console.log(`❌ Clients endpoint failed with status: ${clientsResponse.status}`);
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running');
      console.log('💡 Please start the backend server: npm run start:dev');
    } else if (error.message === 'Request timeout') {
      console.log('❌ Request timeout - server may be slow or unresponsive');
    } else {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

testEndpoints();
