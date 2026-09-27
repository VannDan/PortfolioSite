document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Page Navigation Logic ---
    const navLinks = document.querySelectorAll('nav a, .logo');
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
        const activeLink = document.querySelector(`a[href="${hash}"]`);
        if (activeLink && !activeLink.classList.contains('logo')) {
            activeLink.classList.add('active');
        }
    }

    // Listen for URL hash changes (when user clicks links or uses browser back button)
    window.addEventListener('hashchange', navigateToHash);
    
    // Trigger on first load
    navigateToHash();


    // --- 2. Gallery Next/Prev Logic ---
    const galleryContainers = document.querySelectorAll('.gallery-container');

    galleryContainers.forEach(container => {
        const items = container.querySelectorAll('.gallery-item');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        
        let currentIndex = 0;

        // Hide buttons if gallery only has 1 image
        if (items.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        function showItem(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length; // Loops back to start
            showItem(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length; // Loops back to end
            showItem(currentIndex);
        });
    });
});