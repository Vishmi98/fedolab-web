import nodemailer from "nodemailer";

import { EMAIL_CONFIG } from "@/constants/data";


const COMPANY_NAME = "FEDOLAB";

const emailConfig = {
  user: "vishmi@fedolab.com", // e.g., 'support@yourdomain.com'
  pass: "Vishmi!@#", // app-specific password
};

export class EmailService {
  /**
   * Send thank you email to the user
   */
  static async sendThankYouEmail(userEmail: string) {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    const mailOptions = {
      from: `"${COMPANY_NAME}" <${EMAIL_CONFIG.auth.user}>`,
      to: userEmail,
      subject: `Thank You for Contacting ${COMPANY_NAME}`,
      text: `
Hi,

Thank you for contacting ${COMPANY_NAME}.

We have received your message and our team will get back to you shortly.

Best regards,  
${COMPANY_NAME} Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
          <p>Hi,</p>
          <p>
            Thank you for reaching out to us. We have received your message and
            our team will get back to you shortly.
          </p>
          <br/>
          <p>Best regards,<br/><strong>${COMPANY_NAME} Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  /**
   * Forward user message to admin
   */
  static async forwardMessageToAdmin(
    userEmail: string,
    userName: string,
    message: string
  ) {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    const mailOptions = {
      from: `"${COMPANY_NAME} Contact Form" <${EMAIL_CONFIG.auth.user}>`,
      to: "fedolabsoft@gmail.com, sasindulakpriyafernando@gmail.com, info@fedolab.com",
      replyTo: userEmail, // allows admin to reply directly to user
      subject: `📩 New Contact Message from ${userName}`,
      text: `
New Contact Message

Name: ${userName}
Email: ${userEmail}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
          <h2>📩 New Contact Message</h2>

          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Email:</strong> ${userEmail}</p>

          <hr/>

          <p><strong>Message:</strong></p>
          <p>${message}</p>

          <br/>
          <p style="font-size:12px; color:#888;">
            This message was sent from the ${COMPANY_NAME} contact form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendVerificationEmail(email: string, verificationCode: string): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465, // or use 587 for TLS
        secure: true, // true for 465 (SSL), false for 587 (TLS)
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
        },
      });

      const mailOptions = {
        from: `"FEDOLAB" <${emailConfig.user}>`,
        to: email,
        subject: "Verify Your Email Address",
        text: `Please use the following verification code to verify your account: ${verificationCode}`,
        html: `<p>Please use the following verification code to verify your account:</p><h2>${verificationCode}</h2>`,
      };

      const response = await transporter.sendMail(mailOptions);

      return response?.accepted?.length > 0;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }
}