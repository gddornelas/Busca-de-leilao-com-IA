import { useState } from "react";
import { 
  Search, 
  Sparkles, 
  Car, 
  Building2, 
  Laptop, 
  Tractor, 
  Layers, 
  MapPin, 
  DollarSign, 
  SlidersHorizontal,
  X,
  RotateCcw
} from "lucide-react";

const CATEGORIAS = [
  { id: "Todos", label: "Todos os Lotes", icon: Layers },
  { id: "Veículos", label: "Veículos & Carros", icon: Car },
  { id: "Imóveis", label: "Imóveis & Terrenos", icon: Building2 },
  { id: "Eletrônicos", label: "Eletrônicos & TI", icon: Laptop },
  { id: "Máquinas", label: "Máquinas & Pesados", icon: Tractor },
];

const SUGESTOES_RAPIDAS = [
  "Toyota Corolla ou Civic",
  "Apartamento em São Paulo",
  "Desconto acima de 40%",
  "Retomados de Bancos",
  "Lotes de Notebooks Dell",
  "Caminhões Volvo / Scania"
];

const ESTADOS = [
  "Todos os Estados",
  "São Paulo (SP)",
  "Rio de Janeiro (RJ)",
  "Minas Gerais (MG)",
  "Paraná (PR)",
  "Santa Catarina (SC)",
  "Rio Grande do Sul (RS)",
  "Distrito Federal (DF)",
  "Bahia (BA)",
  "Goiás (GO)"
];

export default function SearchForm({ onBuscar, carregando }) {
  const [categoria, setCategoria] = useState("Todos");
  const [palavra, setPalavra] = useState("");
  const [local, setLocal] = useState("Todos os Estados");
  const [valorMax, setValorMax] = useState("");
  const [origemFiltro, setOrigemFiltro] = useState("Todos");
  const [mostrarAvancado, setMostrarAvancado] = useState(false);

  function handleSubmit(e) {
    if (e) e.preventDefault();
    onBuscar({
      categoria: categoria === "Todos" ? "" : categoria,
      palavra: palavra.trim(),
      local: local === "Todos os Estados" ? "" : local.replace(/\s*\([^)]*\)/, "").trim(),
      valorMax: valorMax ? valorMax.trim() : "",
      origemFiltro: origemFiltro === "Todos" ? "" : origemFiltro
    });
  }

  function handleSugestaoClick(sugestao) {
    setPalavra(sugestao);
    onBuscar({
      categoria: categoria === "Todos" ? "" : categoria,
      palavra: sugestao,
      local: local === "Todos os Estados" ? "" : local.replace(/\s*\([^)]*\)/, "").trim(),
      valorMax: valorMax ? valorMax.trim() : "",
      origemFiltro: origemFiltro === "Todos" ? "" : origemFiltro
    });
  }

  function handleLimpar() {
    setCategoria("Todos");
    setPalavra("");
    setLocal("Todos os Estados");
    setValorMax("");
    setOrigemFiltro("Todos");
    onBuscar({
      categoria: "",
      palavra: "",
      local: "",
      valorMax: "",
      origemFiltro: ""
    });
  }

  return (
    <div className="search-container" id="buscar">
      {/* Abas de Categorias */}
      <div className="category-tabs">
        {CATEGORIAS.map((cat) => {
          const Icon = cat.icon;
          const ativo = categoria === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`cat-tab-btn ${ativo ? "active" : ""}`}
              onClick={() => {
                setCategoria(cat.id);
              }}
            >
              <Icon size={18} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Caixa de Formulário Principal */}
      <form className="search-box-card" onSubmit={handleSubmit}>
        <div className="search-main-row">
          <div className="input-group search-keyword">
            <Search size={20} className="input-icon" />
            <input
              type="text"
              value={palavra}
              onChange={(e) => setPalavra(e.target.value)}
              placeholder="Digite o que procura... Ex: Corolla 2022, Apartamento Brooklin, Notebook i7..."
              className="main-input"
            />
            {palavra && (
              <button 
                type="button" 
                className="clear-input-btn" 
                onClick={() => setPalavra("")}
                title="Limpar texto"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="input-group select-group">
            <MapPin size={18} className="input-icon" />
            <select 
              value={local} 
              onChange={(e) => setLocal(e.target.value)}
              className="styled-select"
            >
              {ESTADOS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          <div className="input-group input-val-max">
            <DollarSign size={18} className="input-icon" />
            <input
              type="number"
              min="0"
              step="1000"
              value={valorMax}
              onChange={(e) => setValorMax(e.target.value)}
              placeholder="Valor Máx (R$)"
              className="styled-input"
            />
          </div>

          <button 
            type="submit" 
            className="submit-search-btn"
            disabled={carregando}
          >
            {carregando ? (
              <>
                <span className="spinner"></span>
                <span>Pesquisando...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Buscar com IA</span>
              </>
            )}
          </button>
        </div>

        {/* Barra de Filtros Rápidos & Sugestões */}
        <div className="search-footer-row">
          <div className="quick-suggestions">
            <span className="suggestions-label">Sugestões de busca:</span>
            <div className="suggestions-list">
              {SUGESTOES_RAPIDAS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  className="suggestion-pill"
                  onClick={() => handleSugestaoClick(sug)}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-actions">
            <button
              type="button"
              className="toggle-advanced-btn"
              onClick={() => setMostrarAvancado(!mostrarAvancado)}
            >
              <SlidersHorizontal size={14} />
              <span>{mostrarAvancado ? "Ocultar Filtros" : "Mais Filtros"}</span>
            </button>

            {(palavra || local !== "Todos os Estados" || valorMax || categoria !== "Todos") && (
              <button
                type="button"
                className="reset-btn"
                onClick={handleLimpar}
                title="Limpar todos os filtros"
              >
                <RotateCcw size={14} />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Painel Avançado Expandível */}
        {mostrarAvancado && (
          <div className="advanced-filters-panel">
            <div className="advanced-filter-item">
              <label>Tipo de Origem do Leilão</label>
              <select 
                value={origemFiltro} 
                onChange={(e) => setOrigemFiltro(e.target.value)}
              >
                <option value="Todos">Todas as Origens</option>
                <option value="Bancos">Retomados de Bancos / Financeiras</option>
                <option value="Judicial">Leilões Judiciais (JUCESP/Varas Cíveis)</option>
                <option value="Corporativo">Desmobilização de Frotas & TI</option>
                <option value="Apreensão">Apreensões & Receita</option>
              </select>
            </div>

            <div className="advanced-filter-item">
              <label>Ordenação Recomendada</label>
              <select defaultValue="vantagem">
                <option value="vantagem">Maior Vantagem (% Desconto)</option>
                <option value="menorPreco">Menor Valor Inicial</option>
                <option value="dataProxima">Encerramento Mais Próximo</option>
              </select>
            </div>

            <div className="advanced-filter-item">
              <label>Portais Específicos</label>
              <select defaultValue="todos">
                <option value="todos">Todos os leiloeiros homologados</option>
                <option value="sodre">Sodré Santoro</option>
                <option value="superbid">Superbid Exchange</option>
                <option value="mega">Mega Leilões</option>
                <option value="freitas">Freitas Leiloeiro</option>
                <option value="zukerman">Zukerman Leilões</option>
                <option value="milan">Milan Leilões</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
