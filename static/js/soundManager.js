//SOUNDS

// static/js/soundManager.js
class SoundManager {
    constructor() {
        console.log('SoundManager initialized');
        // Start Tone.js
        this.initializeTone();
        this.initializeEventListeners();
    }

    async initializeTone() {
        try {
            await Tone.start();
            console.log('Tone.js started');
        } catch (error) {
            console.error('Error starting Tone.js:', error);
        }
    }

    initializeEventListeners() {
        console.log('Setting up event listeners');
        document.querySelectorAll('.btn-play').forEach(button => {
            console.log('Found test button for:', button.dataset.file);
            button.addEventListener('click', async () => {
                console.log('Test button clicked for:', button.dataset.file);
                // Ensure Tone is started on user interaction
                await Tone.start();
                this.testSound(button.dataset.file);
            });
        });
    }

    async testSound(filename) {
        console.log('Testing sound:', filename);
        try {
            // Create new player instance for each playback
            const player = new Tone.Player({
                url: `/static/sounds/${filename}`,
                autostart: false,
                onload: () => {
                    console.log('Sound loaded successfully:', filename);
                    player.start();
                },
                onerror: (e) => {
                    console.error(`Error loading sound ${filename}:`, e);
                }
            }).toDestination();

            // Add error handling for playback
            player.onstop = () => {
                console.log('Playback finished:', filename);
                player.dispose();
            };

        } catch (error) {
            console.error('Error setting up player:', error);
        }
    }
}

// Make sure Tone.js is loaded before initializing SoundManager
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for sounds container');
    if (document.querySelector('.sounds-container')) {
        console.log('Sounds container found, initializing SoundManager');
        const soundManager = new SoundManager();
    }
});

// Add a global click handler to initialize audio context
document.addEventListener('click', async () => {
    try {
        await Tone.start();
        console.log('Tone.js context started on user interaction');
    } catch (error) {
        console.error('Error starting Tone.js context:', error);
    }
}, { once: true });