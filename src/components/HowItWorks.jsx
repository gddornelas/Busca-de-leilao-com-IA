import { Search, Sparkles, TrendingDown, ExternalLink, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  const passos = [
    {
      num: "01",
      icone: Search,
      titulo: "Você define seus critérios",
      descricao: "Informe categoria, cidade, valor máximo ou digite livremente o que procura (veículos, imóveis, informática ou pesados)."
    },
    {
      num: "02",
      icone: Sparkles,
      titulo: "Google Gemini pesquisa em tempo real",
      descricao: "O modelo de IA vasculha os maiores leiloeiros oficiais do país via Google Search Grounding e extrai editais abertos."
    },
    {
      num: "03",
      icone: TrendingDown,
      titulo: "Cálculo de margem e vantagem",
      descricao: "A IA cruza o lance inicial com o valor de avaliação ou tabela FIPE para indicar a porcentagem real de desconto."
    },
    {
      num: "04",
      icone: ExternalLink,
      titulo: "Redirecionamento com fonte clara",
      descricao: "Cada oportunidade exibe o nome exato do portal de origem e um botão direto para participar do leilão oficial com segurança."
    }
  ];

  return (
    <section className="how-it-works-section" id="como-funciona">
      <div className="section-header">
        <span className="section-pill">Transparência & Tecnologia</span>
        <h2 className="section-title">Como a Busca Inteligente Funciona</h2>
        <p className="section-subtitle">
          Agilidade e inteligência para você não perder as melhores arrematações do mercado brasileiro.
        </p>
      </div>

      <div className="steps-grid">
        {passos.map((p, idx) => {
          const Icon = p.icone;
          return (
            <div key={idx} className="step-card">
              <div className="step-card-header">
                <span className="step-num">{p.num}</span>
                <div className="step-icon-wrap">
                  <Icon size={22} />
                </div>
              </div>
              <h3 className="step-title">{p.titulo}</h3>
              <p className="step-desc">{p.descricao}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

