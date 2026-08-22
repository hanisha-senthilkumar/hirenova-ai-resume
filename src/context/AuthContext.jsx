import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_USER_KEY = 'hirenova_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading auth user:', e);
    }
    // Default demo authenticated user
    return {
      username: 'AlexMorgan',
      email: 'alex.morgan@example.com',
      name: 'Alex Morgan',
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  });

  const [isSignedIn, setIsSignedIn] = useState(() => {
    return !!localStorage.getItem(AUTH_USER_KEY) || true;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isAdmin = user?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  // Helper to safely access puter object
  const getPuter = () => {
    return window.puter || null;
  };

  // Sign In with Puter Cloud Auth
  const signInWithPuter = async () => {
    setAuthError(null);
    setLoading(true);

    try {
      const puter = getPuter();
      if (!puter || !puter.auth) {
        throw new Error('Puter SDK is loading. You can also sign in as a Guest or Admin.');
      }

      await puter.auth.signIn();
      const userInfo = await puter.auth.getUser();

      const normalizedUser = {
        username: userInfo.username || 'User',
        email: userInfo.email || `${userInfo.username}@puter.com`,
        name: userInfo.name || userInfo.username || 'Candidate',
        role: userInfo.email?.toLowerCase().includes('admin') ? 'admin' : 'user',
        avatarUrl: userInfo.avatar_url || ''
      };

      setUser(normalizedUser);
      setIsSignedIn(true);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalizedUser));
      return { success: true, role: normalizedUser.role };
    } catch (err) {
      console.error('Puter signIn error:', err);
      const errMsg = err?.message || err?.toString() || '';
      if (errMsg.includes('popup') || errMsg.includes('blocked')) {
        setAuthError('Please allow the sign-in popup and try again.');
      } else {
        setAuthError(errMsg || 'Unable to sign in with Puter.');
      }
      return { success: false, role: 'user' };
    } finally {
      setLoading(false);
    }
  };

  // Sign in / Sign up
  const signIn = async (email, password, name = 'Alex Morgan', role = null) => {
    setLoading(true);
    setAuthError(null);
    try {
      const calculatedRole = role || (email?.toLowerCase().includes('admin') ? 'admin' : 'user');
      const mockUser = {
        username: (email || 'user').split('@')[0],
        email: email || 'alex.morgan@example.com',
        name: name || (calculatedRole === 'admin' ? 'System Administrator' : 'Alex Morgan'),
        role: calculatedRole,
        avatarUrl: ''
      };
      setUser(mockUser);
      setIsSignedIn(true);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      return { success: true, role: calculatedRole };
    } catch (err) {
      setAuthError('Sign in failed.');
      return { success: false, role: 'user' };
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Admin Login
  const loginAsAdmin = async () => {
    return signIn('admin@hirenova.ai', 'admin123', 'System Administrator', 'admin');
  };

  // 1-Click User Login
  const loginAsUser = async (name = 'Alex Morgan', email = 'alex.morgan@example.com') => {
    return signIn(email, 'user123', name, 'user');
  };

  const signUp = async (email, password, fullName, role = 'user') => {
    return signIn(email, password, fullName, role);
  };

  // Sign Out
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
      localStorage.removeItem(AUTH_USER_KEY);
      setLoading(false);
      setAuthError(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn,
        isAdmin,
        loading,
        authError,
        setAuthError,
        signIn,
        loginAsAdmin,
        loginAsUser,
        signInWithPuter,
        signUp,
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
