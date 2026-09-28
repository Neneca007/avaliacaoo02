// functions/oauth/callback/google.js
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Sem code", { status: 400 });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/oauth/callback/google`,
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();
  if (!tokenRes.ok) return new Response(JSON.stringify(tokens), { status: 400 });

  const user = await (await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })).json();

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": `session=${encodeURIComponent(user.email)}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}
