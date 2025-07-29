"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendEmail = async (from, subject = "Feedback", text) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: "acharyaprashant227@gmail.com",
            subject: "Feedback Received ✔",
            text: `New feedback received:\n\n${text}`,
            html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #4CAF50;">New Feedback Received</h2>
      <p><strong>From:</strong>${from}</p>
      <p><strong>Feedback:</strong></p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
        ${text}
      </blockquote>
      <p style="margin-top: 20px;">Please review and follow up if needed.</p>
    </div>
  `,
        });
        console.log(info);
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map