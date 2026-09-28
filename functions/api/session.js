export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/session=([^;]+)/);

    if (!match) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const rawToken = match[1];

    if (!env.DB) {
      return new Response(
        JSON.stringify({ authenticated: false, error: "DB binding não encontrado" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(rawToken);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedToken = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const now = Math.floor(Date.now() / 1000);

    const session = await env.DB.prepare(
      "SELECT user_info, provider FROM sessions WHERE session_token = ? AND expires_at > ?"
    )
      .bind(hashedToken, now)
      .first();

    if (!session) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        user: JSON.parse(session.user_info),
        provider: session.provider,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ authenticated: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
