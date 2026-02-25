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
        // 로그 추가: 어떤 주소로 요청을 보내는지 서버 터미널(Logs)에 찍힙니다.
        console.log("브이월드 요청 파라미터:", req.query); 

        const response = await axios.get(targetUrl, { params: req.query });
        res.json(response.data);
    } catch (error) {
        // 로그 추가: 에러가 발생하면 구체적으로 어떤 에러인지 Logs에 찍힙니다.
        console.error("Vworld API 에러 상세:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: '브이월드 통신 중 에러 발생' });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다!`);
});