import { X, ExternalLink, Trash2, Heart, ShieldCheck } from "lucide-react";

export default function FavoritosDrawer({ isOpen, onClose, favoritos = [], onRemover, onRedirecionar }) {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <Heart size={20} className="text-red fill-current" />
            <div>
              <h3>Lotes Salvos ({favoritos.length})</h3>
              <p className="drawer-subtitle">Seus leilões favoritados para acompanhamento</p>
            </div>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {favoritos.length === 0 ? (
            <div className="drawer-empty-state">
              <Heart size={44} className="empty-heart-icon" />
              <p className="empty-title">Nenhum lote salvo ainda</p>
              <p className="empty-desc">
                Clique no ícone de coração em qualquer leilão para salvá-lo e acompanhar depois.
              </p>
            </div>
          ) : (
            <div className="drawer-items-list">
              {favoritos.map((item) => (
                <div key={item.id} className="drawer-item-card">
                  <div className="drawer-item-content">
                    <span className="drawer-item-category">{item.categoria}</span>
                    <h4 className="drawer-item-title">{item.titulo}</h4>

                    <div className="drawer-item-price-row">
                      <span className="drawer-price-label">Lance Inicial:</span>
                      <strong className="drawer-price-val">{item.valorInicial}</strong>
                      <span className="drawer-discount">-{item.vantagemPercentual}%</span>
                    </div>

                    <div className="drawer-source-badge">
                      <ShieldCheck size={14} />
                      <span>Origem: <strong>{item.siteNome}</strong></span>
                    </div>
                  </div>

                  <div className="drawer-item-actions">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="drawer-enter-btn"
                      onClick={() => onRedirecionar(item)}
                      title={`Ir para o leilão em ${item.siteNome}`}
                    >
                      <span>Entrar em {item.siteNome}</span>
                      <ExternalLink size={14} />
                    </a>

                    <button
                      type="button"
                      className="drawer-remove-btn"
                      onClick={() => onRemover(item)}
                      title="Remover dos salvos"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn-secondary w-full" onClick={onClose}>
            Fechar Salvos
          </button>
        </div>
      </div>
    </div>
  );
}

