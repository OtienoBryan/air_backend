// Test login functionality
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🔐 Testing login...');
    
    // Test login
    const loginResponse = await fetch('http://localhost:3001/api/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login successful:', loginData);
      
      // Test countries with real token
      const countriesResponse = await fetch('http://localhost:3001/api/countries', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Countries response status:', countriesResponse.status);
      
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json();
        console.log('Countries data:', countriesData);
      } else {
        const error = await countriesResponse.text();
        console.log('Countries error:', error);
      }
    } else {
      const error = await loginResponse.text();
      console.log('Login error:', error);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLogin();
