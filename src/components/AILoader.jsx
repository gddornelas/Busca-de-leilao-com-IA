import { useEffect, useState } from "react";
import { Sparkles, Globe, Cpu, CheckCircle2 } from "lucide-react";

const ETAPAS = [
  "Iniciando conexão segura com Gemini AI...",
  "Acionando busca em tempo real com Google Grounding...",
  "Pesquisando editais em Sodré Santoro, Superbid, Mega Leilões e Freitas...",
  "Calculando margem de vantagem em relação à Tabela FIPE e Mercado...",
  "Formatando links diretos e gerando dados oficiais..."
];

export default function AILoader() {
  const [etapaIdx, setEtapaIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setEtapaIdx((prev) => (prev < ETAPAS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ai-loader-container">
      <div className="ai-loader-card">
        <div className="ai-radar-animation">
          <div className="radar-circle circle-1"></div>
          <div className="radar-circle circle-2"></div>
          <div className="radar-circle circle-3"></div>
          <div className="ai-core-icon">
            <Sparkles size={28} className="pulsing-sparkle" />
          </div>
        </div>

        <h3 className="ai-loader-title">Inteligência Artificial Pesquisando Leilões</h3>
        <p className="ai-loader-subtitle">
          Vasculhando leiloeiros homologados do Brasil em tempo real...
        </p>

        <div className="ai-progress-steps">
          {ETAPAS.map((etapa, idx) => {
            const isCompleted = idx < etapaIdx;
            const isCurrent = idx === etapaIdx;
            return (
              <div 
                key={idx} 
                className={`step-row ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="step-indicator">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="step-check" />
                  ) : isCurrent ? (
                    <span className="step-spinner"></span>
                  ) : (
                    <span className="step-dot"></span>
                  )}
                </div>
                <span className="step-text">{etapa}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

