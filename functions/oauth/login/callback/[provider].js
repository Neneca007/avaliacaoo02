export async function onRequestGet(context) {
  const { request, env, params } = context;
  const provider = params.provider;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(`Erro: Código de autorização em falta para o provedor ${provider}.`, { status: 400 });
  }

  try {
    // Exemplo de registo da sessão na base de dados D1 (oauth-sessions-emanuell)
    if (env.DB) {
      await env.DB.prepare(
        "INSERT INTO sessions (provider, code, created_at) VALUES (?, ?, ?)"
      ).bind(provider, code, new Date().toISOString()).run().catch(() => {
        // Ignora caso a tabela ainda esteja a ser criada ou ajustada
      });
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
              <h1>Login com ${provider.toUpperCase()} bem-sucedido!</h1>
              <p>A autenticação foi concluída e a sessão foi registada com sucesso.</p>
              <a href="/" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Voltar ao Início</a>
          </div>
      </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });

  } catch (err) {
    return new Response(`Erro ao processar a sessão: ${err.message}`, { status: 500 });
  }
}
