import { useState } from "react";
import {
  ExternalLink,
  Sparkles,
  Heart,
  MapPin,
  Calendar,
  ShieldCheck,
  TrendingDown,
  Tag,
  Info,
  CheckCircle2
} from "lucide-react";

export default function AuctionCard({ item, onAnalisar, isFavorito, onToggleFavorito, onRedirecionar }) {
  const [imagemErro, setImagemErro] = useState(false);

  // Fallback de imagem de acordo com categoria
  function obterImagemFallback() {
    const cat = (item.categoria || "").toLowerCase();
    if (cat.includes("veíc") || cat.includes("carro") || cat.includes("moto")) {
      return "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80";
    }
    if (cat.includes("imóv") || cat.includes("apart") || cat.includes("casa")) {
      return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
    }
    if (cat.includes("eletr") || cat.includes("note") || cat.includes("comp")) {
      return "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80";
    }
    return "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80";
  }

  const imagemSrc = (imagemErro || !item.imagem) ? obterImagemFallback() : item.imagem;

  function handleEntrarClick(e) {
    if (onRedirecionar) {
      onRedirecionar(item);
    }
  }

  return (
    <article className="auction-card">
      {/* Imagem do Lote com Badges */}
      <div className="card-media-wrapper">
        <img
          src={imagemSrc}
          alt={item.titulo}
          className="card-image"
          onError={() => setImagemErro(true)}
          loading="lazy"
        />

        {/* Badges sobre a foto */}
        <div className="media-overlay-top">
          <span className="badge-category">{item.categoria || "Leilão"}</span>
          <button
            type="button"
            className={`favorite-card-btn ${isFavorito ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorito(item);
            }}
            title={isFavorito ? "Remover dos salvos" : "Salvar lote"}
          >
            <Heart size={18} fill={isFavorito ? "#ef4444" : "none"} color={isFavorito ? "#ef4444" : "#ffffff"} />
          </button>
        </div>

        {/* Vantagem Percentual em destaque */}
        <div className="media-overlay-bottom">
          <span className="advantage-pill">
            <TrendingDown size={14} />
            <strong>{item.vantagemPercentual}% de vantagem</strong>
          </span>
          <span className="status-pill">{item.status || "Aberto"}</span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="card-body">
        <h3 className="card-title" title={item.titulo}>
          {item.titulo}
        </h3>

        {/* Origem do Bem */}
        <div className="card-origin-box">
          <span className="origin-label">Origem:</span>
          <span className="origin-value">{item.origem || "Recuperação Judicial / Bancária"}</span>
        </div>

        {/* Bloco de Preços */}
        <div className="pricing-grid">
          <div className="price-col">
            <span className="price-label">Lance Inicial:</span>
            <span className="price-value highlight">{item.valorInicial}</span>
          </div>

          {item.valorAvaliacao && item.valorAvaliacao !== "Sob consulta" && (
            <div className="price-col right">
              <span className="price-label">Avaliação de Mercado:</span>
              <span className="price-market">{item.valorAvaliacao}</span>
            </div>
          )}
        </div>

        {/* Meta informações: Local e Data */}
        <div className="card-meta-list">
          {item.local && (
            <div className="meta-item">
              <MapPin size={14} className="meta-icon" />
              <span>{item.local}</span>
            </div>
          )}
          {item.data && (
            <div className="meta-item">
              <Calendar size={14} className="meta-icon" />
              <span>{item.data}</span>
            </div>
          )}
        </div>

        {/* Detalhes rápidos */}
        {item.detalhes && (
          <p className="card-snippet">
            {item.detalhes}
          </p>
        )}

        {/* DESTAQUE PRINCIPAL REQUERIDO: SITE DE ORIGEM DE ONDE FOI RETIRADO */}
        <div className="card-source-banner">
          <div className="source-info-left">
            <ShieldCheck size={16} className="source-verified-icon" />
            <div className="source-text">
              <span className="source-caption">Retirado do portal oficial:</span>
              <strong className="source-sitename">{item.siteNome}</strong>
            </div>
          </div>
          <span className="source-safe-badge">Oficial</span>
        </div>

        {/* Ações do Card */}
        <div className="card-actions">
          {/* Botão de Análise com Gemini IA */}
          <button
            type="button"
            className="ai-analyze-btn"
            onClick={() => onAnalisar(item)}
            title="Ver análise completa de risco e oportunidade com IA"
          >
            <Sparkles size={16} />
            <span>Análise IA</span>
          </button>

          {/* BOTÃO PRINCIPAL DE ENTRADA E REDIRECIONAMENTO COM NOME DO SITE */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-redirect-btn"
            onClick={handleEntrarClick}
            title={`Você será redirecionado para o site oficial da ${item.siteNome}`}
          >
            <span>Entrar no leilão em <strong>{item.siteNome}</strong></span>
            <ExternalLink size={16} className="arrow-icon" />
          </a>
        </div>
      </div>
    </article>
  );
}
