const themeButton = document.querySelector('#theme-toggle');

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});


const mobileMenuButton = document.querySelector('#mobile-menu-button');
const mobileMenu = document.querySelector('#mobile-menu');

if (mobileMenuButton && mobileMenu) {

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });

    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    mobileMenuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        });
    });
}

const favoriteCards = document.querySelectorAll('.favorite-card');
const prevButton = document.querySelector('.slider-button-prev');
const nextButton = document.querySelector('.slider-button-next');
const sliderControls = document.querySelectorAll('.slider-control');

let currentSlide = 0;

if (favoriteCards.length && prevButton && nextButton) {

    function showSlide(index) {
        favoriteCards.forEach((card) => {
            card.style.display = 'none';
        });

        sliderControls.forEach((control) => {
            control.classList.remove('active');
        });

        favoriteCards[index].style.display = 'block';
        sliderControls[index].classList.add('active');

        currentSlide = index;
    }

    nextButton.addEventListener('click', () => {
        currentSlide++;

        if (currentSlide >= favoriteCards.length) {
            currentSlide = 0;
        }

        showSlide(currentSlide);
    });

    prevButton.addEventListener('click', () => {
        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = favoriteCards.length - 1;
        }

        showSlide(currentSlide);
    });
}

fetch('products.json')
    .then((response) => response.json())
    .then((products) => {

        const menuGrid = document.querySelector('.menu-grid');
        const categoryButtons = document.querySelectorAll('.menu-category');
        const loadMoreButton = document.querySelector('.load-more');

        let currentCategory = 'coffee';
        let showAllCards = false;

        function createCard(product) {
            const card = document.createElement('article');

            card.classList.add('menu-card');

            const categoryProducts = products.filter(
                (item) => item.category === product.category
            );

            const imageNumber = categoryProducts.indexOf(product) + 1;

            card.innerHTML = `
                <img src="assets/${product.category}-${imageNumber}.svg" alt="${product.name}">
                <div class="menu-card-content">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <strong>$${product.price}</strong>
                </div>
            `;

            return card;
        }

        function renderCategory(category) {
            menuGrid.innerHTML = '';

            const categoryProducts = products.filter(
                (product) => product.category === category
            );

            const productsToShow = showAllCards
                ? categoryProducts
                : categoryProducts.slice(0, 4);

            productsToShow.forEach((product) => {
                menuGrid.append(createCard(product));
            });

            if (loadMoreButton) {
                if (showAllCards || categoryProducts.length <= 4) {
                    loadMoreButton.style.display = 'none';
                } else {
                    loadMoreButton.style.display = 'flex';
                }
            }
        }

        renderCategory(currentCategory);

        categoryButtons.forEach((button) => {
            button.addEventListener('click', () => {

                categoryButtons.forEach((item) => {
                    item.classList.remove('active');
                });

                button.classList.add('active');

                currentCategory = button.dataset.category;
                showAllCards = false;

                renderCategory(currentCategory);
            });
        });

        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                showAllCards = true;
                renderCategory(currentCategory);
            });
        }
    });