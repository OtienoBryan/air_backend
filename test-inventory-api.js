const axios = require('axios');

async function testInventoryAPI() {
  try {
    console.log('🧪 Testing inventory API endpoints...');
    
    const baseURL = 'http://localhost:3002/api';
    
    // Test 1: Check if inventory endpoint exists
    console.log('📡 Testing GET /admin/inventory...');
    try {
      const response = await axios.get(`${baseURL}/admin/inventory`);
      console.log('✅ GET /admin/inventory - SUCCESS');
      console.log(`📊 Found ${response.data.length} inventory items`);
    } catch (error) {
      console.log('❌ GET /admin/inventory - FAILED');
      console.log('Error:', error.response?.status, error.response?.data);
    }
    
    // Test 2: Check if stores endpoint exists
    console.log('📡 Testing GET /admin/inventory/stores...');
    try {
      const response = await axios.get(`${baseURL}/admin/inventory/stores`);
      console.log('✅ GET /admin/inventory/stores - SUCCESS');
      console.log(`🏪 Found ${response.data.length} stores`);
    } catch (error) {
      console.log('❌ GET /admin/inventory/stores - FAILED');
      console.log('Error:', error.response?.status, error.response?.data);
    }
    
    // Test 3: Check if products endpoint exists
    console.log('📡 Testing GET /admin/inventory/products...');
    try {
      const response = await axios.get(`${baseURL}/admin/inventory/products`);
      console.log('✅ GET /admin/inventory/products - SUCCESS');
      console.log(`📦 Found ${response.data.length} products`);
    } catch (error) {
      console.log('❌ GET /admin/inventory/products - FAILED');
      console.log('Error:', error.response?.status, error.response?.data);
    }
    
    // Test 4: Check if PUT endpoint exists (this was the failing one)
    console.log('📡 Testing PUT /admin/inventory/1/quantity...');
    try {
      const response = await axios.put(`${baseURL}/admin/inventory/1/quantity`, {
        quantity: 25
      });
      console.log('✅ PUT /admin/inventory/1/quantity - SUCCESS');
      console.log('📊 Response:', response.data);
    } catch (error) {
      console.log('❌ PUT /admin/inventory/1/quantity - FAILED');
      console.log('Error:', error.response?.status, error.response?.data);
      
      if (error.response?.status === 404) {
        console.log('🔍 This confirms the PUT endpoint was not found');
        console.log('💡 The fix should resolve this by switching to InventoryModule');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testInventoryAPI();