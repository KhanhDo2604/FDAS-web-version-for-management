import { onAuthStateChanged, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // logout
  const logOut = () => {
    return signOut(auth).then((result) => {
      console.log(result);
      // navigate("/login")
    }).catch((err) => {

    });;
  };

  //onAuthStateChanged
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (credential) => {
      if (credential) {
        const docRef = collection(db, 'User');
        const q = query(docRef, where('email', '==', credential.email));
        const docsSnap = await getDocs(q);
        if (!docsSnap.empty) {
          setUser(docsSnap.docs[0].data());
        } else {
          console.log('No such document!');
        }
      } else {
        setUser({});
      }
    });
    return () => {
      unsubcribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, logOut }}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
