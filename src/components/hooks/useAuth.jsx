import { signOut } from 'firebase/auth';
import { createContext, useContext, useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // logout
  const logOut = () => {
    return signOut(auth)
      .then((result) => {
        setUser(null);
      })
      .catch((err) => { });
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
            return undefined;
          }
          return docsSnap.docs[0].data();
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

  return <AuthContext.Provider value={{ user, logOut, logIn }}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
