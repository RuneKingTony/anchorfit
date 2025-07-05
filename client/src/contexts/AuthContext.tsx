
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  profile: any | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired, clear authentication
        console.warn('Authentication token is invalid, clearing session');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token);
    }
  };

  const verifyTokenAndSetUser = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSession({ access_token: token });
        setProfile(data.profile);
        // Store user data for future sessions
        localStorage.setItem('user_data', JSON.stringify(data.user));
      } else {
        // Invalid token, remove it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  };

  useEffect(() => {
    // Check for token in URL first (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      // Store the token and clean up URL
      localStorage.setItem('auth_token', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check for existing session in localStorage
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setSession({ access_token: token });
      fetchProfile(token);
    } else if (token) {
      // Token exists but no user data, verify token
      verifyTokenAndSetUser(token);
    }
    
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const { user: newUser, token, profile } = data;
        setUser(newUser);
        setSession({ access_token: token });
        setProfile(profile);
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(newUser));
        
        return { error: null };
      } else {
        return { error: { message: data.error } };
      }
    } catch (error) {
      return { error: { message: 'Network error' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const { user: newUser, token, profile } = data;
        setUser(newUser);
        setSession({ access_token: token });
        setProfile(profile);
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(newUser));
        
        return { error: null };
      } else {
        return { error: { message: data.error } };
      }
    } catch (error) {
      return { error: { message: 'Network error' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      signUp,
      signIn,
      signOut,
      loading,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
