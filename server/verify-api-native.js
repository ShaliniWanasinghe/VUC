const http = require('http');

const data = JSON.stringify({
    userId: '2020/ADM/001',
    password: 'admin'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Response:', responseBody);
        if (res.statusCode === 200) {
            console.log('✅ Integration Test Passed: Login Successful!');
            process.exit(0);
        } else {
            console.error('❌ Integration Test Failed: Unexpected Status Code');
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});

req.write(data);
req.end();
