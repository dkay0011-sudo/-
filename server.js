const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000; // 서버가 열릴 포트 번호

app.use(cors()); // 모든 도메인에서의 접속을 허용 (CORS 해결)

// 내 서버에 '/vworld'라는 길을 만듭니다.
app.get('/vworld', async (req, res) => {
    try {
        // 브라우저가 보낸 모든 파라미터를 그대로 브이월드에 전달합니다.
        const targetUrl = 'https://api.vworld.kr/req/data';
        const response = await axios.get(targetUrl, { params: req.query });
        
        // 브이월드에서 받은 데이터를 내 브라우저에 그대로 돌려줍니다.
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: '서버 에러가 발생했습니다.' });
    }
});

app.listen(PORT, () => {
    console.log(`백엔드 서버가 http://localhost:${PORT} 에서 돌아가고 있습니다!`);
});