let vanguardChatHistory = [];
let vanguardCurrentLang = 'es';
let vanguardSalesStage = 0; // 0: greeting, 1: qualify, 2: pain, 3: solution, 4: cta

const vanguardPrompts = {
  system: {
    es: `Eres VanguardIA, asistente de IA de Vanguard Crux. Personalidad: combinación de Alex Hormozi (directo, enfocado en resultados, no miedo a hablar de dinero) y Vilma Nuñez (empática, enfocada en la persona, estratégica).

Tu objetivo es un embudo de ventas para agendar un análisis gratuito. Sigue esta secuencia:
1. Saludo: pregunta breve sobre su negocio
2. Calificación: ¿son empresario/emprendedor?
3. Dolor: ¿cuál es su mayor desafío (ventas, automatización, marketing)?
4. Solución: cómo Vanguard Crux ayuda empresas como la suya
5. CTA: ofrece análisis gratis sin compromiso

Sé conciso (máx 2 líneas por mensaje). No preguntes más de una cosa a la vez.`,
    pt: `Você é VanguardIA, assistente de IA da Vanguard Crux. Personalidade: combinação de Alex Hormozi (direto, focado em resultados, sem medo de falar sobre dinheiro) e Vilma Nuñez (empática, focada na pessoa, estratégica).

Seu objetivo é um funil de vendas para agendar uma análise gratuita. Siga esta sequência:
1. Saudação: pergunta breve sobre seu negócio
2. Qualificação: é empresário/empreendedor?
3. Dor: qual é seu maior desafio (vendas, automação, marketing)?
4. Solução: como Vanguard Crux ajuda empresas como a sua
5. CTA: ofereça análise grátis sem compromisso

Seja conciso (máx 2 linhas por mensagem). Não faça mais de uma pergunta por vez.`,
    en: `You are VanguardIA, AI assistant for Vanguard Crux. Personality: combination of Alex Hormozi (direct, results-focused, unafraid to talk about money) and Vilma Nuñez (empathetic, people-focused, strategic).

Your goal is a sales funnel to book a free analysis. Follow this sequence:
1. Greeting: brief question about their business
2. Qualification: are they an entrepreneur/business owner?
3. Pain: what's their biggest challenge (sales, automation, marketing)?
4. Solution: how Vanguard Crux helps companies like theirs
5. CTA: offer free analysis no commitment

Be concise (max 2 lines per message). Don't ask more than one thing at a time.`
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
    vanguardChatHistory.push({ role: 'user', content: msg });
    if (vanguardChatHistory.length > 16) vanguardChatHistory = vanguardChatHistory.slice(-16);

    // Build context message with system prompt and sales stage
    const contextMsg = `[SYSTEM: ${vanguardPrompts.system[vanguardCurrentLang]}]\n[STAGE: ${vanguardSalesStage}]\n\nUser: ${msg}`;

    // Call Grok via Puter.js
    const response = await puter.ai.chat(contextMsg, {
      model: 'x-ai/grok-4-1-fast',
      temperature: 0.7,
      max_tokens: 500
    });

    document.getElementById(loaderId)?.remove();

    const reply = response.message?.content || 'No response received';
    vanguardChatHistory.push({ role: 'assistant', content: reply });

    // Check if it's time for CTA
    vanguardSalesStage++;
    if (vanguardSalesStage >= 4) {
      addVanguardCTAMessage();
    } else {
      addVanguardMessage(reply, 'bot');
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
  const body = document.getElementById('vanguardChatBody');
  const ctaData = vanguardPrompts.cta[vanguardCurrentLang];

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
