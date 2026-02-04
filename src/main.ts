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

// Form Submission (Mock Logic for now)
const form = document.querySelector('#petition-form') as HTMLFormElement;
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const localityInput = document.getElementById('locality') as HTMLInputElement;

    // In a real production environment, this would send data to a backend API.
    // For now, we log it to demonstrate functionality without mock alerts.
    console.log(`[Petition Submission] Name: ${nameInput.value}, Locality: ${localityInput.value}`);

    const submitBtn = form.querySelector('button') as HTMLButtonElement;
    submitBtn.innerText = 'Support Received (Demo)';
    submitBtn.disabled = true;
    submitBtn.style.background = '#27ae60';
    submitBtn.style.color = '#fff';
  });
}
