"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AuthCard, Field, Button, Alert } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      // Better-Auth renvoie ce code tant que l'email n'est pas confirmé.
      if (error.code === "EMAIL_NOT_VERIFIED") {
        setError("Email non vérifié. Vérifie ta boîte mail (ou Mailpit en dev).");
      } else {
        setError(error.message ?? "Échec de la connexion.");
      }
      return;
    }
    router.push("/");
    router.refresh();
  }

  function social(provider: "github" | "google") {
    authClient.signIn.social({ provider, callbackURL: "/" });
  }

  return (
    <AuthCard
      title="Connexion"
      subtitle={
        <>
          Pas de compte ?{" "}
          <Link href="/signup" className="underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? <Alert>{error}</Alert> : null}
        {notice ? <Alert kind="success">{notice}</Alert> : null}
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-right text-sm">
          <Link href="/forgot-password" className="underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <Button type="submit" loading={loading}>
          Se connecter
        </Button>
      </form>

      <div className="space-y-2">
        <div className="text-center text-xs text-neutral-400">ou</div>
        <Button variant="secondary" onClick={() => social("github")}>
          Continuer avec GitHub
        </Button>
        <Button variant="secondary" onClick={() => social("google")}>
          Continuer avec Google
        </Button>
      </div>
    </AuthCard>
  );
}
