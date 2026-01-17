import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../consts';
import { sfx } from '../utils/audio';

export class EndingScene extends Phaser.Scene {
    constructor() { super({ key: 'EndingScene' }); }
    create() {
        sfx.win(); // Toca música de vitória
        const cx = SCREEN_WIDTH / 2; const cy = SCREEN_HEIGHT / 2;
        this.cameras.main.setBackgroundColor('#000000');

        // Display the final surprise image
        const img = this.add.image(cx, cy, 'final_surprise');
        // Scale to fit screen while maintaining aspect ratio
        const scaleX = SCREEN_WIDTH / img.width;
        const scaleY = SCREEN_HEIGHT / img.height;
        const scale = Math.min(scaleX, scaleY);
        img.setScale(scale);

        // Congratulations text at top
        this.add.text(cx, 40, "Parabéns, Doutora!", { fontFamily: 'Courier New', fontSize: '28px', color: '#ffd700', align: 'center', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);

        // Message text at bottom
        const message = this.add.text(cx, SCREEN_HEIGHT - 80, "...muito atrasado, mas espero que consigas tudo que desejar\ne realize seus sonhos!", { fontFamily: 'Courier New', fontSize: '16px', color: '#ffffff', align: 'center', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5).setAlpha(0);

        // Fade in the message
        this.tweens.add({ targets: message, alpha: 1, duration: 2000, delay: 1500, onComplete: () => { this.createResetButton(cx, SCREEN_HEIGHT - 30); } });
    }
    createResetButton(x: number, y: number) {
        const btn = this.add.text(x, y, "NOVA REQUISIÇÃO", { fontFamily: 'Courier New', fontSize: '20px', color: '#000', backgroundColor: '#e0ac69', padding: { x: 10, y: 5 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => { this.scene.start('MainScene', { level: 1, newGame: true }); });
        btn.on('pointerover', () => btn.setStyle({ fill: '#fff' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#000' }));
    }
}
