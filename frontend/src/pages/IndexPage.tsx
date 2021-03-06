import { useCallback, useMemo } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Typography,
} from '@material-ui/core';

import { createPuzzle, PuzzleDocument } from '../db';

const createGoogleAuthProvider = () => {
  const authProvider = new firebase.auth.GoogleAuthProvider();
  authProvider.addScope('profile');
  return authProvider;
};

export const IndexPage = () => {
  const [ user, isUserLoading ] = useAuthState(firebase.auth());
  const googleAuthProvider = useMemo(createGoogleAuthProvider, []);
  const signInWithGoogle = useCallback(
    () => firebase.auth().signInWithRedirect(googleAuthProvider),
    [googleAuthProvider]
  );
  const signOut = useCallback(() => firebase.auth().signOut(), []);
  const history = useHistory();

  const [ puzzles ] = useCollection(
    firebase.firestore().collection('puzzles')
      .where('ownerUid', '==', user ? user.uid : '')
  );
  const puzzleSnapshot: firebase.firestore.QueryDocumentSnapshot<PuzzleDocument>[] = (
    puzzles ? puzzles.docs : []
  );

  const newPuzzle = useCallback(async () => {
    if(!user) { return; }
    const puzzleId = (await createPuzzle(user)).id;
    history.push(`/puzzles/${puzzleId}`);
  }, [user, history]);

  return (
    <div>
      {
        !isUserLoading && !user && <>
          <Typography>Sign in to create puzzles.</Typography>
          <Button onClick={signInWithGoogle}>Sign in with Google</Button>
        </>
      }
      {
        user && <>
          <Typography>Signed in as { user.displayName || user.email || user.uid }.</Typography>
          <Button onClick={signOut}>Sign out</Button>
          <Button onClick={newPuzzle}>New puzzle</Button>
          <Typography component='ul'>
            {
              puzzleSnapshot.map(
                docSnapshot => (
                  <li key={docSnapshot.id}>
                    <Link to={`/puzzles/${docSnapshot.id}`}>{ docSnapshot.data().title }</Link>
                    { ' ' }
                    (<Link to={`/puzzles/${docSnapshot.id}/edit`}>Edit</Link>)
                  </li>
                )
              )
            }
          </Typography>
        </>
      }
    </div>
  );
};

export default IndexPage;
