"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthCard, Field, Button, Alert } from "@/components/ui";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Échec de l'inscription.");
      return;
    }
    // requireEmailVerification est actif côté serveur : pas de session tant que
    // l'email n'est pas confirmé → on invite à aller voir sa boîte mail.
    setDone(true);
  }

  if (done) {
    return (
      <AuthCard title="Vérifie tes mails">
        <Alert kind="success">
          Un email de confirmation a été envoyé à <strong>{email}</strong>.
          Clique sur le lien pour activer ton compte, puis connecte-toi.
        </Alert>
        <p className="text-sm text-neutral-500">
          Tu as déjà un compte (par ex. via GitHub) avec cette adresse ? Aucun
          mail ne sera envoyé :{" "}
          <Link href="/login" className="underline">
            connecte-toi avec cette méthode
          </Link>
          .
        </p>
        <Button variant="secondary" onClick={() => (window.location.href = "/login")}>
          Aller à la connexion
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Créer un compte"
      subtitle={
        <>
          Déjà inscrit ?{" "}
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        <Field
          label="Nom"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" loading={loading}>
          Créer mon compte
        </Button>
      </form>
    </AuthCard>
  );
}
