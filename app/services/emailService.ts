import gmailService from './gmailService';
import outlookService from './outlookService';

type EmailProvider = 'gmail' | 'outlook';

class EmailService {
  private provider: EmailProvider;

  constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  async fetchEmails() {
    if (this.provider === 'gmail') {
      return gmailService.fetchGmailEmails();
    } else if (this.provider === 'outlook') {
      return outlookService.fetchOutlookEmails();
    }
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    if (this.provider === 'gmail') {
      return gmailService.sendGmailEmail(to, subject, text, html);
    } else if (this.provider === 'outlook') {
      return outlookService.sendOutlookEmail(to, subject, text, html);
    }
  }
}

export default EmailService;
