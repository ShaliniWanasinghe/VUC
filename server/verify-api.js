const axios = require('axios');

const loginData = {
    userId: '2020/ADM/001',
    password: 'admin'
};

async function verifyLogin() {
    try {
        console.log('Testing login for admin...');
        const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
        console.log('✅ Login successful!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

verifyLogin();
