// Effects System - Manages JSON-based effects and settings
class EffectsSystem {
    constructor() {
        this.effects = new Map();
        this.activeEffects = new Set();
        this.triggeredEffects = [];
        this.collectedEffects = new Set();
        this.settings = {
            volume: 0.5,
            antiEpilepsy: false,
            lobotomyThreshold: 4, // Lines needed for lobotomy
            developerMode: false
        };
        this.loadSettings();
        this.loadCollectedEffects();
        this.loadEffects();
    }

    async loadEffects() {
        // Embedded effects data to avoid CORS issues
        const effectsData = {
            "effects": [
                {
                    "id": "clear-sound",
                    "name": "Clear Sound",
                    "description": "Plays the classic line clear sound effect",
                    "category": "audio",
                    "intensity": 1,
                    "epilepsyRisk": false,
                    "rarity": "common"
                },
                {
                    "id": "scale-distortion",
                    "name": "Scale Distortion",
                    "description": "The game interface randomly scales up and down",
                    "category": "visual",
                    "intensity": 1,
                    "epilepsyRisk": false,
                    "rarity": "common"
                },
                {
                    "id": "rotation-chaos",
                    "name": "Rotation Chaos", 
                    "description": "The entire game rotates at random angles",
                    "category": "visual",
                    "intensity": 2,
                    "epilepsyRisk": false,
                    "rarity": "uncommon"
                },
                {
                    "id": "skew-transform",
                    "name": "Skew Transform",
                    "description": "Elements become skewed and distorted",
                    "category": "visual", 
                    "intensity": 1,
                    "epilepsyRisk": false,
                    "rarity": "common"
                },
                {
                    "id": "glitch-text",
                    "name": "Glitch Text",
                    "description": "Text elements flash with rainbow colors",
                    "category": "visual",
                    "intensity": 2,
                    "epilepsyRisk": true,
                    "rarity": "uncommon"
                },
                {
                    "id": "glitch-borders",
                    "name": "Glitch Borders",
                    "description": "UI borders flash with chaotic colors",
                    "category": "visual",
                    "intensity": 1,
                    "epilepsyRisk": true,
                    "rarity": "common"
                },
                {
                    "id": "element-rotation",
                    "name": "Element Rotation",
                    "description": "UI elements spin continuously",
                    "category": "visual",
                    "intensity": 2,
                    "epilepsyRisk": false,
                    "rarity": "uncommon"
                },
                {
                    "id": "zoom-effect",
                    "name": "Zoom Effect",
                    "description": "Elements zoom in and out rhythmically",
                    "category": "visual",
                    "intensity": 1,
                    "epilepsyRisk": false,
                    "rarity": "common"
                },
                {
                    "id": "wave-effect",
                    "name": "Wave Effect",
                    "description": "Text bounces up and down like waves",
                    "category": "visual",
                    "intensity": 1,
                    "epilepsyRisk": false,
                    "rarity": "common"
                },
                {
                    "id": "piece-mutation",
                    "name": "Piece Mutation",
                    "description": "Tetris pieces randomly change shape",
                    "category": "gameplay",
                    "intensity": 3,
                    "epilepsyRisk": false,
                    "rarity": "rare"
                },
                {
                    "id": "color-cycling",
                    "name": "Color Cycling",
                    "description": "Block colors shift and change randomly",
                    "category": "gameplay",
                    "intensity": 2,
                    "epilepsyRisk": false,
                    "rarity": "uncommon"
                },
                {
                    "id": "forced-piece-lock",
                    "name": "Piece Lock",
                    "description": "Forces the same piece type repeatedly",
                    "category": "gameplay",
                    "intensity": 4,
                    "epilepsyRisk": false,
                    "rarity": "rare"
                },
                {
                    "id": "board-chaos",
                    "name": "Board Chaos",
                    "description": "Random blocks appear and disappear on the board",
                    "category": "gameplay",
                    "intensity": 5,
                    "epilepsyRisk": false,
                    "rarity": "legendary"
                },
                {
                    "id": "turkey-sandwich",
                    "name": "Turkey Sandwich",
                    "description": "A mysterious turkey sandwich video appears",
                    "category": "media",
                    "intensity": 2,
                    "epilepsyRisk": false,
                    "rarity": "uncommon"
                },
                {
                    "id": "subway-surfers",
                    "name": "Subway Surfers",
                    "description": "Brain rot gaming content takes over half the screen",
                    "category": "media",
                    "intensity": 3,
                    "epilepsyRisk": false,
                    "rarity": "rare"
                },
                {
                    "id": "audio-distortion",
                    "name": "Audio Distortion",
                    "description": "Sound effects become distorted and chaotic",
                    "category": "audio",
                    "intensity": 1,
                    "epilepsyRisk": false,
                    "rarity": "common"
                },
                {
                    "id": "screen-flash",
                    "name": "Screen Flash",
                    "description": "The screen flashes with random bright colors",
                    "category": "screen",
                    "intensity": 3,
                    "epilepsyRisk": true,
                    "rarity": "rare"
                },
                {
                    "id": "corner-lights",
                    "name": "Corner Lights",
                    "description": "Random lights appear in the corners of the screen",
                    "category": "screen",
                    "intensity": 1,
                    "epilepsyRisk": false,
                    "rarity": "common"
                },
                {
                    "id": "hold-piece-swap",
                    "name": "Hold Piece Swap",
                    "description": "Current and hold pieces randomly swap places",
                    "category": "gameplay",
                    "intensity": 3,
                    "epilepsyRisk": false,
                    "rarity": "rare"
                },
                {
                    "id": "speed-chaos",
                    "name": "Speed Chaos",
                    "description": "Game speed randomly increases and decreases",
                    "category": "gameplay",
                    "intensity": 4,
                    "epilepsyRisk": false,
                    "rarity": "rare"
                },
                {
                    "id": "inverted-controls",
                    "name": "Inverted Controls",
                    "description": "Movement controls become inverted",
                    "category": "gameplay",
                    "intensity": 5,
                    "epilepsyRisk": false,
                    "rarity": "legendary"
                }
            ]
        };
        
        effectsData.effects.forEach(effect => {
            this.registerEffect(effect);
        });
        
        console.log(`Loaded ${this.effects.size} effects from embedded data`);
    }

    registerEffect(effectData) {
        const effect = {
            ...effectData,
            enabled: true,
            lastTriggered: 0,
            execute: this.getEffectFunction(effectData.id),
            cleanup: this.getCleanupFunction(effectData.id)
        };
        
        this.effects.set(effectData.id, effect);
    }

    getEffectFunction(id) {
        const effectFunctions = {
            'scale-distortion': () => {
                const root = document.documentElement;
                const scale = 1 + (Math.random() - 0.5) * 0.2;
                root.style.setProperty('--scale', scale);
            },
            
            'rotation-chaos': () => {
                const root = document.documentElement;
                const currentRotate = parseFloat(getComputedStyle(root).getPropertyValue('--rotate')) || 0;
                const rotateAdd = (Math.random() - 0.5) * Math.pow(2, window.glitchLevel || 1);
                root.style.setProperty('--rotate', `${currentRotate + rotateAdd}deg`);
            },
            
            'skew-transform': () => {
                const root = document.documentElement;
                const skew = (Math.random() - 0.5) * 5;
                root.style.setProperty('--skew', `${skew}deg`);
            },
            
            'glitch-text': () => {
                document.querySelectorAll('.info-box, .controls, h3, li').forEach(el => {
                    el.classList.add('glitch-text');
                });
            },
            
            'glitch-borders': () => {
                document.querySelectorAll('.info-box, .controls, .next-piece, .hold-piece').forEach(el => {
                    el.classList.add('glitch-border');
                });
            },
            
            'element-rotation': () => {
                document.querySelectorAll('.next-piece, .hold-piece').forEach(el => {
                    el.classList.add('glitch-rotate');
                });
            },
            
            'zoom-effect': () => {
                document.querySelectorAll('.info-box, .controls').forEach(el => {
                    el.classList.add('zoom-effect');
                });
            },
            
            'wave-effect': () => {
                document.querySelectorAll('h3, li').forEach(el => {
                    el.classList.add('wave-effect');
                });
            },
            
            'piece-mutation': () => {
                if (window.player?.matrix && window.mutateMatrix) {
                    const mutated = window.mutateMatrix(window.player.matrix);
                    if (mutated) {
                        window.player.matrix = mutated;
                    }
                }
            },
            
            'color-cycling': () => {
                if (window.cycleColors) {
                    window.cycleColors();
                }
            },
            
            'forced-piece-lock': () => {
                if (Math.random() < 0.3) {
                    window.forcedPieceType = Math.floor(Math.random() * 7);
                    window.forcedPieceCount = 10;
                    this.showMessage('PIECE LOCK ACTIVATED', '#ff0000');
                }
            },
            
            'board-chaos': () => {
                if (window.board && window.glitchLevel >= 8) {
                    for (let i = 0; i < 3; i++) {
                        const y = Math.floor(Math.random() * window.board.length);
                        const x = Math.floor(Math.random() * window.board[0].length);
                        if (window.board[y][x] === 0) {
                            window.board[y][x] = Math.floor(Math.random() * 7) + 1;
                        } else {
                            window.board[y][x] = 0;
                        }
                    }
                }
            },
            
            'turkey-sandwich': () => {
                const video = document.getElementById('turkeySandwich');
                if (video) {
                    video.currentTime = 0;
                    video.style.display = 'block';
                    video.volume = this.settings.volume;
                    
                    const speedMultiplier = Math.pow(1.2, window.glitchLevel || 1);
                    video.playbackRate = speedMultiplier;
                    
                    const rotationAmount = Math.random() * 360 * (window.glitchLevel || 1) / 10;
                    const scaleAmount = 1 + (Math.random() * (window.glitchLevel || 1) / 2);
                    video.style.transform = `rotate(${rotationAmount}deg) scale(${scaleAmount})`;
                    
                    video.play();
                }
            },
            
            'subway-surfers': () => {
                const video = document.getElementById('subwaySurfers');
                if (video && Math.random() < 0.3) {
                    document.body.classList.add('subway-active');
                    video.currentTime = 0;
                    video.style.display = 'block';
                    video.volume = this.settings.volume;
                    
                    const speedMultiplier = Math.pow(1.2, window.glitchLevel || 1);
                    video.playbackRate = speedMultiplier;
                    
                    video.play();
                    
                    setTimeout(() => {
                        this.getCleanupFunction('subway-surfers')();
                    }, 60000 / speedMultiplier);
                }
            },
            
            'audio-distortion': () => {
                const audio = document.getElementById('clearSound');
                if (audio && this.settings.volume > 0) {
                    audio.currentTime = 0;
                    audio.volume = this.settings.volume;
                    audio.playbackRate = 0.5 + Math.random() * 1.5;
                    audio.play().catch(e => console.log('Audio play failed:', e));
                }
            },
            
            'clear-sound': () => {
                const audio = document.getElementById('clearSound');
                if (audio && this.settings.volume > 0) {
                    audio.currentTime = 0;
                    audio.volume = this.settings.volume;
                    audio.playbackRate = 1;
                    audio.play().catch(e => console.log('Audio play failed:', e));
                }
            },
            
            'screen-flash': () => {
                if (this.settings.antiEpilepsy) return;
                
                const flash = document.createElement('div');
                flash.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${this.getRandomColor()};
                    opacity: 0.7;
                    z-index: 9999;
                    pointer-events: none;
                    animation: flashFade 0.3s ease-out forwards;
                `;
                
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 300);
            },
            
            'corner-lights': () => {
                // This effect is handled in the draw function
                window.cornerLightsActive = true;
            },
            
            'hold-piece-swap': () => {
                if (window.holdPiece?.matrix && window.player?.matrix) {
                    const temp = window.holdPiece.matrix;
                    window.holdPiece.matrix = window.player.matrix;
                    window.player.matrix = temp;
                    window.player.pos.y = 0;
                    window.player.pos.x = Math.floor(window.board[0].length / 2) - Math.floor(window.player.matrix[0].length / 2);
                }
            },
            
            'speed-chaos': () => {
                if (window.dropInterval) {
                    window.dropInterval = Math.max(50, window.dropInterval * (0.5 + Math.random()));
                }
            },
            
            'inverted-controls': () => {
                window.controlsInverted = !window.controlsInverted;
                this.showMessage('CONTROLS INVERTED', '#ff00ff');
            }
        };
        
        return effectFunctions[id] || (() => {});
    }

    getCleanupFunction(id) {
        const cleanupFunctions = {
            'scale-distortion': () => {
                document.documentElement.style.setProperty('--scale', '1');
            },
            
            'rotation-chaos': () => {
                document.documentElement.style.setProperty('--rotate', '0deg');
            },
            
            'skew-transform': () => {
                document.documentElement.style.setProperty('--skew', '0deg');
            },
            
            'glitch-text': () => {
                document.querySelectorAll('.glitch-text').forEach(el => {
                    el.classList.remove('glitch-text');
                });
            },
            
            'glitch-borders': () => {
                document.querySelectorAll('.glitch-border').forEach(el => {
                    el.classList.remove('glitch-border');
                });
            },
            
            'element-rotation': () => {
                document.querySelectorAll('.glitch-rotate').forEach(el => {
                    el.classList.remove('glitch-rotate');
                });
            },
            
            'zoom-effect': () => {
                document.querySelectorAll('.zoom-effect').forEach(el => {
                    el.classList.remove('zoom-effect');
                });
            },
            
            'wave-effect': () => {
                document.querySelectorAll('.wave-effect').forEach(el => {
                    el.classList.remove('wave-effect');
                });
            },
            
            'turkey-sandwich': () => {
                const video = document.getElementById('turkeySandwich');
                if (video) {
                    video.pause();
                    video.style.display = 'none';
                    video.style.transform = '';
                    video.playbackRate = 1;
                }
            },
            
            'subway-surfers': () => {
                const video = document.getElementById('subwaySurfers');
                if (video) {
                    video.pause();
                    video.style.display = 'none';
                    document.body.classList.remove('subway-active');
                }
            },
            
            'audio-distortion': () => {
                const audio = document.getElementById('clearSound');
                if (audio) {
                    audio.playbackRate = 1;
                }
            },
            
            'corner-lights': () => {
                window.cornerLightsActive = false;
            },
            
            'inverted-controls': () => {
                window.controlsInverted = false;
            }
        };
        
        return cleanupFunctions[id] || (() => {});
    }

    triggerEffect(id) {
        const effect = this.effects.get(id);
        if (!effect || !effect.enabled) return false;

        // Skip epilepsy-risk effects if anti-epilepsy mode is enabled
        if (effect.epilepsyRisk && this.settings.antiEpilepsy) return false;

        try {
            effect.execute();
            effect.lastTriggered = Date.now();
            this.activeEffects.add(id);
            
            // Collect the effect
            this.collectEffect(id);
            
            // Add to triggered effects list
            if (!this.triggeredEffects.find(e => e.id === id)) {
                this.triggeredEffects.push({
                    id: effect.id,
                    name: effect.name,
                    description: effect.description,
                    triggeredAt: Date.now()
                });
                this.updateEffectsList();
            }
            
            return true;
        } catch (error) {
            console.error(`Error executing effect ${id}:`, error);
            return false;
        }
    }

    triggerRandomEffect(category = null, intensityLimit = 5) {
        let availableEffects = Array.from(this.effects.values()).filter(effect => 
            effect.enabled && 
            effect.intensity <= intensityLimit &&
            (!effect.epilepsyRisk || !this.settings.antiEpilepsy)
        );

        if (category) {
            availableEffects = availableEffects.filter(effect => effect.category === category);
        }

        if (availableEffects.length === 0) return false;

        const randomEffect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
        return this.triggerEffect(randomEffect.id);
    }

    cleanupAllEffects() {
        this.effects.forEach(effect => {
            try {
                effect.cleanup();
            } catch (error) {
                console.error(`Error cleaning up effect ${effect.id}:`, error);
            }
        });
        this.activeEffects.clear();
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        
        // Update audio volumes immediately
        const audio = document.getElementById('clearSound');
        if (audio) audio.volume = this.settings.volume;
        
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.volume = this.settings.volume;
        });
    }

    saveSettings() {
        try {
            localStorage.setItem('lobotomy-tetris-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('lobotomy-tetris-settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    showMessage(text, color = '#ff0000', duration = 2000) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${color};
            font-size: 36px;
            font-family: 'Press Start 2P', monospace;
            text-shadow: 2px 2px #000;
            z-index: 1000;
            animation: flash 0.5s infinite;
            pointer-events: none;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), duration);
    }

    updateEffectsList() {
        const effectsList = document.getElementById('effectsList');
        if (!effectsList) return;

        effectsList.innerHTML = '';
        this.triggeredEffects.forEach(effect => {
            const effectItem = document.createElement('div');
            effectItem.className = 'effect-item';
            effectItem.innerHTML = `
                <div class="effect-name">${effect.name}</div>
                <div class="effect-description">${effect.description}</div>
            `;
            effectsList.appendChild(effectItem);
        });
    }

    getAllEffects() {
        return Array.from(this.effects.values());
    }

    getTriggeredEffects() {
        return this.triggeredEffects;
    }

    clearTriggeredEffects() {
        this.triggeredEffects = [];
        this.updateEffectsList();
    }

    // Collection System Methods
    collectEffect(id) {
        const effect = this.effects.get(id);
        if (!effect) return false;

        const wasNew = !this.collectedEffects.has(id);
        this.collectedEffects.add(id);
        this.saveCollectedEffects();
        
        if (wasNew) {
            this.showCollectionNotification(effect);
            this.updateCollectionUI();
        }
        
        return wasNew;
    }

    showCollectionNotification(effect) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="font-size: 0.8em; margin-bottom: 5px;">🎉 NEW EFFECT COLLECTED!</div>
            <div style="font-size: 1em; color: var(--accent-color);">${effect.name}</div>
            <div style="font-size: 0.6em; margin-top: 5px;">${effect.description}</div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20%;
            right: 20px;
            background: var(--secondary-bg);
            border: 3px solid var(--accent-color);
            border-radius: 10px;
            padding: 20px;
            color: var(--text-color);
            font-family: 'Press Start 2P', monospace;
            text-align: center;
            z-index: 1500;
            animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 3s forwards;
            max-width: 300px;
            box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3500);
    }

    saveCollectedEffects() {
        try {
            localStorage.setItem('lobotomy-tetris-collection', JSON.stringify([...this.collectedEffects]));
        } catch (error) {
            console.error('Failed to save collection:', error);
        }
    }

    loadCollectedEffects() {
        try {
            const saved = localStorage.getItem('lobotomy-tetris-collection');
            if (saved) {
                this.collectedEffects = new Set(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Failed to load collection:', error);
        }
    }

    resetCollection() {
        this.collectedEffects.clear();
        this.saveCollectedEffects();
        this.updateCollectionUI();
    }

    updateCollectionUI() {
        // Update collection stats
        const totalCount = this.effects.size;
        const collectedCount = this.collectedEffects.size;
        const completionPercent = totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;

        const totalCountEl = document.getElementById('totalCount');
        const collectedCountEl = document.getElementById('collectedCount');
        const completionPercentEl = document.getElementById('completionPercent');

        if (totalCountEl) totalCountEl.textContent = totalCount;
        if (collectedCountEl) collectedCountEl.textContent = collectedCount;
        if (completionPercentEl) completionPercentEl.textContent = completionPercent + '%';

        // Update collection grid
        this.updateCollectionGrid();
    }

    updateCollectionGrid(filterRarity = 'all') {
        const grid = document.getElementById('collectionGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        const effects = Array.from(this.effects.values());
        const filteredEffects = filterRarity === 'all' 
            ? effects 
            : effects.filter(effect => effect.rarity === filterRarity);

        filteredEffects.forEach(effect => {
            const isCollected = this.collectedEffects.has(effect.id);
            const item = document.createElement('div');
            item.className = `collection-item ${isCollected ? 'collected' : 'locked'}`;
            
            item.innerHTML = `
                <div class="effect-rarity ${effect.rarity || 'common'}">${effect.rarity || 'common'}</div>
                <div class="collection-item-name">${effect.name}</div>
                <div class="collection-item-description">${isCollected ? effect.description : '???'}</div>
            `;
            
            grid.appendChild(item);
        });
    }

}

// Global instance
window.effectsSystem = new EffectsSystem();
