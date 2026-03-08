"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

interface Sheet {
  id: string;
  title: string;
}

export default function Home() {
  const router = useRouter();
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSheets() {
    const snapshot = await getDocs(collection(db, "documents"));

    const list: Sheet[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    setSheets(list);
    setLoading(false);
  }

  useEffect(() => {
    loadSheets();
  }, []);

  async function createSheet() {
    const name = prompt("Enter sheet name");

    if (!name) return;

    const docRef = await addDoc(collection(db, "documents"), {
      title: name,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp(),
      cells: {},
      colWidths: [],
    });

    router.push(`/doc/${docRef.id}`);
  }

  async function renameSheet(id: string, currentName: string) {
    const newName = prompt("Rename sheet", currentName);

    if (!newName) return;

    const docRef = doc(db, "documents", id);

    await updateDoc(docRef, {
      title: newName,
      lastModified: serverTimestamp(),
    });

    loadSheets();
  }

  async function deleteSheet(id: string) {
    const confirmDelete = confirm("Delete this sheet?");

    if (!confirmDelete) return;

    const docRef = doc(db, "documents", id);

    await deleteDoc(docRef);

    loadSheets();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-12">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-12">

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              SheetLab
            </h1>

            <p className="text-slate-500 mt-1">
              Real-time collaborative spreadsheets
            </p>
          </div>

          <button
            onClick={createSheet}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg shadow hover:bg-black transition"
          >
            + New Sheet
          </button>

        </div>

        {/* Loading */}

        {loading && (
          <p className="text-slate-500">Loading sheets...</p>
        )}

        {/* Sheet list */}

        <div className="space-y-4">

          {sheets.map((sheet) => (
            <div
              key={sheet.id}
              className="bg-white border border-slate-200 p-5 rounded-xl flex justify-between items-center hover:shadow-md transition"
            >
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/doc/${sheet.id}`)}
              >
                <div className="font-semibold text-lg text-slate-800">
                  {sheet.title}
                </div>

                <div className="text-sm text-slate-400">
                  ID: {sheet.id}
                </div>
              </div>

              <div className="flex gap-4 text-sm">

                <button
                  onClick={() => renameSheet(sheet.id, sheet.title)}
                  className="text-blue-600 hover:underline"
                >
                  Rename
                </button>

                <button
                  onClick={() => deleteSheet(sheet.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}