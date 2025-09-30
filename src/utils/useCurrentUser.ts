import { useEffect, useState } from "react";
import { auth, db } from "../pages/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type User = {
  uid: string;
  name: string;
  type: "user" | "hospital" | "admin";
};

export function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        return;
      }

      const docRef = doc(db, "users", u.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser({
          uid: u.uid,
          name: data.name ?? u.email?.split("@")[0] ?? "User",
          type: data.type ?? "user",
        });
      } else {
        setUser({
          uid: u.uid,
          name: u.email?.split("@")[0] ?? "User",
          type: "user",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
}
