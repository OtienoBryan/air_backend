const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testCreateRoom() {
  try {
    console.log('🔐 Testing login...');
    
    // Step 1: Login
    const loginOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginData = {
      email: 'admin@moonsun.com',
      password: 'admin123'
    };

    const loginResult = await makeRequest(loginOptions, loginData);
    console.log('📡 Login status:', loginResult.status);
    
    if (loginResult.status !== 200 && loginResult.status !== 201) {
      console.error('❌ Login failed:', loginResult.data);
      return;
    }

    console.log('✅ Login successful!');
    const token = loginResult.data.token;
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    // Step 2: Test create room
    console.log('\n💬 Testing create room...');
    const createRoomOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/chat/rooms',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const createRoomData = {
      name: 'Test Room',
      description: 'A test chat room',
      memberIds: [1, 2, 3], // Some staff IDs
      createdBy: 9 // Admin user ID
    };

    console.log('📝 Creating room with data:', createRoomData);

    const createResult = await makeRequest(createRoomOptions, createRoomData);
    console.log('📡 Create room status:', createResult.status);
    
    if (createResult.status !== 200 && createResult.status !== 201) {
      console.error('❌ Create room failed:', createResult.data);
    } else {
      console.log('✅ Room created successfully!');
      console.log('💬 Room:', createResult.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCreateRoom();
