import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db as firestore } from './firebase';
import { FIREBASE_COLLECTIONS, UserStatus } from './rolePermissions';
import { UserRole } from '../app/masyarakat/lib/useCurrentUser';
import { FirestoreUser } from './userManagementService';

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
  userId?: string; // For ID-based login
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  userName?: string;
  phoneNumber?: string;
  idNumber?: string;
  address?: string;
  isEmailVerified: boolean;
}

class AuthenticationService {
  private usersCollection = collection(firestore, FIREBASE_COLLECTIONS.USERS);

  // Login dengan Email/Username/UserID
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      console.log('🔐 AUTH: Login attempt with credentials:', {
        email: credentials.email,
        username: credentials.username,
        userId: credentials.userId,
        hasPassword: !!credentials.password
      });

      let userDoc: FirestoreUser | null = null;

      // 1. Cari user di Firestore berdasarkan identifier yang diberikan
      if (credentials.userId) {
        // Login dengan User ID
        userDoc = await this.findUserByAnyField(credentials.userId);
      } else if (credentials.email) {
        // Login dengan email
        userDoc = await this.findUserByEmail(credentials.email);
      } else if (credentials.username) {
        // Login dengan username
        userDoc = await this.findUserByUsername(credentials.username);
      } else {
        throw new Error('Email, username, atau ID user harus diisi');
      }

      if (!userDoc) {
        throw new Error('User tidak ditemukan dalam sistem');
      }

      // 2. Cek status user
      if (userDoc.status === 'suspended') {
        throw new Error('Akun Anda telah ditangguhkan. Hubungi administrator.');
      }

      if (userDoc.status === 'inactive') {
        throw new Error('Akun Anda tidak aktif. Hubungi administrator.');
      }

      if (userDoc.status === 'pending') {
        throw new Error('Akun Anda masih menunggu persetujuan administrator.');
      }

      // 3. Untuk sementara, skip Firebase Auth validation (karena user dibuat tanpa Firebase Auth)
      // TODO: Implement proper password validation when Firebase Auth integration is complete
      
      // 4. Update last login
      await this.updateLastLogin(userDoc.uid);

      // 5. Return AuthUser object
      const authUser: AuthUser = {
        uid: userDoc.uid,
        email: userDoc.email,
        displayName: userDoc.displayName,
        role: userDoc.role,
        status: userDoc.status,
        userName: userDoc.userName,
        phoneNumber: userDoc.phoneNumber,
        idNumber: userDoc.idNumber,
        address: userDoc.address,
        isEmailVerified: false // Since no Firebase Auth yet
      };

      console.log('✅ AUTH: Login successful:', authUser);
      return authUser;

    } catch (error) {
      console.error('❌ AUTH: Login failed:', error);
      throw error;
    }
  }

  // Cari user berdasarkan email
  private async findUserByEmail(email: string): Promise<FirestoreUser | null> {
    try {
      const q = query(this.usersCollection, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      return snapshot.docs[0].data() as FirestoreUser;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Cari user berdasarkan username
  private async findUserByUsername(username: string): Promise<FirestoreUser | null> {
    try {
      const q = query(this.usersCollection, where('userName', '==', username));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      return snapshot.docs[0].data() as FirestoreUser;
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  }

  // Cari user berdasarkan berbagai field (ID, email, username)
  private async findUserByAnyField(identifier: string): Promise<FirestoreUser | null> {
    try {
      // Try by UID first
      let q = query(this.usersCollection, where('uid', '==', identifier));
      let snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as FirestoreUser;
      }

      // Try by email
      q = query(this.usersCollection, where('email', '==', identifier));
      snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as FirestoreUser;
      }

      // Try by username
      q = query(this.usersCollection, where('userName', '==', identifier));
      snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as FirestoreUser;
      }

      // Try by idNumber
      q = query(this.usersCollection, where('idNumber', '==', identifier));
      snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as FirestoreUser;
      }

      return null;
    } catch (error) {
      console.error('Error finding user by any field:', error);
      return null;
    }
  }

  // Update last login timestamp
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const q = query(this.usersCollection, where('uid', '==', uid));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          lastLoginAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating last login:', error);
      // Don't throw error for this non-critical operation
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      console.log('🚪 AUTH SERVICE: Starting Firebase logout');
      await firebaseSignOut(auth);
      console.log('✅ AUTH SERVICE: Firebase logout successful');
      
      // Clear specific auth items (avoid clearing all to prevent HMR issues)
      if (typeof window !== 'undefined') {
        // Clear only essential auth-related items
        localStorage.removeItem('sigede_auth_user');
        localStorage.removeItem('firebase:authUser');
        localStorage.removeItem('firebase:host');
        console.log('🧹 AUTH SERVICE: Cleared auth storage');
      }
    } catch (error) {
      console.error('❌ AUTH SERVICE: Logout failed:', error);
      // Even if logout fails, clear essential storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sigede_auth_user');
        localStorage.removeItem('firebase:authUser');
        localStorage.removeItem('firebase:host');
      }
      throw error;
    }
  }

  // Get current user (if any Firebase Auth user exists)
  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Cek apakah user adalah admin
  isAdmin(role: UserRole): boolean {
    return ['administrator', 'admin_desa', 'kepala_desa'].includes(role);
  }

  // Validate login credentials format
  validateCredentials(credentials: LoginCredentials): string | null {
    if (!credentials.userId && !credentials.email && !credentials.username) {
      return 'Email, username, atau ID user harus diisi';
    }

    if (credentials.email && !this.isValidEmail(credentials.email)) {
      return 'Format email tidak valid';
    }

    // Password validation is optional for now (temp login without Firebase Auth)
    
    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create singleton instance
export const authService = new AuthenticationService();
export default authService;