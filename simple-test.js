const http = require('http');

function testBackend() {
  console.log('🧪 Testing backend connection...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    console.log(`📡 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`📡 Response: ${data}`);
      if (res.statusCode === 200) {
        console.log('✅ Backend is running!');
      } else {
        console.log('❌ Backend returned error');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Connection failed:', error.message);
  });

  req.end();
}

testBackend();
