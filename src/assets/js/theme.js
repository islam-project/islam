class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.loadTheme();
        this.attachEventListeners();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.enableDarkTheme();
        }
    }

    attachEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            this.disableDarkTheme();
        } else {
            this.enableDarkTheme();
        }
    }

    enableDarkTheme() {
        document.body.classList.add('dark-theme');
        const icon = this.themeToggle?.querySelector('.material-icons');
        if (icon) {
            icon.textContent = 'light_mode';
        }
        localStorage.setItem('theme', 'dark');
    }

    disableDarkTheme() {
        document.body.classList.remove('dark-theme');
        const icon = this.themeToggle?.querySelector('.material-icons');
        if (icon) {
            icon.textContent = 'dark_mode';
        }
        localStorage.setItem('theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
