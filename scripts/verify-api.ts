async function testEndpoint(url: string, description: string) {
  console.log(`\nTEST: ${description}`);
  console.log(`URL: ${url}`);
  try {
    const res = await fetch(url);
    console.log(`HTTP Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log('Response payload:');
    console.log(JSON.stringify(data, null, 2));
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('Error hitting endpoint:', error);
  }
}

async function runTests() {
  console.log('=== API ENDPOINT VERIFICATION LOG ===');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('Testing GET /product-service/products on http://localhost:3000...');

  // Test Case 1: Fetch all active products
  await testEndpoint(
    'http://localhost:3000/product-service/products',
    'Fetch all active products (No filters)'
  );

  // Test Case 2: Search filtering
  await testEndpoint(
    'http://localhost:3000/product-service/products?search=Low-Profile',
    'Search by term "Low-Profile"'
  );

  // Test Case 3: Category filtering
  await testEndpoint(
    'http://localhost:3000/product-service/products?category=switch',
    'Filter by category "switch"'
  );

  // Test Case 4: Category and Search combined
  await testEndpoint(
    'http://localhost:3000/product-service/products?category=keyboard&search=Vela',
    'Filter by category "keyboard" and search by term "Vela"'
  );

  // Test Case 5: Pagination (Page 1, Limit 2)
  await testEndpoint(
    'http://localhost:3000/product-service/products?page=1&limit=2',
    'Pagination (Page 1, Limit 2)'
  );

  // Test Case 6: Pagination (Page 2, Limit 2)
  await testEndpoint(
    'http://localhost:3000/product-service/products?page=2&limit=2',
    'Pagination (Page 2, Limit 2)'
  );

  // Test Case 7: Search with no results
  await testEndpoint(
    'http://localhost:3000/product-service/products?search=NonExistentProduct',
    'Search with no results'
  );

  // Test Case 8: Validation Error (Invalid page number)
  await testEndpoint(
    'http://localhost:3000/product-service/products?page=0',
    'Validation Error (Page < 1)'
  );
}

runTests().catch((e) => {
  console.error('API Verification failed:', e);
  process.exit(1);
});
