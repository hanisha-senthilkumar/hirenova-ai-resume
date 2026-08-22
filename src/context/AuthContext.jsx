import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper to safely access puter object
  const getPuter = () => {
    return window.puter || null;
  };

  // Initialize auth state check on app load
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const puter = getPuter();
        if (puter && puter.auth && typeof puter.auth.isSignedIn === 'function') {
          const signedIn = puter.auth.isSignedIn();
          if (signedIn) {
            const userInfo = await puter.auth.getUser();
            if (mounted) {
              setUser(userInfo);
              setIsSignedIn(true);
            }
          } else {
            if (mounted) {
              setUser(null);
              setIsSignedIn(false);
            }
          }
        }
      } catch (err) {
        console.error('Puter auth check error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // If script isn't instantly available, wait brief tick
    if (window.puter) {
      checkAuth();
    } else {
      const timer = setTimeout(checkAuth, 300);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Sign In function triggered directly from button click
  const signIn = async () => {
    setAuthError(null);
    setLoading(true);

    try {
      const puter = getPuter();
      if (!puter || !puter.auth) {
        throw new Error('Puter SDK is loading. Please try again in a moment.');
      }

      // Must be called synchronously from user gesture
      const res = await puter.auth.signIn();
      const userInfo = await puter.auth.getUser();

      setUser(userInfo);
      setIsSignedIn(true);
      return true;
    } catch (err) {
      console.error('Puter signIn error:', err);
      const errMsg = err?.message || err?.toString() || '';

      if (errMsg.includes('popup') || errMsg.includes('blocked')) {
        setAuthError('Please allow the sign-in popup and try again.');
      } else if (errMsg.includes('cancel') || errMsg.includes('closed') || errMsg.includes('user_closed')) {
        setAuthError('Sign-in was cancelled.');
      } else {
        setAuthError('Unable to sign in. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out function
  const signOut = async () => {
    setLoading(true);
    try {
      const puter = getPuter();
      if (puter && puter.auth && typeof puter.auth.signOut === 'function') {
        await puter.auth.signOut();
      }
    } catch (err) {
      console.error('Puter signOut error:', err);
    } finally {
      setUser(null);
      setIsSignedIn(false);
      setLoading(false);
      setAuthError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn,
        loading,
        authError,
        setAuthError,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
