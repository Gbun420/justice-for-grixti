import "./nav.js";
import { submitSignature } from "./petition.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (!href) return;

      const target = document.querySelector(href);
      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });
});

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (!header) return;

  if (window.scrollY > 100) {
    header.style.background = "var(--primary)";
    header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.2)";
  } else {
    header.style.background =
      "linear-gradient(135deg, var(--primary), var(--secondary))";
    header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  }
});

// Petition form handling
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("petition-form");
  const feedback = document.getElementById("petition-feedback");

  if (!form || !feedback) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    feedback.textContent = "";
    feedback.className = "";

    const data = {
      name: form.name.value.trim(),
      location: form.location.value.trim(),
      message: form.message.value.trim(),
      email: form.email.value.trim(),
    };

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting...";

    try {
      await submitSignature(data);
      feedback.textContent = "✅ Thank you! Your signature has been added.";
      feedback.style.color = "var(--success)";
      form.reset();
    } catch (err) {
      console.error(err);
      feedback.textContent = "❌ Something went wrong. Please try again.";
      feedback.style.color = "var(--accent)";
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});
