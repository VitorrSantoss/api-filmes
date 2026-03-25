let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

async function buscar() {
  const query = document.getElementById("busca").value.trim();
  const container = document.getElementById("resultados");

  if (!query) return;

  container.innerHTML = "<p>Carregando séries...</p>";

  try {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
    );
    const dados = await response.json();

    container.innerHTML = "";

    if (dados.length === 0) {
      container.innerHTML = "<p>Nenhuma série encontrada para este termo.</p>";
      return;
    }

    dados.forEach((item) => {
      const show = item.show;
      const imgUrl = show.image
        ? show.image.medium
        : "https://via.placeholder.com/210x295?text=Sem+Foto";

      const card = document.createElement("div");
      card.className = "filme-card";

      // SEO: O atributo 'alt' é obrigatório para nota 100
      card.innerHTML = `
                <img src="${imgUrl}" alt="Poster da série ${show.name}" loading="lazy">
                <div class="card-info">
                    <h4>${show.name}</h4>
                    <button class="btn-favoritar" aria-label="Adicionar ${show.name} aos favoritos">Favoritar</button>
                </div>
            `;

      card.querySelector(".btn-favoritar").onclick = () =>
        adicionarFavorito(show.name);
      container.appendChild(card);
    });
  } catch (erro) {
    container.innerHTML = "<p>Erro ao buscar dados. Tente novamente.</p>";
  }
}

function adicionarFavorito(nome) {
  if (!favoritos.includes(nome)) {
    favoritos.push(nome);
    salvar();
  } else {
    alert("Série já está nos favoritos.");
  }
}

function removerFavorito(index) {
  favoritos.splice(index, 1);
  salvar();
}

function salvar() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderizarFavoritos();
}

function renderizarFavoritos() {
  const lista = document.getElementById("favoritos");
  lista.innerHTML = "";

  favoritos.forEach((nome, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${nome}</span>
            <button class="btn-remover" onclick="removerFavorito(${index})" aria-label="Remover ${nome} dos favoritos">Remover</button>
        `;
    lista.appendChild(li);
  });
}

// Inicialização
renderizarFavoritos();
