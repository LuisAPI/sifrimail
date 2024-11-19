import ImapClient from 'emailjs-imap-client';
import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS, IMAP_HOST, IMAP_PORT, SMTP_HOST, SMTP_PORT } from '@env';

class EmailService {
  private imapClient: any;
  private smtpTransporter: any;

  constructor() {
    // Initialize IMAP client
    this.imapClient = new ImapClient(IMAP_HOST, parseInt(IMAP_PORT), {
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    // Initialize SMTP client
    this.smtpTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });
  }

  // Function to connect to IMAP and retrieve emails
  async fetchEmails() {
    try {
      await this.imapClient.connect();
      await this.imapClient.selectMailbox('INBOX');
      const messages = await this.imapClient.listMessages('INBOX', '1:*', ['uid', 'envelope', 'body[]']);
      await this.imapClient.close();
      return messages;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  // Function to send an email
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const mailOptions = {
        from: `"Your Name" <${EMAIL_USER}>`,
        to,
        subject,
        text,
        html
      };
      const info = await this.smtpTransporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

export default new EmailService();
