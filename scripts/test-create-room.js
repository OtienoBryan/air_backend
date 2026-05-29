const http = require('http');

async function testCreateRoom() {
  try {
    console.log('🧪 Testing create room functionality...\n');

    // First, authenticate to get a token
    console.log('🔐 Authenticating...');
    
    const authData = JSON.stringify({
      email: 'admin@moonsun.com',
      password: 'admin123'
    });

    const authOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const authReq = http.request(authOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          try {
            const authResponse = JSON.parse(data);
            console.log('✅ Authentication successful');
            
            // Test creating a room
            createTestRoom(authResponse.token, authResponse.user.id);
          } catch (error) {
            console.error('❌ Auth response parse error:', error.message);
            console.log('Raw auth response:', data);
          }
        } else {
          console.error('❌ Authentication failed:', res.statusCode, data);
        }
      });
    });

    authReq.on('error', (error) => {
      console.error('❌ Auth request error:', error.message);
    });

    authReq.write(authData);
    authReq.end();

  } catch (error) {
    console.error('❌ Error testing create room:', error.message);
  }
}

function createTestRoom(token, userId) {
  console.log('\n💬 Creating test room...');
  
  const roomData = JSON.stringify({
    name: 'Test Group Chat',
    description: 'A test group created by script',
    memberIds: [1, 2], // Test with some staff IDs
    createdBy: userId
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/chat/rooms',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  };

  console.log('📤 Sending room data:', JSON.parse(roomData));

  const req = http.request(options, (res) => {
    console.log(`📡 Create room response status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 201 || res.statusCode === 200) {
        try {
          const roomResponse = JSON.parse(data);
          console.log('✅ Room created successfully:', roomResponse);
        } catch (error) {
          console.log('✅ Room created (non-JSON response):', data);
        }
      } else {
        console.error('❌ Room creation failed:', res.statusCode, data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Create room request error:', error.message);
  });

  req.write(roomData);
  req.end();
}

// Wait a bit for server to start
setTimeout(() => {
  testCreateRoom();
}, 3000);
