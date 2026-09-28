function loginGoogle() {
  const params = new URLSearchParams({
    client_id: "SEU_CLIENT_ID.apps.googleusercontent.com",
    redirect_uri: `${window.location.origin}/oauth/callback/google`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });
  window.location.href =
    "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
}
