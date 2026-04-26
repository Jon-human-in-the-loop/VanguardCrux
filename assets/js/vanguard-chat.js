let vanguardChatHistory = [];
let vanguardCurrentLang = 'es';
let vanguardSalesStage = 0; // 0: greeting, 1: qualify, 2: pain, 3: solution, 4: cta

const vanguardPrompts = {
  system: {
    es: `Eres VanguardIA, asistente de IA de Vanguard Crux (agencia boutique de IA y desarrollo en Porto, Portugal). Personalidad: combinación de Alex Hormozi (directo, enfocado en resultados) y Vilma Nuñez (empática, estratégica).

REGLAS CRÍTICAS:
- SIEMPRE responde en ESPAÑOL. NUNCA cambies de idioma.
- Sé conciso: máximo 2-3 líneas por mensaje.
- Una pregunta a la vez.
- Habla de forma natural, NO menciones "etapas" ni "funnel".

FLUJO CONVERSACIONAL (avanza naturalmente):
1. Saludo + pregunta sobre su negocio
2. Profundiza: ¿qué hacen?, ¿hace cuánto?, ¿tamaño del equipo?
3. Identifica el dolor: ¿cuál es su mayor reto hoy?
4. Empatiza con el dolor y haz UNA pregunta más para entenderlo mejor
5. Conecta su dolor con cómo Vanguard Crux lo resuelve (IA, automatización, ventas)
6. Solo cuando el contexto esté maduro: propón el análisis gratis explicando el "por qué" (basado en SU dolor específico)

NUNCA propongas el análisis sin antes haber entendido el dolor y mostrado empatía.`,
    pt: `Você é VanguardIA, assistente de IA da Vanguard Crux (agência boutique de IA e desenvolvimento no Porto, Portugal). Personalidade: combinação de Alex Hormozi (direto, focado em resultados) e Vilma Nuñez (empática, estratégica).

REGRAS CRÍTICAS:
- SEMPRE responda em PORTUGUÊS. NUNCA mude de idioma.
- Seja conciso: máximo 2-3 linhas por mensagem.
- Uma pergunta de cada vez.
- Fale naturalmente, NÃO mencione "etapas" nem "funil".

FLUXO CONVERSACIONAL (avance naturalmente):
1. Saudação + pergunta sobre o negócio
2. Aprofunde: o que fazem?, há quanto tempo?, tamanho da equipe?
3. Identifique a dor: qual o maior desafio hoje?
4. Empatize com a dor e faça MAIS UMA pergunta para entendê-la melhor
5. Conecte a dor com como a Vanguard Crux resolve (IA, automação, vendas)
6. Só quando o contexto estiver maduro: proponha a análise grátis explicando o "porquê" (baseado na DOR específica dele)

NUNCA proponha a análise sem antes ter entendido a dor e mostrado empatia.`,
    en: `You are VanguardIA, AI assistant for Vanguard Crux (boutique AI & development agency in Porto, Portugal). Personality: combination of Alex Hormozi (direct, results-focused) and Vilma Nuñez (empathetic, strategic).

CRITICAL RULES:
- ALWAYS respond in ENGLISH. NEVER switch language.
- Be concise: max 2-3 lines per message.
- One question at a time.
- Speak naturally, do NOT mention "stages" or "funnel".

CONVERSATIONAL FLOW (advance naturally):
1. Greeting + question about their business
2. Dig deeper: what do they do?, how long?, team size?
3. Identify pain: what's their biggest challenge today?
4. Empathize with the pain and ask ONE more question to understand it better
5. Connect their pain with how Vanguard Crux solves it (AI, automation, sales)
6. Only when context is mature: propose free analysis explaining the "why" (based on THEIR specific pain)

NEVER propose the analysis without first understanding the pain and showing empathy.`
  },
  greeting: {
    es: "Hola 👋 Soy VanguardIA de Vanguard Crux. ¿Qué tipo de negocio tienes?",
    pt: "Oi 👋 Sou VanguardIA da Vanguard Crux. Que tipo de negócio você tem?",
    en: "Hey 👋 I'm VanguardIA from Vanguard Crux. What kind of business do you have?"
  },
  cta: {
    es: {
      message: "Te propongo algo: agendemos un análisis GRATIS de tu negocio. Sin compromiso. En 30 min te digo exactamente qué cambios generarían más ingresos.",
      button: "Agendar Análisis Gratis"
    },
    pt: {
      message: "Tenho uma proposta: que tal agendar uma análise GRÁTIS do seu negócio? Sem compromisso. Em 30 min te digo exatamente quais mudanças gerariam mais receita.",
      button: "Agendar Análise Grátis"
    },
    en: {
      message: "Here's what I propose: let's schedule a FREE analysis of your business. No commitment. In 30 mins I'll tell you exactly what changes would generate more revenue.",
      button: "Book Free Analysis"
    }
  }
};

function toggleVanguardChat() {
  const chatWindow = document.getElementById('vanguardChatWindow');
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open')) {
    document.getElementById('vanguardChatInput').focus();
    if (vanguardChatHistory.length === 0) {
      addVanguardMessage(vanguardPrompts.greeting[vanguardCurrentLang], 'bot');
    }
  }
}

function handleVanguardChatKeypress(e) {
  if (e.key === 'Enter') sendVanguardChatMessage();
}

function detectCurrentLanguage() {
  // PRIMARY: Read the currently active language button in real time
  const langBtn = document.querySelector('.language-btn.active');
  if (langBtn) {
    const langText = langBtn.textContent.trim().toLowerCase();
    if (langText.includes('pt')) {
      vanguardCurrentLang = 'pt';
      return;
    } else if (langText.includes('es')) {
      vanguardCurrentLang = 'es';
      return;
    } else if (langText.includes('en')) {
      vanguardCurrentLang = 'en';
      return;
    }
  }
  // FALLBACK: Only use html lang if no active button found
  const htmlLang = document.documentElement.lang;
  if (htmlLang && ['es', 'pt', 'en'].includes(htmlLang)) {
    vanguardCurrentLang = htmlLang;
  }
}

function updateLanguagePlaceholders() {
  const placeholders = {
    es: "Escribe tu pregunta...",
    pt: "Escreva sua pergunta...",
    en: "Type your question..."
  };
  document.getElementById('vanguardChatInput').placeholder = placeholders[vanguardCurrentLang] || placeholders.es;
}

// Observer para cambios de idioma
document.addEventListener('languageChanged', (e) => {
  vanguardCurrentLang = e.detail.lang;
  updateLanguagePlaceholders();
  updateVanguardChatUI();
  // Reset conversation when language changes to prevent context bias
  vanguardChatHistory = [];
  vanguardSalesStage = 0;
  const body = document.getElementById('vanguardChatBody');
  if (body) {
    body.innerHTML = '';
    addVanguardMessage(vanguardPrompts.greeting[vanguardCurrentLang], 'bot');
  }
});

function updateVanguardChatUI() {
  document.querySelectorAll('[data-es][data-pt][data-en]').forEach(el => {
    const text = el.getAttribute(`data-${vanguardCurrentLang}`);
    if (text && !el.querySelector('[class*="msg"]')) {
      el.textContent = text;
    }
  });
}

async function sendVanguardChatMessage() {
  const input = document.getElementById('vanguardChatInput');
  const msg = input.value.trim();

  if (!msg) return;

  addVanguardMessage(msg, 'user');
  input.value = '';

  // Show typing indicator
  const loaderId = 'vanguard-loader-' + Date.now();
  document.getElementById('vanguardChatBody').innerHTML += `<div class="vanguard-msg bot typing" id="${loaderId}">...</div>`;
  scrollVanguardChat();

  try {
    // Detect current language from active button (in real time)
    detectCurrentLanguage();

    vanguardChatHistory.push({ role: 'user', content: msg });
    if (vanguardChatHistory.length > 16) vanguardChatHistory = vanguardChatHistory.slice(-16);

    // Build context message with system prompt, sales stage and language enforcement
    const langName = { es: 'Spanish', pt: 'Portuguese', en: 'English' }[vanguardCurrentLang];
    const langExample = {
      es: 'Example reply: "¡Claro! ¿En qué puedo ayudarte hoy?"',
      pt: 'Example reply: "Claro! Em que posso ajudar você hoje?"',
      en: 'Example reply: "Sure! How can I help you today?"'
    }[vanguardCurrentLang];

    const contextMsg = `CRITICAL LANGUAGE RULE: You MUST respond ONLY in ${langName}. Do NOT use any other language. ${langExample}

${vanguardPrompts.system[vanguardCurrentLang]}

[Conversation stage: ${vanguardSalesStage}]

User says: ${msg}

Your response in ${langName}:`;

    // Call Grok via Puter.js
    const response = await puter.ai.chat(contextMsg, {
      model: 'x-ai/grok-4-1-fast',
      temperature: 0.7,
      max_tokens: 500
    });

    document.getElementById(loaderId)?.remove();

    const reply = response.message?.content || 'No response received';
    vanguardChatHistory.push({ role: 'assistant', content: reply });

    // Always show Grok's reply first
    addVanguardMessage(reply, 'bot');

    // Increment stage and show CTA after enough conversation (6 messages)
    vanguardSalesStage++;
    if (vanguardSalesStage >= 6) {
      // Small delay so the CTA appears as a natural follow-up
      setTimeout(() => addVanguardCTAMessage(), 800);
    }
  } catch (error) {
    document.getElementById(loaderId)?.remove();
    addVanguardMessage('Error al conectar con Grok. Por favor, intenta de nuevo.', 'bot');
  }
  scrollVanguardChat();
}

function addVanguardMessage(text, sender) {
  const body = document.getElementById('vanguardChatBody');
  const formattedText = text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/__(.*?)__/g, '<u>$1</u>');

  const div = document.createElement('div');
  div.className = `vanguard-msg ${sender}`;
  div.innerHTML = formattedText;
  body.appendChild(div);
  scrollVanguardChat();
}

function addVanguardCTAMessage() {
  // Detect current language in real time
  detectCurrentLanguage();

  const body = document.getElementById('vanguardChatBody');
  const ctaData = vanguardPrompts.cta[vanguardCurrentLang] || vanguardPrompts.cta.es;

  const div = document.createElement('div');
  div.className = 'vanguard-msg cta';
  div.innerHTML = `
    <p>${ctaData.message}</p>
    <button onclick="openCalendlyBooking()">${ctaData.button}</button>
  `;
  body.appendChild(div);
  scrollVanguardChat();
}

function openCalendlyBooking() {
  // Replace with your actual Calendly URL
  window.open('https://calendly.com/strategy-vanguardcrux/30min', '_blank');
}

function scrollVanguardChat() {
  const body = document.getElementById('vanguardChatBody');
  setTimeout(() => body.scrollTop = body.scrollHeight, 50);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateLanguagePlaceholders();
  // Get current language from page
  const langBtn = document.querySelector('.language-btn.active');
  if (langBtn) {
    const langText = langBtn.textContent.toLowerCase();
    if (langText === 'pt') vanguardCurrentLang = 'pt';
    else if (langText === 'es') vanguardCurrentLang = 'es';
    else vanguardCurrentLang = 'en';
  }
});
