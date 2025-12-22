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

    function goToSlide(index) {
        currentSlide = index;
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updatePagination();
    }

    // Auto-slide SOLO mobile, UNA SOLA VEZ
    if (window.innerWidth < 768) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);
    }
}

/* =========================================================
   UI EFFECTS - LANGUAGE BUTTON STATE
   ========================================================= */

function updateLanguageButtons(lang) {
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
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
    const open = !menuOverlay.classList.contains('hidden');

    menuBtn.classList.toggle('active', !open);
    menuOverlay.classList.toggle('hidden', open);
    menuOverlay.classList.toggle('opacity-0', open);
    menuContent.classList.toggle('translate-x-full', open);
    document.body.style.overflow = open ? '' : 'hidden';
}

if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);
    menuLinks.forEach(l => l.addEventListener('click', toggleMenu));
}

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
    en: {
        navSolutions: "Services",
        navPhilosophy: "Our approach",
        navTeam: "The team",
        navCaseStudies: "Projects",
        navContact: "Contact",
        heroTitle: "The <span class='text-accent'>global agency</span> that turns <span class='text-accent'>data</span> into growth.",
        heroSlogan: "Unlock your unfair advantage.",
        heroTagline: "AI Architecture. Creative minds solving the impossible.",
        heroSubtitle: "We implement AI and automation strategies to give your business a competitive edge.",
        heroCTA: "Claim my Free audit",
        philosophyTitle: "We don't just sell services. We build growth partnerships.",
        philosophyDesc: "Our success is measured by your increased revenue. ROI-driven growth partnerships.",
        solutionsTitle: "Digital growth services",
        sol1Title: "Performance Marketing & SEO",
        sol1Desc: "We attract and convert valuable customers with data-driven seo & paid media campaigns.",
        sol2Title: "AI & Business automation",
        sol2Desc: "We streamline your business operations with ai assistants & process automation.",
        sol3Title: "Branding & Content strategy",
        sol3Desc: "We build memorable brands that connect with their audiences using impactful storytelling & visual identity design.",
        contactTitle: "Ready to scale your business?",
        contactSubtitle: "Get a FREE AI-powered analysis of your business!",
        contactButton: "Get my Free business analysis",
        contactEmailPlaceholder: "Your business email",
        contactUrlPlaceholder: "Your website URL"
    },
    es: {
        navSolutions: "Servicios",
        navPhilosophy: "Nuestra Filosofía",
        navTeam: "El equipo",
        navCaseStudies: "Proyectos",
        navContact: "Contacto",
        heroTitle: "La <span class='text-accent'>agencia global</span> que convierte <span class='text-accent'>datos</span> en crecimiento.",
        heroSlogan: "Desbloquea tu ventaja competitiva.",
        heroTagline: "Arquitectura AI. Mentes creativas solucionando lo imposible.",
        heroSubtitle: "Implementamos estrategias de AI para dar ventaja competitiva a tu negocio.",
        heroCTA: "Obtén mi auditoría gratuita",
        philosophyTitle: "No vendemos servicios. Construimos asociaciones duraderas.",
        philosophyDesc: "Nuestro éxito se mide por tu aumento de ingresos. Asociaciones ROI-driven.",
        solutionsTitle: "Servicios digitales de crecimiento",
        sol1Title: "Marketing de rendimiento & SEO",
        sol1Desc: "Atraemos y convertimos clientes valiosos con campañas de seo impulsadas por datos y medios pagados.",
        sol2Title: "Automatización empresarial & AI",
        sol2Desc: "Optimizamos tus operaciones comerciales con asistentes de AI y automatización de procesos.",
        sol3Title: "Estrategia de marca & Contenido",
        sol3Desc: "Creamos marcas memorables que se conectan con sus audiencias mediante narrativas impactantes y diseño visual.",
        contactTitle: "¿Listo para escalar tu negocio?",
        contactSubtitle: "Obtén GRATIS un análisis con AI de tu negocio.",
        contactButton: "Obtén mi análisis Gratis",
        contactEmailPlaceholder: "Tu correo electrónico profesional",
        contactUrlPlaceholder: "URL de tu sitio web"
    },
    pt: {
        navSolutions: "Serviços",
        navPhilosophy: "Nossa abordagem",
        navTeam: "A equipa",
        navCaseStudies: "Projetos",
        navContact: "Contato",
        heroTitle: "A <span class='text-accent'>agência global</span> que transforma <span class='text-accent'>dados</span> em crescimento.",
        heroSlogan: "Desbloqueie aua vantagem competitiva.",
        heroTagline: "Arquitetura AI. Mentes criativas resolvendo o impossível.",
        heroSubtitle: "Implementamos estratégias de AI para dar vantagem competitiva ao seu negócio.",
        heroCTA: "Solicite minha auditoria Gratuita",
        philosophyTitle: "Não vendemos serviços. Construímos parcerias de crescimento.",
        philosophyDesc: "O nosso sucesso é medido pelo aumento da sua receita. Parcerias ROI-driven.",
        solutionsTitle: "Serviços de crescimento digital",
        sol1Title: "Marketing de desempenho & SEO",
        sol1Desc: "Atraímos e convertemos clientes valiosos com campanhas de seo orientadas por dados e mídia paga.",
        sol2Title: "Automação comercial & AI",
        sol2Desc: "Otimizamos as operações comerciais com assistentes de ai e automação de processos.",
        sol3Title: "Estratégia de marca & Conteúdo",
        sol3Desc: "Criamos marcas memoráveis que se conectam com seus públicos através de narrativas impactantes e design visual.",  
        contactTitle: "Pronto para escalar seu negócio?",
        contactSubtitle: "Receba uma análise GRATUITA da sua empresa com IA.",
        contactButton: "Receba minha análise Gratuita",
        contactEmailPlaceholder: "Seu email profissional",
        contactUrlPlaceholder: "URL do seu site"
    }
};
function detectBrowserLanguage() {
    const saved = localStorage.getItem('userLanguage');
    if (saved) return saved;

    const lang = navigator.language.split('-')[0];
    return ['es', 'pt'].includes(lang) ? lang : 'en';
}

function setLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('userLanguage', lang);

    // Traducción de elementos con `data-lang` (texto HTML)
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (translations[lang]?.[key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Traducción de placeholders (`data-lang-placeholder`)
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.dataset.langPlaceholder;
        if (translations[lang]?.[key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Actualiza botones activos
    updateLanguageButtons(lang);
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


