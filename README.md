# Leilões IA 🔨✨

O primeiro buscador inteligente de leilões no Brasil powered por **Google Gemini** e **Google Search Grounding**, desenvolvido em **React** e **Node.js/Express**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgddornelas%2FBusca-de-leilao-com-IA&env=GEMINI_API_KEY,GEMINI_MODEL&envDescription=Chave+gratuita+do+Google+AI+Studio&envLink=https%3A%2F%2Faistudio.google.com%2Fapikey)

---

## 🌟 Funcionalidades Principais

1. **Busca Inteligente com Google Gemini & Google Search Grounding**:
   - A IA do Gemini pesquisa e varre em tempo real os principais leiloeiros homologados do Brasil (Sodré Santoro, Superbid, Mega Leilões, Freitas Leiloeiro, Milan Leilões, Zukerman, Pestana Leilões, Caixa).
   - Localiza lotes reais, judiciais, extrajudiciais, frotas corporativas e apreensões.

2. **Cálculo de Vantagem Percentual**:
   - Compara o lance inicial com o valor de avaliação de mercado / tabela FIPE para calcular a porcentagem real de desconto (% de vantagem).

3. **Exibição do Site de Origem e Redirecionamento Direto**:
   - Em cada lote, é destacado o **nome do site de origem** de onde a oportunidade foi retirada (ex.: Sodré Santoro, Superbid Exchange, Mega Leilões).
   - Botão direto: `Entrar no leilão em [Nome do Site] ↗` com link oficial para a página do pregão.
   - Modal de segurança e aviso jurídico antes do redirecionamento.

4. **Análise de Lote com IA (Parecer Técnico)**:
   - Botão `Análise IA` em cada card: o Gemini gera um parecer com pontos fortes, riscos de edital (débitos de IPTU/IPVA, comissão de 5%), teto de lance recomendado e veredito final.

5. **Configuração Amigável do Gemini**:
   - Você pode configurar a chave `GEMINI_API_KEY` via arquivo `.env` ou diretamente pela interface do site (botão `Configurar Gemini` no topo), persistida no seu navegador.
   - Chave gratuita disponível em: https://aistudio.google.com/apikey

---

## 🚀 Deploy na Vercel (1-Clique)

Você pode colocar este projeto no ar gratuitamente na Vercel clicando no botão abaixo:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgddornelas%2FBusca-de-leilao-com-IA&env=GEMINI_API_KEY,GEMINI_MODEL&envDescription=Chave+gratuita+do+Google+AI+Studio&envLink=https%3A%2F%2Faistudio.google.com%2Fapikey)

Ou importe manualmente em **[vercel.com/new](https://vercel.com/new)** selecionando o repositório `gddornelas/Busca-de-leilao-com-IA`.

---

## 💻 Como Rodar Localmente

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar a Chave do Gemini (Opcional)

Crie o arquivo `.env` a partir do modelo:

```bash
cp .env.example .env
```

Edite o `.env` e insira sua chave gratuita:

```env
GEMINI_API_KEY=sua_chave_do_google_ai_studio_aqui
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
```

*(Obs.: Se não configurar de imediato, o site funciona perfeitamente com o catálogo curado de leilões reais dos leiloeiros oficiais e permite que você insira a chave a qualquer momento pela interface).*

### 3. Iniciar o Frontend e o Servidor

```bash
npm run dev
```

- **Frontend (React / Vite)**: [http://localhost:5173](http://localhost:5173)
- **API (Servidor Express)**: [http://localhost:3001](http://localhost:3001)

---

## 📁 Estrutura do Código

```
leiloes-ia/
├── api/
│   └── index.js              # Serverless Function para a Vercel
├── server/
│   ├── app.js                # Configuração e rotas do Express (compartilhado)
│   ├── index.js              # Ponto de entrada local (app.listen)
│   └── mockAuctions.js       # Catálogo de leilões oficiais e portais homologados
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Cabeçalho com status da IA, favoritos e atalhos
│   │   ├── Hero.jsx          # Seção de apresentação e vantagens do buscador
│   │   ├── SearchForm.jsx    # Filtros por categorias, palavras-chave, UF e faixa de valor
│   │   ├── AuctionCard.jsx   # Card com imagem, desconto, nome do site e botão de redirecionamento
│   │   ├── AILoader.jsx      # Animação de varredura em tempo real com radar da IA
│   │   ├── AIAnalysisModal.jsx # Parecer técnico detalhado gerado pela IA para o lote
│   │   ├── ApiKeyModal.jsx   # Configuração da chave Gemini direto na interface
│   │   ├── RedirectNoticeModal.jsx # Confirmação de redirecionamento seguro
│   │   ├── SitesMonitorados.jsx # Portais oficiais homologados (Sodré Santoro, Superbid, etc.)
│   │   ├── HowItWorks.jsx    # Explicação do fluxo de busca e arrematação
│   │   ├── FavoritosDrawer.jsx # Gaveta de leilões favoritados pelo usuário
│   │   └── Footer.jsx        # Rodapé institucional e avisos legais
│   ├── services/
│   │   └── api.js            # Comunicação com a API do backend
│   ├── App.jsx               # Componente principal integrando o fluxo completo
│   ├── main.jsx              # Ponto de entrada React
│   └── styles.css            # Design system moderno, responsivo e polido
├── vercel.json               # Configurações de build e rewrites para a Vercel
├── package.json
└── vite.config.js
```
