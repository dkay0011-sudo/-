const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const https = require('https'); // 추가!
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(__dirname));

// 브라우저에서 보이는 404 에러(favicon)를 방지하기 위한 가짜 응답
app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/vworld', async (req, res) => {
    try {
        const targetUrl = 'https://api.vworld.kr/req/data';
        console.log('📡 VWorld 요청:', { url: targetUrl, params: req.query });
        
        const response = await axios.get(targetUrl, { 
            params: req.query,
            timeout: 15000,
            // [중요] SSL 보안 인증 오류(socket hang up)를 강제로 통과시키는 설정입니다.
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://dkay-map.onrender.com',
                'Origin': 'https://dkay-map.onrender.com',
                'Accept': '*/*'
            }
        });
        console.log('✅ VWorld 응답 성공:', response.status);
        res.json(response.data);
    } catch (error) {
        console.error('❌ VWorld 에러 발생:');
        console.error('   상태 코드:', error.response?.status);
        console.error('   에러 메시지:', error.message);
        console.error('   응답 데이터:', error.response?.data);
        res.status(500).json({ error: '브이월드 연결 실패', details: error.message });
    }
});

app.listen(PORT, () => console.log(`서버 작동 중: ${PORT}`));