import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DB_URL,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID
});

const App: React.FC = () => {
  return (
    <div className="App">
      <a href={`https://slack.com/oauth/authorize?scope=team:read,users:read&client_id=${process.env.REACT_APP_SLACK_CLIENT_ID}&state=${window.location.href}`}><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" /></a>
    </div>
  );
}

export default App;
