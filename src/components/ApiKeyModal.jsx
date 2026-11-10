import { useState } from "react";
import { Key, X, ExternalLink, Check, Sparkles, Shield, Cpu } from "lucide-react";

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey, model, onSaveModel }) {
  const [localKey, setLocalKey] = useState(apiKey || "");
  const [localModel, setLocalModel] = useState(model || "gemini-2.0-flash");
  const [salvo, setSalvo] = useState(false);

  if (!isOpen) return null;

  function handleSalvar(e) {
    e.preventDefault();
    onSaveApiKey(localKey.trim());
    onSaveModel(localModel);
    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      onClose();
    }, 1200);
  }

  function handleLimpar() {
    setLocalKey("");
    onSaveApiKey("");
    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      onClose();
    }, 800);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog api-key-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Key size={20} className="modal-key-icon" />
            <div>
              <h3>Configurações do Google Gemini</h3>
              <p className="modal-subtitle">Conecte sua chave para ativar a busca em tempo real com IA</p>
            </div>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="modal-body">
          <div className="api-key-explainer">
            <p>
              A busca inteligente por leilões utiliza o <strong>Google Gemini</strong> com a ferramenta 
              <strong> Google Search Grounding</strong> para vasculhar a internet e trazer oportunidades 
              reais dos principais leiloeiros do Brasil.
            </p>
            <a 
              href="https://aistudio.google.com/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="free-key-link"
            >
              <span>Obter chave gratuita no Google AI Studio</span>
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="form-field">
            <label htmlFor="apiKeyInput">Sua Chave de API do Gemini (GEMINI_API_KEY):</label>
            <input
              id="apiKeyInput"
              type="password"
              placeholder="Cole aqui sua chave AIzaSy..."
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="key-input"
            />
            <span className="field-hint">
              A chave fica gravada no seu navegador (localStorage) e não é compartilhada publicamente.
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="modelSelect">Modelo Gemini:</label>
            <div className="model-select-wrapper">
              <Cpu size={16} className="model-icon" />
              <select
                id="modelSelect"
                value={localModel}
                onChange={(e) => setLocalModel(e.target.value)}
                className="model-select"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Mais Rápido & Suporte a Search)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Estável)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Análise Mais Profunda)</option>
              </select>
            </div>
          </div>

          {salvo && (
            <div className="save-success-banner">
              <Check size={18} />
              <span>Configurações salvas com sucesso!</span>
            </div>
          )}

          <div className="modal-footer">
            <div className="footer-left">
              {localKey && (
                <button type="button" className="btn-text-danger" onClick={handleLimpar}>
                  Remover chave
                </button>
              )}
            </div>
            <div className="modal-footer-buttons">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar Configurações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

