import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../consts';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const cx = SCREEN_WIDTH / 2;
        const cy = SCREEN_HEIGHT / 2;

        const bg = this.add.image(cx, cy, 'gameOver');
        const scaleX = SCREEN_WIDTH / bg.width;
        const scaleY = SCREEN_HEIGHT / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        const btnBg = this.add.rectangle(cx, cy + 80, 240, 60, 0x222222).setOrigin(0.5);
        btnBg.setStrokeStyle(2, 0xffffff);
        btnBg.setAlpha(0);
        btnBg.disableInteractive();

        const btnText = this.add.text(cx, cy + 80, 'Tentar Novamente', {
            fontFamily: 'Courier New',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);
        btnText.setAlpha(0);

        this.time.delayedCall(3000, () => {
            btnBg.setInteractive({ useHandCursor: true });
            this.tweens.add({ targets: [btnBg, btnText], alpha: 1, duration: 300, ease: 'Quad.easeOut' });
        });

        btnBg.on('pointerover', () => btnBg.setFillStyle(0x333333));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0x222222));
        btnBg.on('pointerdown', () => {
            btnBg.disableInteractive();
            this.cameras.main.fadeOut(400);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MainScene', { level: 1, newGame: true });
            });
        });

        this.cameras.main.fadeIn(400);
    }
}
