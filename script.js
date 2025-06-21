// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Typed.js initialization
    const typed = new Typed('#typed-text', {
        stringsElement: '#typed-strings',
        typeSpeed: 40,
        backSpeed: 20,
        backDelay: 1500,
        loop: true,
        smartBackspace: true,
        cursorChar: '|',
        fadeOut: false,
        showCursor: true,
        autoInsertCss: false,
        attr: null
    });
});

// Enhanced scroll effects
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const scrolled = window.scrollY > 50;

    nav.style.background = scrolled
        ? 'rgba(0, 0, 0, 0.9)'
        : 'rgba(0, 0, 0, 0.7)';
    nav.style.backdropFilter = scrolled
        ? 'blur(40px)'
        : 'blur(30px)';
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate cards on scroll
document.querySelectorAll('.feature-card, .process-step').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    observer.observe(card);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Join Waitlist Button Logic (Selected/Unselected)
const joinWaitlistBtn = document.getElementById('joinWaitlistBtn');
let isWaitlistSelected = false; // Initial state

joinWaitlistBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    isWaitlistSelected = !isWaitlistSelected; // Toggle state
    if (isWaitlistSelected) {
        joinWaitlistBtn.classList.add('selected');
        joinWaitlistBtn.textContent = 'Waitlist Joined!'; // Change text
        alert('You have successfully joined the waitlist!');
    } else {
        joinWaitlistBtn.classList.remove('selected');
        joinWaitlistBtn.textContent = 'Join Waitlist'; // Change text back
        alert('You are now unselected from the waitlist.');
    }
});

// Typewriter Effect for Final CTA Title
const typewriterElement = document.getElementById('typewriterText');
const textToType = "Ready to Split Smarter?";

function typeWriter(element, text) {
    let i = 0;
    element.textContent = ''; // Clear existing text
    element.style.width = '0'; // Reset width for animation
    element.style.animation = 'none'; // Reset animation
    void element.offsetWidth; // Trigger reflow
    element.style.animation = 'typing 3.5s steps(30, end) forwards, blink-caret .75s step-end infinite'; // Re-apply animation
}

// Trigger typewriter effect when the element comes into view
const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
            typeWriter(entry.target, textToType);
            entry.target.dataset.typed = true; // Mark as typed to avoid re-triggering
            typewriterObserver.unobserve(entry.target); // Stop observing after first trigger
        }
    });
}, { threshold: 0.8 }); // Adjust threshold as needed
typewriterObserver.observe(typewriterElement);

// Receipt Screenshot Upload Functionality
const screenshotUpload = document.getElementById('screenshotUpload');
const uploadStatus = document.getElementById('uploadStatus');

screenshotUpload.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        uploadStatus.textContent = `File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        alert('Screenshot uploaded! (This is a demo, actual OCR processing would happen on a backend.)');
    } else {
        uploadStatus.textContent = '';
    }
});

// Text to JSON Conversion Functionality
const receiptTextInput = document.getElementById('receiptTextInput');
const convertToJsonBtn = document.getElementById('convertToJsonBtn');
const jsonOutput = document.getElementById('jsonOutput');

convertToJsonBtn.addEventListener('click', function() {
    const inputText = receiptTextInput.value.trim();
    if (inputText) {
        try {
            // This is a simple example of converting text to a mock JSON.
            // A real OCR/NLP service would extract meaningful data.
            const lines = inputText.split('\n').filter(line => line.trim() !== '');
            const items = [];
            let total = 0;

            lines.forEach(line => {
                const parts = line.split(/\s+/); // Split by one or more spaces
                const lastPart = parts[parts.length - 1]; // Last part is likely price
                const priceMatch = lastPart.match(/\$?(\d+\.\d{2})/);

                if (priceMatch) {
                    const price = parseFloat(priceMatch[1]);
                    const name = parts.slice(0, parts.length - 1).join(' ').replace(/^\d+\s*/, '').trim(); // Remove leading numbers if present
                    items.push({ name: name, price: price });
                    if (!isNaN(price)) {
                        total += price;
                    }
                } else if (line.toLowerCase().includes('total')) {
                     const totalMatch = line.match(/\$?(\d+\.\d{2})/);
                     if (totalMatch) {
                         total = parseFloat(totalMatch[1]);
                     }
                }
            });

            const mockJson = {
                receipt_id: `REC-${Date.now()}`,
                merchant_name: "Demo Store",
                date: new Date().toISOString().split('T')[0],
                items: items.length > 0 ? items : [{ name: inputText.substring(0, 30) + '...', price: 0 }], // Fallback if no items
                total_amount: total.toFixed(2),
                currency: "USD",
                raw_text: inputText
            };
            jsonOutput.textContent = JSON.stringify(mockJson, null, 2);
        } catch (e) {
            jsonOutput.textContent = `Error converting text: ${e.message}`;
            console.error(e);
        }
    } else {
        jsonOutput.textContent = 'Please enter some text to convert.';
    }
}); 