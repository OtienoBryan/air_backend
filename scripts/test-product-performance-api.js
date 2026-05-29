const axios = require('axios');

async function testProductPerformanceAPI() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    console.log('🔍 Testing Product Performance API...');
    console.log('🌐 Base URL:', baseURL);
    
    // Test the products performance endpoint
    console.log('\n📊 Testing /admin/sales/products/performance...');
    try {
      const response = await axios.get(`${baseURL}/admin/sales/products/performance?year=2025`);
      console.log('✅ API Response Status:', response.status);
      console.log('📦 Products returned:', response.data.length);
      console.log('📋 Sample data:', JSON.stringify(response.data.slice(0, 2), null, 2));
    } catch (error) {
      console.error('❌ API Error:', error.response?.status, error.response?.statusText);
      console.error('❌ Error details:', error.response?.data);
    }
    
    // Test the summary endpoint
    console.log('\n📈 Testing /admin/sales/products/performance/summary...');
    try {
      const response = await axios.get(`${baseURL}/admin/sales/products/performance/summary?year=2025`);
      console.log('✅ Summary API Response Status:', response.status);
      console.log('📊 Summary data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('❌ Summary API Error:', error.response?.status, error.response?.statusText);
      console.error('❌ Error details:', error.response?.data);
    }
    
    // Test with different year
    console.log('\n📅 Testing with year 2024...');
    try {
      const response = await axios.get(`${baseURL}/admin/sales/products/performance?year=2024`);
      console.log('✅ 2024 API Response Status:', response.status);
      console.log('📦 Products for 2024:', response.data.length);
    } catch (error) {
      console.error('❌ 2024 API Error:', error.response?.status, error.response?.statusText);
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.error('💡 Make sure the backend server is running on port 3000');
  }
}

testProductPerformanceAPI();
