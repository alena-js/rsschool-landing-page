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