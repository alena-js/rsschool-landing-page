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
        const modal = document.querySelector('#modal');
        const modalImage = document.querySelector('#modal-image');
        const modalTitle = document.querySelector('#modal-title');
        const modalDescription = document.querySelector('#modal-description');
        const modalPrice = document.querySelector('#modal-price');
        const modalSizes = document.querySelector('#modal-sizes');
        const modalAdditives = document.querySelector('#modal-additives');
        const modalClose = document.querySelector('.modal-close');
        const modalOverlay = document.querySelector('.modal-overlay');

        let currentCategory = 'coffee';
        let showAllCards = window.innerWidth > 768;

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

    card.addEventListener('click', () => {
        modalImage.src = `assets/${product.category}-${imageNumber}.svg`;
        modalImage.alt = product.name;
        modalTitle.textContent = product.name;
        modalDescription.textContent = product.description;

        modalSizes.innerHTML = '';
        modalAdditives.innerHTML = '';

        function updateModalPrice() {
            let totalPrice = Number(product.price);

            const activeSize = modalSizes.querySelector('.modal-option.active');

            if (activeSize) {
                const sizeKey = activeSize.dataset.size;

                totalPrice += Number(product.sizes[sizeKey]['add-price']);
            }

            modalAdditives
                .querySelectorAll('.modal-option.active')
                .forEach((button) => {
                    const additiveKey = button.dataset.additive;

                    totalPrice += Number(
                        product.additives[additiveKey]['add-price']
                    );
                });

            modalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        }

        Object.entries(product.sizes).forEach(
            ([sizeKey, sizeData], index) => {
                const sizeButton = document.createElement('button');

                sizeButton.type = 'button';
                sizeButton.classList.add('modal-option');
                sizeButton.dataset.size = sizeKey;

                sizeButton.innerHTML = `
                    <span class="modal-option-circle">
                        ${sizeKey.toUpperCase()}
                    </span>
                    <span>${sizeData.size}</span>
                `;

                if (index === 0) {
                    sizeButton.classList.add('active');
                }

                sizeButton.addEventListener('click', (event) => {
                    event.stopPropagation();

                    modalSizes
                        .querySelectorAll('.modal-option')
                        .forEach((button) => {
                            button.classList.remove('active');
                        });

                    sizeButton.classList.add('active');

                    updateModalPrice();
                });

                modalSizes.append(sizeButton);
            }
        );
        Object.entries(product.additives).forEach(
    ([additiveKey, additiveData], index) => {
        const additiveButton = document.createElement('button');

        additiveButton.type = 'button';
        additiveButton.classList.add('modal-option');
        additiveButton.dataset.additive = additiveKey;

        additiveButton.innerHTML = `
            <span class="modal-option-circle">
                ${index + 1}
            </span>
            <span>${additiveData.name}</span>
        `;

        additiveButton.addEventListener('click', (event) => {
            event.stopPropagation();

            additiveButton.classList.toggle('active');

            updateModalPrice();
        });

        modalAdditives.append(additiveButton);
    }
);

        updateModalPrice();

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    return card;
}

        function renderCategory(category) {
            menuGrid.innerHTML = '';

            const categoryProducts = products.filter(
                (product) => product.category === category
            );

            const isMobile = window.innerWidth <= 768;
            const productsToShow = isMobile && !showAllCards
            ? categoryProducts.slice(0, 4)
            : categoryProducts;

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
        window.addEventListener('resize', () => {

    if (window.innerWidth > 768) {
        showAllCards = true;
    } else {
        showAllCards = false;
    }

    renderCategory(currentCategory);
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

});