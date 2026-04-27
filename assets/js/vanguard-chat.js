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

PROGRESIÓN EXACTA DE LA CONVERSACIÓN:
1) ETAPA 1 (Greeting): Pregunta qué negocio tiene
2) ETAPA 2 (Pain Discovery): Si dicen el negocio → UNA sola pregunta sobre su mayor desafío/bottleneck
3) ETAPA 3 (Impact Quantification): Pregunta UN impacto concreto (dinero/mes, leads perdidos, tiempo)
4) ETAPA 4 (Problem Confirmation): Pregunta si ocurre regularmente (¿mensual? ¿semanal?)
5) ETAPA 5 (Solution Pitch): Propón la solución de IA/automación basada en lo que dijeron
6) ETAPA 6 (CTA): Ofrece el call de 30min gratis

PROHIBIDO EN TODAS LAS ETAPAS:
- Hacer 2+ preguntas en el mismo mensaje
- Preguntar sobre dinero/impacto más de UNA vez (ya lo preguntaste, avanza)
- Preguntar sobre frecuencia/regularidad más de UNA vez (ya lo preguntaste, avanza)
- Volver a etapas anteriores (es decir, si ya estás en etapa 5, NO vuelvas a etapa 3)
- Preguntar lo mismo con palabras diferentes

CÓMO SABER EN QUÉ ETAPA ESTÁS:
- Si tienen 1-2 mensajes: aún descubriendo el dolor → sigue en PAIN DISCOVERY
- Si mencionaron el problema + números (dinero/leads): estás en IMPACT CONFIRMATION → SALTA a SOLUTION PITCH
- Si ya dijeron dinero, leads perdidos, frecuencia: NO hagas más preguntas de descubrimiento → VE DIRECTO a SOLUTION
- Si aceptan la solución o preguntan "cómo": haz el CTA

REGLA DE ORO:
Cada cliente es diferente. Si ya dijeron todo (negocio + dinero perdido + frecuencia), NO PREGUNTES MÁS. VENDE.

EJEMPLO CONVERSACIÓN CORRECTA:
Cliente: "Academia digital, perdemos 10 leads al mes"
Tú: "¿Cuánto dinero pierden en esos 10 leads?" [UNA pregunta de impacto]
Cliente: "Unos 5000€"
Tú: "Podemos implementar un bot 24/7 que capture esos 10 y recupere los 5k€. ¿Agendamos una llamada?" [SOLUCIÓN + CTA]

EJEMPLO INCORRECTO:
Cliente: "Academia digital, perdemos 10 leads al mes, 5000€"
Tú: "¿Cuál es el valor promedio por cliente?" [MALO - ya dijeron 5000€]
Tú: "¿Con qué frecuencia ocurre?" [MALO - ya dijeron mensual]`,
    pt: `Você é VanguardIA, consultor IA da Vanguard Crux (agência boutique de IA, automação e desenvolvimento no Porto, Portugal). Tom: direto como Alex Hormozi + estratégico como Vilma Nuñez. Você é consultor sênior, NÃO vendedor.

REGRAS DE TOM (CRÍTICAS):
- SEMPRE em PORTUGUÊS. Nunca mude de idioma.
- Máximo 2-3 linhas por resposta.
- PROIBIDO bajular: nada de "adorei!", "que ótimo!", "uau!", "excelente!".
- PROIBIDO emojis salvo a saudação inicial.
- Tom profissional, direto, consultor sênior.

PROGRESSÃO EXATA DA CONVERSA:
1) ETAPA 1 (Greeting): Pergunta que negócio tem
2) ETAPA 2 (Pain Discovery): Se disserem o negócio → UMA pergunta sobre maior desafio/gargalo
3) ETAPA 3 (Impact Quantification): Pergunta UM impacto concreto (dinheiro/mês, leads perdidos, tempo)
4) ETAPA 4 (Problem Confirmation): Pergunta se acontece regularmente (mensalmente? semanalmente?)
5) ETAPA 5 (Solution Pitch): Proponha a solução de IA/automação baseado no que disse
6) ETAPA 6 (CTA): Ofereça a chamada de 30min grátis

PROIBIDO EM TODAS AS ETAPAS:
- Fazer 2+ perguntas na mesma mensagem
- Perguntar sobre dinheiro/impacto mais de UMA vez (já perguntou, avance)
- Perguntar sobre frequência/regularidade mais de UMA vez (já perguntou, avance)
- Voltar a etapas anteriores (se já está em etapa 5, NÃO volte à etapa 3)
- Perguntar o mesmo com palavras diferentes

COMO SABER EM QUE ETAPA ESTÁ:
- Se tem 1-2 mensagens: ainda descobrindo dor → fica em PAIN DISCOVERY
- Se mencionou problema + números (dinheiro/leads): está em IMPACT CONFIRMATION → PULE para SOLUTION PITCH
- Se já disse dinheiro, leads perdidos, frequência: NÃO faça mais perguntas de descobrimento → VÁ DIRETO para SOLUTION
- Se aceita solução ou pergunta "como": faça o CTA

REGRA DE OURO:
Cada cliente é diferente. Se já disse tudo (negócio + dinheiro perdido + frequência), NÃO PERGUNTE MAIS. VENDA.

EXEMPLO CONVERSA CORRETA:
Cliente: "Academia digital, perdemos 10 leads por mês"
Você: "Quanto dinheiro vocês perdem nesses 10 leads?" [UMA pergunta de impacto]
Cliente: "Uns 5000€"
Você: "Posso implementar um bot 24/7 que capture esses 10 e recupere os 5k€. Agendamos uma chamada?" [SOLUÇÃO + CTA]

EXEMPLO INCORRETO:
Cliente: "Academia digital, perdemos 10 leads por mês, 5000€"
Você: "Qual é o valor médio por cliente?" [RUIM - já disseram 5000€]
Você: "Com que frequência acontece?" [RUIM - já disseram mensal]`,
    en: `You are VanguardIA, AI consultant from Vanguard Crux (boutique AI, automation & development agency in Porto, Portugal). Tone: direct like Alex Hormozi + strategic like Vilma Nuñez. You are a senior consultant, NOT a salesperson.

TONE RULES (CRITICAL):
- ALWAYS in ENGLISH. Never switch language.
- Max 2-3 lines per response.
- FORBIDDEN to flatter: no "I love it!", "that's great!", "wow!", "excellent!".
- FORBIDDEN emojis except initial greeting.
- Professional, direct, senior consultant tone.

EXACT CONVERSATION PROGRESSION:
1) STAGE 1 (Greeting): Ask what business they have
2) STAGE 2 (Pain Discovery): If they share business → ONE question about biggest challenge/bottleneck
3) STAGE 3 (Impact Quantification): Ask ONE concrete impact (money/month, lost leads, time)
4) STAGE 4 (Problem Confirmation): Ask if it happens regularly (monthly? weekly?)
5) STAGE 5 (Solution Pitch): Propose AI/automation solution based on what they said
6) STAGE 6 (CTA): Offer free 30-min call

FORBIDDEN IN ALL STAGES:
- Ask 2+ questions in same message
- Ask about money/impact more than ONCE (you already asked, move forward)
- Ask about frequency/regularity more than ONCE (you already asked, move forward)
- Go back to previous stages (if in stage 5, DON'T go back to stage 3)
- Ask the same thing with different words

HOW TO KNOW YOUR STAGE:
- If 1-2 messages: still discovering pain → stay in PAIN DISCOVERY
- If mentioned problem + numbers (money/leads): in IMPACT CONFIRMATION → SKIP to SOLUTION PITCH
- If already said money, lost leads, frequency: DON'T ask more discovery → GO STRAIGHT to SOLUTION
- If they accept solution or ask "how": do CTA

GOLDEN RULE:
Each client is different. If they already said everything (business + money lost + frequency), DON'T ASK MORE. SELL.

CORRECT CONVERSATION EXAMPLE:
Client: "Digital academy, we lose 10 leads monthly"
You: "How much money do you lose from those 10 leads?" [ONE impact question]
Client: "About 5000€"
You: "I can implement a 24/7 bot that captures those 10 and recovers the 5k€. Let's schedule a call?" [SOLUTION + CTA]

WRONG EXAMPLE:
Client: "Digital academy, we lose 10 leads monthly, 5000€"
You: "What's the average value per customer?" [BAD - they already said 5000€]
You: "How often does this happen?" [BAD - they already said monthly]"`
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

// Analizar qué se cubrió ya en la conversación
function analyzeConversationCoverage() {
  const conversationText = vanguardChatHistory.map(m => m.content.toLowerCase()).join(' ');

  const coverage = {
    hasBusiness: /negocio|academia|agencia|empresa|startup|ecommerce|tienda|plataforma|app|saas/i.test(conversationText),
    hasMoney: /€|euros?|dinero|\$|dólares?|pesos?|libras?|dinheiro|ganancia|pérdida|pierde|pierden/i.test(conversationText),
    hasFrequency: /mes|monthly|semanal|weekly|diario|daily|mensual|cada|siempre|regularmente|sempre|semana|semaan/i.test(conversationText),
    hasNumbers: /\d+/i.test(conversationText),
  };

  return coverage;
}

// Generar instrucciones basadas en lo que ya se sabe
function generateStageBriefing() {
  const coverage = analyzeConversationCoverage();
  const briefings = {
    es: {
      all: 'RESUME: El cliente ya dijo: negocio, dinero perdido, y frecuencia. NO hagas más preguntas. VENDE DIRECTO la solución de IA/automación.',
      business_money: 'RESUME: El cliente dijo negocio + dinero perdido. Pregunta si ocurre regularmente (1 pregunta). Luego VENDE.',
      business_only: 'RESUME: El cliente dijo negocio. Pregunta por dinero perdido mensualmente (1 pregunta). Luego sigue.',
      money_frequency: 'RESUME: El cliente dijo dinero + frecuencia. Pregunta qué tipo de negocio (1 pregunta). Luego VENDE.',
    },
    pt: {
      all: 'RESUMO: Cliente já disse: negócio, dinheiro perdido, e frequência. NÃO faça mais perguntas. VENDA DIRETO a solução de IA/automação.',
      business_money: 'RESUMO: Cliente disse negócio + dinheiro perdido. Pergunte se acontece regularmente (1 pergunta). Depois VENDA.',
      business_only: 'RESUMO: Cliente disse negócio. Pergunte por dinheiro perdido mensalmente (1 pergunta). Depois siga.',
      money_frequency: 'RESUMO: Cliente disse dinheiro + frequência. Pergunte que tipo de negócio (1 pergunta). Depois VENDA.',
    },
    en: {
      all: 'SUMMARY: Client already said: business, money lost, and frequency. DON\'T ask more questions. SELL DIRECTLY the AI/automation solution.',
      business_money: 'SUMMARY: Client said business + money lost. Ask if it happens regularly (1 question). Then SELL.',
      business_only: 'SUMMARY: Client said business. Ask about monthly money lost (1 question). Then continue.',
      money_frequency: 'SUMMARY: Client said money + frequency. Ask what type of business (1 question). Then SELL.',
    }
  };

  const lang = vanguardCurrentLang;
  const b = briefings[lang] || briefings.en;

  if (coverage.hasBusiness && coverage.hasMoney && coverage.hasFrequency) {
    return b.all;
  } else if (coverage.hasBusiness && coverage.hasMoney) {
    return b.business_money;
  } else if (coverage.hasBusiness && coverage.hasFrequency) {
    return b.money_frequency;
  } else if (coverage.hasBusiness) {
    return b.business_only;
  }

  return '';
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

    // FORCE solution + CTA if client already gave us enough info (deterministic flow)
    const coverage = analyzeConversationCoverage();
    if (coverage.hasBusiness && coverage.hasMoney && coverage.hasNumbers && vanguardChatHistory.length >= 4) {
      document.getElementById(loaderId)?.remove();

      const solutionMessages = {
        es: 'Perfecto. Con IA podemos automatizar la atención de leads 24/7, recuperar el dinero perdido y escalar sin contratar más personal. Vanguard Crux ya implementó esto para academias y agencias en Europa.',
        pt: 'Perfeito. Com IA podemos automatizar o atendimento de leads 24/7, recuperar o dinheiro perdido e escalar sem contratar mais pessoal. Vanguard Crux já implementou isso para academias e agências na Europa.',
        en: 'Perfect. With AI we can automate lead handling 24/7, recover lost money and scale without hiring more staff. Vanguard Crux has already implemented this for academies and agencies in Europe.'
      };

      const solutionMsg = solutionMessages[vanguardCurrentLang] || solutionMessages.es;
      vanguardChatHistory.push({ role: 'assistant', content: solutionMsg });
      addVanguardMessage(solutionMsg, 'bot');

      // Show CTA after a brief pause
      setTimeout(() => addVanguardCTAMessage(), 1200);
      return;
    }

    // Build context message with system prompt, sales stage and language enforcement
    const langName = { es: 'Spanish', pt: 'Portuguese', en: 'English' }[vanguardCurrentLang];
    const langExample = {
      es: 'Example reply: "¡Claro! ¿En qué puedo ayudarte hoy?"',
      pt: 'Example reply: "Claro! Em que posso ajudar você hoje?"',
      en: 'Example reply: "Sure! How can I help you today?"'
    }[vanguardCurrentLang];

    const stageBriefing = generateStageBriefing();

    const contextMsg = `CRITICAL LANGUAGE RULE: You MUST respond ONLY in ${langName}. Do NOT use any other language. ${langExample}

${vanguardPrompts.system[vanguardCurrentLang]}

[Conversation stage: ${vanguardSalesStage}]
${stageBriefing ? `[${stageBriefing}]` : ''}

CONVERSATION HISTORY (for reference):
${vanguardChatHistory.slice(-6).map(m => `${m.role === 'user' ? 'CLIENT' : 'YOU'}: ${m.content}`).join('\n')}

User says: ${msg}

Your response in ${langName}:`;

    // Use GPT-4o-mini for better instruction following (Grok was repeating questions)
    const response = await puter.ai.chat(contextMsg, {
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 300
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
