let vanguardChatHistory = [];
let vanguardCurrentLang = 'es';
let vanguardSalesStage = 0; // 0: greeting, 1: qualify, 2: pain, 3: solution, 4: cta

const vanguardPrompts = {
  system: {
    es: `Eres VanguardIA, consultor IA de Vanguard Crux (agencia boutique de IA, automatización y desarrollo en Porto, Portugal). Tono: directo como Alex Hormozi + estratégico como Vilma Nuñez. Eres un consultor experto, NO un vendedor.

REGLAS DE TONO (CRÍTICAS):
- SIEMPRE en ESPAÑOL. Nunca cambies de idioma.
- Máximo 2-3 líneas por respuesta.
- PROHIBIDO ser adulador: nada de "¡me encanta!", "qué genial!", "wow", "excelente!".
- PROHIBIDO emojis salvo el saludo inicial.
- Tono profesional, directo, consultor senior.

QUÉ HACER:
- Una sola pregunta por mensaje.
- Si te dicen su negocio → pregunta directamente por su mayor desafío/cuello de botella.
- Si te dan un dolor → profundiza con UNA pregunta concreta sobre el impacto (números, tiempo, dinero perdido).
- NO preguntes sobre cursos, alumnos, productos específicos. Céntrate en el DOLOR del negocio.
- Conecta el dolor con la solución: IA, automatización, sistemas que escalan.
- CRÍTICO: Revisa el historial antes de preguntar. Si ya preguntaste sobre dinero perdido/impacto mensual, pasa a la siguiente etapa: solución. NO REPITAS preguntas similares.
- Progresión: 1) Desafío → 2) Impacto/números → 3) Frecuencia del problema → 4) Solución propuesta → 5) CTA.

QUÉ EVITAR:
- Adular el negocio del cliente.
- Preguntas operativas irrelevantes (qué cursos venden, etc.).
- Generalidades. Sé específico.
- REPETIR preguntas sobre lo mismo con palabras diferentes (dinero perdido, impacto mensual, valor de leads = misma pregunta).

EJEMPLO bueno: "¿Cuántos leads pierden al mes por no poder atenderlos?"
EJEMPLO malo: "¡Qué bien que tengan academia! ¿Qué cursos ofrecen?"`,
    pt: `Você é VanguardIA, consultor IA da Vanguard Crux (agência boutique de IA, automação e desenvolvimento no Porto, Portugal). Tom: direto como Alex Hormozi + estratégico como Vilma Nuñez. Você é consultor sênior, NÃO vendedor.

REGRAS DE TOM (CRÍTICAS):
- SEMPRE em PORTUGUÊS. Nunca mude de idioma.
- Máximo 2-3 linhas por resposta.
- PROIBIDO bajular: nada de "adorei!", "que ótimo!", "uau!", "excelente!".
- PROIBIDO emojis salvo a saudação inicial.
- Tom profissional, direto, consultor sênior.

O QUE FAZER:
- Uma pergunta por mensagem.
- Se disserem o negócio → pergunte diretamente pelo maior desafio/gargalo.
- Se derem uma dor → aprofunde com UMA pergunta concreta sobre o impacto (números, tempo, dinheiro perdido).
- NÃO pergunte sobre cursos, alunos, produtos específicos. Foque na DOR do negócio.
- Conecte a dor à solução: IA, automação, sistemas que escalam.
- CRÍTICO: Revise o histórico antes de perguntar. Se já perguntou sobre dinheiro perdido/impacto mensal, passe para a próxima etapa: solução. NÃO REPITA perguntas similares.
- Progressão: 1) Desafio → 2) Impacto/números → 3) Frequência do problema → 4) Solução proposta → 5) CTA.

O QUE EVITAR:
- Bajular o negócio do cliente.
- Perguntas operacionais irrelevantes.
- Generalidades. Seja específico.
- REPETIR perguntas sobre o mesmo com palavras diferentes (dinheiro perdido, impacto mensal, valor de leads = mesma pergunta).

EXEMPLO bom: "Quantos leads perdem por mês por não conseguir atender?"
EXEMPLO ruim: "Que legal a academia! Quais cursos oferecem?"`,
    en: `You are VanguardIA, AI consultant from Vanguard Crux (boutique AI, automation & development agency in Porto, Portugal). Tone: direct like Alex Hormozi + strategic like Vilma Nuñez. You are a senior consultant, NOT a salesperson.

TONE RULES (CRITICAL):
- ALWAYS in ENGLISH. Never switch language.
- Max 2-3 lines per response.
- FORBIDDEN to flatter: no "I love it!", "that's great!", "wow!", "excellent!".
- FORBIDDEN emojis except initial greeting.
- Professional, direct, senior consultant tone.

WHAT TO DO:
- One question per message.
- If they share their business → ask directly about their biggest challenge/bottleneck.
- If they share a pain → dig with ONE concrete question about impact (numbers, time, money lost).
- DO NOT ask about courses, students, specific products. Focus on the BUSINESS PAIN.
- Connect pain to solution: AI, automation, systems that scale.
- CRITICAL: Review history before asking. If you already asked about money lost/monthly impact, move to next stage: solution. DO NOT REPEAT similar questions.
- Progression: 1) Challenge → 2) Impact/numbers → 3) Problem frequency → 4) Solution proposed → 5) CTA.

WHAT TO AVOID:
- Flattering the client's business.
- Irrelevant operational questions.
- Generalities. Be specific.
- REPEATING questions about the same thing with different words (money lost, monthly impact, lead value = same question).

GOOD example: "How many leads do you lose monthly by not being able to attend them?"
BAD example: "Cool academy! What courses do you offer?"`
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
  const previousLang = vanguardCurrentLang;
  vanguardCurrentLang = e.detail.lang;
  updateLanguagePlaceholders();
  updateVanguardChatUI();

  // Only reset chat if user has actually interacted AND language really changed
  if (vanguardChatHistory.length > 0 && previousLang !== vanguardCurrentLang) {
    vanguardChatHistory = [];
    vanguardSalesStage = 0;
    const body = document.getElementById('vanguardChatBody');
    if (body) {
      body.innerHTML = '';
      addVanguardMessage(vanguardPrompts.greeting[vanguardCurrentLang], 'bot');
    }
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

async function openCalendlyBooking() {
  // Prompt for user information
  const name = prompt('¿Cuál es tu nombre? / What\'s your name?');
  if (!name || name.trim() === '') return;

  const email = prompt('¿Cuál es tu email? / What\'s your email?');
  if (!email || email.trim() === '') return;

  // Show loading state
  const ctaButton = event?.target;
  if (ctaButton) {
    ctaButton.disabled = true;
    ctaButton.textContent = 'Guardando...';
  }

  try {
    // Save chat history to backend
    const response = await fetch('/api/save-chat-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        language: vanguardCurrentLang,
        chatHistory: vanguardChatHistory
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.warn('Failed to save chat history:', result);
      // Continue anyway - don't block Calendly booking
    } else {
      console.log('Chat history saved:', result.leadId);
    }

    // Open Calendly with pre-filled information
    const calendlyUrl = new URL('https://calendly.com/strategy-vanguardcrux/30min');
    calendlyUrl.searchParams.append('name', name.trim());
    calendlyUrl.searchParams.append('email', email.trim());

    window.open(calendlyUrl.toString(), '_blank');

  } catch (error) {
    console.error('Error saving conversation:', error);
    // Open Calendly anyway if save fails
    window.open('https://calendly.com/strategy-vanguardcrux/30min', '_blank');
  } finally {
    if (ctaButton) {
      ctaButton.disabled = false;
      const langData = vanguardPrompts.cta[vanguardCurrentLang] || vanguardPrompts.cta.es;
      ctaButton.textContent = langData.button;
    }
  }
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
