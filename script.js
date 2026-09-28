document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dark Mode / Theme Toggle Logic ---
    const desktopToggles = document.querySelectorAll('.theme-toggle');
    const mobileToggle = document.getElementById('mobileThemeToggle');
    const body = document.body;

    function updateThemeUI(isDark) {
        // Desktop Logo Text Update
        desktopToggles.forEach(toggle => {
            const staticPart = toggle.querySelector('.logo-static');
            const defaultPart = toggle.querySelector('.logo-default');
            const hoverPart = toggle.querySelector('.logo-hover');
            
            if (staticPart && defaultPart && hoverPart) {
                if (isDark) {
                    staticPart.textContent = '';
                    defaultPart.textContent = 'Dan Vann';
                    hoverPart.textContent = 'Light Mode?';
                } else {
                    staticPart.textContent = 'Da';
                    defaultPart.textContent = 'n Vann';
                    hoverPart.textContent = 'rk Mode?';
                }
            }
        });
        // The mobile switch now animates purely via CSS classes!
    }

    // Check for saved preference
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateThemeUI(true);
    } else {
        updateThemeUI(false);
    }

    function handleToggle(e) {
        e.preventDefault(); 
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeUI(isDark);
    }

    // Apply the listeners
    desktopToggles.forEach(toggle => toggle.addEventListener('click', handleToggle));
    if (mobileToggle) mobileToggle.addEventListener('click', handleToggle);


    // --- 2. Mobile Menu Logic ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    // We only attach close clicks to ACTUAL links, so the toggle switch doesn't accidentally close the menu
    const navLinks = document.querySelectorAll('nav a'); 

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuToggle.classList.toggle('open'); // This triggers the button animation in CSS
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuToggle.classList.remove('open');
        });
    });

    // --- 3. Page Navigation Logic ---
    const pages = document.querySelectorAll('.page');

    function navigateToHash() {
        const hash = window.location.hash || '#home';
        
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const targetPage = document.querySelector(hash);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        const activeLinks = document.querySelectorAll(`a[href="${hash}"]`);
        activeLinks.forEach(link => link.classList.add('active'));
        
        window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', navigateToHash);
    navigateToHash();

    // --- 4. Fetch Data & Build Website ---
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            buildProjects(data.projects);
            buildBlog(data.blog);
            initGalleries();
        })
        .catch(error => console.error('Error loading data:', error));

    function buildProjects(projectsData) {
        for (const [projectId, items] of Object.entries(projectsData)) {
            const container = document.querySelector(`.gallery-container[data-project="${projectId}"]`);
            if (!container) continue;

            items.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = `gallery-item ${index === 0 ? 'active' : ''}`;

                if (item.type === 'image') {
                    div.innerHTML = `
                        <img src="${item.src}" alt="${item.caption}">
                        <p class="gallery-caption">${item.caption}</p>
                    `;
                } else if (item.type === 'text') {
                    div.classList.add('text-item');
                    const paragraphs = item.lines.map(line => `<p>${line}</p>`).join('');
                    div.innerHTML = `<div class="poem-block">${paragraphs}</div>`;
                }
                
                container.appendChild(div);
            });
        }
    }

    function buildBlog(blogData) {
        const blogContainer = document.getElementById('blog-content');
        if (!blogContainer) return;

        blogData.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            
            const paragraphsHtml = post.paragraphs.map(p => `<p>${p}</p>`).join('');
            
            article.innerHTML = `
                <span class="blog-date">${post.date}</span>
                <h2>${post.title}</h2>
                <img src="${post.image}" alt="${post.title}">
                ${paragraphsHtml}
            `;
            blogContainer.appendChild(article);
        });
    }

    // --- 5. Gallery Next/Prev Logic ---
    function initGalleries() {
        const galleryContainers = document.querySelectorAll('.gallery-container');

        galleryContainers.forEach(container => {
            const items = container.querySelectorAll('.gallery-item');
            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');
            const counter = container.querySelector('.gallery-counter');
            
            const totalItems = items.length;
            let currentIndex = 0;

            if (counter && totalItems > 0) {
                counter.textContent = `(1 of ${totalItems})`;
            }

            if (totalItems <= 1) {
                const controls = container.querySelector('.gallery-controls');
                if (controls) controls.style.display = 'none';
                return;
            }

            function showItem(index) {
                items.forEach(item => item.classList.remove('active'));
                items[index].classList.add('active');
                
                if (counter) {
                    counter.textContent = `(${index + 1} of ${totalItems})`;
                }
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalItems;
                showItem(currentIndex);
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                showItem(currentIndex);
            });
        });
    }
});