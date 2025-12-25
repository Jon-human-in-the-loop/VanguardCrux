/* =========================================================
   BASIC / FALLBACK ANIMATIONS
   ========================================================= */

function initAnimations() {
    if (typeof gsap !== 'undefined') {
        console.log('Premium GSAP animations loaded');
        return;
    }

    const elements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity .8s ease, transform .8s ease';
        observer.observe(el);
    });
}

/* =========================================================
   PROJECT SWIPER (SIMPLE, STABLE)
   ========================================================= */

function initProjectSwiper() {
    const swiper = document.querySelector('.project-swiper');
    if (!swiper) return;

    const wrapper = swiper.querySelector('.swiper-wrapper');
    const slides = wrapper.querySelectorAll('.swiper-slide');
    const pagination = swiper.querySelector('.swiper-pagination');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'swiper-button-prev';
    prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'swiper-button-next';
    nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    nextBtn.setAttribute('aria-label', 'Next slide');
    
    swiper.appendChild(prevBtn);
    swiper.appendChild(nextBtn);

    // Create bullets
    slides.forEach((_, i) => {
        const bullet = document.createElement('span');
        bullet.className = 'swiper-pagination-bullet';
        if (i === 0) bullet.classList.add('swiper-pagination-bullet-active');
        bullet.addEventListener('click', () => goToSlide(i));
        pagination.appendChild(bullet);
    });

    function updatePagination() {
        pagination.querySelectorAll('.swiper-pagination-bullet').forEach((b, i) => {
            b.classList.toggle('swiper-pagination-bullet-active', i === currentSlide);
        });
    }

    function updateButtons() {
        const isAtStart = currentSlide === 0;
        const isAtEnd = currentSlide === totalSlides - 1;
        
        // Update previous button
        prevBtn.disabled = isAtStart;
        prevBtn.style.opacity = isAtStart ? '0.5' : '1';
        prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
        prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        // Update next button
        nextBtn.disabled = isAtEnd;
        nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }

    function goToSlide(index) {
        currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updatePagination();
        updateButtons();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // Add click handlers
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
    });

    // Initialize button states
    updateButtons();

    // Auto-slide SOLO mobile, UNA SOLA VEZ
    if (window.innerWidth < 768) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);
    }
}

/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuContent = document.getElementById('menu-content');
const menuLinks = document.querySelectorAll('.menu-link');

function toggleMenu() {
    const isOpen = !menuOverlay.classList.contains('hidden');

    if (isOpen) {
        // Close menu
        menuBtn.classList.remove('active');
        menuOverlay.classList.add('hidden');
        menuOverlay.classList.add('opacity-0');
        menuContent.classList.add('translate-x-full');
        document.body.style.overflow = '';
    } else {
        // Open menu
        menuBtn.classList.add('active');
        menuOverlay.classList.remove('hidden');
        menuOverlay.classList.remove('opacity-0');
        menuContent.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    }
}

if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on overlay (outside menu content)
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            toggleMenu();
        }
    });
    
    // Close menu when clicking menu links
    menuLinks.forEach(l => l.addEventListener('click', toggleMenu));
}

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
    en: {
        // Navigation
        navSolutions: "Services",
        navPhilosophy: "Our Approach",
        navTeam: "The Team",
        navCaseStudies: "Projects",
        navContact: "Contact",
        navAbout: "About Us",

        // Meta
        metaTitle: "Vanguard Crux | AI & Automation Marketing Agency in Porto",
        metaDescription: "Vanguard Crux is a digital growth agency in Porto, Portugal, specializing in AI marketing, business process automation, and performance strategies to scale your revenue.",
        metaKeywords: "digital agency porto, ai marketing, business automation, performance marketing, growth agency portugal, marketing automation, digital strategy, seo agency",

        // Hero Section
        heroTitle: 'The <span class="text-accent" data-pulse="true">Global Agency</span> that Turns <span class="text-accent" data-pulse="true">Data</span> into Growth.',
        heroSlogan: "Unlock Your Unfair Advantage.",
        heroTagline: "AI Architecture. Creative Minds Solving the Impossible.",
        heroSubtitle: "We are Vanguard Crux, a global performance marketing agency. We implement AI and automation strategies to give your business a real competitive edge in Portugal and beyond.",
        heroCTA: "Claim My Free Audit",

        // Philosophy Section
        philosophyTag: "Our Growth Approach",
        philosophyTitle: "We don't just sell services. We build growth partnerships.",
        philosophyDesc: "Our success is measured by your increased revenue. We focus on implementing performance marketing and automation that delivers a clear ROI, ensuring our collaboration is a profitable long-term investment.",

        // Solutions Section
        solutionsTitle: "Digital Growth Services",
        sol1Title: "Performance Marketing & SEO",
        sol1Desc: "We attract and convert high-value customers with data-driven SEO and paid media campaigns on Meta & Google, focused on maximizing your ROI.",
        sol2Title: "AI & Business Automation",
        sol2Desc: "We optimize your operations with custom AI assistants and process automation (Make/N8N) to increase efficiency and reduce costs.",
        sol3Title: "Branding & Content Strategy",
        sol3Desc: "We build memorable brands that connect with their audience. Includes visual identity design and high-performance content marketing strategies.",

        // Case Studies Section
        caseStudiesTitle: "Proven Results, Not Promises.",
        case1Title: "Kultur Atelier, Hamburg",
        case1Desc: "Developed a cohesive graphic identity to boost the visibility of their cultural events, increasing community engagement through strategic branding.",
        case2Title: "Tasca do Infante, Porto",
        case2Desc: "A local performance marketing strategy that increased online bookings by 40% in 3 months through targeted social media ads.",
        case3Title: "Smart Mobility Solutions, Dubai",
        case3Desc: "Implemented AI-powered chatbot and automation workflows that reduced customer support costs by 60% while improving response times by 85%.",
        case4Title: "Vinos de Bodega, Mendoza",
        case4Desc: "Complete digital transformation with e-commerce platform and content strategy that generated a 250% increase in online sales within 6 months.",
        case5Title: "TechStart Hub, Lisbon",
        case5Desc: "Implemented comprehensive SEO and content marketing strategy that drove 300% organic traffic growth and established thought leadership in the Portuguese tech ecosystem.",

        // About Section
        aboutTitle: "We think outside the box. We act inside your goals.",
        aboutSubtitle: "Our story is one without borders. Born from the collaboration of digital experts across Argentina, from Paraná to Mendoza, our journey has taken us to develop projects in Hamburg and Dubai, and has led us to establish our European hub in Porto.",
        aboutPillar1Title: "Global Perspective, Local Execution",
        aboutPillar1Desc: "Our team across continents allows us to apply the best global strategies with a deep understanding of the local market.",
        aboutPillar2Title: "AI at the Core",
        aboutPillar2Desc: "We use AI and automation not as an add-on, but as the central engine to optimize every marketing process and decision.",

        // Team Section
        teamTitle: "Meet the Vanguard Crux Team",
        teamSubtitle: "Experience our team in 360° - Interactive Innovation",
        jonName: "Jon Flores",
        jonRole: "AI Strategist",
        jonLocation: "Porto, Portugal",
        jonSkill1: "AI Strategy",
        jonSkill2: "Automation",
        jonSkill3: "Data Analytics",
        joseName: "José Aluz",
        joseRole: "Content Strategist",
        joseLocation: "Mendoza, Argentina",
        joseSkill1: "Content Strategy",
        joseSkill2: "Brand Narrative",
        joseSkill3: "Creative Direction",

        // Contact Section
        contactTitle: "Ready to scale your business?",
        contactSubtitle: 'Get a <strong class="text-accent">FREE AI-powered analysis</strong> of your business. Just share your website and email - we\'ll identify your top 3 growth opportunities and send a personalized report in 48 hours.',
        contactEmailPlaceholder: "Your Business Email",
        contactUrlPlaceholder: "Your Website URL",
        contactButton: "Get My Free Business Analysis",

        // Footer
        footerCompany: "Company",
        footerSolutions: "Solutions",
        footerLegal: "Legal",
        footerContact: "Get in Touch",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms & Conditions",
        footerCookies: "Cookies Policy"
    },
    es: {
        // Navigation
        navSolutions: "Servicios",
        navPhilosophy: "Nuestro Enfoque",
        navTeam: "El Equipo",
        navCaseStudies: "Proyectos",
        navContact: "Contacto",
        navAbout: "Nosotros",

        // Meta
        metaTitle: "Vanguard Crux | Agencia de Marketing con IA y Automatización en Oporto",
        metaDescription: "Vanguard Crux es una agencia de crecimiento digital en Oporto, Portugal, especializada en marketing con IA, automatización de procesos empresariales y estrategias de rendimiento para escalar tus ingresos.",
        metaKeywords: "agencia digital oporto, marketing con ia, automatización empresarial, marketing de rendimiento, agencia de crecimiento portugal, automatización de marketing, estrategia digital, agencia seo",

        // Hero Section
        heroTitle: 'La <span class="text-accent" data-pulse="true">Agencia Global</span> que Convierte <span class="text-accent" data-pulse="true">Datos</span> en Crecimiento.',
        heroSlogan: "Desbloquea Tu Ventaja Competitiva.",
        heroTagline: "Arquitectura de IA. Mentes Creativas Resolviendo lo Imposible.",
        heroSubtitle: "Somos Vanguard Crux, una agencia global de marketing de rendimiento. Implementamos estrategias de IA y automatización para darle a tu negocio una ventaja competitiva real en Portugal y más allá.",
        heroCTA: "Reclama Mi Auditoría Gratuita",

        // Philosophy Section
        philosophyTag: "Nuestro Enfoque de Crecimiento",
        philosophyTitle: "No solo vendemos servicios. Construimos asociaciones de crecimiento.",
        philosophyDesc: "Nuestro éxito se mide por el aumento de tus ingresos. Nos enfocamos en implementar marketing de rendimiento y automatización que genere un ROI claro, asegurando que nuestra colaboración sea una inversión rentable a largo plazo.",

        // Solutions Section
        solutionsTitle: "Servicios de Crecimiento Digital",
        sol1Title: "Marketing de Rendimiento y SEO",
        sol1Desc: "Atraemos y convertimos clientes de alto valor con SEO basado en datos y campañas de medios pagos en Meta y Google, enfocados en maximizar tu ROI.",
        sol2Title: "IA y Automatización Empresarial",
        sol2Desc: "Optimizamos tus operaciones con asistentes de IA personalizados y automatización de procesos (Make/N8N) para aumentar la eficiencia y reducir costos.",
        sol3Title: "Branding y Estrategia de Contenido",
        sol3Desc: "Construimos marcas memorables que conectan con su audiencia. Incluye diseño de identidad visual y estrategias de marketing de contenido de alto rendimiento.",

        // Case Studies Section
        caseStudiesTitle: "Resultados Comprobados, No Promesas.",
        case1Title: "Kultur Atelier, Hamburgo",
        case1Desc: "Desarrollamos una identidad gráfica cohesiva para aumentar la visibilidad de sus eventos culturales, incrementando el compromiso de la comunidad a través del branding estratégico.",
        case2Title: "Tasca do Infante, Oporto",
        case2Desc: "Una estrategia local de marketing de rendimiento que aumentó las reservas en línea en un 40% en 3 meses a través de anuncios dirigidos en redes sociales.",
        case3Title: "Smart Mobility Solutions, Dubái",
        case3Desc: "Implementamos chatbot impulsado por IA y flujos de automatización que redujeron los costos de soporte al cliente en un 60% mientras mejoraban los tiempos de respuesta en un 85%.",
        case4Title: "Vinos de Bodega, Mendoza",
        case4Desc: "Transformación digital completa con plataforma de e-commerce y estrategia de contenido que generó un aumento del 250% en ventas online en 6 meses.",
        case5Title: "TechStart Hub, Lisboa",
        case5Desc: "Implementamos una estrategia integral de SEO y marketing de contenidos que impulsó un crecimiento del 300% en tráfico orgánico y estableció liderazgo de pensamiento en el ecosistema tecnológico portugués.",

        // About Section
        aboutTitle: "Pensamos fuera de la caja. Actuamos dentro de tus objetivos.",
        aboutSubtitle: "Nuestra historia es una sin fronteras. Nacidos de la colaboración de expertos digitales en Argentina, desde Paraná hasta Mendoza, nuestro viaje nos ha llevado a desarrollar proyectos en Hamburgo y Dubái, y nos ha conducido a establecer nuestro centro europeo en Oporto.",
        aboutPillar1Title: "Perspectiva Global, Ejecución Local",
        aboutPillar1Desc: "Nuestro equipo a través de continentes nos permite aplicar las mejores estrategias globales con un profundo conocimiento del mercado local.",
        aboutPillar2Title: "IA en el Núcleo",
        aboutPillar2Desc: "Usamos IA y automatización no como un complemento, sino como el motor central para optimizar cada proceso y decisión de marketing.",

        // Team Section
        teamTitle: "Conoce al Equipo de Vanguard Crux",
        teamSubtitle: "Experimenta nuestro equipo en 360° - Innovación Interactiva",
        jonName: "Jon Flores",
        jonRole: "Estratega de IA",
        jonLocation: "Oporto, Portugal",
        jonSkill1: "Estrategia de IA",
        jonSkill2: "Automatización",
        jonSkill3: "Analítica de Datos",
        joseName: "José Aluz",
        joseRole: "Estratega de Contenido",
        joseLocation: "Mendoza, Argentina",
        joseSkill1: "Estrategia de Contenido",
        joseSkill2: "Narrativa de Marca",
        joseSkill3: "Dirección Creativa",

        // Contact Section
        contactTitle: "¿Listo para escalar tu negocio?",
        contactSubtitle: 'Obtén un <strong class="text-accent">análisis GRATUITO impulsado por IA</strong> de tu negocio. Solo comparte tu sitio web y correo electrónico - identificaremos tus 3 principales oportunidades de crecimiento y enviaremos un informe personalizado en 48 horas.',
        contactEmailPlaceholder: "Tu Email Empresarial",
        contactUrlPlaceholder: "URL de Tu Sitio Web",
        contactButton: "Obtener Mi Análisis Empresarial Gratuito",

        // Footer
        footerCompany: "Empresa",
        footerSolutions: "Soluciones",
        footerLegal: "Legal",
        footerContact: "Ponte en Contacto",
        footerPrivacy: "Política de Privacidad",
        footerTerms: "Términos y Condiciones",
        footerCookies: "Política de Cookies"
    },
    pt: {
        // Navigation
        navSolutions: "Serviços",
        navPhilosophy: "A Nossa Abordagem",
        navTeam: "A Equipa",
        navCaseStudies: "Projetos",
        navContact: "Contacto",
        navAbout: "Sobre Nós",

        // Meta
        metaTitle: "Vanguard Crux | Agência de Marketing com IA e Automatização no Porto",
        metaDescription: "A Vanguard Crux é uma agência de crescimento digital no Porto, Portugal, especializada em marketing com IA, automatização de processos empresariais e estratégias de desempenho para escalar a sua receita.",
        metaKeywords: "agência digital porto, marketing com ia, automatização empresarial, marketing de desempenho, agência de crescimento portugal, automatização de marketing, estratégia digital, agência seo",

        // Hero Section
        heroTitle: 'A <span class="text-accent" data-pulse="true">Agência Global</span> que Transforma <span class="text-accent" data-pulse="true">Dados</span> em Crescimento.',
        heroSlogan: "Desbloqueie a Sua Vantagem Injusta.",
        heroTagline: "Arquitetura de IA. Mentes Criativas a Resolver o Impossível.",
        heroSubtitle: "Somos a Vanguard Crux, uma agência global de marketing de desempenho. Implementamos estratégias de IA e automatização para dar ao seu negócio uma vantagem competitiva real em Portugal e além.",
        heroCTA: "Reclame a Minha Auditoria Gratuita",

        // Philosophy Section
        philosophyTag: "A Nossa Abordagem de Crescimento",
        philosophyTitle: "Não vendemos apenas serviços. Construímos parcerias de crescimento.",
        philosophyDesc: "O nosso sucesso é medido pelo aumento da sua receita. Focamo-nos na implementação de marketing de desempenho e automatização que entrega um ROI claro, garantindo que a nossa colaboração seja um investimento rentável a longo prazo.",

        // Solutions Section
        solutionsTitle: "Serviços de Crescimento Digital",
        sol1Title: "Marketing de Desempenho e SEO",
        sol1Desc: "Atraímos e convertemos clientes de alto valor com SEO baseado em dados e campanhas de mídia paga no Meta e Google, focados em maximizar o seu ROI.",
        sol2Title: "IA e Automatização Empresarial",
        sol2Desc: "Otimizamos as suas operações com assistentes de IA personalizados e automatização de processos (Make/N8N) para aumentar a eficiência e reduzir custos.",
        sol3Title: "Branding e Estratégia de Conteúdo",
        sol3Desc: "Construímos marcas memoráveis que se conectam com o seu público. Inclui design de identidade visual e estratégias de marketing de conteúdo de alto desempenho.",

        // Case Studies Section
        caseStudiesTitle: "Resultados Comprovados, Não Promessas.",
        case1Title: "Kultur Atelier, Hamburgo",
        case1Desc: "Desenvolvemos uma identidade gráfica coesa para aumentar a visibilidade dos seus eventos culturais, aumentando o envolvimento da comunidade através do branding estratégico.",
        case2Title: "Tasca do Infante, Porto",
        case2Desc: "Uma estratégia local de marketing de desempenho que aumentou as reservas online em 40% em 3 meses através de anúncios direcionados nas redes sociais.",
        case3Title: "Smart Mobility Solutions, Dubai",
        case3Desc: "Implementámos chatbot impulsionado por IA e fluxos de automatização que reduziram os custos de suporte ao cliente em 60% enquanto melhoravam os tempos de resposta em 85%.",
        case4Title: "Vinos de Bodega, Mendoza",
        case4Desc: "Transformação digital completa com plataforma de e-commerce e estratégia de conteúdo que gerou um aumento de 250% nas vendas online em 6 meses.",
        case5Title: "TechStart Hub, Lisboa",
        case5Desc: "Implementámos uma estratégia abrangente de SEO e marketing de conteúdo que impulsionou um crescimento de 300% no tráfego orgânico e estabeleceu liderança de pensamento no ecossistema tecnológico português.",

        // About Section
        aboutTitle: "Pensamos fora da caixa. Agimos dentro dos seus objetivos.",
        aboutSubtitle: "A nossa história é sem fronteiras. Nascidos da colaboração de especialistas digitais em toda a Argentina, de Paraná a Mendoza, a nossa jornada levou-nos a desenvolver projetos em Hamburgo e Dubai, e conduziu-nos a estabelecer o nosso centro europeu no Porto.",
        aboutPillar1Title: "Perspetiva Global, Execução Local",
        aboutPillar1Desc: "A nossa equipa em continentes permite-nos aplicar as melhores estratégias globais com um profundo conhecimento do mercado local.",
        aboutPillar2Title: "IA no Núcleo",
        aboutPillar2Desc: "Usamos IA e automatização não como um complemento, mas como o motor central para otimizar cada processo e decisão de marketing.",

        // Team Section
        teamTitle: "Conheça a Equipa da Vanguard Crux",
        teamSubtitle: "Experiencie a nossa equipa em 360° - Inovação Interativa",
        jonName: "Jon Flores",
        jonRole: "Estratega de IA",
        jonLocation: "Porto, Portugal",
        jonSkill1: "Estratégia de IA",
        jonSkill2: "Automatização",
        jonSkill3: "Análise de Dados",
        joseName: "José Aluz",
        joseRole: "Estratega de Conteúdo",
        joseLocation: "Mendoza, Argentina",
        joseSkill1: "Estratégia de Conteúdo",
        joseSkill2: "Narrativa de Marca",
        joseSkill3: "Direção Criativa",

        // Contact Section
        contactTitle: "Pronto para escalar o seu negócio?",
        contactSubtitle: 'Obtenha uma <strong class="text-accent">análise GRATUITA impulsionada por IA</strong> do seu negócio. Partilhe apenas o seu website e email - identificaremos as suas 3 principais oportunidades de crescimento e enviaremos um relatório personalizado em 48 horas.',
        contactEmailPlaceholder: "O Seu Email Empresarial",
        contactUrlPlaceholder: "URL do Seu Website",
        contactButton: "Obter a Minha Análise Empresarial Gratuita",

        // Footer
        footerCompany: "Empresa",
        footerSolutions: "Soluções",
        footerLegal: "Legal",
        footerContact: "Entre em Contacto",
        footerPrivacy: "Política de Privacidade",
        footerTerms: "Termos e Condições",
        footerCookies: "Política de Cookies"
    }
}

/* =========================================================
   LANGUAGE SWITCHER
   ========================================================= */

function detectBrowserLanguage() {
    // Get saved language from localStorage
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && (savedLang === 'en' || savedLang === 'pt' || savedLang === 'es')) {
        return savedLang;
    }
    
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Map browser language codes to supported languages
    if (browserLang.startsWith('pt')) {
        return 'pt';
    } else if (browserLang.startsWith('es')) {
        return 'es';
    } else {
        return 'en'; // Default to English
    }
}

function setLanguage(lang) {
    // Validate language
    if (!['en', 'pt', 'es'].includes(lang)) {
        lang = 'en';
    }
    
    // Save to localStorage
    localStorage.setItem('userLanguage', lang);
    
    // Update active button state in all language switchers
    document.querySelectorAll('.language-switcher').forEach(switcher => {
        switcher.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    });
    
    // Add active class to selected language buttons
    document.querySelectorAll(`.language-btn[onclick*="'${lang}'"]`).forEach(btn => {
        btn.classList.add('active');
    });
    
    // Apply translations to all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        const translation = translations[lang] && translations[lang][key];
        
        if (translation) {
            // Handle different element types
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.hasAttribute('data-lang-placeholder')) {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    // Update meta tags
    const metaTitle = translations[lang]?.metaTitle;
    const metaDescription = translations[lang]?.metaDescription;
    const metaKeywords = translations[lang]?.metaKeywords;
    
    if (metaTitle) {
        document.title = metaTitle;
        const titleMeta = document.querySelector('title[data-lang="metaTitle"]');
        if (titleMeta) titleMeta.textContent = metaTitle;
    }
    
    if (metaDescription) {
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute('content', metaDescription);
    }
    
    if (metaKeywords) {
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta) keywordsMeta.setAttribute('content', metaKeywords);
    }
    
    console.log('Language set to:', lang);
}

/* =========================================================
   LEGAL LINKS
   ========================================================= */

function initLegalLinks() {
    document.querySelectorAll('.legal-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            const lang = localStorage.getItem('userLanguage') || 'en';
            const suffix = lang === 'en' ? '' : `-${lang}`;
            window.location.href = `${page}${suffix}.html`;
        });
    });
}

/* =========================================================
   INIT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initProjectSwiper();
    initLegalLinks();

    const detectedLang = detectBrowserLanguage();

    // Espera a que TODO el DOM esté realmente pintado
    requestAnimationFrame(() => {
        setLanguage(detectedLang);
        console.log('Language applied to full DOM:', detectedLang);
    });
});

