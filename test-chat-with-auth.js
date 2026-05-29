const fetch = require('node-fetch');

async function testChatWithAuth() {
  try {
    console.log('🔐 Testing chat API with authentication...\n');

    // Step 1: Login to get a token
    console.log('📝 Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@moonsun.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('❌ Login failed:', loginResponse.status, errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('👤 User:', loginData.user);
    console.log('🔑 Token:', loginData.token.substring(0, 20) + '...');

    // Step 2: Test chat rooms endpoint
    console.log('\n📝 Step 2: Testing chat rooms endpoint...');
    const chatRoomsResponse = await fetch('http://localhost:3001/api/chat/rooms', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Chat rooms response status:', chatRoomsResponse.status);
    
    if (!chatRoomsResponse.ok) {
      const errorText = await chatRoomsResponse.text();
      console.error('❌ Chat rooms failed:', errorText);
    } else {
      const chatRooms = await chatRoomsResponse.json();
      console.log('✅ Chat rooms loaded successfully!');
      console.log('💬 Number of rooms:', chatRooms.length);
      console.log('📋 Rooms:', chatRooms.map(room => ({
        id: room.id,
        name: room.name,
        memberCount: room.members?.length || 0
      })));
    }

    // Step 3: Test staff endpoint
    console.log('\n📝 Step 3: Testing staff endpoint...');
    const staffResponse = await fetch('http://localhost:3001/api/chat/staff', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Staff response status:', staffResponse.status);
    
    if (!staffResponse.ok) {
      const errorText = await staffResponse.text();
      console.error('❌ Staff failed:', errorText);
    } else {
      const staff = await staffResponse.json();
      console.log('✅ Staff loaded successfully!');
      console.log('👥 Number of staff:', staff.length);
      console.log('📋 Staff:', staff.map(s => ({
        id: s.id,
        name: s.name,
        email: s.business_email
      })));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testChatWithAuth();
