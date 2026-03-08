import Presence from "@/components/Presence";
import Grid from "@/components/Grid";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Spreadsheet Dashboard</h1>

      <p className="text-gray-500 mt-2">
        Create and collaborate on spreadsheet documents in real time.
      </p>

      <Presence />

      <Grid />
    </main>
  );
}