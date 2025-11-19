let stickers = [];
let topJogadores = [];
let topArtilheiros = [];

function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

async function loadJogadores() {
  try {
    const response = await fetch('./scripts/jogadores_wikidata.json');
    const todosJogadores = await response.json();
    
    // Pega os 50 jogadores com mais jogos e ordena do maior para o menor
    topJogadores = [...todosJogadores]
      .sort((a, b) => parseInt(b.jogos) - parseInt(a.jogos))
      .slice(0, 50);
    
    // Pega os 10 jogadores com mais gols e ordena do maior para o menor
    topArtilheiros = [...todosJogadores]
      .sort((a, b) => parseInt(b.gols) - parseInt(a.gols))
      .slice(0, 10);
    
    const jogadoresEmbaralhados = embaralhar(todosJogadores);
    const primeirosDez = jogadoresEmbaralhados.slice(0, 12);
    
    stickers = primeirosDez.map((j, index) => {
      return {
        id: index + 1,
        name: j.apelido,
        imagem: j.imagem,
        wikipedia: j.wikidata || null,
        position: j.posicao,
        description: "Legenda da Seleção Brasileira",
        stats: `${j.jogos} Jogos - ${j.gols} gols`,
      };
    });
    
    renderCarousel();
    renderArtilheirosCarousel();
    render();
  } catch (err) {
    console.error("Erro ao carregar JSON:", err);
  }
}

function renderCarousel() {
  const carouselSection = document.getElementById('carousel-section');
  
  // Duplica os jogadores para o efeito infinito
  const duplicatedPlayers = [...topJogadores, ...topJogadores];
  
  const carouselHTML = duplicatedPlayers.map(jogador => `
    <div class="carousel-card">
      <img src="${jogador.imagem}" alt="${jogador.apelido}" class="carousel-image">
      <div class="carousel-info">
        <div class="carousel-name">${jogador.apelido}</div>
        <div class="carousel-stats">${jogador.jogos} Jogos</div>
      </div>
    </div>
  `).join('');
  
  carouselSection.innerHTML = `
    <div class="carousel-title">🏆 Maiores Jogadores por Partidas 🏆</div>
    <div class="carousel-container">
      <div class="carousel-track">
        ${carouselHTML}
      </div>
    </div>
  `;
}

function renderArtilheirosCarousel() {
  const artilheirosSection = document.getElementById('artilheiros-section');
  
  // Duplica os artilheiros para o efeito infinito
  const duplicatedArtilheiros = [...topArtilheiros, ...topArtilheiros];
  
  const carouselHTML = duplicatedArtilheiros.map(jogador => `
    <div class="carousel-card">
      <img src="${jogador.imagem}" alt="${jogador.apelido}" class="carousel-image">
      <div class="carousel-info">
        <div class="carousel-name">${jogador.apelido}</div>
        <div class="carousel-stats">⚽ ${jogador.gols} Gols</div>
      </div>
    </div>
  `).join('');
  
  artilheirosSection.innerHTML = `
    <div class="carousel-title">⚽ Top 10 Maiores Artilheiros ⚽</div>
    <div class="carousel-container">
      <div class="carousel-track reverse">
        ${carouselHTML}
      </div>
    </div>
  `;
}

function createStickerCard(sticker) {
  const imagemUrl = sticker.imagem || 'https://via.placeholder.com/200?text=' + encodeURIComponent(sticker.name);
  const wikiLink = sticker.wikipedia ? `href="${sticker.wikipedia}" target="_blank"` : 'style="opacity: 0.5; cursor: not-allowed;"';

  return `
    <div class="sticker">
      <div class="sticker-image">
        <img src="${imagemUrl}" alt="${sticker.name}">
      </div>
      <div class="sticker-info">
        <div>
          <div class="sticker-header">
            <div class="sticker-title">${sticker.name}</div>
            <div class="sticker-position">${sticker.position}</div>
          </div>
          <div class="sticker-description">${sticker.description}</div>
          <div class="sticker-stats">
            <div class="stat-badge">${sticker.stats}</div>
          </div>
          <div class="sticker-rarity">
          </div>
        </div>
        <div class="sticker-footer">
          <a ${wikiLink} class="btn btn-trade">Ver Perfil</a>
        </div>
      </div>
    </div>
  `;
}

function render() {
  const container = document.getElementById('container');
  container.innerHTML = stickers.map(createStickerCard).join('');
}

loadJogadores();
