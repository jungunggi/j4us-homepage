const nodemailer = require('nodemailer');
require('dotenv').config();

// 이메일 전송 설정 (환경변수 사용)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // .env의 EMAIL_USER
    pass: process.env.EMAIL_PASSWORD   // .env의 EMAIL_PASSWORD (Gmail 앱 비밀번호)
  }
});

// 메일 전송 함수
async function sendEmail(name, company, tel, email, service, message) {
  try {
    const senderEmail = process.env.EMAIL_USER;
    const adminEmail  = 'J4us@j4us.co.kr';

    // 고객에게 보낼 확인 메일 (이메일 입력 시에만 발송)
    if (email) {
      const customerMailOptions = {
        from: `"J4US SOLUTION" <${senderEmail}>`,
        to: email,
        subject: '[J4US SOLUTION] 문의 접수 확인',
        html: `
          <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">J4US SOLUTION</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">문의 접수 완료</p>
            </div>
            <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
              <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
                <strong>${name}</strong>님, 안녕하세요!
              </p>
              <p style="color: #666; font-size: 14px; line-height: 1.8; margin: 0 0 20px 0;">
                제이포우솔루션에 문의해주셔서 감사합니다.<br/>
                귀하의 문의 내용을 확인하였으며, 전문 컨설턴트가 빠른 시일 내에 연락드리겠습니다.
              </p>
              <div style="background: white; border-left: 4px solid #0066FF; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px 0; color: #0066FF; font-size: 14px;">📋 접수 정보</h3>
                <table style="width: 100%; font-size: 13px; color: #666;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; width: 30%;">이름</td>
                    <td style="padding: 8px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">연락처</td>
                    <td style="padding: 8px 0;">${tel}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">회사명</td>
                    <td style="padding: 8px 0;">${company || '미입력'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600;">문의 솔루션</td>
                    <td style="padding: 8px 0;">${service || '미선택'}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin: 30px 0 0 0;">
                이 메일은 자동으로 발송된 메일입니다. 회신하지 마시기 바랍니다.
              </p>
            </div>
          </div>
        `
      };
      await transporter.sendMail(customerMailOptions);
    }

    // 관리자에게 보낼 메일
    const adminMailOptions = {
      from: `"J4US SOLUTION" <${senderEmail}>`,
      to: adminEmail,
      subject: `[J4US SOLUTION] 새로운 문의 - ${name} (${service || '미선택'})`,
      html: `
        <div style="font-family: 'Noto Sans KR', sans-serif;">
          <h2>📩 새로운 고객 문의가 접수되었습니다.</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f0f0f0;">
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: 600;">이름</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${name}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: 600;">연락처</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${tel}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: 600;">이메일</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${email || '미입력'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: 600;">회사명</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${company || '미입력'}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="border: 1px solid #ddd; padding: 12px; font-weight: 600;">문의 솔루션</td>
              <td style="border: 1px solid #ddd; padding: 12px;">${service || '미선택'}</td>
            </tr>
            <tr>
              <td colspan="2" style="border: 1px solid #ddd; padding: 12px; font-weight: 600;">문의 내용</td>
            </tr>
            <tr>
              <td colspan="2" style="border: 1px solid #ddd; padding: 12px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `
    };

    await transporter.sendMail(adminMailOptions);

    return { success: true, message: '메일이 성공적으로 전송되었습니다.' };
  } catch (error) {
    console.error('메일 전송 실패:', error);
    return { success: false, message: `메일 전송에 실패했습니다: ${error.message}` };
  }
}

module.exports = { sendEmail };
