class RadioPlayer {
    constructor(language = 'ar') {
        this.language = language;
        this.apiBase = 'https://mp3quran.net/api/v3';
        this.radios = [];
        this.audioPlayer = document.getElementById('audio-player');
        this.radioList = document.getElementById('radio-list');
        this.searchInput = document.getElementById('search');
        this.currentRadio = null;

        this.init();
    }

    async init() {
        await this.loadRadios();
        this.attachEventListeners();
    }

    async loadRadios() {
        try {
            const response = await fetch(`${this.apiBase}/radios?language=${this.language}`);
            const data = await response.json();
            this.radios = data.radios || [];
            this.renderRadios();
        } catch (error) {
            console.error('Error loading radios:', error);
        }
    }

    renderRadios(radiosToRender = this.radios) {
        this.radioList.innerHTML = '';

        radiosToRender.forEach(radio => {
            const radioItem = this.createRadioItem(radio);
            this.radioList.appendChild(radioItem);
        });
    }

    createRadioItem(radio) {
        const div = document.createElement('div');
        div.className = 'radio-item';
        div.dataset.radioId = radio.id;

        const radioWaves = document.createElement('div');
        radioWaves.className = 'radio-waves-animation';
        radioWaves.innerHTML = `
            <span class="radio-circle"></span>
            <span class="radio-wave"></span>
            <span class="radio-wave"></span>
            <span class="radio-wave"></span>
        `;

        const name = document.createElement('span');
        name.className = 'radio-name';
        name.textContent = radio.name;

        div.appendChild(radioWaves);
        div.appendChild(name);

        div.addEventListener('click', () => this.playRadio(radio, div));

        return div;
    }

    playRadio(radio, element) {
        if (this.audioPlayer) {
            this.audioPlayer.src = radio.url;
            this.audioPlayer.play();

            document.querySelectorAll('.radio-item').forEach(item => {
                item.classList.remove('active');
            });
            element.classList.add('active');

            this.currentRadio = radio;
        }
    }

    filterRadios(searchTerm) {
        const filtered = this.radios.filter(radio =>
            radio.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderRadios(filtered);
    }

    attachEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterRadios(e.target.value);
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.lang || 'ar';
    new RadioPlayer(lang);
});
