import { makeRedirectUri, AuthRequest, AuthSessionResult, DiscoveryDocument } from 'expo-auth-session';
import axios from 'axios';

// Constants
const OUTLOOK_API_BASE_URL = 'https://graph.microsoft.com/v1.0';

const CLIENT_ID = '<YOUR_OUTLOOK_CLIENT_ID>';
const REDIRECT_URI = makeRedirectUri();  // No need for useProxy now
const SCOPES = ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.Send'];

// Outlook Discovery URL for OAuth2 endpoints
const DISCOVERY_URL = 'https://login.microsoftonline.com/common/.well-known/openid-configuration';

// Let access token be globally available for API calls
let accessToken: string | null = null;

async function authenticateOutlook(): Promise<void> {
  // Fetch the discovery document
  const discovery: DiscoveryDocument = await axios.get(DISCOVERY_URL).then(response => response.data);

  // Configure the auth request with discovery information
  const request = new AuthRequest({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: SCOPES,
    discovery: discovery,  // Pass the discovery document
    responseType: 'token',
  });

  // Make the auth request asynchronously
  const result: AuthSessionResult = await request.promptAsync();

  // Parse the result and store the token
  if (result.type === 'success' && result.params.access_token) {
    accessToken = result.params.access_token;
  } else {
    throw new Error('Outlook authentication failed');
  }
}

async function fetchOutlookEmails(): Promise<any> {
  if (!accessToken) {
    await authenticateOutlook();
  }
  const response = await axios.get(`${OUTLOOK_API_BASE_URL}/me/messages`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.value;
}

async function sendOutlookEmail(to: string, subject: string, text: string, html?: string): Promise<any> {
  if (!accessToken) {
    await authenticateOutlook();
  }
  const response = await axios.post(
    `${OUTLOOK_API_BASE_URL}/me/sendMail`,
    {
      message: {
        subject,
        body: { contentType: 'HTML', content: html || text },
        toRecipients: [{ emailAddress: { address: to } }],
      },
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
}

export default {
  authenticateOutlook,
  fetchOutlookEmails,
  sendOutlookEmail,
};
