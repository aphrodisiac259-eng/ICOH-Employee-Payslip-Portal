import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { AdminRole, AdminUser } from '../types';

interface AuthContextType {
  currentUser: User | null;
  adminProfile: AdminUser | null;
  role: AdminRole | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user: User) => {
    const adminDocRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminDocRef);

    if (!adminSnap.exists()) {
      await fbSignOut(auth);

      setAdminProfile(null);
      setRole(null);

      throw new Error(
        'This account is not authorized to access the ICOH Admin Console.'
      );
    }

    const data = adminSnap.data() as AdminUser;

    if (data.isActive !== true) {
      await fbSignOut(auth);

      setAdminProfile(null);
      setRole(null);

      throw new Error(
        'This administrator account is inactive. Please contact the Super Administrator.'
      );
    }

    if (data.role !== 'SuperAdmin' && data.role !== 'PayrollOfficer') {
      await fbSignOut(auth);

      setAdminProfile(null);
      setRole(null);

      throw new Error(
        'This account does not have a valid administrator role.'
      );
    }

    const profile: AdminUser = {
      ...data,
      userId: user.uid,
      email: user.email || data.email
    };

    setAdminProfile(profile);
    setRole(data.role);

    await setDoc(
      adminDocRef,
      {
        lastLogin: serverTimestamp(),
        email: user.email || data.email
      },
      { merge: true }
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          await fetchUserProfile(user);
        } catch (error) {
          console.error('Admin verification failed:', error);

          setCurrentUser(null);
          setAdminProfile(null);
          setRole(null);
        }
      } else {
        setAdminProfile(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        pass
      );

      await fetchUserProfile(credential.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fbSignOut(auth);

    setCurrentUser(null);
    setAdminProfile(null);
    setRole(null);
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchUserProfile(currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        adminProfile,
        role,
        loading,
        login,
        logout,
        refreshProfile
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