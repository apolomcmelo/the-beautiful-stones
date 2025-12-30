import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../consts';

export class TransitionScene extends Phaser.Scene {
    constructor() { super({ key: 'TransitionScene' }); }
    create() {
        const cx = SCREEN_WIDTH / 2;
        const cy = SCREEN_HEIGHT / 2;
        this.cameras.main.setBackgroundColor('#000000');
        this.add.image(cx, cy, 'world_globe').setScale(0.32);
        this.add.text(cx, 50, "A Caminho do Deserto...", { fontFamily: 'Courier New', fontSize: '24px', color: '#fff', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

        const startX = 200;
        const startY = cy - 120;
        const endX = SCREEN_WIDTH - 150;
        const endY = cy + 70;

        // Ponto de controle para criar o arco
        const controlX = (startX + endX) / 2;
        const controlY = cy - 90;

        const plane = this.add.image(startX, startY, 'plane_sprite').setScale(1.2).setDepth(10);

        // Curva de Bézier quadrática
        const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(startX, startY),
            new Phaser.Math.Vector2(controlX, controlY),
            new Phaser.Math.Vector2(endX, endY)
        );

        this.cameras.main.fadeIn(400);

        this.tweens.add({
            targets: { t: 0 },
            t: 1,
            duration: 5000,
            ease: 'Sine.easeInOut',
            onUpdate: (_tween: any, target: any) => {
                const point = curve.getPoint(target.t);
                plane.setPosition(point.x, point.y);

                const tangent = curve.getTangent(target.t);
                plane.setRotation(Math.atan2(tangent.y, tangent.x));
            },
            onComplete: () => {
                this.cameras.main.fadeOut(1000);
                this.time.delayedCall(1000, () => {
                    this.scene.start('MainScene', { level: 4, newGame: false });
                });
            }
        });
    }
}
