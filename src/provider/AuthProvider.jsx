import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut ,sendPasswordResetEmail} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import { Toaster } from "react-hot-toast";


const AuthProvider = ({ children }) => {

  

  const provider = new GoogleAuthProvider()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)


  // email pass register 
  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }
  // email pass login 
  const login = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }
  // google log in 
  const signGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, provider)
  }
  // Sign out

  const logOut = () => {
    return signOut(auth)
  }

    // reset password (send password reset email)
  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email)
      .finally(() => setLoading(false)); // ensure loading gets reset even when caller handles error
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unSub();
    };
  }, []);

  const authInfo = {
    loading,
    user,
  
    setUser,
    createUser,
    login,
    signGoogle,
    logOut,
    resetPassword

   
  };
  return <AuthContext value={authInfo}>
    <div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
    {children}
  </AuthContext>;
};

export default AuthProvider;
