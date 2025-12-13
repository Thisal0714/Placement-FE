import Link from "next/link";
import { BlockUserIcon } from "@/app/util/icons";

export default function PermissionDenied() {
  return (
    
    <section className="w-full h-screen flex flex-col justify-center items-center bg-white">
      <BlockUserIcon
        className="w-80 h-80 mb-8"
        userColor="var(--danger)"
        hoverColor="var(--danger-hover)"
      />

      <h2 className="text-2xl text-black mb-5">
        You are not authorized to access this page.
      </h2>
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </Link>
    </section>
  );
}