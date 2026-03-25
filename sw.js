// Nome do cache (mude a versão quando atualizar seu app)
const CACHE_NAME = "series-pro-cache-v1";

// Arquivos que o app precisa para funcionar offline (App Shell)
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  // Adicione aqui o caminho para a sua logo/ícones se quiser que carreguem offline
];

// 1. INSTALAÇÃO: Baixa os arquivos e guarda no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto com sucesso!");
      return cache.addAll(urlsToCache);
    }),
  );
  // Força o Service Worker a assumir o controle imediatamente
  self.skipWaiting();
});

// 2. ATIVAÇÃO: Limpa caches de versões antigas do seu app
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Apagando cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  // Garante que a página atual seja controlada pelo novo Service Worker
  self.clients.claim();
});

// 3. INTERCEPTAÇÃO (FETCH): Onde a mágica do offline acontece
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se o arquivo estiver no cache (offline), retorna ele.
      if (response) {
        return response;
      }

      // Se não estiver no cache, vai buscar na internet (ex: a API de séries)
      return fetch(event.request);
    }),
  );
});
