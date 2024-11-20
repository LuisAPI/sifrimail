import * as AuthSession from 'expo-auth-session';
import axios from 'axios';

const GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1';

const CLIENT_ID = '<YOUR_GOOGLE_CLIENT_ID>';
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

let accessToken: string | null = null;

async function authenticateGmail() {
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES.join(' ')}`;
  const result = await AuthSession.startAsync({ authUrl });
  if (result.type === 'success') {
    accessToken = result.params.access_token;
  } else {
    throw new Error('Gmail authentication failed');
  }
}

async function fetchGmailEmails() {
  if (!accessToken) {
    await authenticateGmail();
  }
  const response = await axios.get(`${GMAIL_API_BASE_URL}/users/me/messages`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.messages;
}

async function sendGmailEmail(to: string, subject: string, text: string, html?: string) {
  if (!accessToken) {
    await authenticateGmail();
  }
  const response = await axios.post(
    `${GMAIL_API_BASE_URL}/users/me/messages/send`,
    {
      raw: btoa(
        `To: ${to}\r\nSubject: ${subject}\r\n\r\n${html || text}`
      ),
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}

export default {
  authenticateGmail,
  fetchGmailEmails,
  sendGmailEmail,
};
