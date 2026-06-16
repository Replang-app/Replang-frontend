import { createAuthClient } from "better-auth/react";

/**
 * Client Better-Auth (front).
 *
 * `baseURL` non défini → le client utilise l'origine courante du navigateur.
 * En dev comme en prod, tout est servi sous une **origine unique** par Traefik
 * (dev : http://localhost ; prod : https://<domaine>), donc les appels
 * `/api/auth/*` sont same-origin (cookies + CORS triviaux).
 *
 * Le nom affiché de l'utilisateur est le champ natif `name` (éditable via
 * `updateUser`). Pas de champ additionnel.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || undefined,
});

export const { useSession, signIn, signUp, signOut } = authClient;
