const nodemailer = require('nodemailer');

const sendMail = async (to, subject, message, config) => {



  let transporter = nodemailer.createTransport({
  
    service: config.configMail.service,
    auth: {
      user: config.configMail.auth.user,
      pass: config.configMail.auth.pass,
    },
    
    // service: 'office365',
    // auth: {
    //   user: 'noreply@aigroup.com.br',
    //   pass: 'Daf73432'
    // }
  });

  let mailOptions = {
    from: config.configMail.auth.user,
    to,
    subject,
    html: message
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendMail }