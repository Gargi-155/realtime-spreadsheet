"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { getUser } from "@/lib/user";

interface PresenceProps {
  docId: string;
}

interface UserPresence {
  id: string;
  name: string;
  color: string;
  lastActive: number;
}

export default function Presence({ docId }: PresenceProps) {
  const [users, setUsers] = useState<UserPresence[]>([]);

  useEffect(() => {
    if (!docId) return;

    const user = getUser();

    // Reference to THIS user's presence inside this document
    const userRef = doc(db, "presence", docId, "users", user.id);

    // Register user
    setDoc(userRef, {
      ...user,
      lastActive: Date.now(),
    });

    // Heartbeat to keep user active
    const heartbeat = setInterval(() => {
      setDoc(userRef, {
        ...user,
        lastActive: Date.now(),
      });
    }, 5000);

    // Listen for realtime users in this sheet
    const unsubscribe = onSnapshot(
      collection(db, "presence", docId, "users"),
      (snapshot) => {
        const activeUsers: UserPresence[] = snapshot.docs.map((doc) =>
          doc.data() as UserPresence
        );

        setUsers(activeUsers);
      }
    );

    // Cleanup when user leaves
    const cleanup = () => {
      deleteDoc(userRef);
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      clearInterval(heartbeat);
      window.removeEventListener("beforeunload", cleanup);
      unsubscribe();
    };
  }, [docId]);

  return (
    <div className="flex gap-3">
      {users.map((u) => (
        <div
          key={u.id}
          className="px-3 py-1 rounded text-white text-sm font-medium"
          style={{ backgroundColor: u.color }}
        >
          {u.name}
        </div>
      ))}
    </div>
  );
}