import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../consts';

export class TransitionScene extends Phaser.Scene {
    constructor() { super({ key: 'TransitionScene' }); }
    create() {
        this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'world_map');
        this.add.text(SCREEN_WIDTH / 2, 50, "A Caminho do Deserto...", { fontFamily: 'Courier New', fontSize: '24px', color: '#fff', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
        const graphics = this.add.graphics(); graphics.lineStyle(4, 0xffffff, 1);
        const path = new Phaser.Curves.Line([200, 300, 600, 350]); path.draw(graphics);
        const plane = this.add.image(200, 300, 'plane').setScale(2);
        this.tweens.add({ targets: plane, x: 600, y: 350, duration: 4000, ease: 'Sine.easeInOut', onComplete: () => { this.cameras.main.fadeOut(1000); this.time.delayedCall(1000, () => { this.scene.start('MainScene', { level: 4, newGame: false }); }); } });
    }
}
