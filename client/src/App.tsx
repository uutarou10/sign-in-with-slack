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
  const [user, setUser] = React.useState<firebase.User|null>(null);
  const [authCompleted, setAuthCompleted] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const queryPrams = new URLSearchParams(window.location.search);
      const token = queryPrams.get('t');

      if (token) {
        window.history.replaceState(undefined, window.document.title, window.location.href.replace(window.location.search, ''));
        await firebase.auth().signInWithCustomToken(token);
      }

      firebase.auth().onAuthStateChanged(user => {
        setAuthCompleted(true);
        setUser(user);
      });
    })();
  });

  // onAuthStateChangedが呼ばれるまではLoadingを表示する
  if (!authCompleted) {
    return (
      <div>Loading...</div>
    )
  }

  if (user) {
    return (
      <React.Fragment>
        <h1>Sign in with Slack Example</h1>
        <h2>Welcome!</h2>
        <div>Login as {user.uid}</div>
        <button onClick={() => firebase.auth().signOut()}>Sign out</button>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <h1>Sign in with Slack Example</h1>
        <a href={`https://slack.com/oauth/authorize?scope=team:read,users:read&client_id=${process.env.REACT_APP_SLACK_CLIENT_ID}&state=${window.location.href}`}><img alt="Sign in with Slack" height="40" width="172" src="https://platform.slack-edge.com/img/sign_in_with_slack.png" /></a>
      </React.Fragment>
    );
  }
}

export default App;
