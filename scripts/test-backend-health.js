const http = require('http');

async function testBackendHealth() {
  try {
    console.log('🧪 Testing backend health...\n');

    // Test basic connectivity
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      console.log(`📡 Backend response status: ${res.statusCode}`);
      console.log(`📡 Backend response headers:`, res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📡 Backend response body: ${data}`);
        
        if (res.statusCode === 200 || res.statusCode === 404) {
          console.log('✅ Backend is running and responding');
        } else {
          console.log('❌ Backend responded with unexpected status');
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Backend connection error:', error.message);
      console.log('\n💡 Make sure the backend is running:');
      console.log('   cd backend && npm run start:dev');
    });

    req.setTimeout(5000, () => {
      console.error('❌ Backend connection timeout');
      req.destroy();
    });

    req.end();

  } catch (error) {
    console.error('❌ Error testing backend health:', error.message);
  }
}

testBackendHealth();
