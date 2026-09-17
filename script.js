const themeButton = document.querySelector('#theme-toggle');

themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});