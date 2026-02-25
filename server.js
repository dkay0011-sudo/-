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
        // 1. 다시 정석대로 https를 사용합니다!
        const targetUrl = 'https://api.vworld.kr/req/data';
        
        const response = await axios.get(targetUrl, { 
            params: req.query,
            timeout: 15000, // 응답 대기 시간을 15초로 넉넉하게 잡습니다.
            headers: {
                // 2. 더 정교한 브라우저 가면을 씁니다.
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                // 3. 동희 님의 렌더 주소를 확실히 각인시킵니다.
                'Referer': 'https://dkay-map.onrender.com', 
                'Origin': 'https://dkay-map.onrender.com'
            }
        });
        
        console.log("브이월드 응답 성공!");
        res.json(response.data);
    } catch (error) {
        // 에러가 나면 브이월드가 뭐라고 했는지 정확히 로그를 찍습니다.
        console.error("Vworld 상세 에러:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: '브이월드 연결에 실패했습니다.' });
    }
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: 포트 ${PORT}`);
});