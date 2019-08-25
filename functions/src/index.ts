import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { oauthAccess } from './slack';

admin.initializeApp();

exports.authWithSlack = functions.https.onRequest(async (req, res) => {
  const slackAuthCode = req.query.code as string | undefined;

  if (!slackAuthCode) {
    console.warn('code query string not find.')
    res.status(400).end();
  }

  const userCredential = await oauthAccess(slackAuthCode);

  if (userCredential.team_id !== 'T029ACBGM') {
    console.warn(`This team (id: ${userCredential.team_id}) dose not have access rights.`);
    res.status(403).end();
    return;
  }

  try {
    const customToken = await admin.auth().createCustomToken(userCredential.user_id);
    res.json({
      custom_token: customToken
    }).end();
    return;
  } catch (e) {
    console.error('Failed to create custom token:', e)
  }
});
