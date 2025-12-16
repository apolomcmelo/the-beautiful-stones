import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../consts';
import { sfx } from '../utils/audio';

export class EndingScene extends Phaser.Scene {
    constructor() { super({ key: 'EndingScene' }); }
    create() {
        sfx.win(); // Toca música de vitória
        const cx = SCREEN_WIDTH / 2; const cy = SCREEN_HEIGHT / 2;
        this.cameras.main.setBackgroundColor('#000000');
        this.add.image(cx, cy, 'cake').setScale(4);
        this.add.text(cx, cy - 150, "PARABÉNS DENISE!", { fontFamily: 'Courier New', fontSize: '24px', color: '#ffd700', align: 'center', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5);
        const scream = this.add.text(cx, cy, "FOOOOODA-SE!", { fontFamily: 'Courier New', fontSize: '64px', color: '#ffffff', stroke: '#ff0000', strokeThickness: 8 }).setOrigin(0.5).setScale(0).setAlpha(0);
        const sub = this.add.text(cx, cy + 150, "A BUROCRACIA ERA UMA FESTA\n'Só queríamos manter-te ocupada.'", { fontFamily: 'Courier New', fontSize: '16px', color: '#aaaaaa', align: 'center' }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets: scream, scale: 1, alpha: 1, duration: 1000, delay: 1000, ease: 'Bounce.easeOut', onComplete: () => { this.tweens.add({ targets: sub, alpha: 1, duration: 1000 }); this.createResetButton(cx, cy + 200); } });
    }
    createResetButton(x: number, y: number) {
        const btn = this.add.text(x, y, "NOVA REQUISIÇÃO", { fontFamily: 'Courier New', fontSize: '20px', color: '#000', backgroundColor: '#e0ac69', padding: { x: 10, y: 5 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => { this.scene.start('MainScene', { level: 1, newGame: true }); });
        btn.on('pointerover', () => btn.setStyle({ fill: '#fff' }));
        btn.on('pointerout', () => btn.setStyle({ fill: '#000' }));
    }
}
