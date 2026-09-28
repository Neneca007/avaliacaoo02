document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status");
  const authSection = document.getElementById("auth-section");
  const userSection = document.getElementById("user-section");
  const userEmailEl = document.getElementById("user-email");

  // Consulta a sessão local na rota /api/me
  fetch("/api/me", { credentials: "same-origin" })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return null;
    })
    .then((user) => {
      if (user) {
        // Usuário autenticado
        const identifier = user.email || user.displayName || user.displayName || "Usuário";
        statusEl.textContent = `Sessão ativa: ${identifier}`;
        if (userEmailEl) {
          userEmailEl.textContent = identifier;
        }

        // Alterna a exibição das seções
        if (authSection) authSection.classList.add("hidden");
        if (userSection) userSection.classList.remove("hidden");
      } else {
        // Sem sessão ativa
        statusEl.textContent = "Nenhuma sessão neste navegador.";
        if (authSection) authSection.classList.remove("hidden");
        if (userSection) userSection.classList.add("hidden");
      }
    })
    .catch((error) => {
      console.error("Erro ao verificar sessão:", error);
      statusEl.textContent = "Erro ao consultar status da sessão.";
    });
});
