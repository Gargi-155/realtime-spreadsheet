"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import Grid from "@/components/Grid";
import Presence from "@/components/Presence";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [title, setTitle] = useState("Untitled Sheet");
  const [editing, setEditing] = useState(false);

  // Load sheet title
  useEffect(() => {
    async function loadTitle() {
      const docRef = doc(db, "documents", id);
      const snapshot = await getDoc(docRef);

      const data = snapshot.data();
      if (data?.title) {
        setTitle(data.title);
      }
    }

    if (id) loadTitle();
  }, [id]);

  // Save title when editing finishes
  async function saveTitle() {
    const docRef = doc(db, "documents", id);

    await updateDoc(docRef, {
      title: title,
    });

    setEditing(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <div className="flex items-center gap-4">

            {/* Back to dashboard */}

            <button
              onClick={() => router.push("/")}
              className="text-sm text-slate-500 hover:underline"
            >
              ← Dashboard
            </button>

            {/* Editable sheet title */}

            {editing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                }}
                className="text-2xl font-semibold bg-transparent border-b border-slate-300 outline-none"
                autoFocus
              />
            ) : (
              <h1
                onClick={() => setEditing(true)}
                className="text-2xl font-semibold text-slate-800 cursor-pointer"
              >
                {title}
              </h1>
            )}

          </div>

          {/* Presence indicator */}

          <Presence />

        </div>

        {/* Spreadsheet */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <Grid docId={id} />
        </div>

      </div>

    </main>
  );
}