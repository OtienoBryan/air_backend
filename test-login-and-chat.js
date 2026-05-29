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

async function testLoginAndChat() {
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
    console.log('👤 User:', loginResult.data.user);
    const token = loginResult.data.token;
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    // Step 2: Test chat rooms
    console.log('\n💬 Testing chat rooms...');
    const chatOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/chat/rooms',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const chatResult = await makeRequest(chatOptions);
    console.log('📡 Chat rooms status:', chatResult.status);
    
    if (chatResult.status !== 200) {
      console.error('❌ Chat rooms failed:', chatResult.data);
    } else {
      console.log('✅ Chat rooms loaded successfully!');
      console.log('💬 Number of rooms:', chatResult.data.length);
      console.log('📋 Rooms:', chatResult.data.map(room => ({
        id: room.id,
        name: room.name,
        memberCount: room.members?.length || 0
      })));
    }

    // Step 3: Test staff endpoint
    console.log('\n👥 Testing staff...');
    const staffOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/chat/staff',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const staffResult = await makeRequest(staffOptions);
    console.log('📡 Staff status:', staffResult.status);
    
    if (staffResult.status !== 200) {
      console.error('❌ Staff failed:', staffResult.data);
    } else {
      console.log('✅ Staff loaded successfully!');
      console.log('👥 Number of staff:', staffResult.data.length);
      console.log('📋 Staff:', staffResult.data.map(s => ({
        id: s.id,
        name: s.name,
        email: s.business_email
      })));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLoginAndChat();
