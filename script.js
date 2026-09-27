document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu Logic ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('nav a, .logo');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close menu when a link is clicked (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    });

    // --- 2. Page Navigation Logic ---
    const pages = document.querySelectorAll('.page');

    function navigateToHash() {
        const hash = window.location.hash || '#home';
        
        // Hide all pages, remove active from all links
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        // Show target page
        const targetPage = document.querySelector(hash);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Highlight active link in the sidebar
        const activeLinks = document.querySelectorAll(`a[href="${hash}"]`);
        activeLinks.forEach(link => {
            if (!link.classList.contains('logo')) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top on page change
        window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', navigateToHash);
    navigateToHash();

    // --- 3. Gallery Next/Prev Logic ---
    const galleryContainers = document.querySelectorAll('.gallery-container');

    galleryContainers.forEach(container => {
        const items = container.querySelectorAll('.gallery-item');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const counter = container.querySelector('.gallery-counter');
        
        const totalItems = items.length;
        let currentIndex = 0;

        // Setup the initial counter text
        if (counter && totalItems > 0) {
            counter.textContent = `(1 of ${totalItems})`;
        }

        // Hide controls entirely if the gallery only has 1 image
        if (totalItems <= 1) {
            const controls = container.querySelector('.gallery-controls');
            if (controls) controls.style.display = 'none';
            return;
        }

        function showItem(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');
            
            // Update counter text
            if (counter) {
                counter.textContent = `(${index + 1} of ${totalItems})`;
            }
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalItems; // Loops back to start
            showItem(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems; // Loops back to end
            showItem(currentIndex);
        });
    });
});