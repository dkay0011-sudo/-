const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/vworld', async (req, res) => {
    try {
        const targetUrl = 'https://api.vworld.kr/req/data';
        
        const response = await axios.get(targetUrl, { 
            params: req.query,
            timeout: 15000, 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Referer': req.query.domain || 'https://dkay-map.onrender.com',
                'Accept': 'application/json, text/plain, */*'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Vworld 상세 에러:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: '브이월드 서버 연결 실패' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});