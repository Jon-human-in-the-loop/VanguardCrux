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
   UI EFFECTS
   ========================================================= */

function initRippleEffects() {
    document.querySelectorAll('.btn-primary, button').forEach(btn => {
        btn.addEventListener('click', e => {
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            ripple.className = 'ripple-effect';

            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
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
        navPhilosophy: "Our Approach",
        navTeam: "The Team",
        navCaseStudies: "Projects",
        navContact: "Contact",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms & Conditions",
        footerCookies: "Cookies Policy"
    },
    es: {
        navSolutions: "Servicios",
        navPhilosophy: "Nuestro Enfoque",
        navTeam: "El Equipo",
        navCaseStudies: "Proyectos",
        navContact: "Contacto",
        footerPrivacy: "Política de Privacidad",
        footerTerms: "Términos y Condiciones",
        footerCookies: "Política de Cookies"
    },
    pt: {
        navSolutions: "Serviços",
        navPhilosophy: "A Nossa Abordagem",
        navTeam: "A Equipa",
        navCaseStudies: "Projetos",
        navContact: "Contacto",
        footerPrivacy: "Política de Privacidade",
        footerTerms: "Termos e Condições",
        footerCookies: "Política de Cookies"
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

    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (translations[lang]?.[key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
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

    const detectedLang = detectBrowserLanguage();

    // Espera a que TODO el DOM esté realmente pintado
    requestAnimationFrame(() => {
        setLanguage(detectedLang);
        console.log('Language applied to full DOM:', detectedLang);
    });
});
