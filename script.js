/* =========================================================
   PORTFOLIO — Benedicte Mawunyo WOMAGNO
   Interactions JavaScript
   Thème : violet sombre & rose (aucune logique dépendante du thème)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Utilitaires ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Menu mobile ---------- */
  const navToggle = $("#nav-toggle");
  const primaryNav = $("#primary-nav");

  function closeMenu() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
    primaryNav.classList.remove("is-open");
  }

  function openMenu() {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Fermer le menu");
    primaryNav.classList.add("is-open");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    // Fermer le menu au clic sur un lien
    $$(".nav-link", primaryNav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Fermer avec Échap
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Fermer au clic extérieur
    document.addEventListener("click", (e) => {
      if (!primaryNav.classList.contains("is-open")) return;
      if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Réinitialiser si on revient sur grand écran
    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  /* ---------- En-tête au défilement ---------- */
  const header = $("#site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Lien actif dans la navigation ---------- */
  const sections = $$("main section[id]");
  const navLinks = $$(".nav-link");

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    let currentId = sections.length ? sections[0].id : null;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const isActive = href === `#${currentId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  if (sections.length && navLinks.length) {
    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
  }

  /* ---------- Défilement fluide (compensation du header sticky) ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#" || targetId.length < 2) return;

      const target = document.getElementById(targetId.slice(1));
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top,
        behavior: prefersReduced ? "auto" : "smooth"
      });

      // Focus sur la cible pour l'accessibilité
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- Détails des projets (accordéons) ---------- */
  $$(".js-project-toggle").forEach((btn) => {
    const controlsId = btn.getAttribute("aria-controls");
    if (!controlsId) return;
    const panel = document.getElementById(controlsId);
    if (!panel) return;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      btn.textContent = expanded ? "En savoir plus" : "Réduire";
      panel.hidden = expanded;
    });
  });

  /* ---------- Année du copyright ---------- */
  const yearEl = $("#current-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Masquage des contacts non renseignés ---------- */
  const contactList = $("#contact-list");
  if (contactList) {
    $$(".contact-item", contactList).forEach((item) => {
      const link = item.querySelector(".contact-value");
      if (!link) return;

      const href = (link.getAttribute("href") || "").trim();
      const text = (link.textContent || "").trim();

      const isPlaceholder =
        !href ||
        !text ||
        /\[.*\]/.test(href) ||
        /\[.*\]/.test(text) ||
        /^(mailto|tel):$/i.test(href);

      if (isPlaceholder) item.classList.add("is-empty");
    });

    // Masquer le bouton mailto principal si l'email n'est pas renseigné
    const mailBtn = $("#contact-mail-btn");
    if (mailBtn) {
      const href = (mailBtn.getAttribute("href") || "").trim();
      const text = (mailBtn.textContent || "").trim();
      if (!href || /\[.*\]/.test(href) || /\[.*\]/.test(text)) {
        mailBtn.classList.add("is-empty");
        mailBtn.style.display = "none";
      }
    }
  }

  /* ---------- Apparition au défilement ---------- */
  const revealTargets = [
    ...$$(".section-header"),
    ...$$(".project-card"),
    ...$$(".skill-card"),
    ...$$(".award-card"),
    ...$$(".about-content p"),
    ...$$(".contact-item"),
  ];

  if (revealTargets.length && !prefersReduced && "IntersectionObserver" in window) {
    revealTargets.forEach((el) => el.classList.add("reveal-on-scroll"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }
})();