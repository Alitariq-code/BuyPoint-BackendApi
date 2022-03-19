const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.EMAIL_FROM}`;
  }

  newTransport() {
    return nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT,
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../view/email/${template}.pug`, {
      firstName: this.firstName,

      subject
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
      // html:
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to BuyingPoint Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token {valid for only 10 minutes'
    );
  }
};

// const sendEmail = async options => {
//   // 1) Create a

//   const transporter = nodemailer.createTransport({
//     // host: process.env.EMAIL_HOST,
//     // port: process.env.EMAIL_PORT,
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   // 2) Define the email options
//   const mailOptions = {
//     from: 'Ali Tariq <alitariqcode@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     // html:
//   };
//   console.log(mailOptions);

//   // 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
