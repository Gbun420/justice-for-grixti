import './style.css'

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

// Form Submission with Validation and Loading State
const form = document.querySelector('#petition-form') as HTMLFormElement;
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const localityInput = document.getElementById('locality') as HTMLInputElement;
    const messageInput = document.getElementById('message') as HTMLTextAreaElement;

    const nameError = nameInput.nextElementSibling as HTMLElement;
    const localityError = localityInput.nextElementSibling as HTMLElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const loadingState = form.querySelector('.loading-state') as HTMLElement;

    // Reset errors and button state
    nameError.style.display = 'none';
    localityError.style.display = 'none';
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

    if (!isValid) {
      return;
    }

    // Show loading state
    submitButton.style.display = 'none';
    loadingState.style.display = 'block';

    // Simulate API call
    console.log(`[Petition Submission] Name: ${nameInput.value}, Locality: ${localityInput.value}, Message: ${messageInput.value}`);

    try {
      // In a real application, replace this with an actual fetch() call to your backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

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
document.querySelectorAll('nav a').forEach(anchor => {
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