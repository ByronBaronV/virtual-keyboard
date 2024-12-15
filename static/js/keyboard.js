//KEYBOARD 1/2

// static/js/keyboard.js

class VirtualKeyboard {
    constructor() {
        // Create a main output node that everything will connect to
        this.mainOutput = new Tone.Gain(1).toDestination();

        // Set up effects with bypass options
        // Reverb: adds space and depth to the sound
        this.reverb = new Tone.Reverb({
            decay: 2.5, // Duration of the reverb tail
            preDelay: 0.1, // Delay before reverb starts
            wet: 0  // Start with effect bypassed
        }).connect(this.mainOutput);

        // Delay: creates echoes of the sound
        this.delay = new Tone.FeedbackDelay({
            delayTime: "8n", // Delay time un musical notation (eighth note)
            feedback: 0.5, // Amount of delayed signal fed back into the delay
            wet: 0  // Start with effect bypassed
        }).connect(this.reverb);

        // Distortion: adds harmonic content and grit to the sound
        this.distortion = new Tone.Distortion({
            distortion: 0.8, // Amount of distortion (0-1)
            wet: 0  // Start with effect bypassed
        }).connect(this.delay);

        // Initialize instruments
        this.instruments = {
        } // PolySynth: Allows playing multiple notes simultaneously
            synth: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "square8" }, // Waveform type
                envelope: {
                    attack: 0.05, // Time to reach full volume
                    decay: 0.3, // Time to reach sustain level
                    sustain: 0.4, // Level to sustain at
                    release: 0.8, // Time to fade out after key release
                }
            }),
            // Sampler: Plays back pre-recorded audio samples
            piano: new Tone.Sampler({
                urls: { // Map of note names to audio files URLs
                    A0: "A0.mp3",
                    C1: "C1.mp3",
                    "D#1": "Ds1.mp3",
                    "F#1": "Fs1.mp3",
                    A1: "A1.mp3",
                    C2: "C2.mp3",
                    "D#2": "Ds2.mp3",
                    "F#2": "Fs2.mp3",
                    A2: "A2.mp3",
                    C3: "C3.mp3",
                    "D#3": "Ds3.mp3",
                    "F#3": "Fs3.mp3",
                    A3: "A3.mp3",
                    C4: "C4.mp3",
                    "D#4": "Ds4.mp3",
                    "F#4": "Fs4.mp3",
                    A4: "A4.mp3",
                    C5: "C5.mp3",
                    "D#5": "Ds5.mp3",
                    "F#5": "Fs5.mp3",
                    A5: "A5.mp3",
                    C6: "C6.mp3",
                    "D#6": "Ds6.mp3",
                    "F#6": "Fs6.mp3",
                    A6: "A6.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/", // Invalid URL 404 Error
            }),
            // MonoSynth: Single-voice synthetizer for bass sounds
            basssynth: new Tone.MonoSynth({
                oscillator: { type: "sawtooth" },
                envelope: {
                    attack: 0.1,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 0.8
                }
            }),
            // FMSynth: Frequency Modulation synthesis for complex timbres
            lead: new Tone.FMSynth({
                harmonicity: 3, // Ratio between carrier and modulator frequencies
                modulationIndex: 10, // Amount of modulation
                oscillator: { type: "sine" },
                envelope: {
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0.2,
                    release: 0.4
                }
            })
        };

        // Connect initial instrument to effects chain
        this.currentInstrument = this.instruments.synth;
        this.currentInstrument.connect(this.distortion);

        // Track master effects state
        this.masterEffectsEnabled = false;

        // Effects state
        this.effects = {
            reverb: false,
            delay: false,
            distortion: false
        };

        // Store previous wet values when bypassing
        this.previousWetValues = {
            reverb: 0,
            delay: 0,
            distortion: 0
        };

        // Keyboard mapping
        this.keyMap = {
            'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4',
            'd': 'E4', 'f': 'F4', 't': 'F#4', 'g': 'G4',
            'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
            'k': 'C5'
        };

        this.activeNotes = new Set();
        this.customSounds = {};
        this.initializeEventListeners();
    }

    async initializeAudio() {
        await Tone.start();
        console.log('Audio is ready');
    }

    async loadCustomSounds() {
        try {
            const response = await fetch('/api/sounds');
            const sounds = await response.json();

            sounds.forEach(sound => {
                this.customSounds[sound.key_mapping] = new Tone.Player({
                    url: `/static/sounds/${sound.filename}`,
                    onload: () => console.log(`Loaded: ${sound.filename}`),
                }).connect(this.distortion); // Connect to effects chain
            });
        } catch (error) {
            console.error('Error loading custom sounds:', error);
        }
    }

    initializeEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Click events for visual keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('mousedown', () => this.playNote(key.dataset.note));
            key.addEventListener('mouseup', () => this.stopNote(key.dataset.note));
            key.addEventListener('mouseleave', () => this.stopNote(key.dataset.note));
        });

        // Instrument selection
        const instrumentSelect = document.getElementById('instrument');
        if (instrumentSelect) {
            instrumentSelect.addEventListener('change', (e) => {
                this.switchInstrument(e.target.value);
            });
        }

        // Effects controls
        this.initializeEffectsControls();

        const effectsToggle = document.getElementById('effectsToggle');
        if (effectsToggle) {
            effectsToggle.addEventListener('click', () => {
                this.toggleMasterEffects();
            });
        }
    }

    initializeEffectsControls() {
        // Add sliders for effects parameters
        const controls = document.querySelector('.controls');
        if (controls) {
            const effectsDiv = document.createElement('div');
            effectsDiv.className = 'effects-controls';
            effectsDiv.innerHTML = `
                <div class="effect-control">
                    <label>
                        <input type="checkbox" class="effect-toggle" data-effect="reverb"> Reverb
                    </label>
                    <input type="range" class="effect-param" data-effect="reverb" data-param="decay"
                           min="0.1" max="4" step="0.1" value="2.5">
                </div>
                <div class="effect-control">
                    <label>
                        <input type="checkbox" class="effect-toggle" data-effect="delay"> Delay
                    </label>
                    <input type="range" class="effect-param" data-effect="delay" data-param="feedback"
                           min="0" max="0.9" step="0.1" value="0.5">
                </div>
                <div class="effect-control">
                    <label>
                        <input type="checkbox" class="effect-toggle" data-effect="distortion"> Distortion
                    </label>
                    <input type="range" class="effect-param" data-effect="distortion" data-param="distortion"
                           min="0" max="1" step="0.1" value="0.8">
                </div>
            `;
            controls.appendChild(effectsDiv);

            // Add event listeners for effects controls
            document.querySelectorAll('.effect-toggle').forEach(toggle => {
                toggle.addEventListener('change', (e) => {
                    const effect = e.target.dataset.effect;
                    this.toggleEffect(effect, e.target.checked);
                });
            });

            document.querySelectorAll('.effect-param').forEach(slider => {
                slider.addEventListener('input', (e) => {
                    const effect = e.target.dataset.effect;
                    const param = e.target.dataset.param;
                    this.updateEffectParameter(effect, param, e.target.value);
                });
            });

            document.addEventListener('DOMContentLoaded', async () => {
                    const keyboard = new VirtualKeyboard();
                // Add this to ensure audio context starts
                    const startAudioButton = document.createElement('button');
                    startAudioButton.textContent = 'Start Audio';
                    startAudioButton.className = 'btn';
                document.querySelector('.keyboard-container').prepend(startAudioButton);

                startAudioButton.addEventListener('click', async () => {
                    await keyboard.initializeAudio();
                    startAudioButton.remove();
                });
            });
        }
    }

export default VirtualKeyboard;