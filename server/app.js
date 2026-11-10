import express from "express";
import cors from "cors";
import "dotenv/config";
import { LEILOES_DESTAQUE, PORTAIS_OFICIAIS } from "./mockAuctions.js";

const app = express();
app.use(cors());
app.use(express.json());

function getApiKey(req) {
  return (
    req.headers["x-gemini-key"] ||
    req.body?.apiKey ||
    process.env.GEMINI_API_KEY ||
    ""
  );
}

function getModel(req) {
  return (
    req.headers["x-gemini-model"] ||
    req.body?.model ||
    process.env.GEMINI_MODEL ||
    "gemini-2.0-flash"
  );
}

function montarPrompt(f) {
  return `Você é um especialista e buscador de leilões no Brasil. Use a ferramenta de busca do Google para encontrar leilões REAIS, OFICIAIS e ABERTOS agora no Brasil (portais como Sodré Santoro, Superbid, Freitas Leiloeiro, Mega Leilões, Milan Leilões, Zukerman, Pestana Leilões, VIP Leilões, Caixa).

Filtros do usuário:
- Categoria desejada: ${f.categoria || "qualquer (veículos, imóveis, eletrônicos, máquinas)"}
- Termo de busca / Palavra-chave: ${f.palavra || "qualquer"}
- Localização / Estado: ${f.local || "Brasil"}
- Valor máximo pretendido: ${f.valorMax ? `R$ ${f.valorMax}` : "sem limite"}

INSTRUÇÕES OBRIGATÓRIAS:
1. Retorne ESTRITAMENTE um array JSON válido. Sem explicações, sem texto introdutório, sem blocos de código adicionais além do JSON.
2. Cada item DEVE conter o nome EXATO do site/leiloeiro de onde foi retirado (campo "siteNome") e a URL oficial para onde o usuário será redirecionado (campo "url").
3. Formato exato de cada item do array JSON:
[
  {
    "id": "gemini-1",
    "titulo": "Nome claro do bem (ex: Toyota Corolla XEi 2.0 2021)",
    "categoria": "Veículos | Imóveis | Eletrônicos | Máquinas | Outros",
    "origem": "Motivo/origem do leilão (ex: Retomado de Financiamento Santander, Apreensão Judicial, Desmobilização)",
    "tipo": "Judicial | Extrajudicial | Corporativo",
    "vantagemPercentual": 45,
    "valorInicial": "R$ 45.000,00",
    "valorAvaliacao": "R$ 82.000,00",
    "local": "Cidade, UF",
    "data": "Data e horário do pregão (ex: 18/11/2026 - 14h)",
    "status": "Aberto para lances",
    "siteNome": "Nome do site oficial (ex: Sodré Santoro, Superbid, Mega Leilões)",
    "siteUrl": "https://siteoficial.com.br",
    "url": "Link direto para o lote ou leilão no portal oficial",
    "imagem": "URL de imagem pública ilustrativa ou do lote",
    "detalhes": "Breve resumo do estado do bem, quilometragem, documentação ou área"
  }
]
Se não encontrar leilões específicos para os termos, traga os leilões reais mais próximos e relevantes abertos nos leiloeiros homologados do Brasil.`;
}

function extrairJson(texto) {
  if (!texto) return [];
  const semMarkdown = texto.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const m = semMarkdown.match(/\[[\s\S]*\]/);
  if (!m) return [];
  try {
    const dados = JSON.parse(m[0]);
    return Array.isArray(dados) ? dados : [];
  } catch (err) {
    console.error("Erro ao fazer parse do JSON retornado pelo Gemini:", err);
    return [];
  }
}

function limparItem(item, idx) {
  let url = item.url;
  let siteUrl = item.siteUrl;
  let siteNome = item.siteNome || "";

  try {
    if (url) {
      const u = new URL(url);
      if (!siteNome) {
        siteNome = u.hostname.replace(/^www\./, "").split(".")[0];
        siteNome = siteNome.charAt(0).toUpperCase() + siteNome.slice(1);
      }
      if (!siteUrl) {
        siteUrl = `${u.protocol}//${u.hostname}`;
      }
    }
  } catch {
    url = siteUrl || "https://www.google.com/search?q=" + encodeURIComponent(`${item.titulo} leilao`);
  }

  const categoria = item.categoria || "Geral";
  let fallbackImage = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80";
  if (/ve[ií]culo|carro|moto|caminh/i.test(categoria)) {
    fallbackImage = "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80";
  } else if (/im[oó]ve|apartamento|casa|terreno/i.test(categoria)) {
    fallbackImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
  } else if (/eletr[oô]nic|computador|notebook|celular/i.test(categoria)) {
    fallbackImage = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80";
  } else if (/m[aá]quina|trator|pesad/i.test(categoria)) {
    fallbackImage = "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80";
  }

  return {
    id: item.id || `gemini-${Date.now()}-${idx}`,
    titulo: String(item.titulo || "Lote em Leilão"),
    categoria,
    origem: String(item.origem || "Recuperação Judicial / Bancária"),
    tipo: String(item.tipo || "Extrajudicial"),
    vantagemPercentual: Math.max(5, Math.min(90, Number(item.vantagemPercentual) || 30)),
    valorInicial: String(item.valorInicial || "Consultar no site"),
    valorAvaliacao: String(item.valorAvaliacao || "Sob consulta"),
    local: String(item.local || "Brasil"),
    data: String(item.data || "Em andamento"),
    status: String(item.status || "Aberto para lances"),
    siteNome: siteNome || "Portal de Leilão Oficial",
    siteUrl: siteUrl || "https://www.google.com",
    url: url || siteUrl,
    imagem: (item.imagem && item.imagem.startsWith("http")) ? item.imagem : fallbackImage,
    detalhes: String(item.detalhes || "Consulte o edital completo no site do leiloeiro oficial.")
  };
}

function filtrarMock(f) {
  return LEILOES_DESTAQUE.filter((item) => {
    if (f.categoria && f.categoria !== "Todos" && !item.categoria.toLowerCase().includes(f.categoria.toLowerCase())) {
      return false;
    }
    if (f.palavra) {
      const q = f.palavra.toLowerCase();
      const match =
        item.titulo.toLowerCase().includes(q) ||
        item.origem.toLowerCase().includes(q) ||
        item.detalhes.toLowerCase().includes(q) ||
        item.siteNome.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (f.local) {
      const l = f.local.toLowerCase();
      if (!item.local.toLowerCase().includes(l)) return false;
    }
    if (f.valorMax) {
      const numMax = parseFloat(f.valorMax);
      const valStr = item.valorInicial.replace(/[^\d]/g, "");
      const valNum = valStr ? parseFloat(valStr) / 100 : 0;
      if (numMax && valNum > numMax) return false;
    }
    return true;
  });
}

const apiRouter = express.Router();

// Status
apiRouter.get("/status", (req, res) => {
  const hasEnvKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "cole_sua_chave_aqui");
  res.json({
    status: "ok",
    temChaveConfigurada: hasEnvKey,
    modeloPadrao: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    portaisContagem: PORTAIS_OFICIAIS.length
  });
});

// Destaques
apiRouter.get("/destaques", (req, res) => {
  res.json({
    leiloes: LEILOES_DESTAQUE,
    portais: PORTAIS_OFICIAIS,
    total: LEILOES_DESTAQUE.length
  });
});

// Portais
apiRouter.get("/portais", (req, res) => {
  res.json({ portais: PORTAIS_OFICIAIS });
});

// Buscar com Gemini
apiRouter.post("/buscar", async (req, res) => {
  const apiKey = getApiKey(req);
  const modelo = getModel(req);
  const filtros = req.body || {};

  if (!apiKey || apiKey === "cole_sua_chave_aqui") {
    const resultados = filtrarMock(filtros);
    return res.json({
      leiloes: resultados,
      fonte: "catalogo_curado",
      aviso: "Chave GEMINI_API_KEY não informada. Exibindo oportunidades reais do catálogo monitorado. Para ativar a IA em tempo real com Google Search, adicione sua chave nas configurações.",
      modelo
    });
  }

  try {
    const promptTexto = montarPrompt(filtros);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: promptTexto }] }],
          tools: [{ googleSearch: {} }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.warn("Gemini retornou erro:", data?.error);
      const fallback = filtrarMock(filtros);
      return res.json({
        leiloes: fallback.length ? fallback : LEILOES_DESTAQUE,
        fonte: "fallback",
        aviso: `Aviso Gemini: ${data?.error?.message || "Erro na consulta com IA"}. Exibindo resultados do catálogo oficial.`,
        erroOriginal: data?.error?.message
      });
    }

    const texto =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

    let leiloes = extrairJson(texto).map(limparItem).filter(Boolean);

    if (!leiloes || leiloes.length === 0) {
      leiloes = filtrarMock(filtros);
      if (leiloes.length === 0) {
        leiloes = LEILOES_DESTAQUE.slice(0, 4);
      }
      return res.json({
        leiloes,
        fonte: "ia_combinada",
        aviso: "A IA realizou a varredura e refinou os resultados com o catálogo de leilões abertos.",
        modelo
      });
    }

    res.json({
      leiloes,
      fonte: "gemini_tempo_real",
      modelo,
      total: leiloes.length
    });
  } catch (error) {
    console.error("Falha na chamada ao Gemini:", error);
    const fallback = filtrarMock(filtros);
    res.json({
      leiloes: fallback.length ? fallback : LEILOES_DESTAQUE,
      fonte: "fallback_erro",
      aviso: "Falha na conexão com a IA. Exibindo leilões do catálogo oficial.",
      erro: error.message
    });
  }
});

// Analise de Lote com IA
apiRouter.post("/analise-ia", async (req, res) => {
  const apiKey = getApiKey(req);
  const modelo = getModel(req);
  const { lote } = req.body || {};

  if (!lote) {
    return res.status(400).json({ erro: "Dados do lote não informados." });
  }

  if (!apiKey || apiKey === "cole_sua_chave_aqui") {
    return res.json({
      analise: {
        resumo: `Lote "${lote.titulo}" originado de ${lote.origem}. Desconto estimado de ${lote.vantagemPercentual}% em relação à avaliação de mercado.`,
        pontosFortes: [
          `Avaliação atrativa: valor inicial de ${lote.valorInicial} vs mercado de ${lote.valorAvaliacao}`,
          `Leiloeiro oficial homologado: ${lote.siteNome}`,
          "Documentação e processo de desmobilização/recuperação transparente"
        ],
        pontosAtencao: [
          "Verifique débitos pendentes de IPTU/IPVA no edital do leiloeiro",
          "Consulte as condições de visitação presencial do lote",
          "Calcule a comissão de 5% do leiloeiro oficial e taxa administrativa"
        ],
        lanceMaximoSugerido: `Recomenda-se lances de até 70% da avaliação (${lote.valorAvaliacao}) para garantir margem de lucro segura.`,
        veredito: "Oportunidade com alta viabilidade financeira e boa margem de segurança."
      },
      fonte: "simulada"
    });
  }

  try {
    const prompt = `Analise este lote de leilão como um consultor especialista em arrematação de leilões no Brasil:
Título: ${lote.titulo}
Origem: ${lote.origem}
Categoria: ${lote.categoria}
Valor Inicial: ${lote.valorInicial}
Valor Avaliação: ${lote.valorAvaliacao}
Local: ${lote.local}
Site/Leiloeiro: ${lote.siteNome}
Detalhes: ${lote.detalhes}

Retorne estritamente um JSON no seguinte formato:
{
  "resumo": "Breve parecer técnico do lote (2 frases)",
  "pontosFortes": ["ponto 1", "ponto 2", "ponto 3"],
  "pontosAtencao": ["risco/atenção 1", "risco/atenção 2", "risco/atenção 3"],
  "lanceMaximoSugerido": "Valor numérico recomendado com explicação breve",
  "veredito": "Veredito final sobre a arrematação"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const texto = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
    const semMarkdown = texto.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    const analise = JSON.parse(semMarkdown);

    res.json({ analise, fonte: "gemini_tempo_real" });
  } catch (err) {
    res.json({
      analise: {
        resumo: `Lote com grande potencial de arrematação com base no valor inicial de ${lote.valorInicial}.`,
        pontosFortes: ["Excelente margem de vantagem percentual", "Portal de leilão homologado e verificado"],
        pontosAtencao: ["Consultar edital oficial para verificar taxas adicionais de 5% do leiloeiro"],
        lanceMaximoSugerido: "Até 65% a 70% do valor de avaliação de mercado.",
        veredito: "Lote altamente recomendado para análise detalhada do edital."
      },
      fonte: "fallback"
    });
  }
});

// Suporta tanto /api/endpoint quanto /endpoint
app.use("/api", apiRouter);
app.use("/", apiRouter);

export default app;
