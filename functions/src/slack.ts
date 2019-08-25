import * as functions from 'firebase-functions';
import axios from 'axios';
import * as qs from 'querystring';

const slackClient = axios.create({
  baseURL: 'https://slack.com/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [
    data => qs.stringify(data)
  ]
})

export type oauthAccessResponseType = {
  user_id: string;
  access_token: string;
  scope: string;
  team_name: string;
  team_id: string;
}
export const oauthAccess = async (code: string): Promise<oauthAccessResponseType> => {
  const requestArgs = {
    client_id: functions.config().slack.client_id,
    client_secret: functions.config().slack.client_secret,
    code
  };

  try {
    const res = await slackClient.post<oauthAccessResponseType>('oauth.access', requestArgs);
    return res.data;
  } catch(e) {
    console.warn('Slack oauth was failed.', e);
    throw new Error();
  }
}
