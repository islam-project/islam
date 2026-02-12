class LiveStreamPlayer {
    constructor() {
        this.videoElement = document.getElementById('livevideo');
        this.channels = {
            quran: 'https://win.holol.com/live/quran/playlist.m3u8',
            sunnah: 'https://win.holol.com/live/sunnah/playlist.m3u8'
        };
        this.hls = null;
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.checkHLSSupport();
    }

    checkHLSSupport() {
        if (Hls.isSupported()) {
            this.hls = new Hls();
        } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            console.log('HLS natively supported');
        } else {
            console.error('HLS not supported');
        }
    }

    playChannel(channelUrl) {
        if (!channelUrl) return;

        if (Hls.isSupported()) {
            if (this.hls) {
                this.hls.destroy();
            }
            this.hls = new Hls();
            this.hls.loadSource(channelUrl);
            this.hls.attachMedia(this.videoElement);

            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.videoElement.play();
            });

            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS Error:', data);
            });
        } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            this.videoElement.src = channelUrl;
            this.videoElement.addEventListener('loadedmetadata', () => {
                this.videoElement.play();
            });
        }
    }

    attachEventListeners() {
        const channelButtons = document.querySelectorAll('[data-channel]');
        channelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const channel = btn.dataset.channel;
                if (this.channels[channel]) {
                    this.playChannel(this.channels[channel]);
                    channelButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
        });

        const legacyButtons = document.querySelectorAll('[onclick*="playlive"]');
        legacyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const onclickAttr = btn.getAttribute('onclick');
                const match = onclickAttr.match(/playlive\('(.+?)'\)/);
                if (match && match[1]) {
                    this.playChannel(match[1]);
                    legacyButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
            });
            btn.removeAttribute('onclick');
        });
    }

    destroy() {
        if (this.hls) {
            this.hls.destroy();
        }
    }
}

window.playlive = function(url) {
    const player = new LiveStreamPlayer();
    player.playChannel(url);
};

document.addEventListener('DOMContentLoaded', () => {
    new LiveStreamPlayer();
});
