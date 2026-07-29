const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'edgaedson59@gmail.com',
      pass: 'rmxk ovnl ngme upjb',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Your App" <edgaedson59@gmail.com>',
      to: 'edgaedson59@gmail.com',
      subject: 'Test Email from Localhost',
      html: '<h1>Hello!</h1><p>Your Gmail setup is working! 🎉</p>',
    });
    console.log('✅ Email sent:', info.messageId);
    console.log('📧 Check your inbox!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmail();
