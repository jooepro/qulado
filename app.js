(() => {
  "use strict";
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: CONFIG.currency, maximumFractionDigits: 0 });
  const placeholderUrl = /REPLACE-WITH-AFTERNIC-LISTING-URL/i;
  const form = document.querySelector(".offer-form");
  const status = form?.querySelector(".form-status");
  const amountField = form?.querySelector('[name="amount"]');
  const setText = (selector, value) => document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });

 setText("[data-domain]", CONFIG.domain);
setText(
  "[data-price]",
  `${money.format(CONFIG.price)} ${CONFIG.currency}`
);
setText("[data-availability]", CONFIG.availability);

const animateInsight = (element, value, delay = 0) => {
  const match = String(value).match(/^(\d+)(.*)$/);

  if (!match) {
    element.textContent = value;
    return;
  }

  const target = Number(match[1]);
  const suffix = match[2];
  const duration = 1500;
  const startTime = performance.now() + delay;

  const update = (time) => {
    if (time < startTime) {
      requestAnimationFrame(update);
      return;
    }

    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  element.textContent = `0${suffix}`;
  requestAnimationFrame(update);
};

const insightObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const numbers = entry.target.querySelectorAll("[data-insight]");

      if (entry.isIntersecting) {
        numbers.forEach((element, index) => {
          const value = CONFIG.insights[element.dataset.insight];
          animateInsight(element, value, index * 120);
        });
      } else {
        numbers.forEach((element) => {
          const value = CONFIG.insights[element.dataset.insight];
          const match = String(value).match(/^(\d+)(.*)$/);

          element.textContent = match ? `0${match[2]}` : value;
        });
      }
    });
  },
  {
    threshold: 0.3
  }
);

document.querySelectorAll(".insight-card").forEach((card) => {
  insightObserver.observe(card);
});
  document.querySelectorAll("[data-email]").forEach((el) => { el.textContent = CONFIG.contactEmail; el.href = `mailto:${CONFIG.contactEmail}`; });
  document.title = `${CONFIG.domain} — A Name Ready for Its Next Big Idea`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", `${CONFIG.domain} is a distinctive, versatile .com domain available for its next big idea.`);

  const isValidCheckoutUrl = (value) => {
    try { const url = new URL(value); return url.protocol === "https:" && !placeholderUrl.test(value); } catch { return false; }
  };
  const scrollToOffer = (message) => {
    document.querySelector("#offer")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => amountField?.focus(), 450);
      if (status) { status.textContent = message; status.className = "form-status form-status-notice"; }
    };
    document.querySelectorAll("a.button-primary").forEach((link) => {
      if (!link.textContent.includes("Buy Now")) return;
      link.href = isValidCheckoutUrl(CONFIG.afternicUrl) ? CONFIG.afternicUrl : "#offer";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.addEventListener("click", (event) => {
        if (!isValidCheckoutUrl(CONFIG.afternicUrl)) { event.preventDefault(); scrollToOffer("The Afternic listing is not live yet. Please send an inquiry or offer below."); }
      });
    });
   const animateInsight = (element, value, delay = 0) => {
  const match = String(value).match(/^(\d+)(.*)$/);

  if (!match) {
    element.textContent = value;
    return;
  }

  const target = Number(match[1]);
  const suffix = match[2];
  const duration = 1500;
  const startTime = performance.now() + delay;

  const update = (time) => {
    if (time < startTime) {
      requestAnimationFrame(update);
      return;
    }

    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  element.textContent = `0${suffix}`;
  requestAnimationFrame(update);
};

const insightObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const numbers = entry.target.querySelectorAll("[data-insight]");

      if (entry.isIntersecting) {
        numbers.forEach((element, index) => {
          const value = CONFIG.insights[element.dataset.insight];
          animateInsight(element, value, index * 120);
        });
      } else {
        numbers.forEach((element) => {
          const value = CONFIG.insights[element.dataset.insight];
          const match = String(value).match(/^(\d+)(.*)$/);

          element.textContent = match ? `0${match[2]}` : value;
        });
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".insight-card").forEach((card) => {
  insightObserver.observe(card);
});});

  const dialog = document.querySelector(".privacy-dialog"); const privacyHeading = dialog?.querySelector("h2");
  if (dialog && privacyHeading) { privacyHeading.id = "privacy-title"; dialog.setAttribute("aria-labelledby", "privacy-title"); dialog.setAttribute("aria-modal", "true"); }
  document.querySelector(".privacy-link")?.addEventListener("click", () => dialog?.showModal());
  document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  const conceptObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
  entry.target.classList.add("is-visible");
} else {
  entry.target.classList.remove("is-visible");
}
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll(".concept").forEach((card) => {
  conceptObserver.observe(card);
});
})();
