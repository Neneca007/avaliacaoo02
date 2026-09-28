export async function onRequestGet(context) {
  const { env, params } = context;
  const provider = params.provider;

  if (provider === "google") {
    const clientId = (env.GOOGLE_CLIENT_ID || "").trim();
    const redirectUri = (env.GOOGLE_REDIRECT_URI || "").trim();

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&prompt=select_account`;

    return Response.redirect(googleAuthUrl, 302);
  }

  if (provider === "github") {
    const clientId = (env.GITHUB_CLIENT_ID || "").trim();
    const redirectUri = (env.GITHUB_REDIRECT_URI || "").trim();

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email%20read:user`;

    return Response.redirect(githubAuthUrl, 302);
  }

  return new Response("Provider não suportado", { status: 400 });
}


