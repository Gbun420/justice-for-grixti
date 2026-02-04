import './style.css'

// Email Configuration (Proton Mail Integration)
const emailConfig = {
  service: 'Proton Mail',
  username: 'justiceforgrixti@proton.me',
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
    const emailErrorElement = emailInput.parentElement?.querySelector('.error-message');
    if (emailErrorElement) emailErrorElement.remove();

    submitButton.disabled = false;
    submitButton.style.display = 'block';
    loadingState.style.display = 'none';
    submitButton.textContent = 'Sign the Petition';
    submitButton.style.backgroundColor = ''; // Reset to default

    // Client-side Validation
    let isValid = true;
    if (!nameInput.value.trim() || !nameInput.checkValidity()) {
      nameError.style.display = 'block';
      isValid = false;
    }
    if (!localityInput.value.trim() || !localityInput.checkValidity()) {
      localityError.style.display = 'block';
      isValid = false;
    }
    // Basic email validation if provided
    if (emailInput.value.trim() && !emailInput.checkValidity()) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = 'red';
      errorDiv.textContent = 'Please enter a valid email address.';
      emailInput.parentElement?.appendChild(errorDiv);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Show loading state
    submitButton.style.display = 'none';
    loadingState.style.display = 'block';

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
      submitButton.textContent = 'Signed Successfully!';
      submitButton.style.backgroundColor = '#27ae60'; // Success green
      submitButton.disabled = true;
      submitButton.style.display = 'block';
      form.reset(); // Clear form after successful submission

    } catch (error) {
      console.error('Petition submission failed:', error);
      submitButton.textContent = 'Submission Failed!';
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
    const targetId = this.getAttribute('href');
    if (targetId) {
      document.querySelector(targetId)?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Update current year in footer
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear().toString();
}

// Mock Analytics for Console
setInterval(() => {
  console.log(`[Proton Mail Analytics Simulation] Daily Report (mock): ${newsletterSubscribers.length} new subscribers, ${Math.floor(Math.random() * 100)} page views today.`);
  console.log(`[Proton Mail Analytics Simulation] Automated Communications (mock): Case updates sent.`);
}, 60000 * 5); // Every 5 minutes for demonstration