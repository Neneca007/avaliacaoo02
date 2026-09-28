export async function onRequestGet(context) {
  const { request, env, params } = context;
  const provider = params.provider;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(`Erro: Código de autorização em falta para o provedor ${provider}.`, { status: 400 });
  }

  return new Response(`
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <title>Autenticação Concluída</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f6f8; color: #333; }
            .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: inline-block; }
            h1 { color: #2e7d32; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Login com ${provider.toUpperCase()} efetuado com sucesso!</h1>
            <p>O fluxo de autenticação terminou corretamente.</p>
            <a href="/" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Voltar ao Início</a>
        </div>
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
