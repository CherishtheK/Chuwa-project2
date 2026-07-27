import { transporter } from "../config/mailer";


async function sendEmails(to: string, subject: string, html: string){
    try {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER, // sender address
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
} catch (err) {
  console.error("Error while sending mail:", err);
}
}

export default sendEmails;