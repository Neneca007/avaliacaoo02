import { randomToken, sha256 } from "../../_shared/crypto.js";
import { txCookie } from "../../_shared/cookies.js";
import { getProvider } from "../../_shared/providers.js";

export async function onRequestGet(context) {
  const { env, params } = context;
  const name = params.provider;
  const provider = getProvider(name);

  if (!provider) {
    return new Response("Not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const txId = randomToken();
  const state = randomToken();
  const codeVerifier = randomToken();
  const nonce = name === "google" ? randomToken() : null;

  const codeChallenge = await sha256(codeVerifier);
  const idHash = await sha256(txId);
  const stateHash = await sha256(state);

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 600;

  await env.DB.prepare("DELETE FROM oauth_transactions WHERE expires_at < ?")
    .bind(now)
    .run();
  await env.DB.prepare(
    "INSERT INTO oauth_transactions (id_hash, provider, state_hash, nonce, code_verifier, expires_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(idHash, name, stateHash, nonce, codeVerifier, expiresAt)
    .run();

  const url = new URL(provider.authorizeUrl);
  url.searchParams.set("client_id", provider.clientId(env));
  url.searchParams.set("redirect_uri", `${env.PUBLIC_BASE_URL}/oauth/callback/${name}`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  if (name === "google") {
    url.searchParams.set("scope", provider.scope);
    url.searchParams.set("nonce", nonce);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": txCookie(txId),
      "Cache-Control": "no-store",
    },
  });
}
