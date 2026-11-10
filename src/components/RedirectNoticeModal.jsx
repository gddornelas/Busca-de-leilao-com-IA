import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, X, ArrowUpRight } from "lucide-react";

export default function RedirectNoticeModal({ lote, onClose }) {
  if (!lote) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog redirect-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="redirect-header">
          <div className="redirect-icon-wrap">
            <ShieldCheck size={32} className="shield-icon" />
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="redirect-body">
          <span className="redirect-pill">Redirecionamento Seguro</span>
          <h3 className="redirect-title">
            Entrando no leilão em <strong>{lote.siteNome}</strong>
          </h3>
          <p className="redirect-desc">
            Você está saindo do <strong>Leilões IA</strong> e acessando o pregão oficial no portal 
            homologado da <strong>{lote.siteNome}</strong>.
          </p>

          <div className="redirect-target-card">
            <div className="target-lot-title">{lote.titulo}</div>
            <div className="target-url-row">
              <span className="url-label">Link de destino:</span>
              <span className="url-text" title={lote.url}>{lote.url}</span>
            </div>
          </div>

          <div className="security-tips">
            <div className="tip-item">
              <span className="tip-bullet">✓</span>
              <span>Leiloeiro oficial matriculado com fé pública</span>
            </div>
            <div className="tip-item">
              <span className="tip-bullet">✓</span>
              <span>Cadastre-se com antecedência e habilite-se para dar lances</span>
            </div>
          </div>
        </div>

        <div className="redirect-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Permanecer aqui
          </button>
          <a
            href={lote.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-redirect"
            onClick={onClose}
          >
            <span>Ir para {lote.siteNome}</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

