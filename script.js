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