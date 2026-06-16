"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import { Field, Button, Alert } from "@/components/ui";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-black/10 p-6 dark:border-white/10">
      <h2 className="font-medium">{title}</h2>
      {children}
    </section>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [msg, setMsg] = useState<{ kind: "error" | "success"; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
  }, [isPending, session, router]);

  useEffect(() => {
    if (session) setName(session.user.name);
  }, [session]);

  if (isPending || !session) {
    return (
      <main className="flex flex-1 items-center justify-center text-sm text-neutral-500">
        Chargement…
      </main>
    );
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await authClient.updateUser({ name });
    setMsg(
      error
        ? { kind: "error", text: error.message ?? "Échec de la mise à jour." }
        : { kind: "success", text: "Nom mis à jour." },
    );
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      setMsg({ kind: "error", text: error.message ?? "Échec du changement." });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMsg({ kind: "success", text: "Mot de passe modifié." });
  }

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: "/account",
    });
    if (error) {
      setMsg({ kind: "error", text: error.message ?? "Échec de la demande." });
      return;
    }
    setNewEmail("");
    setMsg({
      kind: "success",
      text: "Confirmation envoyée à ton adresse actuelle.",
    });
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mon compte</h1>
        <Link href="/" className="text-sm underline">
          Retour
        </Link>
      </header>

      {msg ? <Alert kind={msg.kind}>{msg.text}</Alert> : null}

      <Section title="Profil">
        <p className="text-sm text-neutral-500">{session.user.email}</p>
        <form onSubmit={saveProfile} className="space-y-4">
          <Field
            label="Nom"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit">Enregistrer</Button>
        </form>
      </Section>

      <Section title="Changer le mot de passe">
        <form onSubmit={savePassword} className="space-y-4">
          <Field
            label="Mot de passe actuel"
            type="password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Field
            label="Nouveau mot de passe"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit">Mettre à jour</Button>
        </form>
      </Section>

      <Section title="Changer l'email">
        <p className="text-sm text-neutral-500">
          Un lien de confirmation est envoyé à ton adresse <em>actuelle</em>.
        </p>
        <form onSubmit={saveEmail} className="space-y-4">
          <Field
            label="Nouvelle adresse"
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button type="submit">Demander le changement</Button>
        </form>
      </Section>
    </main>
  );
}
