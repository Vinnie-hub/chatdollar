// ─── Service Worker Registration ───
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('SW registered:', registration.scope);
      }).catch(function(err) {
        console.log('SW registration failed:', err);
      });
    });
  }

  // ─── PWA Install Prompt ───
  let deferredPrompt;
  const installBtn = document.getElementById("installBtn");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "flex";
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Install result:", outcome);
    deferredPrompt = null;
    installBtn.style.display = "none";
  });

  window.addEventListener("appinstalled", () => {
    console.log("PWA installed");
    installBtn.style.display = "none";
    deferredPrompt = null;
  });

  // ─── Main App Logic ───
  (function() {
    // Profile pool (24 profiles)
    const allProfiles = [
      { name: "Margaret W.", age: 58, country: "🇺🇸 US", img: "https://randomuser.me/api/portraits/women/65.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Robert H.", age: 62, country: "🇬🇧 UK", img: "https://randomuser.me/api/portraits/men/62.jpg", status: "typing", statusText: "typing…" },
      { name: "Helga S.", age: 55, country: "🇩🇪 DE", img: "https://randomuser.me/api/portraits/women/55.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "James M.", age: 64, country: "🇨🇦 CA", img: "https://randomuser.me/api/portraits/men/64.jpg", status: "typing", statusText: "typing…" },
      { name: "Karen P.", age: 51, country: "🇦🇺 AU", img: "https://randomuser.me/api/portraits/women/51.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Lars E.", age: 60, country: "🇸🇪 SE", img: "https://randomuser.me/api/portraits/men/60.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Ingrid O.", age: 57, country: "🇳🇴 NO", img: "https://randomuser.me/api/portraits/women/57.jpg", status: "typing", statusText: "typing…" },
      { name: "Pierre D.", age: 63, country: "🇫🇷 FR", img: "https://randomuser.me/api/portraits/men/63.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Sofia R.", age: 54, country: "🇮🇹 IT", img: "https://randomuser.me/api/portraits/women/54.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Anouk V.", age: 56, country: "🇳🇱 NL", img: "https://randomuser.me/api/portraits/women/56.jpg", status: "typing", statusText: "typing…" },
      { name: "William T.", age: 67, country: "🇺🇸 US", img: "https://randomuser.me/api/portraits/men/67.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Diane K.", age: 59, country: "🇬🇧 UK", img: "https://randomuser.me/api/portraits/women/59.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Thomas B.", age: 61, country: "🇩🇰 DK", img: "https://randomuser.me/api/portraits/men/61.jpg", status: "typing", statusText: "typing…" },
      { name: "Maria G.", age: 53, country: "🇪🇸 ES", img: "https://randomuser.me/api/portraits/women/53.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Henrik L.", age: 66, country: "🇫🇮 FI", img: "https://randomuser.me/api/portraits/men/66.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Clara P.", age: 52, country: "🇧🇪 BE", img: "https://randomuser.me/api/portraits/women/52.jpg", status: "typing", statusText: "typing…" },
      { name: "George R.", age: 65, country: "🇮🇪 IE", img: "https://randomuser.me/api/portraits/men/65.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Elena M.", age: 50, country: "🇵🇹 PT", img: "https://randomuser.me/api/portraits/women/50.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Oliver S.", age: 68, country: "🇨🇭 CH", img: "https://randomuser.me/api/portraits/men/68.jpg", status: "typing", statusText: "typing…" },
      { name: "Anna K.", age: 56, country: "🇦🇹 AT", img: "https://randomuser.me/api/portraits/women/56.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Johan V.", age: 63, country: "🇳🇱 NL", img: "https://randomuser.me/api/portraits/men/63.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Lisa N.", age: 54, country: "🇳🇿 NZ", img: "https://randomuser.me/api/portraits/women/54.jpg", status: "typing", statusText: "typing…" },
      { name: "Peter J.", age: 69, country: "🇺🇸 US", img: "https://randomuser.me/api/portraits/men/69.jpg", status: "looking", statusText: "Looking to talk 💬" },
      { name: "Catherine D.", age: 57, country: "🇬🇧 UK", img: "https://randomuser.me/api/portraits/women/57.jpg", status: "looking", statusText: "Looking to talk 💬" }
    ];

    // Recent M-Pesa withdrawals (placeholder data - replace with MulaEarn feed)
    const tickerItems = [
      { name: "Kelvin O.", amt: "$38", method: "M-Pesa" },
      { name: "Amina H.", amt: "$52", method: "M-Pesa" },
      { name: "Brian M.", amt: "$27", method: "M-Pesa" },
      { name: "Faith W.", amt: "$64", method: "M-Pesa" },
      { name: "Dennis K.", amt: "$41", method: "M-Pesa" },
      { name: "Mercy A.", amt: "$35", method: "M-Pesa" }
    ];
    const toastData = tickerItems.map(t => [t.name, t.amt, t.method]);

    function shuffleArray(arr) {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    function renderProfiles() {
      const grid = document.getElementById('profilesGrid');
      if (!grid) return;
      const shuffled = shuffleArray(allProfiles);
      const display = shuffled.slice(0, 12);
      grid.innerHTML = display.map((p, i) => `
        <a href="https://mulaearn.com/register.php?ref=harzel" target="_blank" class="profile-card" style="animation-delay:${i * 0.04}s">
          <div class="pc-banner"></div>
          <div class="pc-body">
            <div class="pc-avatar-wrap">
              <img class="pc-avatar" src="${p.img}" alt="${p.name}" loading="lazy" />
              <div class="pc-dot"></div>
            </div>
            <div class="pc-info">
              <div class="pc-name">${p.name} <span class="pc-age">· ${p.age}</span></div>
              <div class="pc-meta"><span class="pc-flag-badge">${p.country}</span></div>
              <div class="pc-status ${p.status}">
                <span class="pc-sdot ${p.status}"></span>${p.statusText}
              </div>
            </div>
          </div>
          <div class="pc-actions">
            <span class="btn-start-chat">💬 Chat</span>
            <span class="btn-watch-chat">👁 Watch</span>
          </div>
        </a>
      `).join('');
    }

    renderProfiles();
    setInterval(renderProfiles, 7000);


    const tickerTrack = document.getElementById('tickerTrack');
    if (tickerTrack) {
      const doubled = [...tickerItems, ...tickerItems];
      tickerTrack.innerHTML = doubled.map(t => `
        <div class="t-item">
          <div class="t-check">
            <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
          </div>
          <strong>${t.name}</strong> withdrew <span class="t-amt">${t.amt}</span> · ${t.method}
        </div>
      `).join('');
    }

    // FAQ
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', function() {
        const item = this.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });

    // Toast notifications
    let toastIdx = 0;
    const toastWrap = document.getElementById('toastWrap');

    function showToast() {
      if (!toastWrap) return;
      const d = toastData[toastIdx++ % toastData.length];
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = `
        <div class="t-icon">
          <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
        </div>
        <div class="t-body">
          <div class="t-line"><strong>${d[0]}</strong> withdrew <span class="t-green">${d[1]}</span> · ${d[2]}</div>
        </div>
        <div class="t-ago">${Math.floor(Math.random() * 3) + 1}m ago</div>
      `;
      toastWrap.appendChild(el);
      while (toastWrap.children.length > 2) toastWrap.removeChild(toastWrap.firstChild);
      setTimeout(() => {
        el.classList.add('out');
        setTimeout(() => el.remove(), 300);
      }, 3500);
      setTimeout(showToast, 5000 + Math.random() * 3000);
    }

    setTimeout(showToast, 1500);
  })();