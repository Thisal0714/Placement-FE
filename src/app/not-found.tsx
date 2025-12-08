import Link from "next/link";

export default function CustomNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold mb-4 text-black">404 — Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Looks like you’re lost!
      </p>
      <div className="flex items-center bg-primary text-white px-4 py-2 rounded-lg cursor-pointer text-lg">
        <Link href="/products">
          Back to Home
        </Link>
      </div>
    </div>
  );
}