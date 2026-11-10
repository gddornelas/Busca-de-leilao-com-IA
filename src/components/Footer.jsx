import { Gavel, Sparkles, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Gavel size={24} className="footer-gavel" />
              <span>LEILÕES <strong className="text-gold">IA</strong></span>
            </div>
            <p className="footer-tagline">
              Buscador inteligente de leilões com inteligência artificial Google Gemini. 
              Varredura de editais, cálculo de desconto real e direcionamento seguro para leiloeiros homologados.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Portais Integrados</h4>
            <ul>
              <li><a href="https://www.sodresantoro.com.br" target="_blank" rel="noreferrer">Sodré Santoro</a></li>
              <li><a href="https://www.superbid.net" target="_blank" rel="noreferrer">Superbid Exchange</a></li>
              <li><a href="https://www.megaleiloes.com.br" target="_blank" rel="noreferrer">Mega Leilões</a></li>
              <li><a href="https://www.freitasleiloeiro.com.br" target="_blank" rel="noreferrer">Freitas Leiloeiro</a></li>
              <li><a href="https://www.zukerman.com.br" target="_blank" rel="noreferrer">Zukerman Leilões</a></li>
              <li><a href="https://www.milanleiloes.com.br" target="_blank" rel="noreferrer">Milan Leilões</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Categorias</h4>
            <ul>
              <li><a href="#buscar">Veículos e Frotas</a></li>
              <li><a href="#buscar">Imóveis Residenciais e Comerciais</a></li>
              <li><a href="#buscar">Eletrônicos e TI</a></li>
              <li><a href="#buscar">Máquinas e Equipamentos</a></li>
              <li><a href="#buscar">Leilões Judiciais</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Avisos Legais</h4>
            <div className="footer-legal-box">
              <ShieldCheck size={18} className="legal-shield" />
              <p>
                O <strong>Leilões IA</strong> é uma plataforma agregadora e de inteligência de busca. 
                Não realizamos leilões próprios. Todos os lances, cadastros e pagamentos são efetuados 
                diretamente nas plataformas oficiais dos leiloeiros matriculados.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Leilões IA. Desenvolvido com Google Gemini AI e React.</p>
          <p className="footer-disclaimer">
            Consulte sempre o edital oficial no site de destino antes de dar qualquer lance.
          </p>
        </div>
      </div>
    </footer>
  );
}

