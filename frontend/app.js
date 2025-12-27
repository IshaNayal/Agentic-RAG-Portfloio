// REGISTER PLUGIN
gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------
1. SMOOTH ANCHOR SCROLL (Header Offset)
-------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    const headerHeight = 90;
    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      headerHeight;

    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

/* -------------------------------------------------
2. HERO LOAD ANIMATION
-------------------------------------------------- */
const heroTL = gsap.timeline();

heroTL
  .from(".hero-title", {
    y: 120,
    opacity: 0,
    skewY: 3,
    duration: 1.5,
    ease: "power4.out"
  })
  .from(".hero-subtitle", {
    y: 30,
    opacity: 0,
    duration: 1
  }, "-=1")
  .from(".shape-item", {
    y: 300,
    scale: 0.5,
    duration: 1.2,
    stagger: 0.08,
    ease: "back.out(1.5)"
  }, "-=1.2");

/* -------------------------------------------------
3. OVERLAP CARD REVEAL
-------------------------------------------------- */
gsap.utils.toArray(".overlap-card").forEach(card => {
  gsap.from(card, {
    y: 100,
    opacity: 0,
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      end: "top 20%",
      scrub: 1
    }
  });
});

/* -------------------------------------------------
4. PROJECTS HORIZONTAL SCROLL
-------------------------------------------------- */
const wrapper = document.querySelector(".projects-section-wrapper");
const track = document.querySelector(".projects-horizontal-track");

if (wrapper && track) {
  const getScrollAmount = () =>
    -(track.scrollWidth - window.innerWidth);

  const scrollTween = gsap.to(track, {
    x: getScrollAmount,
    ease: "none"
  });

  ScrollTrigger.create({
    trigger: wrapper,
    start: "top top",
    end: () => `+=${track.scrollWidth}`,
    pin: true,
    scrub: 1,
    animation: scrollTween,
    invalidateOnRefresh: true,
    anticipatePin: 1
  });
}

/* -------------------------------------------------
5. MARQUEE PAUSE ON HOVER
-------------------------------------------------- */
document.querySelectorAll(".marquee-container").forEach(container => {
  const content = container.querySelector(".marquee-content");
  if (!content) return;

  container.addEventListener("mouseenter", () => {
    content.style.animationPlayState = "paused";
  });

  container.addEventListener("mouseleave", () => {
    content.style.animationPlayState = "running";
  });
});

/* -------------------------------------------------
6. SHAPE HOVER INTERACTION
-------------------------------------------------- */
document.querySelectorAll(".shape-item").forEach(item => {
  item.addEventListener("mouseenter", () => {
    gsap.to(item, {
      scale: 1.02,
      y: -20,
      duration: 0.4,
      ease: "back.out(1.7)"
    });
  });

  item.addEventListener("mouseleave", () => {
    gsap.to(item, {
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  });
});

/* -------------------------------------------------
7. NAV BUTTON COLOR CHANGE
-------------------------------------------------- */
ScrollTrigger.create({
  trigger: "#about",
  start: "top 80%",
  end: "bottom 20%",
  onToggle: self => {
    document.querySelectorAll(".pill-btn").forEach(btn => {
      btn.classList.toggle("btn-cream", self.isActive);
    });
  }
});

/* -------------------------------------------------
8. CTA BUTTON HOVER
-------------------------------------------------- */
document.querySelectorAll(".cta-btn-main, .cta-btn-arrow").forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, { scale: 1.02, duration: 0.2 });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { scale: 1, duration: 0.2 });
  });
});

/* -------------------------------------------------
9. HEADER VISIBILITY (HERO ONLY)
-------------------------------------------------- */
const header = document.querySelector("header");
const hero = document.querySelector(".hero-wrapper");

if (header && hero) {
  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom top",
    onToggle: self => {
      gsap.to(header, {
        y: self.isActive ? 0 : -120,
        opacity: self.isActive ? 1 : 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  });
}

/* -------------------------------------------------
10. REFRESH ON RESIZE
-------------------------------------------------- */
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

 gsap.to("#flower1", {
    rotation: 360,
    svgOrigin: "100 100",   // SVG viewBox ka center (x=100,y=100)
    duration: 4,
    repeat: -1,
    ease: "linear"
  });
