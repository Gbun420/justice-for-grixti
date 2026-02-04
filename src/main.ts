import './style.css'

// Email Configuration (Proton Mail Integration)
const emailConfig = {
  service: 'Proton Mail',
  username: 'justiceforgrixti@proton.me', // Corrected Proton Mail domain
  smtp: {
    host: 'mail.protonmail.com',
    port: 587,
    secure: false
  },
  notifications: {
    newSignature: true,
    dailySummary: true,
    urgentAlerts: true
  }
};
console.log('Email Configuration Loaded:', emailConfig);

// Internationalization (i18n) Logic
let translations: Record<string, any> = {};

async function loadTranslations(lang: string) {
  try {
    const response = await fetch(`/public/locales/${lang}.json`);
    translations = await response.json();
    applyTranslations();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

function getNestedTranslation(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined; // Path not found
    }
  }
  return typeof current === 'string' ? current : undefined;
}


function applyTranslations() {
  // Apply translations to meta tags and title
  const titleElement = document.querySelector('title');
  if (titleElement) {
    titleElement.textContent = getNestedTranslation(translations, 'page_title') || '';
  }

  document.querySelectorAll('meta[data-i18n]').forEach(metaElement => {
    const key = metaElement.getAttribute('data-i18n');
    if (key) {
      const translatedText = getNestedTranslation(translations, key);
      if (translatedText) {
        metaElement.setAttribute('content', translatedText);
      }
    }
  });

  // Apply translations to data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key && !key.startsWith('meta_') && key !== 'page_title' && key !== 'og_title' && key !== 'og_description') { // Exclude meta and title handled above
      let translatedText = getNestedTranslation(translations, key);

      if (translatedText) {
        if (element instanceof HTMLInputElement && element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', translatedText);
        } else if (element instanceof HTMLTextAreaElement && element.hasAttribute('placeholder')) {
          element.setAttribute('placeholder', translatedText);
        } else if (element.tagName === 'A' && key.includes('email_address')) {
          // For mailto links, only update the text content, href is hardcoded
          element.textContent = translatedText;
        }
        else {
          element.textContent = translatedText;
        }
      }
    }
  });

  // Handle specific elements with mixed content or special formatting
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement && translations.footer?.copyright) {
    const copyrightText = translations.footer.copyright.replace('{year}', new Date().getFullYear().toString());
    const parentP = currentYearElement.closest('p');
    if (parentP) {
      parentP.innerHTML = copyrightText; // Use innerHTML to allow {year} replacement
    }
  }
}

// Cookie Consent Logic
function handleCookieConsent() {
  const cookieConsent = document.getElementById('cookie-consent');
  const acceptCookiesButton = document.getElementById('accept-cookies');

  if (cookieConsent && acceptCookiesButton) {
    const consentAccepted = localStorage.getItem('cookieConsentAccepted');

    if (!consentAccepted) {
      cookieConsent.style.display = 'block';
    }

    acceptCookiesButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsentAccepted', 'true');
      cookieConsent.style.display = 'none';
    });
  }
}

// Load default language on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadTranslations('en');
  renderTestimonials(); // Render testimonials after translations are loaded
  handleCookieConsent(); // Handle cookie consent
});


// Scroll Reveal Logic
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Simulated Newsletter Subscriber List
const newsletterSubscribers: string[] = [];

// Function to render testimonials dynamically
async function renderTestimonials() {
  const testimonialGrid = document.getElementById('testimonial-grid');
  if (!testimonialGrid) return;

  try {
    const response = await fetch('/public/data/testimonials.json');
    const testimonials = await response.json();

    testimonialGrid.innerHTML = ''; // Clear existing content

    testimonials.forEach((testimonial: { quote: string; author: string; }) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';

      const quote = document.createElement('p');
      quote.textContent = testimonial.quote; // No need for quotes here, they are in the JSON

      const author = document.createElement('span');
      author.className = 'testimonial-author';
      author.textContent = testimonial.author;

      card.appendChild(quote);
      card.appendChild(author);
      testimonialGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error rendering testimonials:', error);
    testimonialGrid.innerHTML = '<p class="error-message" style="color: red;">Failed to load testimonials.</p>';
  }
}


// Form Submission with Validation, Loading State, and Proton Mail Simulation
const form = document.querySelector('#petition-form') as HTMLFormElement;
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const localityInput = document.getElementById('locality') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const messageInput = document.getElementById('message') as HTMLTextAreaElement;
    const newsletterSignupCheckbox = document.getElementById('newsletter-signup') as HTMLInputElement;

    const nameError = nameInput.nextElementSibling as HTMLElement;
    const localityError = localityInput.nextElementSibling as HTMLElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const loadingState = form.querySelector('.loading-state') as HTMLElement;

    // Reset errors and button state
    nameError.style.display = 'none';
    localityError.style.display = 'none';
    
    // Clear any previous email validation messages
    let emailErrorElement = emailInput.nextElementSibling as HTMLElement; // Get the error div directly
    if (emailErrorElement && emailErrorElement.classList.contains('error-message')) {
      emailErrorElement.style.display = 'none';
    } else {
      // If not found, create it for initial use
      emailErrorElement = document.createElement('div');
      emailErrorElement.className = 'error-message';
      emailErrorElement.style.color = 'red';
      emailInput.parentElement?.insertBefore(emailErrorElement, emailInput.nextElementSibling);
    }

    submitButton.disabled = false;
    submitButton.style.display = 'block';
    loadingState.style.display = 'none';
    
    // Use translated text for button
    submitButton.textContent = getNestedTranslation(translations, 'petition_section.form.submit_button') || 'Sign the Petition';
    submitButton.style.backgroundColor = ''; // Reset to default

    // Client-side Validation
    let isValid = true;
    if (!nameInput.value.trim() || !nameInput.checkValidity()) {
      nameError.textContent = getNestedTranslation(translations, 'petition_section.form.name_error') || 'Please enter a valid name (letters and spaces only).';
      nameError.style.display = 'block';
      isValid = false;
    }
    if (!localityInput.value.trim() || !localityInput.checkValidity()) {
      localityError.textContent = getNestedTranslation(translations, 'petition_section.form.locality_error') || 'Please enter your locality.';
      localityError.style.display = 'block';
      isValid = false;
    }
    // Basic email validation if provided
    if (emailInput.value.trim() && !emailInput.checkValidity()) {
      emailErrorElement.textContent = getNestedTranslation(translations, 'petition_section.form.email_error') || 'Please enter a valid email address.';
      emailErrorElement.style.display = 'block';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Show loading state
    submitButton.style.display = 'none';
    loadingState.style.display = 'block';
    loadingState.textContent = getNestedTranslation(translations, 'petition_section.form.loading_state') || 'Submitting...';


    // Simulate API call (backend interaction for real email sending/storage)
    console.log(`[Petition Submission - Simulated Backend] Name: ${nameInput.value}, Locality: ${localityInput.value}, Email: ${emailInput.value}, Message: ${messageInput.value}, Newsletter: ${newsletterSignupCheckbox.checked}`);

    try {
      // Simulate network delay for submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate Admin Notification via Proton Mail
      if (emailConfig.notifications.newSignature) {
        console.log(`[Proton Mail Simulation] Sending new signature notification to ${emailConfig.username} for: ${nameInput.value}`);
      }

      // Simulate Confirmation Email to Signer (if opted for newsletter)
      if (newsletterSignupCheckbox.checked && emailInput.value.trim()) {
        newsletterSubscribers.push(emailInput.value.trim());
        console.log(`[Proton Mail Simulation] Sending confirmation/welcome email to ${emailInput.value} and adding to newsletter list.`);
        console.log(`[Proton Mail Simulation] Current newsletter subscribers:`, newsletterSubscribers);
      } else if (emailInput.value.trim()) {
        console.log(`[Proton Mail Simulation] Sending one-time confirmation to ${emailInput.value}.`);
      }


      // Simulate Daily Summary Report trigger (conceptual)
      if (emailConfig.notifications.dailySummary) {
        console.log(`[Proton Mail Simulation] Triggering daily summary report generation for ${emailConfig.username}.`);
      }

      // Simulate secure data management with Proton Mail/Drive (conceptual)
      console.log(`[Proton Mail Simulation] Securely storing form data and potentially backing up to Proton Drive.`);

      // Update counter
      const countElement = document.getElementById('signatureCount');
      if (countElement) {
        let currentCount = parseInt(countElement.textContent?.replace(/,/g, '') || '0');
        countElement.textContent = (currentCount + 1).toLocaleString();
      }

      // Success feedback
      submitButton.textContent = getNestedTranslation(translations, 'petition_section.form.signed_successfully') || 'Signed Successfully!';
      submitButton.style.backgroundColor = '#27ae60'; // Success green
      submitButton.disabled = true;
      submitButton.style.display = 'block';
      form.reset(); // Clear form after successful submission

    } catch (error) {
      console.error('Petition submission failed:', error);
      submitButton.textContent = getNestedTranslation(translations, 'petition_section.form.submission_failed') || 'Submission Failed!';
      submitButton.style.backgroundColor = '#e74c3c'; // Error red
      submitButton.disabled = false; // Allow retry
      submitButton.style.display = 'block';
    } finally {
      loadingState.style.display = 'none';
    }
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('.main-nav a').forEach(anchor => { // Adjusted selector for new HTML structure
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    if (targetId) {
      document.querySelector(targetId)?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Mock Analytics for Console
setInterval(() => {
  console.log(`[Proton Mail Analytics Simulation] Daily Report (mock): ${newsletterSubscribers.length} new subscribers, ${Math.floor(Math.random() * 100)} page views today.`);
  console.log(`[Proton Mail Analytics Simulation] Automated Communications (mock): Case updates sent.`);
}, 60000 * 5); // Every 5 minutes for demonstration