// Premium Animation System Integration
// Disable basic animations in favor of GSAP-powered system
function initAnimations() {
    // Check if advanced animations are available
    if (typeof gsap !== 'undefined') {
        console.log('Premium GSAP animations loaded');
        return; // Advanced animations will handle everything
    }
    
    // Fallback to basic animations if GSAP fails to load
    const animateElements = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
        observer.observe(el);
    });
}

// Simple swiper replacement
function initProjectSwiper() {
    const swiper = document.querySelector('.project-swiper');
    const wrapper = swiper.querySelector('.swiper-wrapper');
    const slides = wrapper.querySelectorAll('.swiper-slide');
    const pagination = swiper.querySelector('.swiper-pagination');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create pagination bullets
    for (let i = 0; i < totalSlides; i++) {
        const bullet = document.createElement('span');
        bullet.className = 'swiper-pagination-bullet';
        if (i === 0) bullet.classList.add('swiper-pagination-bullet-active');
        bullet.addEventListener('click', () => goToSlide(i));
        pagination.appendChild(bullet);
    }
    
    function goToSlide(index) {
        currentSlide = index;
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update pagination
        pagination.querySelectorAll('.swiper-pagination-bullet').forEach((bullet, i) => {
            bullet.classList.toggle('swiper-pagination-bullet-active', i === currentSlide);
        });
    }
    
    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initProjectSwiper();
    initPremiumFeatures();
});

// Initialize premium immersive features
function initPremiumFeatures() {
    // Initialize ripple effects for buttons
    initRippleEffects();
    
    // Initialize magnetic hover effects
    initMagneticEffects();
    
    // Initialize scroll-triggered animations for elements without GSAP
    initScrollAnimations();
    
    // Performance monitoring
    monitorPerformance();
}

function initRippleEffects() {
    const buttons = document.querySelectorAll('.btn-primary, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function initMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic-element');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

function initScrollAnimations() {
    // Only run if GSAP is not available
    if (typeof gsap !== 'undefined') return;
    
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => observer.observe(el));
}

function monitorPerformance() {
    // Monitor frame rate for particle system optimization
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;
    
    function checkPerformance() {
        const currentTime = performance.now();
        frameCount++;
        
        if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // Reduce particle count if performance is poor
            if (fps < 30 && window.particleSystem) {
                window.particleSystem.config.particleCount = Math.max(20, window.particleSystem.config.particleCount * 0.8);
            }
        }
        
        requestAnimationFrame(checkPerformance);
    }
    
    checkPerformance();
}

const menuBtn = document.getElementById('menu-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuContent = document.getElementById('menu-content');
const menuLinks = document.querySelectorAll('.menu-link');

function toggleMenu() {
    const isHidden = menuOverlay.classList.contains('hidden');
    if (isHidden) {
        // Open menu
        menuBtn.classList.add('active');
        menuOverlay.classList.remove('hidden');
        setTimeout(() => {
            menuOverlay.classList.remove('opacity-0');
            menuContent.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        }, 10);
    } else {
        // Close menu
        menuBtn.classList.remove('active');
        menuOverlay.classList.add('opacity-0');
        menuContent.classList.add('translate-x-full');
        document.body.style.overflow = '';
        setTimeout(() => {
            menuOverlay.classList.add('hidden');
        }, 400);
    }
}

menuBtn.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);
menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

const translations = {
    en: {
        metaTitle: "Digital Pulse | AI & Automation Marketing Agency in Porto",
        metaDescription: "Digital Pulse is a digital growth agency in Porto, Portugal, specializing in AI marketing, business process automation, and performance strategies to scale your revenue.",
        metaKeywords: "digital agency porto, ai marketing, business automation, performance marketing, growth agency portugal, marketing automation, digital strategy, seo agency",
        navSolutions: "Services",
        navPhilosophy: "Our Approach",
        navTeam: "The Team",
        navCaseStudies: "Projects",
        navContact: "Contact",
        navAbout: "About Us",
        heroTitle: 'The <span class="text-accent">Global Agency</span> that Turns Data into Growth.',
        heroSubtitle: "We are Digital Pulse, a global performance marketing agency. We implement AI and automation strategies to give your business a real competitive edge in Portugal and beyond.",
        heroCTA: "Claim My Free Audit",
        philosophyTag: "Our Growth Approach",
        philosophyTitle: "We don't just sell services. We build growth partnerships.",
        philosophyDesc: "Our success is measured by your increased revenue. We focus on implementing performance marketing and automation that delivers a clear ROI, ensuring our collaboration is a profitable long-term investment.",
        solutionsTitle: "Digital Growth Services",
        sol1Title: "Performance Marketing & SEO",
        sol1Desc: "We attract and convert high-value customers with data-driven SEO and paid media campaigns on Meta & Google, focused on maximizing your ROI.",
        sol2Title: "AI & Business Automation",
        sol2Desc: "We optimize your operations with custom AI assistants and process automation (Make/N8N) to increase efficiency and reduce costs.",
        sol3Title: "Branding & Content Strategy",
        sol3Desc: "We build memorable brands that connect with their audience. Includes visual identity design and high-performance content marketing strategies.",
        caseStudiesTitle: "Proven Results, Not Promises.",
        case1Title: "Kultur Atelier, Hamburg",
        case1Desc: "Developed a cohesive graphic identity to boost the visibility of their cultural events, increasing community engagement through strategic branding.",
        case2Title: "Tasca do Infante, Porto",
        case2Desc: "A local performance marketing strategy that increased online bookings by 40% in 3 months through targeted social media ads.",
        aboutTitle: "We think outside the box. We act inside your goals.",
        aboutSubtitle: "Our story is one without borders. Born from the collaboration of digital experts across Argentina, from Paraná to Mendoza, our journey has taken us to develop projects in Hamburg and Dubai, and has led us to establish our European hub in Porto.",
        aboutPillar1Title: "Global Perspective, Local Execution",
        aboutPillar1Desc: "Our team across continents allows us to apply the best global strategies with a deep understanding of the local market.",
        aboutPillar2Title: "AI at the Core",
        aboutPillar2Desc: "We use AI and automation not as an add-on, but as the central engine to optimize every marketing process and decision.",
        teamTitle: "Meet Our Global Team",
        teamSubtitle: "Strategists, creators, and developers distributed across the world, united by a passion for delivering results.",
        jonRole: "AI Strategist | Porto",
        contactTitle: "Ready to scale your business?",
        contactSubtitle: 'Fill out the form with your website URL. In 48 hours, our team will send you a <strong class="text-accent">free, personalized Growth Potential Audit</strong> identifying the top 3 opportunities for your business using AI and automation.',
        contactNamePlaceholder: "Your Name",
        contactEmailPlaceholder: "Your Email",
        contactUrlPlaceholder: "Your Website URL",
        contactMessagePlaceholder: "Tell us about your biggest digital challenge...",
        contactButton: "Claim My Free Audit",
        footerCompany: "Company",
        footerSolutions: "Solutions",
        footerLegal: "Legal",
        footerContact: "Get in Touch",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms & Conditions",
        footerCookies: "Cookies Policy",
        sol1TitleFoot: "Performance & Growth",
        sol2TitleFoot: "Tech & Automation"
    },
    es: {
        metaTitle: "Digital Pulse | Agencia de Marketing con IA y Automatización en Porto",
        metaDescription: "Digital Pulse es una agencia de crecimiento digital en Porto, Portugal, especializada en marketing con IA, automatización de procesos de negocio y estrategias de performance para escalar tu facturación.",
        metaKeywords: "agencia digital porto, marketing con ia, automatización de negocios, marketing de performance, agencia de crecimiento portugal, automatización de marketing, estrategia digital, agencia seo",
        navSolutions: "Servicios",
        navPhilosophy: "Nuestro Enfoque",
        navTeam: "El Equipo",
        navCaseStudies: "Proyectos",
        navContact: "Contacto",
        navAbout: "Nosotros",
        heroTitle: 'La <span class="text-accent">Agencia Global</span> que Convierte Datos en Facturación.',
        heroSubtitle: "Somos Digital Pulse, una agencia global de marketing de performance. Implementamos estrategias de IA y automatización para dar a tu negocio una ventaja competitiva real en Portugal y más allá.",
        heroCTA: "Reclamar mi Auditoría Gratuita",
        philosophyTag: "Nuestro Enfoque de Crecimiento",
        philosophyTitle: "No solo entregamos servicios. Creamos alianzas enfocadas en la facturación.",
        philosophyDesc: "Nuestro éxito se mide por el aumento de tu facturación. Nos enfocamos en implementar marketing de performance y automatización que entrega un ROI claro, asegurando que nuestra colaboración sea una inversión rentable a largo plazo.",
        solutionsTitle: "Servicios de Crecimiento Digital",
        sol1Title: "Marketing de Performance y SEO",
        sol1Desc: "Atraemos y convertimos clientes de alto valor con estrategias SEO y de paid media basadas en datos en Meta y Google, enfocadas en maximizar tu ROI.",
        sol2Title: "IA y Automatización de Negocios",
        sol2Desc: "Optimizamos tus operaciones con asistentes de IA a medida y automatización de procesos (Make/N8N) para aumentar la eficiencia y reducir costes.",
        sol3Title: "Branding y Estrategia de Contenido",
        sol3Desc: "Construimos marcas memorables que conectan con su audiencia. Incluye diseño de identidad visual y estrategias de marketing de contenidos de alto rendimiento.",
        caseStudiesTitle: "Resultados Demostrados, No Promesas.",
        case1Title: "Kultur Atelier, Hamburgo",
        case1Desc: "Desarrollo de una identidad gráfica cohesiva para potenciar la visibilidad de sus eventos culturales, aumentando la participación de la comunidad a través de un branding estratégico.",
        case2Title: "Tasca do Infante, Porto",
        case2Desc: "Una estrategia local de marketing de performance que incrementó las reservas online en un 40% en 3 meses a través de anuncios segmentados en redes sociales.",
        aboutTitle: "Pensamos fuera de la caja. Actuamos dentro de tus objetivos.",
        aboutSubtitle: "Nuestra historia es una sin fronteras. Nacida de la colaboración de expertos digitales de distintas partes de Argentina, desde Paraná hasta Mendoza, nuestra trayectoria nos llevó a desarrollar proyectos en Hamburgo y Dubái, y nos ha llevado a establecer nuestro hub europeo en Porto.",
        aboutPillar1Title: "Perspectiva Global, Ejecución Local",
        aboutPillar1Desc: "Nuestro equipo a través de continentes nos permite aplicar las mejores estrategias globales con un profundo entendimiento del mercado local.",
        aboutPillar2Title: "Inteligencia Artificial en el Núcleo",
        aboutPillar2Desc: "Usamos la IA y la automatización no como un extra, sino como el motor central para optimizar cada proceso y decisión de marketing.",
        teamTitle: "Conoce a Nuestro Equipo Global",
        teamSubtitle: "Estrategas, creativos y desarrolladores distribuidos por el mundo, unidos por la pasión de entregar resultados.",
        jonRole: "Estratega IA | Porto",
        contactTitle: "¿Listo para escalar tu negocio?",
        contactSubtitle: 'Rellena el formulario con la URL de tu web. En 48 horas, nuestro equipo te enviará una <strong class="text-accent">Auditoría de Potencial de Crecimiento gratuita y personalizada</strong>, identificando las 3 principales oportunidades para tu negocio usando IA y automatización.',
        contactNamePlaceholder: "Tu Nombre",
        contactEmailPlaceholder: "Tu Email",
        contactUrlPlaceholder: "La URL de tu Web",
        contactMessagePlaceholder: "Cuéntanos sobre tu mayor desafío digital...",
        contactButton: "Reclamar mi Auditoría Gratuita",
        footerCompany: "Compañía",
        footerSolutions: "Soluciones",
        footerLegal: "Legal",
        footerContact: "Contacto",
        footerPrivacy: "Política de Privacidad",
        footerTerms: "Términos y Condiciones",
        footerCookies: "Política de Cookies",
        sol1TitleFoot: "Performance y Crecimiento",
        sol2TitleFoot: "Tecnología y Automatización"
    },
    pt: {
        metaTitle: "Digital Pulse | Agência de Marketing com IA e Automação no Porto",
        metaDescription: "A Digital Pulse é uma agência de crescimento digital no Porto, Portugal, especializada em marketing com IA, automação de processos de negócio e estratégias de performance para escalar a sua faturação.",
        metaKeywords: "agência digital porto, marketing com ia, automação de negócios, marketing de performance, agência de crescimento portugal, automação de marketing, estratégia digital, agência seo",
        navSolutions: "Serviços",
        navPhilosophy: "A Nossa Abordagem",
        navTeam: "A Equipa",
        navCaseStudies: "Projetos",
        navContact: "Contacto",
        navAbout: "Sobre Nós",
        heroTitle: 'A <span class="text-accent">Agência Global</span> que Transforma Dados em Faturação.',
        heroSubtitle: "Somos a Digital Pulse, uma agência global de marketing de performance. Implementamos estratégias de IA e automação para dar ao seu negócio uma vantagem competitiva real em Portugal e além.",
        heroCTA: "Reivindicar a Minha Auditoria Gratuita",
        philosophyTag: "A Nossa Abordagem de Crescimento",
        philosophyTitle: "Não entregamos apenas serviços. Construímos parcerias focadas na faturação.",
        philosophyDesc: "O nosso sucesso é medido pelo aumento da sua faturação. Focamo-nos em implementar marketing de performance e automação que entrega um ROI claro, garantindo que a nossa colaboração seja um investimento rentável a longo prazo.",
        solutionsTitle: "Serviços de Crescimento Digital",
        sol1Title: "Marketing de Performance e SEO",
        sol1Desc: "Atraímos e convertemos clientes de alto valor com estratégias de SEO e paid media baseadas em dados no Meta e Google, focadas em maximizar o seu ROI.",
        sol2Title: "IA e Automação de Negócios",
        sol2Desc: "Otimizamos as suas operações com assistentes de IA personalizados e automação de processos (Make/N8N) para aumentar a eficiência e reduzir custos.",
        sol3Title: "Branding e Estratégia de Conteúdo",
        sol3Desc: "Construímos marcas memoráveis que se conectam com o seu público. Inclui design de identidade visual e estratégias de marketing de conteúdo de alta performance.",
        caseStudiesTitle: "Resultados Comprovados, Não Promessas.",
        case1Title: "Kultur Atelier, Hamburgo",
        case1Desc: "Desenvolvimento de uma identidade gráfica coesa para impulsionar a visibilidade dos seus eventos culturais, aumentando o envolvimento da comunidade através de branding estratégico.",
        case2Title: "Tasca do Infante, Porto",
        case2Desc: "Uma estratégia local de marketing de performance que aumentou as reservas online em 40% em 3 meses através de anúncios segmentados nas redes sociais.",
        aboutTitle: "Pensamos fora da caixa. Atuamos dentro dos seus objetivos.",
        aboutSubtitle: "A nossa história não tem fronteiras. Nascida da colaboração de especialistas digitais de diferentes partes da Argentina, de Paraná a Mendoza, a nossa jornada levou-nos a desenvolver projetos em Hamburgo e no Dubai, e levou-nos a estabelecer o nosso centro europeu no Porto.",
        aboutPillar1Title: "Perspetiva Global, Execução Local",
        aboutPillar1Desc: "A nossa equipa espalhada por continentes permite-nos aplicar as melhores estratégias globais com um profundo conhecimento do mercado local.",
        aboutPillar2Title: "IA no Centro de Tudo",
        aboutPillar2Desc: "Usamos IA e automação não como um extra, mas como o motor central para otimizar cada processo e decisão de marketing.",
        teamTitle: "Conheça a Nossa Equipa Global",
        teamSubtitle: "Estrategas, criativos e developers distribuídos pelo mundo, unidos pela paixão por entregar resultados.",
        jonRole: "Estratega de IA | Porto",
        contactTitle: "Pronto para escalar o seu negócio?",
        contactSubtitle: 'Preencha o formulário com o URL do seu site. Em 48 horas, a nossa equipa irá enviar-lhe uma <strong class="text-accent">Auditoria de Potencial de Crescimento gratuita e personalizada</strong>, identificando as 3 principais oportunidades para o seu negócio usando IA e automação.',
        contactNamePlaceholder: "O seu Nome",
        contactEmailPlaceholder: "O seu Email",
        contactUrlPlaceholder: "O URL do seu Website",
        contactMessagePlaceholder: "Fale-nos sobre o seu maior desafio digital...",
        contactButton: "Reivindicar a Minha Auditoria Gratuita",
        footerCompany: "Empresa",
        footerSolutions: "Soluções",
        footerLegal: "Legal",
        footerContact: "Contacto",
        footerPrivacy: "Política de Privacidade",
        footerTerms: "Termos e Condições",
        footerCookies: "Política de Cookies",
        sol1TitleFoot: "Performance e Crescimento",
        sol2TitleFoot: "Tecnologia e Automação"
    }
};

function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update all language switcher buttons (both desktop and mobile)
    document.querySelectorAll('.language-btn').forEach(button => {
        button.classList.remove('active');
        const buttonLang = button.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (buttonLang === lang) {
            button.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setLanguage('en');
});