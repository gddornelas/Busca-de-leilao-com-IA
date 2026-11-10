import { ExternalLink, ShieldCheck, Building, Car, Laptop, HardHat } from "lucide-react";

export default function SitesMonitorados({ portais = [], onFiltrarPorSite }) {
  return (
    <section className="sites-section" id="portais">
      <div className="section-header">
        <span className="section-pill">Fontes Oficiais Homologadas</span>
        <h2 className="section-title">Portais de Leilão Monitorados em Tempo Real</h2>
        <p className="section-subtitle">
          Nossa IA varre somente leiloeiros oficiais credenciados pelas Juntas Comerciais do Brasil, 
          garantindo segurança jurídica, validade de editais e transparência em cada arrematação.
        </p>
      </div>

      <div className="portais-grid">
        {portais.map((portal, idx) => (
          <div key={idx} className="portal-card">
            <div className="portal-card-top">
              <div className="portal-badge-wrap">
                <ShieldCheck size={18} className="portal-shield" />
                <span className="portal-name">{portal.nome}</span>
              </div>
              <span className="portal-year">Desde {portal.fundacao}</span>
            </div>

            <p className="portal-desc">{portal.descricao}</p>

            <div className="portal-tags">
              <span className="portal-tag">{portal.tipo}</span>
              <span className="portal-region">{portal.estado}</span>
            </div>

            <div className="portal-actions">
              <button
                type="button"
                className="filter-portal-btn"
                onClick={() => onFiltrarPorSite(portal.nome)}
              >
                Buscar lotes desta casa
              </button>
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="visit-portal-link"
                title={`Visitar site oficial da ${portal.nome}`}
              >
                <span>Visitar {portal.nome}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

