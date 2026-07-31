import { transporter } from "../config/mailer";


async function sendEmails(to: string, subject: string, html: string) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}

export default sendEmails;

