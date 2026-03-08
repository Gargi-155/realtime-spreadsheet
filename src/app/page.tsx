"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Doc {
  id: string;
  title?: string;
}

export default function Home() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [creating, setCreating] = useState(false);

  async function loadDocs() {
    const snapshot = await getDocs(collection(db, "documents"));

    const list: Doc[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setDocs(list);
  }

  useEffect(() => {
    loadDocs();
  }, []);

  async function createSheet() {
    setCreating(true);

    const docRef = await addDoc(collection(db, "documents"), {
      title: "Untitled Sheet",
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      cells: {},
      colWidths: [],
    });

    router.push(`/doc/${docRef.id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Spreadsheet Dashboard
        </h1>

        <p className="text-gray-600 mb-8">
          Create and collaborate on spreadsheets in real time.
        </p>

        <button
          onClick={createSheet}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 mb-8"
        >
          {creating ? "Creating..." : "+ Create New Sheet"}
        </button>

        <div className="space-y-3">

          {docs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/doc/${doc.id}`)}
              className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
            >
              {doc.title || "Untitled Sheet"}
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}