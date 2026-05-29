const http = require('http');

async function testInvoicesEndpoint() {
  console.log('🔍 [Test] Testing invoices endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/invoices',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`✅ [Test] Status: ${res.statusCode}`);
    console.log(`✅ [Test] Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ [Test] Response received');
      try {
        const jsonData = JSON.parse(data);
        console.log('📊 [Test] Response data:', {
          invoicesCount: jsonData.invoices?.length || 0,
          total: jsonData.total || 0,
          sampleInvoice: jsonData.invoices?.[0] || null
        });
        
        if (jsonData.invoices?.[0]?.soNumber) {
          console.log('✅ [Test] SO Number found:', jsonData.invoices[0].soNumber);
        } else {
          console.log('❌ [Test] SO Number not found in response');
        }
      } catch (error) {
        console.log('❌ [Test] Error parsing response:', error.message);
        console.log('📄 [Test] Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ [Test] Request error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 [Test] Backend server is not running. Please start it with: npm run start:dev');
    }
  });

  req.end();
}

testInvoicesEndpoint();