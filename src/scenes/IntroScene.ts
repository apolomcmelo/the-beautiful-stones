import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../consts';
import { unlockAudio } from '../utils/audio';

export class IntroScene extends Phaser.Scene {
    private currentSlideIndex: number = 0;
    private slideGroup!: Phaser.GameObjects.Group;
    private slides: any[];

    constructor() {
        super({ key: 'IntroScene' });
        this.slides = [
            {
                image: 'slide1',
                text: "Nas profundezas da terra, os Anões encontraram os fragmentos de um monumento esquecido. Artefatos de uma era perdida... complexos demais até para os maiores sábios de pedra.\nAs pedras chamam umas pelas outras, desejando ser reunidas sob o céu aberto... mas uma força terrível as mantém presas na escuridão."
            },
            {
                image: 'slide2',
                text: "Este artefato é tão interessante! Tão complexo.\nE pah! Precisamos da Senhora dos Megálitos.\nRezem para que os estafetas não percam este pedido de ajuda no caminho."
            },
            {
                image: 'slide3',
                text: "Então?... A sério? Pedras e mais pedras? Parece-me fun. Vamos a isso!"
            },
            {
                image: 'slide4',
                text: "Mas a Senhora dos Monólitos não sabia... O desafio não eram orcs, nem dragões, nem a língua negra."
            },
            {
                image: 'slide5',
                text: "Diante dela, erguia-se a criatura feita de sombra e fogo, que devora a esperança e o tempo:",
                fadeOutText: true
            },
            {
                image: null, // Black screen
                text: "A Burocracia Espanhola.",
                surprise: true
            },
            {
                image: 'cover',
                isTitleScreen: true
            }
        ];
    }

    create() {
        this.slideGroup = this.add.group();
        this.showSlide(0);

        this.input.on('pointerdown', () => {
            unlockAudio();
            const currentSlide = this.slides[this.currentSlideIndex];
            if (currentSlide && currentSlide.isTitleScreen) return;
            this.nextSlide();
        });

        this.add.text(SCREEN_WIDTH - 10, SCREEN_HEIGHT - 10, "(Clique para avançar)", { fontSize: '12px', color: '#666' }).setOrigin(1);
    }

    showSlide(index: number) {
        this.slideGroup.clear(true, true);

        if (index >= this.slides.length) {
            // Should not happen if last slide is title screen, but good fallback
            this.scene.start('MainScene', { level: 1, newGame: true });
            return;
        }

        const slide = this.slides[index];
        const cx = SCREEN_WIDTH / 2;
        const cy = SCREEN_HEIGHT / 2;

        if (slide.isTitleScreen) {
            // Title Screen Layout
            const img = this.add.image(cx, cy, slide.image);
            const scaleX = SCREEN_WIDTH / img.width;
            const scaleY = SCREEN_HEIGHT / img.height;
            const scale = Math.max(scaleX, scaleY);
            img.setScale(scale);
            this.slideGroup.add(img);

            // Title
            const titleText = this.add.text(cx, cy - 50, "A Jornada das\nBelas Pedras", {
                fontFamily: 'Courier New',
                fontSize: '40px',
                color: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 6,
                shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 0, stroke: true, fill: true }
            }).setOrigin(0.5);
            this.slideGroup.add(titleText);

            // Button
            const btnBg = this.add.rectangle(cx, cy + 100, 220, 50, 0x000000).setInteractive({ useHandCursor: true });
            btnBg.setStrokeStyle(2, 0xffffff);
            const btnText = this.add.text(cx, cy + 100, "INICIAR EXPEDIÇÃO", {
                fontFamily: 'Courier New',
                fontSize: '20px',
                color: '#ffffff'
            }).setOrigin(0.5);

            this.slideGroup.add(btnBg);
            this.slideGroup.add(btnText);

            btnBg.on('pointerover', () => btnBg.setFillStyle(0x333333));
            btnBg.on('pointerout', () => btnBg.setFillStyle(0x000000));
            btnBg.on('pointerdown', () => {
                unlockAudio();
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(500, () => {
                    this.scene.start('MainScene', { level: 1, newGame: true });
                });
            });

            this.cameras.main.fadeIn(500);
            return;
        }

        let dialogHeight = 0;
        let textObj: Phaser.GameObjects.Text | null = null;

        // 1. Create Text first to measure it
        if (slide.text) {
            const textStyle = {
                fontFamily: 'Courier New',
                fontSize: '16px',
                color: '#fff',
                align: 'center',
                wordWrap: { width: SCREEN_WIDTH - 40 }
            };

            if (!slide.image) {
                textStyle.fontSize = '20px';
            }

            // Create text
            textObj = this.add.text(cx, 0, slide.text, textStyle).setOrigin(0.5);

            if (slide.image) {
                // Calculate needed height
                const textHeight = textObj.height;
                dialogHeight = textHeight + 40; // Padding
                dialogHeight = Math.max(dialogHeight, 80); // Min height
            }
        }

        const imageAreaHeight = SCREEN_HEIGHT - dialogHeight;

        // 2. Setup Image and Backgrounds
        if (slide.image) {
            // Image
            const img = this.add.image(cx, imageAreaHeight / 2, slide.image);
            const scaleX = SCREEN_WIDTH / img.width;
            const scaleY = imageAreaHeight / img.height;
            const scale = Math.max(scaleX, scaleY);
            img.setScale(scale);
            this.slideGroup.add(img);

            // Dialog Box
            const dialogBg = this.add.rectangle(cx, SCREEN_HEIGHT - (dialogHeight / 2), SCREEN_WIDTH, dialogHeight, 0x000000);
            this.slideGroup.add(dialogBg);

            // Border
            const border = this.add.rectangle(cx, imageAreaHeight, SCREEN_WIDTH, 2, 0xffffff);
            this.slideGroup.add(border);

            // Position Text
            if (textObj) {
                textObj.setPosition(cx, SCREEN_HEIGHT - (dialogHeight / 2));
            }
        } else {
            // No image
            const bg = this.add.rectangle(cx, cy, SCREEN_WIDTH, SCREEN_HEIGHT, 0x000000);
            this.slideGroup.add(bg);

            if (textObj) {
                textObj.setPosition(cx, cy);
            }
        }

        // 3. Add Text to Group and Effects
        if (textObj) {
            textObj.setDepth(10);
            this.slideGroup.add(textObj);

            if (slide.fadeOutText) {
                this.tweens.add({
                    targets: this.slideGroup.getChildren(),
                    alpha: 0,
                    duration: 2000,
                    delay: 3000
                });
            }

            if (slide.surprise) {
                textObj.setAlpha(0);
                this.tweens.add({
                    targets: textObj,
                    alpha: 1,
                    duration: 500,
                    delay: 1000
                });
            }
        }

        this.cameras.main.fadeIn(500);
    }

    nextSlide() {
        this.currentSlideIndex++;
        this.showSlide(this.currentSlideIndex);
    }
}
