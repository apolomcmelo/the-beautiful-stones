import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { IntroScene } from './scenes/IntroScene';
import { TransitionScene } from './scenes/TransitionScene';
import { MainScene } from './scenes/MainScene';
import { EndingScene } from './scenes/EndingScene';
import { GameOverScene } from './scenes/GameOverScene';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './consts';
import { unlockAudio } from './utils/audio';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000000',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [BootScene, IntroScene, TransitionScene, MainScene, EndingScene, GameOverScene]
};

new Phaser.Game(config);

// Adiciona listener global ao documento para capturar qualquer clique inicial
document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });
