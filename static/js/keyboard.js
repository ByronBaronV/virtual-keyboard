// Updated keyboard.js

class VirtualKeyboard {
    constructor() {
        // Create a main output node that everything will connect to
        this.mainOutput = new Tone.Gain(1).toDestination();

        // Set up effects with bypass options
        this.reverb = new Tone.Reverb({
            decay: 2.5,
            preDelay: 0.1,
            wet: 0
        }).connect(this.mainOutput);

        this.delay = new Tone.FeedbackDelay({
            delayTime: "8n",
            feedback: 0.5,
            wet: 0
        }).connect(this.reverb);

        this.distortion = new Tone.Distortion({
            distortion: 0.8,
            wet: 0
        }).connect(this.delay);

        // Initialize instruments
        this.instruments = {
            synth: new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "square8" },
                envelope: {
                    attack: 0.05,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 0.8
                }
            }),
            piano: new Tone.Sampler({
                urls: {
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
                    A6: "A6.mp3"
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/"
            }),
            basssynth: new Tone.MonoSynth({
                oscillator: { type: "sawtooth" },
                envelope: {
                    attack: 0.1,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 0.8
                }
            }),
            lead: new Tone.FMSynth({
                harmonicity: 3,
                modulationIndex: 10,
                oscillator: { type: "sine" },
                envelope: {
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0.2,
                    release: 0.4
                }
            })
        };

        this.currentInstrument = this.instruments.synth;
        this.currentInstrument.connect(this.distortion);

        this.masterEffectsEnabled = false;

        this.effects = {
            reverb: false,
            delay: false,
            distortion: false
        };

        this.previousWetValues = {
            reverb: 0,
            delay: 0,
            distortion: 0
        };

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
                    onload: () => console.log(`Loaded: ${sound.filename}`)
                }).connect(this.distortion);
            });
        } catch (error) {
            console.error('Error loading custom sounds:', error);
        }
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('mousedown', () => this.playNote(key.dataset.note));
            key.addEventListener('mouseup', () => this.stopNote(key.dataset.note));
            key.addEventListener('mouseleave', () => this.stopNote(key.dataset.note));
        });

        const instrumentSelect = document.getElementById('instrument');
        if (instrumentSelect) {
            instrumentSelect.addEventListener('change', (e) => {
                this.switchInstrument(e.target.value);
            });
        }

        const effectsToggle = document.getElementById('effectsToggle');
        if (effectsToggle) {
            effectsToggle.addEventListener('click', () => {
                this.toggleMasterEffects();
            });
        }

        this.initializeEffectsControls();
    }

    // switchInstrument(instrumentName) {
    //     if (this.instruments[instrumentName]) {
    //         console.log(`Switching to instrument: ${instrumentName}`);
    //         this.currentInstrument.disconnect(); // Disconnect current instrument
    //         this.currentInstrument = this.instruments[instrumentName];
    //         this.currentInstrument.toDestination(); // Connect directly to the output (bypass effects)
    //         this.verifyInstrumentConnection();
    //     } else {
    //         console.warn(`Instrument not found: ${instrumentName}`);
    //     }
    // }

    switchInstrument(instrumentName) {
        if (this.instruments[instrumentName]) {
            // Disconnect the current instrument
            console.log(`Switching from ${this.currentInstrument.constructor.name} to ${instrumentName}`);
            this.currentInstrument.disconnect();
    
            // Set the new instrument
            this.currentInstrument = this.instruments[instrumentName];
    
            // Connect the new instrument to the effects chain
            this.currentInstrument.connect(this.distortion); // Add effects here
            console.log(`Successfully switched to instrument: ${instrumentName}`);
        } else {
            console.warn(`Instrument not found: ${instrumentName}`);
        }
    }

    playNote(note) {
        if (this.currentInstrument.triggerAttack) {
            console.log(`Attempting to play note: ${note}`);
            this.currentInstrument.triggerAttack(note);
            this.activeNotes.add(note);
        } else {
            console.error("Current instrument does not support triggerAttack.");
        }
    }

    stopNote(note) {
        if (this.currentInstrument.triggerRelease) {
            this.currentInstrument.triggerRelease(note);
            this.activeNotes.delete(note);
        }
    }

    toggleMasterEffects() {
        this.masterEffectsEnabled = !this.masterEffectsEnabled;
        Object.keys(this.effects).forEach(effect => {
            this.toggleEffect(effect, this.masterEffectsEnabled);
        });
        console.log(`Master effects: ${this.masterEffectsEnabled ? 'On' : 'Off'}`);
    }

    toggleEffect(effect, isEnabled) {
        if (this.effects.hasOwnProperty(effect)) {
            this.effects[effect] = isEnabled;
            const effectNode = this[effect];
            if (isEnabled) {
                effectNode.wet.value = this.previousWetValues[effect] || 1;
            } else {
                this.previousWetValues[effect] = effectNode.wet.value;
                effectNode.wet.value = 0;
            }
        }
    }

    initializeEffectsControls() {
        const controls = document.querySelector('.controls');
        if (controls) {
            const effectsDiv = document.createElement('div');
            effectsDiv.className = 'effects-controls';
            effectsDiv.innerHTML = `
                <div class="effect-control">
                    <label>
                        <input type="checkbox" class="effect-toggle" data-effect="reverb"> Reverb
                    </label>
                    <input type="range" class="effect-param" data-effect="reverb" data-param="decay" min="0.1" max="4" step="0.1" value="2.5">
                </div>
                <div class="effect-control">
                    <label>
                        <input type="checkbox" class="effect-toggle" data-effect="delay"> Delay
                    </label>
                    <input type="range" class="effect-param" data-effect="delay" data-param="feedback" min="0" max="0.9" step="0.1" value="0.5">
                </div>
                <div class="effect-control">
                    <label>
                        <input type="checkbox" class="effect-toggle" data-effect="distortion"> Distortion
                    </label>
                    <input type="range" class="effect-param" data-effect="distortion" data-param="distortion" min="0" max="1" step="0.1" value="0.8">
                </div>
            `;
            controls.appendChild(effectsDiv);

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
        }
    }

    updateEffectParameter(effect, param, value) {
        if (this[effect] && this[effect][param] !== undefined) {
            this[effect][param] = parseFloat(value);
            console.log(`Updated ${effect} ${param} to ${value}`);
        }
    }

    verifyInstrumentConnection() {
        console.log("Verifying instrument connection...");
        if (!this.currentInstrument) {
            console.error("No current instrument selected.");
            return false;
        }
    
        try {
            // Test connection by triggering a short note
            this.currentInstrument.triggerAttackRelease("C4", "8n");
            console.log("Instrument is connected and functional.");
            return true;
        } catch (error) {
            console.error("Instrument connection issue:", error);
            return false;
        }
    }
}

export default VirtualKeyboard;

