"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [notesCount, setNotesCount] = useState<number | null>(null);

  // Garde de route : pas de session → redirection vers /login.
  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  // Démontre le flux JWT bout-en-bout (cookie session → token → microservice).
  useEffect(() => {
    if (!session) return;
    apiFetch("/api/notes")
      .then((r) => (r.ok ? r.json() : []))
      .then((notes) => setNotesCount(Array.isArray(notes) ? notes.length : 0))
      .catch(() => setNotesCount(null));
  }, [session]);

  if (isPending || !session) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-neutral-500">
        Chargement…
      </main>
    );
  }

  async function logout() {
    await authClient.signOut();
    router.replace("/login");
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Replang</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/account" className="underline">
            Mon compte
          </Link>
          <button onClick={logout} className="underline">
            Déconnexion
          </button>
        </nav>
      </header>

      <section className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
        <p className="text-lg">
          Bonjour <strong>{session.user.name}</strong> 👋
        </p>
        <p className="mt-1 text-sm text-neutral-500">{session.user.email}</p>
        <p className="mt-4 text-sm">
          {notesCount === null
            ? "Connexion au service Notes…"
            : `Tu as ${notesCount} note${notesCount > 1 ? "s" : ""}.`}
        </p>
      </section>
    </main>
  );
}
