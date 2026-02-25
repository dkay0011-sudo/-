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
        const response = await axios.get(targetUrl, { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: '서버 에러가 발생했습니다.' });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다!`);
});