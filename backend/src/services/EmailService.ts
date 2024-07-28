import nodemailer from "nodemailer";

class EmailService {
  static sendEmail = (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE_NAME,
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),

      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    transporter
      .verify()
      .then(() => {
        const mailOptions = {
          subject,
          text,
          from: process.env.EMAIL_ADDRESS,
          to,
        };
        transporter.sendMail(mailOptions);
        transporter.close();
      })
      .catch(console.error);
  };
}

export default EmailService;
