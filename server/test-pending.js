const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testPendingNotices = async () => {
    try {
        console.log('Logging in as Admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            userId: '2020/ADM/001',
            password: 'admin'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token obtained.');

        console.log('Fetching Pending Notices...');
        const noticesRes = await axios.get(`${API_URL}/notices?status=pending`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const notices = noticesRes.data;
        console.log(`Fetched ${notices.length} notices.`);

        const nonPending = notices.filter(n => n.status !== 'pending');
        if (nonPending.length > 0) {
            console.error('❌ FAILURE: Found non-pending notices in response:', nonPending.map(n => ({ id: n._id, status: n.status })));
        } else {
            console.log('✅ SUCCESS: All returned notices are pending.');
        }

        console.log('Sample Notice:', notices[0] ? { title: notices[0].title, status: notices[0].status } : 'None');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

testPendingNotices();
