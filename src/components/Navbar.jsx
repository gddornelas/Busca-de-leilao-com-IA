import { useState } from "react";
import { Gavel, Sparkles, Key, ExternalLink, ShieldCheck, Heart } from "lucide-react";

export default function Navbar({ onOpenApiKey, temChaveConfigurada, favoritosCount, onToggleFavoritos }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="#" className="brand">
          <div className="brand-icon">
            <Gavel size={22} className="gavel-icon" />
            <Sparkles size={14} className="sparkle-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">
              LEILÕES <span className="brand-accent">IA</span>
            </span>
            <span className="brand-subtitle">Busca Inteligente em Leilões Oficiais</span>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#buscar" className="nav-link active">Buscar com IA</a>
          <a href="#destaques" className="nav-link">Oportunidades</a>
          <a href="#portais" className="nav-link">Sites Monitorados</a>
          <a href="#como-funciona" className="nav-link">Como Funciona</a>
        </nav>

        <div className="navbar-actions">
          <button 
            type="button" 
            className="action-btn favoritos-btn"
            onClick={onToggleFavoritos}
            title="Meus Leilões Salvos"
          >
            <Heart size={18} className={favoritosCount > 0 ? "fill-current" : ""} />
            <span className="badge-count">{favoritosCount}</span>
          </button>

          <button 
            type="button" 
            className={`action-btn api-key-btn ${temChaveConfigurada ? "has-key" : "no-key"}`}
            onClick={onOpenApiKey}
            title="Configurar Chave Gemini AI"
          >
            <Key size={16} />
            <span className="api-key-text">
              {temChaveConfigurada ? "Gemini AI Ativo" : "Configurar Gemini"}
            </span>
            <span className="status-dot"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

