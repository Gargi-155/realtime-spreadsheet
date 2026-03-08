"use client";

import { useParams } from "next/navigation";
import Presence from "@/components/Presence";
import Grid from "@/components/Grid";

export default function DocumentPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Spreadsheet: {id}</h1>

      <p className="text-gray-500 mt-2">
        Collaborative spreadsheet editor
      </p>

      <Presence />

      <Grid docId={id} />
    </main>
  );
}