import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import SearchForm from "./components/SearchForm.jsx";
import AuctionCard from "./components/AuctionCard.jsx";
import AILoader from "./components/AILoader.jsx";
import AIAnalysisModal from "./components/AIAnalysisModal.jsx";
import ApiKeyModal from "./components/ApiKeyModal.jsx";
import RedirectNoticeModal from "./components/RedirectNoticeModal.jsx";
import SitesMonitorados from "./components/SitesMonitorados.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import FavoritosDrawer from "./components/FavoritosDrawer.jsx";
import Footer from "./components/Footer.jsx";
import { buscarLeiloes, obterDestaques, obterStatus } from "./services/api.js";
import { 
  Sparkles, 
  Filter, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Layers, 
  ArrowUpDown,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function App() {
  const [leiloes, setLeiloes] = useState([]);
  const [portais, setPortais] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [iniciando, setIniciando] = useState(true);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [fonteResultados, setFonteResultados] = useState("");
  
  // Modais e gavetas
  const [loteParaAnalise, setLoteParaAnalise] = useState(null);
  const [loteParaRedirecionar, setLoteParaRedirecionar] = useState(null);
  const [apiKeyModalAberta, setApiKeyModalAberta] = useState(false);
  const [favoritosDrawerAberto, setFavoritosDrawerAberto] = useState(false);

  // Configurações e Persistência
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("leiloes_gemini_key") || "");
  const [model, setModel] = useState(() => localStorage.getItem("leiloes_gemini_model") || "gemini-2.0-flash");
  const [temChaveServidor, setTemChaveServidor] = useState(false);
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const saved = localStorage.getItem("leiloes_salvos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Ordenação ativa
  const [ordenacao, setOrdenacao] = useState("vantagem");

  // Carregar status inicial e destaques
  useEffect(() => {
    async function inicializar() {
      try {
        const [statusData, destaquesData] = await Promise.all([
          obterStatus().catch(() => ({ temChaveConfigurada: false })),
          obterDestaques().catch(() => ({ leiloes: [], portais: [] }))
        ]);

        setTemChaveServidor(Boolean(statusData.temChaveConfigurada));
        if (destaquesData.leiloes) {
          setLeiloes(destaquesData.leiloes);
        }
        if (destaquesData.portais) {
          setPortais(destaquesData.portais);
        }
      } catch (err) {
        console.error("Falha ao inicializar dados:", err);
      } finally {
        setIniciando(false);
      }
    }
    inicializar();
  }, []);

  // Salvar favoritos no localStorage
  useEffect(() => {
    try {
      localStorage.setItem("leiloes_salvos", JSON.stringify(favoritos));
    } catch (e) {
      console.error(e);
    }
  }, [favoritos]);

  function handleSalvarApiKey(key) {
    setApiKey(key);
    localStorage.setItem("leiloes_gemini_key", key);
  }

  function handleSalvarModel(m) {
    setModel(m);
    localStorage.setItem("leiloes_gemini_model", m);
  }

  function toggleFavorito(item) {
    setFavoritos((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }

  // Executa busca com IA
  async function buscar(filtros) {
    setCarregando(true);
    setErro("");
    setAviso("");
    
    // Rola suavemente para a área de resultados
    const resultsAnchor = document.getElementById("area-resultados");
    if (resultsAnchor) {
      resultsAnchor.scrollIntoView({ behavior: "smooth" });
    }

    try {
      const resposta = await buscarLeiloes(filtros, apiKey, model);
      setLeiloes(resposta.leiloes || []);
      setFonteResultados(resposta.fonte || "");
      if (resposta.aviso) {
        setAviso(resposta.aviso);
      }
    } catch (e) {
      setErro(e.message || "Ocorreu um erro ao consultar os leilões com a IA.");
    } finally {
      setCarregando(false);
    }
  }

  function filtrarPorSite(nomeSite) {
    buscar({ palavra: nomeSite });
  }

  // Ordenar lista de leilões
  const leiloesOrdenados = [...leiloes].sort((a, b) => {
    if (ordenacao === "vantagem") {
      return (b.vantagemPercentual || 0) - (a.vantagemPercentual || 0);
    }
    if (ordenacao === "menorPreco") {
      const valA = parseFloat(String(a.valorInicial).replace(/[^\d]/g, "")) || 0;
      const valB = parseFloat(String(b.valorInicial).replace(/[^\d]/g, "")) || 0;
      return valA - valB;
    }
    return 0;
  });

  const temChaveAtiva = Boolean(apiKey || temChaveServidor);

  return (
    <div className="app-layout">
      {/* Barra de Navegação */}
      <Navbar 
        onOpenApiKey={() => setApiKeyModalAberta(true)} 
        temChaveConfigurada={temChaveAtiva}
        favoritosCount={favoritos.length}
        onToggleFavoritos={() => setFavoritosDrawerAberto(true)}
      />

      {/* Banner Informativo se não houver chave do Gemini configurada */}
      {!temChaveAtiva && (
        <div className="top-info-banner">
          <div className="banner-content">
            <Sparkles size={16} className="banner-sparkle" />
            <span>
              <strong>Dica:</strong> Ative a pesquisa em tempo real com Google Search conectando sua chave gratuita do Gemini.
            </span>
            <button 
              type="button" 
              className="banner-action-btn"
              onClick={() => setApiKeyModalAberta(true)}
            >
              Configurar Chave
            </button>
          </div>
        </div>
      )}

      <main className="main-content">
        {/* Seção Hero */}
        <Hero onExplorarClick={() => {
          const el = document.getElementById("buscar");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }} />

        {/* Formulário de Busca Inteligente com IA */}
        <SearchForm onBuscar={buscar} carregando={carregando} />

        {/* Área de Resultados com Âncora */}
        <section className="results-section" id="area-resultados">
          {/* Carregando com animação inteligente */}
          {carregando && <AILoader />}

          {/* Erro */}
          {erro && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <div>
                <strong>Erro na busca:</strong>
                <p>{erro}</p>
              </div>
            </div>
          )}

          {/* Aviso / Notificação de Fonte */}
          {aviso && !carregando && (
            <div className="notice-banner">
              <Info size={18} />
              <p>{aviso}</p>
            </div>
          )}

          {/* Cabeçalho da Grade de Resultados */}
          {!carregando && (
            <div className="results-header" id="destaques">
              <div className="results-header-left">
                <h2 className="results-title">
                  Oportunidades em Leilões Oficiais
                </h2>
                <span className="results-badge-count">
                  {leiloes.length} {leiloes.length === 1 ? "lote encontrado" : "lotes encontrados"}
                </span>
                {fonteResultados === "gemini_tempo_real" && (
                  <span className="gemini-live-badge">
                    <Sparkles size={13} />
                    <span>Gemini Live Search</span>
                  </span>
                )}
              </div>

              {leiloes.length > 0 && (
                <div className="results-header-right">
                  <div className="sort-box">
                    <ArrowUpDown size={15} className="sort-icon" />
                    <span className="sort-label">Ordenar por:</span>
                    <select 
                      value={ordenacao} 
                      onChange={(e) => setOrdenacao(e.target.value)}
                      className="sort-select"
                    >
                      <option value="vantagem">Maior Vantagem (% Desconto)</option>
                      <option value="menorPreco">Menor Lance Inicial</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grade de Cards de Leilão */}
          {!carregando && leiloesOrdenados.length > 0 && (
            <div className="auctions-grid">
              {leiloesOrdenados.map((item, idx) => (
                <AuctionCard 
                  key={item.id || item.url + idx} 
                  item={item} 
                  onAnalisar={(l) => setLoteParaAnalise(l)}
                  isFavorito={favoritos.some((f) => f.id === item.id)}
                  onToggleFavorito={toggleFavorito}
                  onRedirecionar={(l) => setLoteParaRedirecionar(l)}
                />
              ))}
            </div>
          )}

          {/* Estado Vazio */}
          {!carregando && leiloes.length === 0 && !erro && (
            <div className="empty-results-box">
              <Layers size={48} className="empty-icon" />
              <h3>Nenhum leilão encontrado para os filtros selecionados</h3>
              <p>Tente ajustar as palavras-chave, selecionar "Todos os Estados" ou remover o valor máximo.</p>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => buscar({})}
              >
                Ver todos os leilões em destaque
              </button>
            </div>
          )}
        </section>

        {/* Seção de Portais de Leilão Monitorados */}
        <SitesMonitorados 
          portais={portais} 
          onFiltrarPorSite={filtrarPorSite} 
        />

        {/* Seção Como Funciona */}
        <HowItWorks />
      </main>

      {/* Rodapé */}
      <Footer />

      {/* Modais */}
      {loteParaAnalise && (
        <AIAnalysisModal 
          lote={loteParaAnalise} 
          onClose={() => setLoteParaAnalise(null)}
          apiKey={apiKey}
          model={model}
          onRedirecionar={(l) => setLoteParaRedirecionar(l)}
        />
      )}

      {loteParaRedirecionar && (
        <RedirectNoticeModal 
          lote={loteParaRedirecionar} 
          onClose={() => setLoteParaRedirecionar(null)} 
        />
      )}

      <ApiKeyModal 
        isOpen={apiKeyModalAberta} 
        onClose={() => setApiKeyModalAberta(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSalvarApiKey}
        model={model}
        onSaveModel={handleSalvarModel}
      />

      <FavoritosDrawer 
        isOpen={favoritosDrawerAberto} 
        onClose={() => setFavoritosDrawerAberto(false)}
        favoritos={favoritos}
        onRemover={toggleFavorito}
        onRedirecionar={(l) => setLoteParaRedirecionar(l)}
      />
    </div>
  );
}
