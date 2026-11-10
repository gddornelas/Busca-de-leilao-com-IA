import { Sparkles, Shield, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";

export default function Hero({ onExplorarClick }) {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Sparkles size={16} className="badge-sparkle" />
        <span>Buscador Inteligente com Google Gemini & Busca em Tempo Real</span>
      </div>

      <h1 className="hero-title">
        Encontre as melhores oportunidades em leilões com{" "}
        <span className="gradient-text">Inteligência Artificial</span>
      </h1>

      <p className="hero-description">
        Nossa IA varre diariamente os maiores portais de leilões homologados do Brasil 
        (<strong>Sodré Santoro</strong>, <strong>Superbid</strong>, <strong>Mega Leilões</strong>, <strong>Freitas</strong> e outros), 
        calcula a margem real de desconto sobre o valor de mercado e te encaminha com 
        segurança direto para a página do leiloeiro oficial.
      </p>

      <div className="hero-features-row">
        <div className="hero-feature-item">
          <div className="feature-icon-wrap shield">
            <Shield size={20} />
          </div>
          <div>
            <strong>100% Leiloeiros Oficiais</strong>
            <span>Somente sites homologados e com fé pública</span>
          </div>
        </div>

        <div className="hero-feature-item">
          <div className="feature-icon-wrap trending">
            <TrendingUp size={20} />
          </div>
          <div>
            <strong>Cálculo de Vantagem Real</strong>
            <span>Desconto percentual vs Tabela FIPE ou Mercado</span>
          </div>
        </div>

        <div className="hero-feature-item">
          <div className="feature-icon-wrap redirect">
            <ExternalLink size={20} />
          </div>
          <div>
            <strong>Redirecionamento com Origem</strong>
            <span>Você sempre sabe qual site publicou a oportunidade</span>
          </div>
        </div>
      </div>
    </section>
  );
}

