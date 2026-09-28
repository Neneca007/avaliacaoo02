const encoder = new TextEncoder();

export function base64url(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64urlDecode(text) {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/")
    .padEnd(Math.ceil(text.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

// 32 bytes aleatórios -> 43 caracteres Base64URL
export function randomToken() {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

// SHA-256 em Base64URL (serve para resumos e para o code_challenge)
export async function sha256(text) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return base64url(new Uint8Array(digest));
}
