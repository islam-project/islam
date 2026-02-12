class QuranPlayer {
    constructor(language = 'ar') {
        this.language = language;
        this.apiBase = 'https://mp3quran.net/api/v3';
        this.reciters = [];
        this.moshaf = [];
        this.suwar = [];

        this.reciterSelect = document.getElementById('chooseReciter');
        this.moshafSelect = document.getElementById('chooseMoshaf');
        this.surahSelect = document.getElementById('chooseSurah');
        this.audioPlayer = document.getElementById('audioPlayer');

        this.reciterSearch = document.getElementById('searchReciter');
        this.moshafSearch = document.getElementById('searchMoshaf');
        this.surahSearch = document.getElementById('searchSurah');

        this.init();
    }

    async init() {
        await this.loadReciters();
        await this.loadSuwar();
        this.attachEventListeners();
    }

    async loadReciters() {
        try {
            const response = await fetch(`${this.apiBase}/reciters?language=${this.language}`);
            const data = await response.json();
            this.reciters = data.reciters || [];
            this.populateReciters();
        } catch (error) {
            console.error('Error loading reciters:', error);
        }
    }

    async loadSuwar() {
        try {
            const response = await fetch(`${this.apiBase}/suwar?language=${this.language}`);
            const data = await response.json();
            this.suwar = data.suwar || [];
        } catch (error) {
            console.error('Error loading suwar:', error);
        }
    }

    populateReciters() {
        this.reciterSelect.innerHTML = '<option value="">اختر القارئ / Choose Reciter</option>';
        this.reciters.forEach(reciter => {
            const option = document.createElement('option');
            option.value = reciter.id;
            option.textContent = reciter.name;
            this.reciterSelect.appendChild(option);
        });
    }

    populateMoshaf(reciterId) {
        const reciter = this.reciters.find(r => r.id == reciterId);
        if (!reciter) return;

        this.moshaf = reciter.moshaf || [];
        this.moshafSelect.innerHTML = '<option value="">اختر الرواية / Choose Edition</option>';

        this.moshaf.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.name;
            option.dataset.server = m.server;
            this.moshafSelect.appendChild(option);
        });
    }

    populateSurah() {
        this.surahSelect.innerHTML = '<option value="">اختر السورة / Choose Surah</option>';
        this.suwar.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.id;
            option.textContent = `${surah.id}. ${surah.name}`;
            this.surahSelect.appendChild(option);
        });
    }

    playAudio() {
        const moshafOption = this.moshafSelect.selectedOptions[0];
        const surahId = this.surahSelect.value;

        if (!moshafOption || !surahId) return;

        const server = moshafOption.dataset.server;
        const paddedSurahId = surahId.toString().padStart(3, '0');
        const audioUrl = `${server}${paddedSurahId}.mp3`;

        this.audioPlayer.src = audioUrl;
        this.audioPlayer.play();
    }

    attachEventListeners() {
        this.reciterSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.populateMoshaf(e.target.value);
                this.moshafSelect.disabled = false;
            }
        });

        this.moshafSelect.addEventListener('change', () => {
            if (this.moshafSelect.value) {
                this.populateSurah();
                this.surahSelect.disabled = false;
            }
        });

        this.surahSelect.addEventListener('change', () => {
            if (this.surahSelect.value) {
                this.playAudio();
            }
        });

        if (this.reciterSearch) {
            this.reciterSearch.addEventListener('input', (e) => {
                this.filterSelect(this.reciterSelect, e.target.value);
            });
        }

        if (this.moshafSearch) {
            this.moshafSearch.addEventListener('input', (e) => {
                this.filterSelect(this.moshafSelect, e.target.value);
            });
        }

        if (this.surahSearch) {
            this.surahSearch.addEventListener('input', (e) => {
                this.filterSelect(this.surahSelect, e.target.value);
            });
        }

        const toggleButtons = document.querySelectorAll('[id^="toggle"]');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const inputId = btn.id.replace('toggle', 'search');
                const input = document.getElementById(inputId);
                if (input) {
                    input.style.display = input.style.display === 'none' ? 'block' : 'none';
                }
            });
        });
    }

    filterSelect(selectElement, searchTerm) {
        const options = selectElement.querySelectorAll('option');
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            option.style.display = matches ? 'block' : 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.lang || 'ar';
    new QuranPlayer(lang);
});
