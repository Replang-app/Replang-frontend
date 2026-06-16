/**
 * Appel d'un microservice protégé (notes, …) depuis le front.
 *
 * Modèle Better-Auth : la session vit dans un cookie ; pour parler à un
 * microservice on récupère un JWT court (15 min) via `/api/auth/token`, puis on
 * l'envoie en `Authorization: Bearer`. Le service vérifie le JWT en local (JWKS).
 * Même origine (Traefik) → le cookie de session part tout seul.
 */
export async function getJwt(): Promise<string | null> {
  const res = await fetch("/api/auth/token", { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { token?: string };
  return data.token ?? null;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getJwt();
  return fetch(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
