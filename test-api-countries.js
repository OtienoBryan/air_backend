const axios = require('axios');

async function testCountriesAPI() {
  try {
    console.log('🌐 Testing Countries API endpoint...');
    
    // Test the countries endpoint
    const response = await axios.get('http://localhost:3001/api/sales-reps/countries');
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 API Response Data:', response.data);
    console.log('📋 Number of countries:', response.data.length);
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data);
    console.error('Full Error:', error.message);
  }
}

// Run the test
testCountriesAPI();
