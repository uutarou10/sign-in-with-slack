import * as functions from 'firebase-functions';
import axios from 'axios';
import * as qs from 'querystring';

// 全体的に例外処理が果てしなくてきとう。
// というか、SlackAPIはok: falseがエラーの際には返ってくるのでこれでは例外処理になってないような気がする。
// 細かいことは気にしない。

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

// 面倒なので使いそうなやつだけ
export type SlackUserType = {
  id: string;
  team_id: string;
  name: string;
  real_name: string;
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
};
export const usersInfo = async (token: string, userId: string) => {
  const requestArgs = {
    token,
    user_id: userId
  };

  try {
    const res = await slackClient.post<{user: SlackUserType}>('users.info', requestArgs);
    return res.data.user;
  } catch (e) {
    console.warn('Slack oauth was failed.', e);
    throw new Error();
  }
};
