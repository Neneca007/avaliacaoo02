export async function onRequestGet(context) {
  const { env, params } = context;
  const provider = params.provider;

  if (provider === "google") {
    const redirectUri = env.GOOGLE_REDIRECT_URI.trim();
    const clientId = env.GOOGLE_CLIENT_ID.trim();

    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "online",
        prompt: "select_account"
      }).toString();

    return Response.redirect(googleAuthUrl, 302);
  }

  if (provider === "github") {
    const redirectUri = env.GITHUB_REDIRECT_URI.trim();
    const clientId = env.GITHUB_CLIENT_ID.trim();

    const githubAuthUrl = "https://github.com/login/oauth/authorize?" +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: "user:email read:user"
      }).toString();

    return Response.redirect(githubAuthUrl, 302);
  }

  return new Response("Provider não suportado", { status: 400 });
}
