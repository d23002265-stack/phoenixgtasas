document.addEventListener("DOMContentLoaded", () => {
  // Loader
  const loader = document.getElementById("loader")
  const progress = document.querySelector(".loader-progress")

  // Simulate loading
  if (loader && progress) {
    setTimeout(() => {
      // 1. Швидко завантажуємо до 80%
      progress.style.width = "80%"
      
      setTimeout(() => {
        // 2. На 80% ВЖЕ запускаємо анімацію сторінки (під лоадером)
        document.body.classList.add("loaded")
        
        // 3. Доводимо смужку до 100% і прибираємо лоадер
        progress.style.width = "100%"
        setTimeout(() => {
          loader.style.opacity = "0"
          loader.style.visibility = "hidden"
        }, 400) // Коротка затримка перед зникненням
      }, 600) // Час на "завантаження" до 80%
    }, 200) // Початкова затримка
  }

  // Scroll Animations (Reveal)
  const revealElements = document.querySelectorAll(".reveal")

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight
    const elementVisible = 100

    revealElements.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add("active")
      } else {
        // Optional: remove class if you want animation to re-trigger on scroll up
        // reveal.classList.remove("active");
      }
    })
  }

  window.addEventListener("scroll", revealOnScroll)
  revealOnScroll() // Trigger once on load

  // Navbar Scroll Effect
  const nav = document.querySelector("nav")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled")
    } else {
      nav.classList.remove("scrolled")
    }
  })

  // Number Counter Animation
  const stats = document.querySelectorAll(".stat-number")
  let hasAnimatedStats = false

  const animateStats = () => {
    const triggerBottom = (window.innerHeight / 5) * 4
    const statsSection = document.querySelector(".stats-container")

    if (!statsSection) return

    const sectionTop = statsSection.getBoundingClientRect().top

    if (sectionTop < triggerBottom && !hasAnimatedStats) {
      stats.forEach((stat) => {
        // Ігноруємо елементи без data-target (наприклад, блок онлайну), щоб не збивати їх значення
        if (!stat.hasAttribute("data-target")) return

        const target = +stat.getAttribute("data-target")
        // Якщо ціль 0, інкремент теж 0, інакше розраховуємо
        const increment = target > 0 ? target / 100 : 1;

        const updateCount = () => {
          const count = +stat.innerText
          if (count < target) {
            stat.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 20);
          } else if (stat.getAttribute('data-target') === "21") {
            // Додаємо "+" тільки для унікальних робіт
            stat.innerText = target + "+";
          } else {
            // Для інших лічильників (онлайн) просто встановлюємо фінальне значення
            stat.innerText = target;
          }
        }
        updateCount()
      })
      hasAnimatedStats = true
    }
  }

  window.addEventListener("scroll", animateStats)

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      // Найнадійніша перевірка: якщо посилання не веде на конкретний ID, нічого не робимо.
      if (href === "#" || href.length <= 1) {
        e.preventDefault(); // Просто зупиняємо дію посилання за замовчуванням
        return; // І виходимо з функції
      }

      e.preventDefault();
      if (document.querySelector(href)) {
        document.querySelector(href).scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Unavailable Popup Logic
  const popup = document.getElementById("unavailable-popup")
  if (popup) {
    const openPopupButtons = document.querySelectorAll(
      ".js-show-unavailable-popup"
    )
    const closePopupButton = document.getElementById("close-popup-btn")

    const showPopup = (e) => {
      e.preventDefault()
      popup.classList.add("visible")
    }

    const hidePopup = () => {
      popup.classList.remove("visible")
    }

    openPopupButtons.forEach((button) =>
      button.addEventListener("click", showPopup)
    )
    closePopupButton.addEventListener("click", hidePopup)
    popup.addEventListener("click", (e) => {
      if (e.target === popup) hidePopup()
    })
  }

document.addEventListener("DOMContentLoaded", () => {
  const onlineCard = document.getElementById("server-online-card");
  const heroOnlineCount = document.getElementById("hero-online-count");

  const onlineValue = onlineCard?.querySelector(".server-online-value");
  const onlineBar = onlineCard?.querySelector(".online-progress-fill");

  const apiUrl = "https://aventis-online.pp.ua/api/data_1.json";

  async function loadOnline() {
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // 🔥 Універсальність (під різні API)
      const players = data.count ?? data.players ?? 0;
      const maxPlayers = data.maxCount ?? data.maxPlayers ?? 100;

      if (typeof players === "number") {
        // текст типу 1/90
        if (onlineValue) {
          onlineValue.innerText = `${players}/${maxPlayers}`;
        }

        // тільки число
        if (heroOnlineCount) {
          heroOnlineCount.innerText = players;
        }

        // прогрес-бар
        if (onlineBar) {
          const percent = Math.min(100, Math.max(0, (players / maxPlayers) * 100));
          onlineBar.style.width = percent + "%";
        }

      } else {
        setOffline();
      }

    } catch (error) {
      console.error("Online error:", error);
      setError();
    }
  }

  function setOffline() {
    if (onlineValue) onlineValue.innerText = "Офлайн";
    if (heroOnlineCount) heroOnlineCount.innerText = "Офлайн";
    if (onlineBar) onlineBar.style.width = "0%";
  }

  function setError() {
    if (onlineValue) onlineValue.innerText = "Помилка";
    if (heroOnlineCount) heroOnlineCount.innerText = "Помилка";
    if (onlineBar) onlineBar.style.width = "0%";
  }

  loadOnline();
  setInterval(loadOnline, 30000);
});

  // Cookie Consent Logic
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
  const rejectCookiesBtn = document.getElementById('reject-cookies-btn');
  const cookieStorageKey = 'volya_cookie_consent_v3';
  const cookieExpirationDays = 30;

  if (cookieBanner && acceptCookiesBtn && rejectCookiesBtn) {
      const storedConsent = localStorage.getItem(cookieStorageKey);
      let shouldShowBanner = true;

      if (storedConsent) {
          try {
              const { timestamp } = JSON.parse(storedConsent);
              const now = new Date().getTime();
              const daysPassed = (now - timestamp) / (1000 * 60 * 60 * 24);

              if (daysPassed < cookieExpirationDays) {
                  shouldShowBanner = false;
              }
          } catch (e) {
              // Якщо дані пошкоджені, показуємо банер знову
              shouldShowBanner = true;
          }
      }

      if (shouldShowBanner) {
          console.log('Cookie banner initializing...');
          setTimeout(() => {
              cookieBanner.classList.add('visible');
              console.log('Cookie banner shown');
          }, 500); // Невелика затримка для кращого UX
      }

      acceptCookiesBtn.addEventListener('click', () => {
          const consentData = {
              status: 'accepted',
              timestamp: new Date().getTime()
          };
          localStorage.setItem(cookieStorageKey, JSON.stringify(consentData));
          cookieBanner.classList.remove('visible');
      });

      rejectCookiesBtn.addEventListener('click', () => {
          const consentData = {
              status: 'rejected',
              timestamp: new Date().getTime()
          };
          localStorage.setItem(cookieStorageKey, JSON.stringify(consentData));
          cookieBanner.classList.remove('visible');
      });
  } else {
      console.log('Cookie banner elements not found on this page');
  }
  
  
})
document.addEventListener('DOMContentLoaded', () => {
    const mainImg = document.getElementById('aventis-main');
    const thumbs = document.querySelectorAll('#aventis-promo-wrapper .t-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;

    // Функція оновлення галереї
    function updateGallery(index) {
        // Оновлюємо поточний індекс
        currentIndex = index;

        // Беремо посилання з клікнутої мініатюри
        const newSrc = thumbs[currentIndex].getAttribute('src');

        // Ефект плавного переходу
        mainImg.style.opacity = '0.3';
        
        setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
        }, 150);

        // Оновлюємо активний клас на мініатюрах
        thumbs.forEach(t => t.classList.remove('active'));
        thumbs[currentIndex].classList.add('active');
    }

    // Клік по кнопці "Вперед"
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let nextIndex = (currentIndex + 1) % thumbs.length;
        updateGallery(nextIndex);
    });

    // Клік по кнопці "Назад"
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let prevIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
        updateGallery(prevIndex);
    });

    // Клік по самій мініатюрі
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateGallery(index);
        });
    });
});

