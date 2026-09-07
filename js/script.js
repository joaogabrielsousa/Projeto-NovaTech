/**
 * NovaTech — Main JavaScript
 * Projeto: Projeto-NovaTech
 *
 * Responsabilidades:
 * - Header e navegação
 * - Menu mobile
 * - Smooth scroll
 * - Navegação ativa
 * - Animações de entrada
 * - Contadores de estatísticas
 * - Slider de depoimentos
 * - Interação visual da interface de IA
 * - Back to top
 * - Acessibilidade e reduced motion
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       01. ELEMENTOS DO DOM
    ========================================================= */

    const header = document.querySelector("#header");
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector("#mobile-menu");

    const desktopNavLinks = document.querySelectorAll(".nav__link");
    const mobileNavLinks = document.querySelectorAll(
        ".mobile-menu__link, .mobile-menu__cta"
    );

    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll("main section[id]");

    const statValues = document.querySelectorAll(".stat-card__value");

    const testimonialSlider = document.querySelector(
        "[data-testimonials-slider]"
    );
    const testimonialCards = document.querySelectorAll("[data-testimonial]");
    const testimonialPrev = document.querySelector(
        "[data-testimonial-prev]"
    );
    const testimonialNext = document.querySelector(
        "[data-testimonial-next]"
    );

    const aiSendButton = document.querySelector(".ai-interface__send");
    const aiInputArea = document.querySelector(".ai-interface__input");

    /* =========================================================
       02. CONFIGURAÇÕES
    ========================================================= */

    const MOBILE_BREAKPOINT = 768;
    const HEADER_SCROLL_THRESHOLD = 50;
    const BACK_TO_TOP_THRESHOLD = 500;
    const COUNTER_DURATION = 1800;
    const TESTIMONIAL_INTERVAL = 5000;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =========================================================
       03. ESTADO
    ========================================================= */

    let currentTestimonial = 0;
    let testimonialTimer = null;

    /* =========================================================
       04. HEADER / SCROLL
    ========================================================= */

    function handleScroll() {
        const scrollY = window.scrollY;

        if (header) {
            header.classList.toggle(
                "is-scrolled",
                scrollY > HEADER_SCROLL_THRESHOLD
            );
        }
    }

    /* =========================================================
       05. MENU MOBILE
    ========================================================= */

    function openMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        mobileMenu.classList.add("is-open");
        menuToggle.classList.add("is-active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu");

        document.body.classList.add("menu-open");
    }

    function closeMobileMenu() {
        if (!menuToggle || !mobileMenu) return;

        mobileMenu.classList.remove("is-open");
        menuToggle.classList.remove("is-active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");

        document.body.classList.remove("menu-open");
    }

    function toggleMobileMenu() {
        if (!mobileMenu) return;

        const isOpen = mobileMenu.classList.contains("is-open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMobileMenu);
    }

    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* =========================================================
       06. FECHAR MENU COM ESC / CLIQUE EXTERNO
    ========================================================= */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!mobileMenu || !menuToggle) return;
        if (!mobileMenu.classList.contains("is-open")) return;

        const clickedInsideMenu = mobileMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    /* =========================================================
       07. SMOOTH SCROLL
    ========================================================= */

    allAnchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });

            closeMobileMenu();
        });
    });

    /* =========================================================
       08. NAVEGAÇÃO ATIVA
    ========================================================= */

    function setupActiveNavigation() {
        if (!sections.length || !desktopNavLinks.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    desktopNavLinks.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${currentId}`;

                        link.classList.toggle("active", isActive);
                    });
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }

    /* =========================================================
       09. ANIMAÇÕES DE ENTRADA
    ========================================================= */

    function setupRevealAnimations() {
        if (prefersReducedMotion) return;

        const revealElements = document.querySelectorAll(
            [
                ".section-header",
                ".feature-card",
                ".features__footer",
                ".about__image-wrapper",
                ".about__content",
                ".ai-showcase__wrapper",
                ".ai-showcase__technologies",
                ".stat-card",
                ".statistics__highlight",
                ".testimonial-card",
                ".final-cta__wrapper"
            ].join(", ")
        );

        if (!revealElements.length) return;

        revealElements.forEach((element) => {
            element.classList.add("reveal");
        });

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("is-visible");
                    observerInstance.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }

    /* =========================================================
       10. CONTADORES DE ESTATÍSTICAS
    ========================================================= */

    function animateCounter(element) {
        const target = Number(element.dataset.target);
        const suffix = element.dataset.suffix || "";

        if (Number.isNaN(target)) return;

        if (prefersReducedMotion) {
            element.textContent = `${target}${suffix}`;
            return;
        }

        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(
                elapsed / COUNTER_DURATION,
                1
            );

            // Ease-out cúbico
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(
                easedProgress * target
            );

            element.textContent =
                `${currentValue}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent =
                    `${target}${suffix}`;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function setupCounters() {
        if (!statValues.length) return;

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);
                    observerInstance.unobserve(entry.target);
                });
            },
            {
                threshold: 0.5
            }
        );

        statValues.forEach((stat) => {
            observer.observe(stat);
        });
    }

    /* =========================================================
       11. SLIDER DE DEPOIMENTOS
    ========================================================= */

    function updateTestimonial(index) {
        if (!testimonialCards.length) return;

        const total = testimonialCards.length;

        currentTestimonial =
            (index + total) % total;

        testimonialCards.forEach((card, cardIndex) => {
            const isActive =
                cardIndex === currentTestimonial;

            card.classList.toggle(
                "is-active",
                isActive
            );

            card.setAttribute(
                "aria-hidden",
                isActive ? "false" : "true"
            );
        });
    }

    function showNextTestimonial() {
        updateTestimonial(currentTestimonial + 1);
    }

    function showPreviousTestimonial() {
        updateTestimonial(currentTestimonial - 1);
    }

    function stopTestimonialAutoplay() {
        if (testimonialTimer) {
            clearInterval(testimonialTimer);
            testimonialTimer = null;
        }
    }

    function startTestimonialAutoplay() {
        if (
            prefersReducedMotion ||
            testimonialCards.length <= 1
        ) {
            return;
        }

        stopTestimonialAutoplay();

        testimonialTimer = setInterval(
            showNextTestimonial,
            TESTIMONIAL_INTERVAL
        );
    }

    if (testimonialNext) {
        testimonialNext.addEventListener("click", () => {
            showNextTestimonial();
            startTestimonialAutoplay();
        });
    }

    if (testimonialPrev) {
        testimonialPrev.addEventListener("click", () => {
            showPreviousTestimonial();
            startTestimonialAutoplay();
        });
    }

    if (testimonialSlider) {
        testimonialSlider.addEventListener(
            "mouseenter",
            stopTestimonialAutoplay
        );

        testimonialSlider.addEventListener(
            "mouseleave",
            startTestimonialAutoplay
        );

        testimonialSlider.addEventListener(
            "focusin",
            stopTestimonialAutoplay
        );

        testimonialSlider.addEventListener(
            "focusout",
            (event) => {
                if (
                    !testimonialSlider.contains(
                        event.relatedTarget
                    )
                ) {
                    startTestimonialAutoplay();
                }
            }
        );
    }

    /* =========================================================
       12. INTERAÇÃO DA INTERFACE DE IA
    ========================================================= */

    if (aiSendButton) {
        aiSendButton.addEventListener("click", () => {
            if (!aiInputArea) return;

            aiInputArea.classList.add("is-active");

            window.setTimeout(() => {
                aiInputArea.classList.remove("is-active");
            }, 500);
        });
    }

    /* =========================================================
       13. BACK TO TOP
    ========================================================= */

    function setupBackToTop() {
        const backToTop = document.querySelector(
            ".footer__back-top"
        );

        if (!backToTop) return;

        function updateBackToTop() {
            backToTop.classList.toggle(
                "is-visible",
                window.scrollY > BACK_TO_TOP_THRESHOLD
            );
        }

        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );

        updateBackToTop();
    }

    /* =========================================================
       14. RESPONSIVIDADE
    ========================================================= */

    function handleResize() {
        if (
            window.innerWidth > MOBILE_BREAKPOINT
        ) {
            closeMobileMenu();
        }
    }

    window.addEventListener(
        "resize",
        handleResize,
        { passive: true }
    );

    /* =========================================================
       15. INICIALIZAÇÃO
    ========================================================= */

    handleScroll();

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    setupActiveNavigation();
    setupRevealAnimations();
    setupCounters();
    setupBackToTop();

    updateTestimonial(0);
    startTestimonialAutoplay();
});
