"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthCard, Field, Button, Alert } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await authClient.requestPasswordReset({
      email,
      // Better-Auth redirige le lien email vers cette page avec ?token=...
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Une erreur est survenue.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle={
        <Link href="/login" className="underline">
          Retour à la connexion
        </Link>
      }
    >
      {sent ? (
        <Alert kind="success">
          Si un compte existe pour <strong>{email}</strong>, un email de
          réinitialisation vient d'être envoyé.
        </Alert>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? <Alert>{error}</Alert> : null}
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" loading={loading}>
            Envoyer le lien
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
