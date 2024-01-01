import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [authenticating, setAuthenticating] = useState(true);

  // logout
  const logOut = () => {
    return signOut(auth)
      .then((result) => {
        setUser(null);
      })
      .catch((err) => { });
  };

  const fetchUserData = async (email) => {
    const docRef = collection(db, 'User');
    const q = query(docRef, where('email', '==', email));
    const docsSnap = await getDocs(q);
    if (!docsSnap.empty) {
      return docsSnap.docs[0].data();
    } else {
      console.log('No such document!');
      return null;
    }
  };

  const logIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
      .then(async (credential) => {
        if (credential) {
          const docRef = collection(db, 'User');
          const q = query(docRef, where('email', '==', credential.user.email));
          const docsSnap = await getDocs(q);
          if (!docsSnap.empty) {
            setUser(docsSnap.docs[0].data());
          } else {
            console.log('No such document!');
          }
          return docsSnap.docs[0].data()['role'];
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData = await fetchUserData(currentUser.email);
        setUser(userData);
      } else {
        setUser(null);
      }
      setAuthenticating(false);

    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, logOut, authenticating, logIn, setUser }}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
