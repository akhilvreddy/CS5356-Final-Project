/**
 * Test script to verify NextAuth credentials authentication
 * 
 * Run with:
 * node scripts/test-auth-endpoint.js email@example.com your_password
 */

const fetch = require('node-fetch');

async function testAuthEndpoint() {
  // Get credentials from command line args
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.error('Usage: node test-auth-endpoint.js <email> <password>');
    process.exit(1);
  }
  
  console.log(`Testing authentication for ${email}...`);
  
  try {
    // First, get the CSRF token
    const csrfResponse = await fetch('http://localhost:3000/api/auth/csrf');
    const { csrfToken } = await csrfResponse.json();
    
    if (!csrfToken) {
      throw new Error('Failed to get CSRF token');
    }
    
    console.log('Got CSRF token');
    
    // Now attempt login
    const loginResponse = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `next-auth.csrf-token=${csrfToken}`
      },
      body: new URLSearchParams({
        csrfToken,
        email,
        password,
        json: 'true',
      }),
      redirect: 'manual',
    });
    
    console.log('\nResponse Status:', loginResponse.status);
    console.log('Response Headers:');
    
    // Check for set-cookie headers
    const cookies = loginResponse.headers.raw()['set-cookie'];
    
    if (cookies && cookies.length > 0) {
      console.log('\nCookies Set:');
      cookies.forEach(cookie => {
        const [name] = cookie.split('=');
        console.log(`- ${name} (value hidden)`);
      });
      
      // Check specifically for session token cookie
      const hasSessionToken = cookies.some(c => 
        c.startsWith('next-auth.session-token=') || 
        c.startsWith('__Secure-next-auth.session-token=')
      );
      
      if (hasSessionToken) {
        console.log('\n✅ SUCCESS: Session token cookie was set!');
      } else {
        console.log('\n❌ ERROR: No session token cookie found');
      }
    } else {
      console.log('\n❌ ERROR: No cookies were set');
    }
    
    // Check for redirect
    if (loginResponse.status === 302) {
      const location = loginResponse.headers.get('location');
      console.log('\nRedirect Location:', location);
      
      if (location && !location.includes('error')) {
        console.log('✅ SUCCESS: Authentication successful (redirected)');
      } else {
        console.log('❌ ERROR: Authentication failed');
      }
    }
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testAuthEndpoint(); 