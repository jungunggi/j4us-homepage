const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendEmail } = require('./mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // HTML, CSS, JS 파일 제공

// 메일 전송 API 엔드포인트
app.post('/api/contact', async (req, res) => {
  const { name, company, tel, email, service, message, agree } = req.body;

  // 필수 필드 검증
  if (!name || !tel || !message) {
    return res.status(400).json({
      success: false,
      message: '필수 필드를 모두 입력해주세요.'
    });
  }

  if (!agree) {
    return res.status(400).json({
      success: false,
      message: '개인정보 수집 및 이용에 동의해주세요.'
    });
  }

  // 메일 전송
  const result = await sendEmail(name, company, tel, email, service, message);
  
  if (result.success) {
    res.status(200).json({ success: true, message: result.message });
  } else {
    res.status(500).json({ success: false, message: result.message });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
