"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getUser } from "@/lib/user";

export default function Presence() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const user = getUser();

    const userRef = doc(db, "presence", user.id);

    setDoc(userRef, user);

    const unsubscribe = onSnapshot(collection(db, "presence"), (snapshot) => {
      const activeUsers = snapshot.docs.map((doc) => doc.data());
      setUsers(activeUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex gap-3 mb-4">
      {users.map((u) => (
        <div
          key={u.id}
          className="px-3 py-1 rounded text-white text-sm"
          style={{ background: u.color }}
        >
          {u.name}
        </div>
      ))}
    </div>
  );
}