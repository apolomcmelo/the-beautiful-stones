import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../consts';
import { unlockAudio } from '../utils/audio';

export class IntroScene extends Phaser.Scene {
    private currentSlide: number = 0;
    private slide0Group!: Phaser.GameObjects.Group;
    private slide1Group!: Phaser.GameObjects.Group;
    private slide2Group!: Phaser.GameObjects.Group;
    private slide3Group!: Phaser.GameObjects.Group;
    private catsArray: Phaser.GameObjects.Image[] = [];

    constructor() { super({ key: 'IntroScene' }); }

    create() {
        const cx = SCREEN_WIDTH / 2; const cy = SCREEN_HEIGHT / 2;
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // SLIDE 0
        this.slide0Group = this.add.group();
        const text0 = this.add.text(cx, cy, "Denise quer apenas escavar megálitos.\nMas para sair do país,\nela tem de enfrentar o maior monstro de todos...", { fontFamily: 'Courier New', fontSize: '18px', color: '#d3c6a6', align: 'center' }).setOrigin(0.5);
        this.slide0Group.add(text0);

        // SLIDE 1
        this.slide1Group = this.add.group();
        const bg1 = this.add.rectangle(cx, cy, SCREEN_WIDTH, SCREEN_HEIGHT, 0x2c3e50);
        const dwarf1 = this.add.image(cx - 50, cy + 50, 'dwarf').setScale(2);
        const dwarf2 = this.add.image(cx + 50, cy + 50, 'dwarf').setScale(2).setFlipX(true);
        const text1 = this.add.text(cx, cy - 50, "ANÕES: Descobrimos megálitos novos!\nVamos convidar a humana!", { fontFamily: 'Courier New', fontSize: '20px', color: '#fff', align: 'center', backgroundColor: '#000' }).setOrigin(0.5);
        this.slide1Group.add(bg1); this.slide1Group.add(dwarf1); this.slide1Group.add(dwarf2); this.slide1Group.add(text1);
        this.slide1Group.setVisible(false);

        // SLIDE 2
        this.slide2Group = this.add.group();
        const bg2 = this.add.rectangle(cx, cy, SCREEN_WIDTH, SCREEN_HEIGHT, 0x8b4513);
        const denise = this.add.image(cx, cy + 20, 'denise').setScale(3);
        const letter = this.add.rectangle(cx + 10, cy + 30, 20, 15, 0xffffff);
        const text2 = this.add.text(cx, cy - 100, "DENISE: Um convite? Megálitos novos?\nVamos a isso!", { fontFamily: 'Courier New', fontSize: '20px', color: '#fff', align: 'center' }).setOrigin(0.5);
        const c1 = this.add.image(cx - 60, cy + 60, 'maron').setAlpha(0);
        const c2 = this.add.image(cx - 30, cy + 60, 'fiodor').setAlpha(0);
        const c3 = this.add.image(cx + 30, cy + 60, 'orpheu').setAlpha(0);
        const c4 = this.add.image(cx + 60, cy + 60, 'koffe').setAlpha(0);
        this.slide2Group.add(bg2); this.slide2Group.add(denise); this.slide2Group.add(letter); this.slide2Group.add(text2);
        this.slide2Group.add(c1); this.slide2Group.add(c2); this.slide2Group.add(c3); this.slide2Group.add(c4);
        this.slide2Group.setVisible(false);
        this.catsArray = [c1, c2, c3, c4];

        // SLIDE 3
        this.slide3Group = this.add.group();
        const bg3 = this.add.rectangle(cx, cy, SCREEN_WIDTH, SCREEN_HEIGHT, 0x8b0000);
        const text3 = this.add.text(cx, cy - 20, "O INIMIGO FINAL:\n\nA ADMINISTRAÇÃO PÚBLICA ESPANHOLA", { fontFamily: 'Courier New', fontSize: '26px', color: '#fff', align: 'center', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
        const btnBg = this.add.rectangle(cx, cy + 100, 250, 50, 0x000000).setInteractive({ useHandCursor: true });
        const btnText = this.add.text(cx, cy + 100, "INICIAR EXPEDIÇÃO", { fontSize: '18px', color: '#d3c6a6' }).setOrigin(0.5);
        btnBg.setStrokeStyle(2, 0xe0ac69);
        btnBg.on('pointerdown', () => {
            unlockAudio();
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => this.scene.start('MainScene', { level: 1, newGame: true }));
        });
        btnBg.on('pointerover', () => btnBg.setFillStyle(0x333333));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0x000000));
        this.slide3Group.add(bg3); this.slide3Group.add(text3); this.slide3Group.add(btnBg); this.slide3Group.add(btnText);
        this.slide3Group.setVisible(false);

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            unlockAudio();
            if (this.currentSlide === 3 && pointer.y > cy + 70 && pointer.y < cy + 130) return;
            this.nextSlide();
        });
        this.add.text(SCREEN_WIDTH - 10, SCREEN_HEIGHT - 10, "(Clique para avançar)", { fontSize: '12px', color: '#666' }).setOrigin(1);
    }

    nextSlide() {
        if (this.currentSlide === 0) { this.slide0Group.setVisible(false); this.slide1Group.setVisible(true); this.cameras.main.fadeIn(500); this.currentSlide++; }
        else if (this.currentSlide === 1) { this.slide1Group.setVisible(false); this.slide2Group.setVisible(true); this.cameras.main.fadeIn(500); this.currentSlide++; this.tweens.add({ targets: this.catsArray, alpha: 1, y: '-=10', duration: 800, delay: 500, ease: 'Power2' }); }
        else if (this.currentSlide === 2) { this.slide2Group.setVisible(false); this.slide3Group.setVisible(true); this.cameras.main.flash(1000, 255, 0, 0); this.currentSlide++; }
    }
}
