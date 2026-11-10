import { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { analisarLoteComIA } from "../services/api.js";

export default function AIAnalysisModal({ lote, onClose, apiKey, model, onRedirecionar }) {
  const [analise, setAnalise] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      if (!lote) return;
      setCarregando(true);
      setErro("");
      try {
        const resultado = await analisarLoteComIA(lote, apiKey, model);
        if (!cancelado) setAnalise(resultado);
      } catch (err) {
        if (!cancelado) setErro(err.message || "Não foi possível carregar a análise da IA.");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, [lote, apiKey, model]);

  if (!lote) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={20} className="modal-sparkle" />
            <div>
              <h3>Parecer Técnico da IA</h3>
              <p className="modal-subtitle">{lote.titulo}</p>
            </div>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Cabeçalho do lote */}
          <div className="modal-lote-summary">
            <div className="summary-item">
              <span className="summary-label">Site Oficial:</span>
              <strong className="summary-value highlight-site">{lote.siteNome}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Lance Inicial:</span>
              <strong className="summary-value text-green">{lote.valorInicial}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avaliação Mercado:</span>
              <span className="summary-value">{lote.valorAvaliacao}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Vantagem Estimada:</span>
              <strong className="summary-value badge-advantage">{lote.vantagemPercentual}% de desconto</strong>
            </div>
          </div>

          {carregando && (
            <div className="modal-loading-state">
              <Loader2 size={32} className="spin-icon" />
              <p>O Gemini está analisando o histórico, avaliação de mercado e riscos do lote...</p>
            </div>
          )}

          {erro && (
            <div className="modal-error-box">
              <AlertTriangle size={18} />
              <span>{erro}</span>
            </div>
          )}

          {analise && !carregando && (
            <div className="ai-report-content">
              {/* Resumo */}
              <div className="report-card report-summary">
                <h4>Resumo Executivo</h4>
                <p>{analise.resumo}</p>
              </div>

              {/* Pontos Fortes e Riscos */}
              <div className="report-columns">
                <div className="report-card report-strengths">
                  <h4>
                    <CheckCircle size={18} className="text-green" />
                    <span>Pontos Fortes da Oportunidade</span>
                  </h4>
                  <ul>
                    {analise.pontosFortes?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="report-card report-warnings">
                  <h4>
                    <AlertTriangle size={18} className="text-amber" />
                    <span>Pontos de Atenção & Edital</span>
                  </h4>
                  <ul>
                    {analise.pontosAtencao?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lance Máximo Sugerido */}
              <div className="report-card report-bid">
                <div className="bid-title-row">
                  <DollarSign size={20} className="bid-icon" />
                  <h4>Teto de Lance Recomendado pela IA</h4>
                </div>
                <p className="bid-recommendation">{analise.lanceMaximoSugerido}</p>
              </div>

              {/* Veredito */}
              <div className="report-card report-verdict">
                <span className="verdict-label">Veredito da IA:</span>
                <p className="verdict-text">{analise.veredito}</p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com redirecionamento claro e nome do site */}
        <div className="modal-footer">
          <div className="modal-footer-notice">
            <ShieldCheck size={16} />
            <span>Redirecionamento para o portal oficial <strong>{lote.siteNome}</strong></span>
          </div>

          <div className="modal-footer-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Fechar
            </button>
            <a
              href={lote.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={() => {
                if (onRedirecionar) onRedirecionar(lote);
                onClose();
              }}
            >
              <span>Acessar Leilão em <strong>{lote.siteNome}</strong></span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

