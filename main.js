/* =========================================================
   BASIC / FALLBACK ANIMATIONS
   ========================================================= */

function initAnimations() {
    if (typeof gsap !== 'undefined') {
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
        navTeam: "Founders",
        navCaseStudies: "Projects",
        navContact: "Contact",
        navAbout: "About Us",
        navTestimonials: "Testimonials",
        navPricing: "Pricing",

        // Meta
        metaTitle: "AI, Automation & Web Development Boutique | Vanguard Crux",
        metaDescription: "Vanguard Crux is a tech consultancy in Porto specializing in Artificial Intelligence integration, custom web development, and process automation for modern businesses.",
        metaKeywords: "ai agency porto, automation consultancy, web development, process automation, ai agents portugal, make automation, n8n, custom software",

        // Hero Section
        heroTitle: 'Scalable growth. <span class="text-accent" data-pulse="true">Personalized</span> attention',
        heroSlogan: "Artificial Intelligence & Development Boutique",
        heroTagline: "We're not a giant agency. We're your best competitive advantage.",
        heroSubtitle: "We empower your business with AI and data without losing the human touch. We design systems that scale your sales with the exclusive attention your company deserves.",
        heroCTA: "Let's discuss your growth",

        // Social Proof
        socialProof1: "Clients Successfully Helped",
        socialProof2: "Projects Completed",
        socialProof3: "Countries Served",
        socialProof4: "Years Combined Experience",

        // Philosophy Section
        philosophyTag: "Our Approach",
        philosophyTitle: "We don't sell hours. We build technology assets",
        philosophyDesc: "We design digital ecosystems that work for you. We focus on automating repetitive tasks, building blazing-fast web platforms, and integrating AI agents that make your team infinitely more efficient.",
        philosophyCTA: "Start Your Transformation",

        // Solutions Section
        solutionsTitle: "Digital Solutions",
        sol1Title: "Consulting & Process Automation",
        sol1Desc: "We audit your workflows and implement custom automations (Make/N8N) to eliminate repetitive manual tasks, drastically reducing operational costs.",
        sol2Title: "Artificial Intelligence Agents",
        sol2Desc: "We build advanced conversational agents for WhatsApp and internal tools, trained specifically on your company's proprietary data & knowledge base.",
        sol3Title: "Web Development & Architecture",
        sol3Desc: "We build everything from high-converting landing pages to complex corporate sites, designed with modern architectures and optimized to integrate AI.",
        learnMore: "Learn More →",

        // Testimonials Section
        testimonialsTag: "Client Stories",
        testimonialsTitle: "Clients & Results",
        testimonialsSubtitle: "Real stories of transformed businesses",
        testimonial1Text: "VanguardCrux automated our sales pipeline and completely transformed our conversion process.",
        testimonial1Metric: "Sales",
        testimonial1Name: "Client A",
        testimonial2Text: "Their AI strategy transformed our customer engagement and lead generation completely.",
        testimonial2Metric: "Leads",
        testimonial2Name: "Client B",
        testimonial3Text: "We saved thousands in operating costs with their automation solutions.",
        testimonial3Metric: "Savings",
        testimonial3Name: "Client C",
        testimonial4Text: "Exceptional strategic guidance. They truly understand the Portuguese market.",
        testimonial4Name: "Client D",

        // Pricing Section
        pricingTag: "Pricing",
        pricingTitle: "Packages & Pricing",
        pricingSubtitle: "Flexible plans for your business. Free consultation included.",
        pricingPlan1: "Digital Foundations",
        pricingPlan1Desc: "For businesses leaping into modernity",
        pricingPlan2: "AI & Agents Integration",
        pricingPlan2Desc: "For teams looking to multiply efficiency",
        pricingPlan3: "Ecosystem & Web Dev",
        pricingPlan3Desc: "End-to-end digital transformation",
        pricingPopular: "Popular",
        pricingPeriod: "Per project",
        pricingPeriodCustom: "Custom pricing",
        pricingFeature1a: "Workflow audit & mapping",
        pricingFeature1b: "Repetitive process automation",
        pricingFeature1c: "Optimization of current tools",
        pricingFeature2a: "AI Agents for WhatsApp/Web",
        pricingFeature2b: "Advanced automation (CRMs, DBs)",
        pricingFeature2c: "Custom internal AI assistants",
        pricingFeature3a: "Full web development",
        pricingFeature3b: "Embedded AI ecosystem",
        pricingFeature3c: "Premium dedicated support",
        pricingCTA1: "Get Started",
        pricingCTA2: "Request Demo",
        pricingCTA3: "Contact Us",

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
        aboutTag: "Our Global Journey",
        aboutTitle: "We think outside the box. We act inside your goals",
        aboutSubtitle: "Our story is one without borders. Born from the collaboration of digital experts across Argentina, from Paraná to Mendoza, our journey has taken us to develop projects in Germany, Dubai, Portugal, and Argentina, ultimately leading us to establish our European hub in Porto.",
        aboutPillar1Title: "Global perspective, local execution",
        aboutPillar1Desc: "Our team across continents allows us to apply the best global strategies with a deep understanding of the local market.",
        aboutPillar2Title: "AI at the core",
        aboutPillar2Desc: "We use AI and automation not as an add-on, but as the central engine to optimize every marketing process and decision.",
        aboutPinNow: "Now",
        journeyArgName: "Argentina",
        journeyArgDesc: "Where it all started. Born in Paraná & Mendoza.",
        journeyGerName: "Germany",
        journeyGerDesc: "Expanding to Europe. Projects in Hamburg & Halle.",
        journeyDubName: "Dubai",
        journeyDubDesc: "Conquering the Middle East. AI strategies at scale.",
        journeyPorName: "Porto",
        journeyPorDesc: "Our European HQ. The future base for global AI.",
        journeyNow: "Now",

        // Team Section
        teamTitle: "Meet the Founders",
        teamSubtitle: "Visionary leaders driving innovation at Vanguard Crux",
        jonName: "Jon Flores",
        jonRole: "AI Strategist & Founder",
        jonLocation: "Porto, Portugal",
        jonSkill1: "AI Strategy",
        jonSkill2: "Automation",
        jonSkill3: "Data Analytics",
        joseName: "José Aluz",
        joseRole: "Content Strategist & Founder",
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
        navTeam: "Fundadores",
        navCaseStudies: "Proyectos",
        navContact: "Contacto",
        navAbout: "Nosotros",
        navTestimonials: "Testimonios",
        navPricing: "Precios",

        // Meta
        metaTitle: "Boutique de IA, Automatización y Desarrollo Web | Vanguard Crux",
        metaDescription: "Vanguard Crux es una consultora tecnológica en Oporto especializada en integración de Inteligencia Artificial, desarrollo web a medida y automatización de procesos para empresas modernas.",
        metaKeywords: "agencia ia oporto, consultoria automatizacion, desarrollo web, automatizacion de procesos, agentes ia portugal, automacion make, n8n, software a medida",

        // Hero Section
        heroTitle: 'Crecimiento escalable. Atención <span class="text-accent" data-pulse="true">personalizada</span>',
        heroSlogan: "Boutique de Inteligencia Artificial & Desarrollo",
        heroTagline: "No somos una gran agencia. Somos tu mejor ventaja competitiva.",
        heroSubtitle: "Potenciamos tu negocio con IA y datos, sin perder el toque humano. Diseñamos sistemas que escalan tus ventas con la atención exclusiva que tu empresa merece.",
        heroCTA: "Hablemos de tu crecimiento",

        // Social Proof
        socialProof1: "Clientes Atendidos Exitosamente",
        socialProof2: "Proyectos Completados",
        socialProof3: "Países Atendidos",
        socialProof4: "Años de Experiencia Combinada",

        // Philosophy Section
        philosophyTag: "Nuestro Enfoque",
        philosophyTitle: "No vendemos horas. Construimos activos tecnológicos",
        philosophyDesc: "Diseñamos ecosistemas digitales que trabajan por ti. Nos enfocamos en automatizar tareas repetitivas, desarrollar plataformas web veloces e integrar agentes de Inteligencia Artificial que hacen a tu equipo infinitamente más eficiente.",
        philosophyCTA: "Comienza Tu Transformación",

        // Solutions Section
        solutionsTitle: "Soluciones de Crecimiento Digital",
        sol1Title: "Consultoría & Automatización de Procesos",
        sol1Desc: "Auditamos tus flujos de trabajo e implementamos automatizaciones a medida (Make/N8N) para eliminar tareas manuales repetitivas, reduciendo costos operativos drásticamente.",
        sol2Title: "Agentes de Inteligencia Artificial",
        sol2Desc: "Desarrollamos agentes conversacionales avanzados para WhatsApp y herramientas internas, entrenados específicamente con los datos y el conocimiento de tu empresa.",
        sol3Title: "Desarrollo y Arquitectura Web",
        sol3Desc: "Construimos desde landing pages de alta conversión hasta sitios corporativos complejos, diseñados bajo arquitecturas modernas y optimizados para integrar IA.",
        learnMore: "Saber Más →",

        // Testimonials Section
        testimonialsTag: "Historias de Clientes",
        testimonialsTitle: "Clientes & Resultados",
        testimonialsSubtitle: "Historias reales de negocios transformados",
        testimonial1Text: "VanguardCrux automatizó nuestro pipeline de ventas y transformó completamente nuestro proceso de conversión.",
        testimonial1Metric: "Ventas",
        testimonial1Name: "Cliente A",
        testimonial2Text: "Su estrategia de IA transformó nuestro engagement con clientes y la generación de leads por completo.",
        testimonial2Metric: "Leads",
        testimonial2Name: "Cliente B",
        testimonial3Text: "Ahorramos miles en costos operativos con sus soluciones de automatización.",
        testimonial3Metric: "Ahorros",
        testimonial3Name: "Cliente C",
        testimonial4Text: "Orientación estratégica excepcional. Entienden realmente el mercado portugués.",
        testimonial4Name: "Cliente D",

        // Pricing Section
        pricingTag: "Precios",
        pricingTitle: "Paquetes & Precios",
        pricingSubtitle: "Planes flexibles para tu negocio. Incluye consulta gratuita.",
        pricingPlan1: "Fundamentos Digitales",
        pricingPlan1Desc: "Para empresas dando el salto a la modernidad",
        pricingPlan2: "Integración de IA & Agentes",
        pricingPlan2Desc: "Para equipos que buscan multiplicar su eficiencia",
        pricingPlan3: "Desarrollo Web & Ecosistema",
        pricingPlan3Desc: "Transformación digital de inicio a fin",
        pricingPopular: "Popular",
        pricingPeriod: "Por proyecto",
        pricingPeriodCustom: "Precio personalizado",
        pricingFeature1a: "Auditoría integral de flujos de trabajo",
        pricingFeature1b: "Automatización de procesos manuales",
        pricingFeature1c: "Optimización de herramientas actuales",
        pricingFeature2a: "Agentes IA para WhatsApp y Web",
        pricingFeature2b: "Automatización avanzada (CRMs, BDs)",
        pricingFeature2c: "Asistentes internos personalizados",
        pricingFeature3a: "Desarrollo web completo",
        pricingFeature3b: "Arquitectura de ecosistema IA embedido",
        pricingFeature3c: "Soporte premium directo",
        pricingCTA1: "Comenzar",
        pricingCTA2: "Solicitar Demo",
        pricingCTA3: "Contactar",

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
        aboutTag: "Nuestro Viaje Global",
        aboutTitle: "Pensamos fuera de la caja. Actuamos dentro de tus objetivos",
        aboutSubtitle: "Nuestra historia no tiene fronteras. Nacidos de la colaboración de expertos digitales en Argentina, desde Paraná hasta Mendoza, nuestro viaje nos ha llevado a desarrollar proyectos en Alemania, Dubái, Portugal y Argentina, estableciendo finalmente nuestro centro europeo en Oporto.",
        aboutPillar1Title: "Perspectiva global, ejecución local",
        aboutPillar1Desc: "Nuestro equipo a través de continentes nos permite aplicar las mejores estrategias globales con un profundo conocimiento del mercado local.",
        aboutPillar2Title: "IA en el núcleo",
        aboutPillar2Desc: "Usamos IA y automatización no como un complemento, sino como el motor central para optimizar cada proceso y decisión de marketing.",
        aboutPinNow: "Ahora",
        journeyArgName: "Argentina",
        journeyArgDesc: "Donde todo empezó. Nacidos en Paraná y Mendoza.",
        journeyGerName: "Alemania",
        journeyGerDesc: "Expansión a Europa. Proyectos en Hamburgo y Halle.",
        journeyDubName: "Dubái",
        journeyDubDesc: "Conquistando Medio Oriente. Estrategias de IA a escala.",
        journeyPorName: "Oporto",
        journeyPorDesc: "Nuestra sede europea. La base futura para la IA global.",
        journeyNow: "Ahora",

        // Team Section
        teamTitle: "Conoce a los Fundadores",
        teamSubtitle: "Líderes visionarios impulsando innovación en Vanguard Crux",
        jonName: "Jon Flores",
        jonRole: "Estratega de IA & Fundador",
        jonLocation: "Oporto, Portugal",
        jonSkill1: "Estrategia de IA",
        jonSkill2: "Automatización",
        jonSkill3: "Analítica de Datos",
        joseName: "José Aluz",
        joseRole: "Estratega de Contenido & Fundador",
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
        navTeam: "Fundadores",
        navCaseStudies: "Projetos",
        navContact: "Contacto",
        navAbout: "Sobre Nós",
        navTestimonials: "Testemunhos",
        navPricing: "Preços",

        // Meta
        metaTitle: "Boutique de IA, Automatização e Desenvolvimento Web | Vanguard Crux",
        metaDescription: "A Vanguard Crux é uma consultoria tecnológica no Porto especializada em integração de Inteligência Artificial, desenvolvimento web à medida e automatização de processos para empresas modernas.",
        metaKeywords: "agência ia porto, consultoria automatização, desenvolvimento web, automatização de processos, agentes ia portugal, automação make, n8n, software à medida",

        // Hero Section
        heroTitle: 'Crescimento escalável. Atenção <span class="text-accent" data-pulse="true">personalizada</span>',
        heroSlogan: "Boutique de Inteligência Artificial & Desenvolvimento",
        heroTagline: "Não somos uma grande agência. Somos a sua melhor vantagem competitiva.",
        heroSubtitle: "Potenciamos o seu negócio com IA e dados, sem perder o toque humano. Desenhamos sistemas que escalam as suas vendas com a atenção exclusiva que a sua empresa merece.",
        heroCTA: "Vamos falar sobre o seu crescimento",

        // Social Proof
        socialProof1: "Clientes Atendidos com Sucesso",
        socialProof2: "Projetos Concluídos",
        socialProof3: "Países Atendidos",
        socialProof4: "Anos de Experiência Combinada",

        // Philosophy Section
        philosophyTag: "A nossa abordagem de crescimento",
        philosophyTitle: "Não vendemos horas. Construímos ativos tecnológicos",
        philosophyDesc: "Desenhamos ecossistemas digitais que trabalham por si. Focamo-nos em automatizar tarefas repetitivas, desenvolver plataformas web super-rápidas e integrar agentes de Inteligência Artificial que tornam a sua equipa infinitamente mais eficiente.",
        philosophyCTA: "Comece a Sua Transformação",

        // Solutions Section
        solutionsTitle: "Soluções Digitais",
        sol1Title: "Consultoria e Automatização de Processos",
        sol1Desc: "Auditamos os seus fluxos de trabalho e implementamos automatizações à medida (Make/N8N) para eliminar tarefas manuais repetitivas, reduzindo custos operacionais drasticamente.",
        sol2Title: "Agentes de Inteligência Artificial",
        sol2Desc: "Desenvolvemos agentes de conversação avançados para WhatsApp e ferramentas internas, treinados especificamente com os dados e conhecimentos da sua empresa.",
        sol3Title: "Desenvolvimento e Arquitetura Web",
        sol3Desc: "Construímos desde landing pages de alta conversão até sites corporativos complexos, concebidos sob arquiteturas modernas e otimizados para integração com IA.",
        learnMore: "Saber Mais →",

        // Testimonials Section
        testimonialsTag: "Histórias de Clientes",
        testimonialsTitle: "Clientes & Resultados",
        testimonialsSubtitle: "Histórias reais de negócios transformados",
        testimonial1Text: "A VanguardCrux automatizou o nosso pipeline de vendas e transformou completamente o nosso processo de conversão.",
        testimonial1Metric: "Vendas",
        testimonial1Name: "Cliente A",
        testimonial2Text: "A sua estratégia de IA transformou o nosso engagement com clientes e a geração de leads por completo.",
        testimonial2Metric: "Leads",
        testimonial2Name: "Cliente B",
        testimonial3Text: "Poupámos milhares em custos operacionais com as suas soluções de automatização.",
        testimonial3Metric: "Poupança",
        testimonial3Name: "Cliente C",
        testimonial4Text: "Orientação estratégica excecional. Compreendem verdadeiramente o mercado português.",
        testimonial4Name: "Cliente D",

        // Pricing Section
        pricingTag: "Preços",
        pricingTitle: "Pacotes & Preços",
        pricingSubtitle: "Planos flexíveis para a sua empresa. Consulta gratuita incluída.",
        pricingPlan1: "Fundamentos Digitais",
        pricingPlan1Desc: "Para empresas a dar o salto para a modernidade",
        pricingPlan2: "Integração de IA & Agentes",
        pricingPlan2Desc: "Para equipas que procuram multiplicar a eficiência",
        pricingPlan3: "Ecosistema & Desenvolvimento Web",
        pricingPlan3Desc: "Transformação digital de ponta a ponta",
        pricingPopular: "Popular",
        pricingPeriod: "Por projeto",
        pricingPeriodCustom: "Preço personalizado",
        pricingFeature1a: "Auditoria integral de fluxos de trabalho",
        pricingFeature1b: "Automatização de processos repetitivos",
        pricingFeature1c: "Otimização de ferramentas atuais",
        pricingFeature2a: "Agentes IA para WhatsApp e Web",
        pricingFeature2b: "Automatização avançada (CRMs, BDs)",
        pricingFeature2c: "Assistentes operacionais personalizados",
        pricingFeature3a: "Desenvolvimento web completo",
        pricingFeature3b: "Arquitetura de ecossistema IA integrado",
        pricingFeature3c: "Suporte premium prioritário",
        pricingCTA1: "Começar",
        pricingCTA2: "Pedir Demo",
        pricingCTA3: "Contactar",

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
        aboutTag: "A nossa jornada global",
        aboutTitle: "Pensamos fora da caixa. Agimos dentro dos seus objetivos",
        aboutSubtitle: "A nossa história não tem fronteiras. Nascidos da colaboração de especialistas digitais em toda a Argentina, de Paraná a Mendoza, a nossa jornada levou-nos a desenvolver projetos na Alemanha, Dubai, Portugal e Argentina, estabelecendo finalmente o nosso centro europeu no Porto.",
        aboutPillar1Title: "Perspetiva global, execução local",
        aboutPillar1Desc: "A nossa equipa em continentes permite-nos aplicar as melhores estratégias globais com um profundo conhecimento do mercado local.",
        aboutPillar2Title: "IA no núcleo",
        aboutPillar2Desc: "Usamos IA e automatização não como um complemento, mas como o motor central para otimizar cada processo e decisão de marketing.",
        aboutPinNow: "Agora",
        journeyArgName: "Argentina",
        journeyArgDesc: "Onde tudo começou. Nascidos no Paraná e Mendoza.",
        journeyGerName: "Alemanha",
        journeyGerDesc: "Expansão para a Europa. Projetos em Hamburgo e Halle.",
        journeyDubName: "Dubai",
        journeyDubDesc: "Conquistando o Médio Oriente. Estratégias de IA à escala.",
        journeyPorName: "Porto",
        journeyPorDesc: "A nossa sede europeia. A base futura para a IA global.",
        journeyNow: "Agora",

        // Team Section
        teamTitle: "Conheça os Fundadores",
        teamSubtitle: "Líderes visionários a impulsionar inovação na Vanguard Crux",
        jonName: "Jon Flores",
        jonRole: "Estratega de IA & Fundador",
        jonLocation: "Porto, Portugal",
        jonSkill1: "Estratégia de IA",
        jonSkill2: "Automatização",
        jonSkill3: "Análise de Dados",
        joseName: "José Aluz",
        joseRole: "Estratega de Conteúdo & Fundador",
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
   MOBILE CAROUSELS
   ========================================================= */

function initMobileCarousels() {
    if (window.innerWidth > 1023) return;

    const configs = [
        { grid: document.getElementById('solutions-grid'),    cardSel: '.service-card', startIdx: 0 },
        { grid: document.querySelector('.testimonials-grid'), cardSel: '.testimonial-card', startIdx: 0 },
        { grid: document.querySelector('.pricing-grid'),      cardSel: '.pricing-card', startIdx: 1 },
    ];

    function scrollToCard(grid, cards, cardIdx) {
        const card = cards[cardIdx];
        if (!card) return;
        if (cardIdx === 0) { grid.scrollLeft = 0; return; }

        // Scroll so the card is centered in the viewport
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const gridCenter = grid.clientWidth / 2;
        grid.scrollLeft = Math.max(0, cardCenter - gridCenter);
    }

    configs.forEach(({ grid, cardSel, startIdx }) => {
        if (!grid) return;
        const cards = Array.from(grid.querySelectorAll(cardSel));
        if (cards.length < 2) return;

        const dotsEl = document.createElement('div');
        dotsEl.className = 'carousel-dots';

        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === startIdx ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', () => {
                scrollToCard(grid, cards, i);
            });
            dotsEl.appendChild(dot);
        });

        grid.parentNode.insertBefore(dotsEl, grid.nextSibling);

        // Scroll to initial position on next frame + wait for images
        requestAnimationFrame(() => {
            setTimeout(() => {
                scrollToCard(grid, cards, startIdx);
            }, 200);
        });

        // Re-apply after full load in case image/font reflow re-snapped the grid
        window.addEventListener('load', () => {
            scrollToCard(grid, cards, startIdx);
        }, { once: true });

        let scrollTimeout;
        grid.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                let activeIdx = 0;
                let minDist = Infinity;
                cards.forEach((card, i) => {
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
                    const dist = Math.abs(cardCenter - gridCenter);
                    if (dist < minDist) { minDist = dist; activeIdx = i; }
                });
                dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === activeIdx);
                });
            }, 50);
        }, { passive: true });
    });
}

/* =========================================================
   ABOUT — PARALLAX JOURNEY
   ========================================================= */

function initJourneyParallax() {
    const section = document.querySelector('.about-journey-visual');
    if (!section) return;

    const layers = section.querySelectorAll('.parallax-layer');
    let ticking = false;

    function updateParallax() {
        const rect = section.getBoundingClientRect();
        const windowH = window.innerHeight;

        // Only compute when section is in viewport
        if (rect.bottom < 0 || rect.top > windowH) { ticking = false; return; }

        // Progress: 0 when section enters bottom, 1 when it exits top
        const progress = 1 - (rect.bottom / (windowH + rect.height));

        layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.2;
            const yOffset = (progress - 0.5) * 80 * speed; // subtle vertical shift
            layer.style.transform = `translateY(${yOffset}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Initial call
    updateParallax();
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
    initMobileCarousels();
    initJourneyParallax();

    const detectedLang = detectBrowserLanguage();

    // Espera a que TODO el DOM esté realmente pintado
    requestAnimationFrame(() => {
        setLanguage(detectedLang);
        });
});
