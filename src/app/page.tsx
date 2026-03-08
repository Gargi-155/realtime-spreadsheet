import Link from "next/link";

export default function Home() {
  const docs = ["sheet1"];

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Spreadsheet Dashboard
      </h1>

      <p className="text-gray-500 mb-6">
        Select a document to open.
      </p>

      <div className="space-y-3">
        {docs.map((doc) => (
          <Link
            key={doc}
            href={`/doc/${doc}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            Open {doc}
          </Link>
        ))}
      </div>
    </main>
  );
}