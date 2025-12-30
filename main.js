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

    // Crear botones de navegación
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

    // Ajustar visibilidad de los slides por tamaño de pantalla
    function updateSlidesPerView() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth < 640) {
            return 1; // 1 slide por pantalla en móviles
        } else if (viewportWidth < 1024) {
            return 2; // 2 slides por pantalla en tablets/medianos
        } else {
            return 3; // 3 slides por pantalla en pantallas grandes
        }
    }

    let slidesPerView = updateSlidesPerView();

    // Create pagination bullets
    pagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const bullet = document.createElement('div');
        bullet.className = 'swiper-pagination-bullet';
        bullet.addEventListener('click', () => goToSlide(i));
        pagination.appendChild(bullet);
    }

    // Inicializar estado de botones y paginación
    function updatePagination() {
        pagination.querySelectorAll('.swiper-pagination-bullet').forEach((b, i) => {
            b.classList.toggle('swiper-pagination-bullet-active', i === currentSlide);
        });
    }

    function updateButtons() {
        const isAtStart = currentSlide === 0;
        const isAtEnd = currentSlide >= totalSlides - slidesPerView;

        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
    }

    function goToSlide(index) {
        currentSlide = Math.max(0, Math.min(index, totalSlides - slidesPerView));
        wrapper.style.transform = `translateX(-${currentSlide * (100 / slidesPerView)}%)`;
        updatePagination();
        updateButtons();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
    });

    // Configuración inicial
    goToSlide(0);

    // Removed auto-slide on mobile to allow users to read content
    // Users can navigate using swipe or navigation buttons

    // Recalcular vistas por pantalla al redimensionar
    window.addEventListener('resize', () => {
        slidesPerView = updateSlidesPerView();
        goToSlide(0);
    });
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

// Pages with separate language-specific HTML files
const PAGES_WITH_LANGUAGE_VERSIONS = ['kultur-atelier', 'fintech-case', 'privacy-policy', 'terms', 'cookies'];

const translations = {
    en: {
        // Navigation
        navSolutions: "Services",
        navPhilosophy: "Our approach",
        navTeam: "The team",
        navCaseStudies: "Projects",
        navContact: "Contact",
        navAbout: "About Us",

        // Meta
        metaTitle: "Vanguard Crux | AI & Automation marketing agency in Porto",
        metaDescription: "Vanguard Crux is a digital growth agency in Porto, Portugal, specializing in AI marketing, business process automation, and performance strategies to scale your revenue.",
        metaKeywords: "digital agency porto, ai marketing, business automation, performance marketing, growth agency portugal, marketing automation, digital strategy, seo agency",

        // Hero Section
        heroTitle: 'The <span class="text-accent" data-pulse="true">global agency</span> that turns <span class="text-accent" data-pulse="true">data</span> into growth',
        heroSlogan: "Unlock your unfair advantage",
        heroTagline: "AI architecture. Creative minds solving the impossible.",
        heroSubtitle: "We are Vanguard Crux, a global performance marketing agency. We implement AI and automation strategies to give your business a real competitive edge in Portugal and beyond.",
        heroCTA: "Claim your free audit",

        // Philosophy Section
        philosophyTag: "Our Growth Approach",
        philosophyTitle: "We don't just sell services. We build growth partnerships",
        philosophyDesc: "Our success is measured by your increased revenue. We focus on implementing performance marketing and automation that delivers a clear ROI, ensuring our collaboration is a profitable long-term investment.",

        // Solutions Section
        solutionsTitle: "Digital growth services",
        sol1Title: "Performance marketing & SEO",
        sol1Desc: "We attract and convert high-value customers with data-driven SEO and paid media campaigns on Meta & Google, focused on maximizing your ROI.",
        sol2Title: "AI & Business automation",
        sol2Desc: "We optimize your operations with custom AI assistants and process automation (Make/N8N) to increase efficiency and reduce costs.",
        sol3Title: "Branding & Content strategy",
        sol3Desc: "We build memorable brands that connect with their audience. Includes visual identity design and high-performance content marketing strategies.",

        // Case Studies Section
        caseStudiesTitle: "Proven results, not promises",
        kulturSubtitle: "Scalable Branding | Cross-City Identity",
        kulturLocationLabel: "Location:",
        kulturLocation: "Halle & Hamburg, Germany",
        kulturDesc: "Unifying the visual identity for a cultural organization with a presence in Halle and Hamburg. A scalable design system connecting communities.",
        case1Title: "Kultur Atelier, Halle & Hamburg - Germany",
        case1Desc: "Unifying the visual identity for a cultural organization with a presence in Halle and Hamburg. A scalable design system connecting communities.",
        case2Title: "Business Case Analyzer Pro",
        case2Subtitle: "Fintech SaaS | AI-Ready Architecture",
        case2TechLabel: "Tech:",
        case2Tech: "Vanilla JS, Chart.js, jsPDF",
        case2Desc: "Financial modeling architecture with simulated AI forecasting. Zero-latency engine for instant ROI, NPV, and IRR calculations with PDF export.",
        case3Title: "Smart Mobility Solutions, Dubai",
        case3Desc: "Implemented AI-powered chatbot and automation workflows that reduced customer support costs by 60% while improving response times by 85%.",
        case4Title: "Vinos de Bodega, Mendoza",
        case4Desc: "Complete digital transformation with e-commerce platform and content strategy that generated a 250% increase in online sales within 6 months.",
        case5Title: "TechStart Hub, Lisbon",
        case5Desc: "Implemented comprehensive SEO and content marketing strategy that drove 300% organic traffic growth and established thought leadership in the Portuguese tech ecosystem.",

        // About Section
        aboutTitle: "We think outside the box. We act inside your goals",
        aboutSubtitle: "Our story is one without borders. Born from the collaboration of digital experts across Argentina, from Paraná to Mendoza, our journey has taken us to develop projects in Hamburg and Dubai, and has led us to establish our European hub in Porto.",
        aboutPillar1Title: "Global perspective, local execution",
        aboutPillar1Desc: "Our team across continents allows us to apply the best global strategies with a deep understanding of the local market.",
        aboutPillar2Title: "AI at the core",
        aboutPillar2Desc: "We use AI and automation not as an add-on, but as the central engine to optimize every marketing process and decision.",

        // Team Section
        teamTitle: "Meet the Vanguard Crux team",
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
        contactSubtitle: 'Get a <strong class="text-accent">FREE AI-powered analysis</strong> of your business. Just share your website and email, we\'ll identify your top 3 growth opportunities and send a personalized report in 48 hours.',
        contactEmailPlaceholder: "Your business email",
        contactUrlPlaceholder: "Your website URL",
        contactButton: "Get your free business analysis",

        // Footer
        footerCompany: "Company",
        footerSolutions: "Solutions",
        footerLegal: "Legal",
        footerContact: "Get in Touch",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms & Conditions",
        footerCookies: "Cookies Policy",

        // Kultur Atelier Detail Page
        kulturMetaTitle: "Kultur Atelier Case Study | Vanguard Crux",
    kulturMetaDesc: "Unified visual identity and branding strategy for Kultur Atelier locations in Halle and Hamburg, Germany.",
    backToHome: "← Back to Home",
    backToProjects: "← Back to Projects",

    kulturHeroTitle: "Kultur Atelier: Identity Without Borders",
    kulturHeroSubtitle: "Visual standardization and brand strategy for locations in Halle and Hamburg.",
    kulturHeroDesc: "A cohesive visual system for a multi-location cultural organization.",
    kulturHeroClient: "Client: Kultur Atelier e.V.",
    kulturHeroLocation: "Location: Halle & Hamburg",
    kulturHeroServices: "Branding System",

    kulturChallengeTitle: "The Challenge",
    kulturChallengeDesc: "As activities expanded between Halle and Hamburg, Kultur Atelier suffered from critical fragmentation. Each location communicated differently, weakening the parent brand.",
    kulturChallengeStat1Title: "2",
    kulturChallengeStat1Label: "Locations in Germany",
    kulturChallengeStat2Title: "100%",
    kulturChallengeStat2Label: "Digital Identity",

    kulturSolutionTitle: "The Solution",
    kulturSolution1Title: "Liquid and Adaptive Identity",
    kulturSolution1Desc: "We developed a flexible Brand Book. Watercolor textures unify the aesthetic while allowing local adaptations.",
    kulturSolution2Title: "Tactical Deployment",
    kulturSolution2Desc: "Graphic assets preserve hierarchy whether in Halle or Hamburg.",
    kulturSolution3Title: "Extended Community",
    kulturSolution3Desc: "Merchandising became the physical bridge between both communities.",

    kulturCommunityTitle: "Extended Community",
    kulturCommunityDesc: "Merchandising created a shared sense of belonging across cities.",
    kulturMerchToteTitle: "Tote Bags",
    kulturMerchToteDesc: "Portable identity design",
    kulturMerchNotebookTitle: "Notebooks",
    kulturMerchNotebookDesc: "Creativity with identity",
    kulturMerchMugTitle: "Mugs",
    kulturMerchMugDesc: "Moments of inspiration",

    exploreMoreTitle: "Explore More Projects",
    exploreMoreDesc: "Discover how we transform brands into memorable experiences",
    viewAllCases: "View All Case Studies",

    // Fintech Case Study Detail Page
    fintechMetaTitle: "Business Case Analyzer Pro Case Study | Vanguard Crux",
    fintechMetaDesc: "Algorithmic financial modeling architecture with zero-latency NPV, ROI, and IRR calculations. AI-ready fintech SaaS built with Vanilla JS.",

    footerRights: "© 2024 Vanguard Crux. All rights reserved."
  },
    es: {
        // Navigation
        navSolutions: "Servicios",
        navPhilosophy: "Nuestro enfoque",
        navTeam: "El equipo",
        navCaseStudies: "Proyectos",
        navContact: "Contacto",
        navAbout: "Nosotros",

        // Meta
        metaTitle: "Vanguard Crux | Agencia de marketing con IA y automatización en Oporto",
        metaDescription: "Vanguard Crux es una agencia de crecimiento digital en Oporto, Portugal, especializada en marketing con IA, automatización de procesos empresariales y estrategias de rendimiento para escalar tus ingresos.",
        metaKeywords: "agencia digital oporto, marketing con ia, automatización empresarial, marketing de rendimiento, agencia de crecimiento portugal, automatización de marketing, estrategia digital, agencia seo",

        // Hero Section
        heroTitle: 'La <span class="text-accent" data-pulse="true">agencia global</span> que convierte <span class="text-accent" data-pulse="true">datos</span> en crecimiento',
        heroSlogan: "Desbloquea tu ventaja competitiva",
        heroTagline: "Arquitectura de IA. Mentes creativas resolviendo lo imposible.",
        heroSubtitle: "Somos Vanguard Crux, una agencia global de marketing de rendimiento. Implementamos estrategias de IA y automatización para darle a tu negocio una ventaja competitiva real en Portugal y más allá.",
        heroCTA: "Reclama tu auditoría gratuita",

        // Philosophy Section
        philosophyTag: "Nuestro enfoque de crecimiento",
        philosophyTitle: "No solo vendemos servicios. Construimos asociaciones de crecimiento",
        philosophyDesc: "Nuestro éxito se mide por el aumento de tus ingresos. Nos enfocamos en implementar marketing de rendimiento y automatización que genere un ROI claro, asegurando que nuestra colaboración sea una inversión rentable a largo plazo.",

        // Solutions Section
        solutionsTitle: "Servicios de crecimiento digital",
        sol1Title: "Marketing de rendimiento y SEO",
        sol1Desc: "Atraemos y convertimos clientes de alto valor con SEO basado en datos y campañas de medios pagos en Meta y Google, enfocados en maximizar tu ROI.",
        sol2Title: "IA y Automatización empresarial",
        sol2Desc: "Optimizamos tus operaciones con asistentes de IA personalizados y automatización de procesos (Make/N8N) para aumentar la eficiencia y reducir costos.",
        sol3Title: "Branding y Estrategia de contenido",
        sol3Desc: "Construimos marcas memorables que conectan con su audiencia. Incluye diseño de identidad visual y estrategias de marketing de contenido de alto rendimiento.",

        // Case Studies Section
        caseStudiesTitle: "Resultados comprobados, no promesas",
        kulturSubtitle: "Branding Escalable | Identidad Multi-ciudad",
        kulturLocationLabel: "Ubicación:",
        kulturLocation: "Halle y Hamburgo, Alemania",
        kulturDesc: "Unificación de la identidad visual para una organización cultural con presencia en Halle y Hamburgo. Un sistema de diseño escalable que conecta comunidades.",
        case1Title: "Kultur Atelier, Halle y Hamburgo - Alemania",
        case1Desc: "Unificación de la identidad visual para una organización cultural con presencia en Halle y Hamburgo. Un sistema de diseño escalable que conecta comunidades.",
        case2Title: "Business Case Analyzer Pro",
        case2Subtitle: "Fintech SaaS | Arquitectura AI-Ready",
        case2TechLabel: "Tech:",
        case2Tech: "Vanilla JS, Chart.js, jsPDF",
        case2Desc: "Arquitectura de modelado financiero con previsión IA simulada. Motor de latencia cero para cálculos instantáneos de ROI, VPN y TIR con exportación PDF.",
        case3Title: "Smart Mobility Solutions, Dubái",
        case3Desc: "Implementamos chatbot impulsado por IA y flujos de automatización que redujeron los costos de soporte al cliente en un 60% mientras mejoraban los tiempos de respuesta en un 85%.",
        case4Title: "Vinos de Bodega, Mendoza",
        case4Desc: "Transformación digital completa con plataforma de e-commerce y estrategia de contenido que generó un aumento del 250% en ventas online en 6 meses.",
        case5Title: "TechStart Hub, Lisboa",
        case5Desc: "Implementamos una estrategia integral de SEO y marketing de contenidos que impulsó un crecimiento del 300% en tráfico orgánico y estableció liderazgo de pensamiento en el ecosistema tecnológico portugués.",

        // About Section
        aboutTitle: "Pensamos fuera de la caja. Actuamos dentro de tus objetivos",
        aboutSubtitle: "Nuestra historia es una sin fronteras. Nacidos de la colaboración de expertos digitales en Argentina, desde Paraná hasta Mendoza, nuestro viaje nos ha llevado a desarrollar proyectos en Hamburgo y Dubái, y nos ha conducido a establecer nuestro centro europeo en Oporto.",
        aboutPillar1Title: "Perspectiva global, ejecución local",
        aboutPillar1Desc: "Nuestro equipo a través de continentes nos permite aplicar las mejores estrategias globales con un profundo conocimiento del mercado local.",
        aboutPillar2Title: "IA en el núcleo",
        aboutPillar2Desc: "Usamos IA y automatización no como un complemento, sino como el motor central para optimizar cada proceso y decisión de marketing.",

        // Team Section
        teamTitle: "Conoce al equipo de Vanguard Crux",
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
        contactSubtitle: 'Obtén un <strong class="text-accent">análisis GRATUITO impulsado por IA</strong> de tu negocio. Solo comparte tu sitio web y correo electrónico, identificaremos tus 3 principales oportunidades de crecimiento y enviaremos un informe personalizado en 48 horas.',
        contactEmailPlaceholder: "Tu email empresarial",
        contactUrlPlaceholder: "URL de tu sitio web",
        contactButton: "Obtener tu análisis empresarial gratuito",

        // Footer
        footerCompany: "Empresa",
        footerSolutions: "Soluciones",
        footerLegal: "Legal",
        footerContact: "Ponte en Contacto",
        footerPrivacy: "Política de Privacidad",
        footerTerms: "Términos y Condiciones",
        footerCookies: "Política de Cookies",

        // Kultur Atelier Detail Page
        // Meta
    kulturMetaTitle: "Caso de Estudio Kultur Atelier | Vanguard Crux",
    kulturMetaDesc: "Identidad visual unificada y estrategia de marca para las ubicaciones de Kultur Atelier en Halle y Hamburgo, Alemania.",
    backToHome: "← Volver al Inicio",
    backToProjects: "← Volver a Proyectos",

    // Hero
    kulturHeroTitle: "Kultur Atelier: Identidad sin Fronteras",
    kulturHeroSubtitle: "Estandarización visual y estrategia de marca para sedes en Halle y Hamburgo.",
    kulturHeroDesc: "Sistema visual coherente para una organización cultural multi-sede.",
    kulturHeroClient: "Cliente: Kultur Atelier e.V.",
    kulturHeroLocation: "Ubicación: Halle y Hamburgo",
    kulturHeroServices: "Sistema de Branding",

    // Challenge
    kulturChallengeTitle: "El Desafío",
    kulturChallengeDesc: "Con actividades expandiéndose entre Halle y Hamburgo, Kultur Atelier sufría una fragmentación crítica. Cada sede comunicaba de forma distinta, diluyendo la fuerza de la marca matriz.",
    kulturChallengeStat1Title: "2",
    kulturChallengeStat1Label: "Sedes en Alemania",
    kulturChallengeStat2Title: "100%",
    kulturChallengeStat2Label: "Identidad Digital",

    // Solution
    kulturSolutionTitle: "La Solución",
    kulturSolution1Title: "Identidad Líquida y Adaptativa",
    kulturSolution1Desc: "Desarrollamos un Brand Book flexible. Las texturas acuareladas unifican la estética permitiendo variaciones locales sin perder pertenencia.",
    kulturSolution2Title: "Despliegue Táctico",
    kulturSolution2Desc: "Las piezas gráficas mantienen jerarquía visual tanto en Halle como en Hamburgo.",
    kulturSolution3Title: "Comunidad Extendida",
    kulturSolution3Desc: "El merchandising actúa como nexo físico entre ambas comunidades.",

    // Community / Merch
    kulturCommunityTitle: "Comunidad Extendida",
    kulturCommunityDesc: "El merchandising se convirtió en el vínculo físico entre los miembros de ambas ciudades.",
    kulturMerchToteTitle: "Tote Bags",
    kulturMerchToteDesc: "Diseño portátil de la identidad",
    kulturMerchNotebookTitle: "Libretas",
    kulturMerchNotebookDesc: "Creatividad con identidad",
    kulturMerchMugTitle: "Tazas",
    kulturMerchMugDesc: "Momentos de inspiración",

    // Navigation
    exploreMoreTitle: "Explora Más Proyectos",
    exploreMoreDesc: "Descubre cómo transformamos marcas en experiencias memorables",
    viewAllCases: "Ver Todos los Casos",

    // Fintech Case Study Detail Page
    fintechMetaTitle: "Caso de Estudio Business Case Analyzer Pro | Vanguard Crux",
    fintechMetaDesc: "Arquitectura de modelado financiero algorítmico con cálculos de VPN, ROI y TIR de latencia cero. Fintech SaaS AI-ready construido con Vanilla JS.",

    // Footer
    footerRights: "© 2024 Vanguard Crux. Todos los derechos reservados."
    },
    pt: {
        // Navigation
        navSolutions: "Serviços",
        navPhilosophy: "A nossa abordagem",
        navTeam: "A equipa",
        navCaseStudies: "Projetos",
        navContact: "Contacto",
        navAbout: "Sobre Nós",

        // Meta
        metaTitle: "Vanguard Crux | Agência de marketing com IA e automatização no Porto",
        metaDescription: "A Vanguard Crux é uma agência de crescimento digital no Porto, Portugal, especializada em marketing com IA, automatização de processos empresariais e estratégias de desempenho para escalar a sua receita.",
        metaKeywords: "agência digital porto, marketing com ia, automatização empresarial, marketing de desempenho, agência de crescimento portugal, automatização de marketing, estratégia digital, agência seo",

        // Hero Section
        heroTitle: 'A <span class="text-accent" data-pulse="true">agência global</span> que transforma <span class="text-accent" data-pulse="true">dados</span> em crescimento',
        heroSlogan: "Desbloqueie a sua vantagem injusta",
        heroTagline: "Arquitetura de IA. Mentes criativas a resolver o impossível.",
        heroSubtitle: "Somos a Vanguard Crux, uma agência global de marketing de desempenho. Implementamos estratégias de IA e automatização para dar ao seu negócio uma vantagem competitiva real em Portugal e além.",
        heroCTA: "Reclame a seu auditoria gratuita",

        // Philosophy Section
        philosophyTag: "A nossa abordagem de crescimento",
        philosophyTitle: "Não vendemos apenas serviços. Construímos parcerias de crescimento",
        philosophyDesc: "O nosso sucesso é medido pelo aumento da sua receita. Focamo-nos na implementação de marketing de desempenho e automatização que entrega um ROI claro, garantindo que a nossa colaboração seja um investimento rentável a longo prazo.",

        // Solutions Section
        solutionsTitle: "Serviços de crescimento digital",
        sol1Title: "Marketing de desempenho e SEO",
        sol1Desc: "Atraímos e convertemos clientes de alto valor com SEO baseado em dados e campanhas de mídia paga no Meta e Google, focados em maximizar o seu ROI.",
        sol2Title: "IA e Automatização empresarial",
        sol2Desc: "Otimizamos as suas operações com assistentes de IA personalizados e automatização de processos (Make/N8N) para aumentar a eficiência e reduzir custos.",
        sol3Title: "Branding e Estratégia de conteúdo",
        sol3Desc: "Construímos marcas memoráveis que se conectam com o seu público. Inclui design de identidade visual e estratégias de marketing de conteúdo de alto desempenho.",

        // Case Studies Section
        caseStudiesTitle: "Resultados comprovados, não promessas",
        kulturSubtitle: "Branding Escalável | Identidade Multi-cidade",
        kulturLocationLabel: "Localização:",
        kulturLocation: "Halle e Hamburgo, Alemanha",
        kulturDesc: "Unificação da identidade visual para uma organização cultural com presença em Halle e Hamburgo. Um sistema de design escalável que conecta comunidades.",
        case1Title: "Kultur Atelier, Halle e Hamburgo - Alemanha",
        case1Desc: "Unificação da identidade visual para uma organização cultural com presença em Halle e Hamburgo. Um sistema de design escalável que conecta comunidades.",
        case2Title: "Business Case Analyzer Pro",
        case2Subtitle: "Fintech SaaS | Arquitetura AI-Ready",
        case2TechLabel: "Tech:",
        case2Tech: "Vanilla JS, Chart.js, jsPDF",
        case2Desc: "Arquitetura de modelagem financeira com previsão IA simulada. Motor de latência zero para cálculos instantâneos de ROI, VPL e TIR com exportação PDF.",
        case3Title: "Smart Mobility Solutions, Dubai",
        case3Desc: "Implementámos chatbot impulsionado por IA e fluxos de automatização que reduziram os custos de suporte ao cliente em 60% enquanto melhoravam os tempos de resposta em 85%.",
        case4Title: "Vinos de Bodega, Mendoza",
        case4Desc: "Transformação digital completa com plataforma de e-commerce e estratégia de conteúdo que gerou um aumento de 250% nas vendas online em 6 meses.",
        case5Title: "TechStart Hub, Lisboa",
        case5Desc: "Implementámos uma estratégia abrangente de SEO e marketing de conteúdo que impulsionou um crescimento de 300% no tráfego orgânico e estabeleceu liderança de pensamento no ecossistema tecnológico português.",

        // About Section
        aboutTitle: "Pensamos fora da caixa. Agimos dentro dos seus objetivos",
        aboutSubtitle: "A nossa história é sem fronteiras. Nascidos da colaboração de especialistas digitais em toda a Argentina, de Paraná a Mendoza, a nossa jornada levou-nos a desenvolver projetos em Hamburgo e Dubai, e conduziu-nos a estabelecer o nosso centro europeu no Porto.",
        aboutPillar1Title: "Perspetiva global, execução local",
        aboutPillar1Desc: "A nossa equipa em continentes permite-nos aplicar as melhores estratégias globais com um profundo conhecimento do mercado local.",
        aboutPillar2Title: "IA no núcleo",
        aboutPillar2Desc: "Usamos IA e automatização não como um complemento, mas como o motor central para otimizar cada processo e decisão de marketing.",

        // Team Section
        teamTitle: "Conheça a equipa da Vanguard Crux",
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
        contactSubtitle: 'Obtenha uma <strong class="text-accent">análise GRATUITA impulsionada por IA</strong> do seu negócio. Partilhe apenas o seu website e email, identificaremos as suas 3 principais oportunidades de crescimento e enviaremos um relatório personalizado em 48 horas.',
        contactEmailPlaceholder: "O seu email empresarial",
        contactUrlPlaceholder: "URL do seu website",
        contactButton: "Obter a minha análise empresarial gratuita",

        // Footer
        footerCompany: "Empresa",
        footerSolutions: "Soluções",
        footerLegal: "Legal",
        footerContact: "Entre em Contacto",
        footerPrivacy: "Política de Privacidade",
        footerTerms: "Termos e Condições",
        footerCookies: "Política de Cookies",

        // Kultur Atelier Detail Page
         kulturMetaTitle: "Estudo de Caso Kultur Atelier | Vanguard Crux",
    kulturMetaDesc: "Identidade visual unificada e estratégia de marca para as localizações da Kultur Atelier em Halle e Hamburgo, Alemanha.",
    backToHome: "← Voltar ao Início",
    backToProjects: "← Voltar aos Projetos",

    kulturHeroTitle: "Kultur Atelier: Identidade Sem Fronteiras",
    kulturHeroSubtitle: "Padronização visual e estratégia de marca para unidades em Halle e Hamburgo.",
    kulturHeroDesc: "Sistema visual coeso para uma organização cultural multi-local.",
    kulturHeroClient: "Cliente: Kultur Atelier e.V.",
    kulturHeroLocation: "Localização: Halle e Hamburgo",
    kulturHeroServices: "Sistema de Branding",

    kulturChallengeTitle: "O Desafio",
    kulturChallengeDesc: "Com a expansão entre Halle e Hamburgo, a Kultur Atelier enfrentava uma fragmentação crítica. Cada unidade comunicava de forma diferente.",
    kulturChallengeStat1Title: "2",
    kulturChallengeStat1Label: "Unidades na Alemanha",
    kulturChallengeStat2Title: "100%",
    kulturChallengeStat2Label: "Identidade Digital",

    kulturSolutionTitle: "A Solução",
    kulturSolution1Title: "Identidade Líquida e Adaptável",
    kulturSolution1Desc: "Criámos um Brand Book flexível. Texturas em aquarela unificam a estética com adaptação local.",
    kulturSolution2Title: "Implementação Tática",
    kulturSolution2Desc: "As peças mantêm hierarquia visual tanto em Halle como em Hamburgo.",
    kulturSolution3Title: "Comunidade Estendida",
    kulturSolution3Desc: "O merchandising tornou-se o elo físico entre as comunidades.",

    kulturCommunityTitle: "Comunidade Estendida",
    kulturCommunityDesc: "O merchandising criou um sentimento de pertença partilhado.",
    kulturMerchToteTitle: "Sacos Tote",
    kulturMerchToteDesc: "Identidade portátil",
    kulturMerchNotebookTitle: "Cadernos",
    kulturMerchNotebookDesc: "Criatividade com identidade",
    kulturMerchMugTitle: "Canecas",
    kulturMerchMugDesc: "Momentos de inspiração",

    exploreMoreTitle: "Explorar Mais Projetos",
    exploreMoreDesc: "Descobre como transformamos marcas em experiências memoráveis",
    viewAllCases: "Ver Todos os Projetos",

    // Fintech Case Study Detail Page
    fintechMetaTitle: "Estudo de Caso Business Case Analyzer Pro | Vanguard Crux",
    fintechMetaDesc: "Arquitetura de modelagem financeira algorítmica com cálculos de VPL, ROI e TIR de latência zero. Fintech SaaS AI-ready construído com Vanilla JS.",

    footerRights: "© 2024 Vanguard Crux. Todos os direitos reservados."
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
    
    // Check if current page has language-specific versions
    const currentPath = window.location.pathname;
    const currentFile = currentPath.replace(/\/$/, '').split('/').pop() || '';
    
    // Check if we're on a page with language versions
    for (const basePage of PAGES_WITH_LANGUAGE_VERSIONS) {
        // Match patterns like "kultur-atelier.html", "kultur-atelier-es.html", "kultur-atelier-pt.html"
        if (currentFile.startsWith(basePage)) {
            const suffix = lang === 'en' ? '' : `-${lang}`;
            const newFile = `${basePage}${suffix}.html`;
            
            // Only redirect if we're changing to a different file
            if (currentFile !== newFile) {
                window.location.href = newFile;
                return; // Exit early since we're redirecting
            }
            break;
        }
    }
    
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
   KULTUR ATELIER CARD CLICK HANDLER
   ========================================================= */

function initKulturAtelierCard() {
    const kulturCard = document.querySelector('.kultur-atelier-card');
    if (kulturCard) {
        kulturCard.addEventListener('click', () => {
            const lang = localStorage.getItem('userLanguage') || 'en';
            const suffix = lang === 'en' ? '' : `-${lang}`;
            window.location.href = `kultur-atelier${suffix}.html`;
        });
    }
}

/* =========================================================
   FINTECH CASE CARD CLICK HANDLER
   ========================================================= */

function initFintechCaseCard() {
    document.querySelectorAll('.fintech-case-card').forEach(card => {
        card.addEventListener('click', function() {
            const currentLang = localStorage.getItem('userLanguage') || 'en';
            let targetPage = 'fintech-case.html';
            if (currentLang === 'es') targetPage = 'fintech-case-es.html';
            if (currentLang === 'pt') targetPage = 'fintech-case-pt.html';
            window.location.href = targetPage;
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
    initKulturAtelierCard();
    initFintechCaseCard();

    const detectedLang = detectBrowserLanguage();

    // Espera a que TODO el DOM esté realmente pintado
    requestAnimationFrame(() => {
        setLanguage(detectedLang);
        console.log('Language applied to full DOM:', detectedLang);
    });
});

