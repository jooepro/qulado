(() => {
  "use strict";
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: CONFIG.currency, maximumFractionDigits: 0 });
  const placeholderUrl = /REPLACE-WITH-AFTERNIC-LISTING-URL/i;
  const form = document.querySelector(".offer-form");
  const status = form?.querySelector(".form-status");
  const amountField = form?.querySelector('[name="amount"]');
  const setText = (selector, value) => document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });

  setText("[data-domain]", CONFIG.domain);
  setText("[data-price]", `${money.format(CONFIG.price)} ${CONFIG.currency}`);
  setText("[data-availability]", CONFIG.availability);
  document.querySelectorAll("[data-insight]").forEach((el, index) => {
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
  document.querySelectorAll('a[href="#offer"]').forEach((link) => {
    if (link.textContent.includes("Buy Now")) return;
    link.addEventListener("click", () => window.setTimeout(() => amountField?.focus(), 450));
  });

  const getValues = () => Object.fromEntries(new FormData(form).entries());
  const validate = (values) => {
    const errors = [];
    if (!values.name.trim()) errors.push("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.push("Please enter a valid email address.");
    if (values.amount && (!Number.isFinite(Number(values.amount)) || Number(values.amount) < 0)) errors.push("Offer amount must be a valid positive number.");
    if (values.message.length > 2000) errors.push("Message must be 2,000 characters or fewer.");
    return errors;
  };
  const buildMessage = (values) => [
    `Hello, I’m interested in ${CONFIG.domain}.`, "", `Name: ${values.name}`, `Email: ${values.email}`,
    values.company ? `Company: ${values.company}` : "", values.amount ? `Offer amount: ${values.amount} ${CONFIG.currency}` : "", "",
    values.message || "I would like to discuss the domain."
  ].filter(Boolean).join("\n");

  const showFallback = (values, note) => {
    document.querySelector(".message-fallback")?.remove();
    const wrapper = document.createElement("div"); wrapper.className = "message-fallback";
    const heading = document.createElement("p"); heading.className = "fallback-heading"; heading.textContent = note;
    const textarea = document.createElement("textarea"); textarea.className = "generated-message"; textarea.readOnly = true; textarea.rows = 9; textarea.value = buildMessage(values);
    const actions = document.createElement("div"); actions.className = "fallback-actions";
    const email = document.createElement("a"); email.className = "button button-secondary"; email.href = `mailto:${encodeURIComponent(CONFIG.contactEmail)}?subject=${encodeURIComponent(`Inquiry about ${CONFIG.domain}`)}&body=${encodeURIComponent(textarea.value)}`; email.textContent = "Open email app";
    const gmail = document.createElement("a"); gmail.className = "button button-secondary"; gmail.target = "_blank"; gmail.rel = "noopener noreferrer"; gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONFIG.contactEmail)}&su=${encodeURIComponent(`Inquiry about ${CONFIG.domain}`)}&body=${encodeURIComponent(textarea.value)}`; gmail.textContent = "Open in Gmail";
    const copy = document.createElement("button"); copy.type = "button"; copy.className = "button button-secondary"; copy.textContent = "Copy message";
    copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(textarea.value); copy.textContent = "Copied"; } catch { textarea.focus(); textarea.select(); copy.textContent = "Select and copy the message"; } });
    actions.append(email, gmail, copy); wrapper.append(heading, textarea, actions); form.append(wrapper);
    if (window.matchMedia("(pointer: coarse)").matches) window.location.href = email.href;
  };

  form?.addEventListener("submit", async (event) => {
    event.preventDefault(); const values = getValues(); const errors = validate(values);
    if (errors.length) { status.textContent = errors.join(" "); status.className = "form-status form-status-error"; return; }
    if (!/^https:\/\//i.test(CONFIG.offerEndpoint)) { status.textContent = "Message ready — NOT sent yet."; status.className = "form-status form-status-success"; showFallback(values, "Message ready — NOT sent yet."); return; }
    status.textContent = "Sending…";
    try {
      const response = await fetch(CONFIG.offerEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, domain: CONFIG.domain }) });
      if (!response.ok) throw new Error("Request failed");
      status.textContent = "Delivered"; status.className = "form-status form-status-success";
    } catch {
      status.textContent = "We couldn't confirm delivery. Your message is still available below."; status.className = "form-status form-status-error"; showFallback(values, "We couldn't confirm delivery. Your message is still available below.");
    }
  });

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
