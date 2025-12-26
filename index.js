const readline = require('readline');
const adService = require('./src/ad-service');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.clear();
  console.log('==========================================');
  console.log('   Active Directory Authentication CLI    ');
  console.log('==========================================\n');

  try {
    const username = await ask('Enter Username: ');
    
    // Simple password prompt (Note: Input will be visible in standard terminal)
    // For production CLIs, use a library like 'inquirer' to hide password input.
    const password = await ask('Enter Password: ');
    
    console.log('\n[INFO] Authenticating against Active Directory...');
    
    const startTime = Date.now();
    const userPayload = await adService.authenticate(username, password);
    const duration = Date.now() - startTime;

    console.log(`\n[SUCCESS] Authentication successful in ${duration}ms!`);
    console.log('------------------------------------------');
    console.log('User Details (Ready for JWT Payload):');
    console.dir(userPayload, { depth: null, colors: true });
    console.log('------------------------------------------');
    console.log('\n[NEXT STEPS] In a real API, you would now sign this payload:');
    console.log(`> const token = jwt.sign(userPayload, 'YOUR_SECRET_KEY', { expiresIn: '1h' });`);

  } catch (error) {
    console.error('\n[FAILED] Authentication Error:');
    console.error(`> ${error.message}`);
    
    console.log('\n[DEBUG TIP] Check your config.js settings if the server is unreachable.');
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();