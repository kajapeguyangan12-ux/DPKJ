import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export type UserRole =
  | "admin"
  | "admin_desa"
  | "kepala_desa"
  | "kepala_dusun"
  | "warga_dpkj"
  | "warga_luar"
  | "unknown";

export interface CurrentUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export function useCurrentUser(): { user: CurrentUser | null; loading: boolean } {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsub = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const data = userDoc.exists() ? userDoc.data() : {};
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          role: (data.role as UserRole) || "unknown",
        });
      } catch {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          role: "unknown",
        });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return { user, loading };
}