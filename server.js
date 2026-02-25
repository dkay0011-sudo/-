const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // 추가!
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- [추가 코드: 메인 화면 보여주기] ---
// index.html 파일이 있는 폴더를 기본으로 설정합니다.
app.use(express.static(__dirname)); 

// 사용자가 주소창에 그냥 접속하면 index.html을 보내줍니다.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// ------------------------------------

app.get('/vworld', async (req, res) => {
    try {
        const targetUrl = 'https://api.vworld.kr/req/data';
        
        // 브이월드에게 보낼 정보에 '가면'을 씌워줍니다.
        const response = await axios.get(targetUrl, { 
            params: req.query,
            headers: {
                // 1. "나는 로봇이 아니라 크롬 브라우저야"라고 속입니다.
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                // 2. "나는 등록된 도메인(dkay-map)에서 온 요청이야"라고 확실히 알려줍니다.
                'Referer': req.query.domain 
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error("Vworld API 에러 상세:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: '브이월드 통신 중 에러 발생' });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다!`);
});