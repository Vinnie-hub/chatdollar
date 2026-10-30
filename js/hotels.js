(function () {
  "use strict";

  /* ============ SETTINGS ============ */
  const REGISTER_URL = "https://mulaearn.com/register.php?ref=harzel";
  const PAGE_SIZE = 6;
  const ROTATE_MS = 7000;

  /* ============ HOTELS ============
     pay = KSh earned per review of this hotel (keep these accurate). */
  const HOTELS = [
    { id: 1,  type: "dining", pay: 420, title: "Classic dining room",           name: "", location: "", blurb: "White-linen tables and warm lighting." },
    { id: 2,  type: "room", pay: 560,   title: "Sea-view bedroom suite",        name: "", location: "", blurb: "Plush bedding and a window onto the water." },
    { id: 3,  type: "city", pay: 550,   title: "High-rise city hotel",          name: "", location: "", blurb: "A glass-fronted tower, glowing at dusk." },
    { id: 4,  type: "resort", pay: 600, title: "Courtyard hotel with pool",     name: "", location: "", blurb: "Landscaped gardens and a lagoon-style pool." },
    { id: 5,  type: "room", pay: 500,   title: "Suite with vaulted ceiling",    name: "", location: "", blurb: "A spacious lounge under a chandelier." },
    { id: 6,  type: "resort", pay: 520, title: "Pool terrace at dusk",          name: "", location: "", blurb: "Terraced rooms wrapped around a glowing pool." },
    { id: 7,  type: "resort", pay: 480, title: "Beachfront resort",             name: "", location: "", blurb: "Sun loungers and palms on soft sand." },
    { id: 8,  type: "city", pay: 340,   title: "City hotel with resort pool",   name: "", location: "", blurb: "Modern rooms and a palm-lined pool deck." },
    { id: 9,  type: "dining", pay: 400, title: "Modern restaurant",             name: "", location: "", blurb: "A bright dining room with timber furniture." },
    { id: 10, type: "dining", pay: 300, title: "Rattan-lit lounge restaurant",  name: "", location: "", blurb: "Woven lighting over relaxed lounge seating." },
    { id: 11, type: "dining", pay: 300, title: "Timber lounge & dining",        name: "", location: "", blurb: "A warm, wood-toned dining space." },
    { id: 12, type: "dining", pay: 450, title: "Skyline-view restaurant",       name: "", location: "", blurb: "Large windows and a view over the city." },
    { id: 13, type: "dining", pay: 380, title: "Garden-style restaurant",       name: "", location: "", blurb: "Plants and natural textures throughout." },
    { id: 14, type: "resort", pay: 450, title: "Resort entrance & water feature", name: "", location: "", blurb: "A grand arrival with a cascading waterfall." },
    { id: 15, type: "resort", pay: 350, title: "Tropical pool deck",            name: "", location: "", blurb: "A thatched lounge, palms and ocean breezes." },
    { id: 16, type: "resort", pay: 320, title: "Beach resort from above",       name: "", location: "", blurb: "White sand and a calm lagoon." },
    { id: 17, type: "resort", pay: 400, title: "Palm-lined pool & balconies",   name: "", location: "", blurb: "Balconied rooms around a sunny pool." },
    { id: 18, type: "room", pay: 460,   title: "Spacious lounge suite",         name: "", location: "", blurb: "Ornate décor and a cosy sitting area." },
    { id: 19, type: "room", pay: 410,   title: "Twin guest room",               name: "", location: "", blurb: "A bright room with blue accents and a fruit welcome." },
    { id: 20, type: "resort", pay: 580, title: "Large resort with lagoon pools", name: "", location: "", blurb: "Pools and a lazy river across a big resort." }
  ];

  const TYPE_LABEL = { resort: "Resort & pool", city: "City hotel", room: "Rooms & suites", dining: "Dining" };

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ============ REFERRAL LINKS ============ */
  document.querySelectorAll("[data-register]").forEach((a) => (a.href = REGISTER_URL));

  /* ============ HOTEL GRID: 6 at a time, rotating ============ */
  const grid = document.getElementById("hotelGrid");
  const dots = document.getElementById("dots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const list = HOTELS.slice();
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  const pages = Math.ceil(list.length / PAGE_SIZE);
  let page = 0;
  let timer = null;

  dots.innerHTML = Array.from(
    { length: pages },
    (_, i) => `<button type="button" aria-label="Show selection ${i + 1} of ${pages}" aria-current="false"></button>`
  ).join("");

  /* wrap around so every selection shows a full 6 */
  const itemsFor = (p) => Array.from({ length: PAGE_SIZE }, (_, i) => list[(p * PAGE_SIZE + i) % list.length]);

  const card = (h, i) => {
    const heading = h.name || h.title;
    const alt = h.name ? `${h.name}${h.location ? ", " + h.location : ""}` : h.title;
    return `
      <article class="hotel-card" style="animation-delay:${i * 70}ms">
        <div class="hotel-media">
          <img src="/assets/hotels/hotel-${h.id}.webp" alt="${esc(alt)}" loading="${i < 3 ? "eager" : "lazy"}" decoding="async" width="640" height="440" />
          <span class="hotel-tag">${esc(TYPE_LABEL[h.type])}</span>
          <span class="hotel-pay"><small>Earn</small><b>KSh ${h.pay}</b><small>per review</small></span>
        </div>
        <div class="hotel-body">
          <h3>${esc(heading)}</h3>
          ${h.location ? `<div class="hotel-loc"><i class="fas fa-location-dot" aria-hidden="true"></i> ${esc(h.location)}</div>` : ""}
          <p>${esc(h.blurb)}</p>
          <a class="btn btn-success hotel-btn" href="${REGISTER_URL}" target="_blank" rel="sponsored noopener" aria-label="Review ${esc(heading)}">
            <i class="fas fa-pen" aria-hidden="true"></i> <span>Review<span class="hide-sm"> this hotel</span></span>
          </a>
        </div>
      </article>`;
  };

  function render() {
    grid.innerHTML = itemsFor(page).map(card).join("");
    [...dots.children].forEach((d, i) => d.setAttribute("aria-current", String(i === page)));
  }

  let swapTimer = null;
  let inView = true;
  function go(n) {
    page = ((n % pages) + pages) % pages;
    clearTimeout(swapTimer);
    if (reduceMotion) return render();
    grid.classList.add("out");
    swapTimer = setTimeout(() => { render(); grid.classList.remove("out"); }, 300);
  }

  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => { stop(); if (!reduceMotion && inView && !document.hidden) timer = setInterval(() => go(page + 1), ROTATE_MS); };

  dots.addEventListener("click", (e) => {
    const i = [...dots.children].indexOf(e.target.closest("button"));
    if (i > -1) { go(i); start(); }
  });
  grid.addEventListener("mouseenter", stop);
  grid.addEventListener("mouseleave", start);
  grid.addEventListener("focusin", stop);
  grid.addEventListener("focusout", start);
  grid.addEventListener("touchstart", stop, { passive: true });
  grid.addEventListener("touchend", () => setTimeout(start, 4000), { passive: true });
  document.addEventListener("visibilitychange", start);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; inView ? start() : stop(); }, { threshold: 0.15 }).observe(grid);
  }

  render();
  start();

  /* ============ FAQ ============ */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", function () {
      const item = this.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ============ FOOTER YEAR ============ */
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  /* ============ PWA INSTALL ============ */
  const installButtons = [document.getElementById("installBtn"), ...document.querySelectorAll(".js-install-btn")].filter(Boolean);
  const setInstallVisible = (show) => installButtons.forEach((b) => (b.hidden = !show));
  let deferredInstallPrompt = null;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  if (isStandalone) setInstallVisible(false);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!isStandalone) setInstallVisible(true);
  });

  installButtons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      setInstallVisible(false);
    })
  );

  window.addEventListener("appinstalled", () => setInstallVisible(false));

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
})();
