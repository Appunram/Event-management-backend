const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  }
});


module.exports = transporter;

/*host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'educationforram@gmail.com',
        clientId: "692652137739-cgf0dabsj16ueiahha8s1efim42tv16r.apps.googleusercontent.com",
        clientSecret: "ZiiZbBAnIz6cHrD3z0_PlVC5",
        refreshToken: "1//04mLr8NsROuNwCgYIARAAGAQSNwF-L9IrCvCqVUasmdCQko1DD1z4Adz0hNyGP1J6a0SOLryNmL3Mq1jbMtGwsk4Kf0Oi7MJyC1o",
    }*/