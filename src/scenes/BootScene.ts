import Phaser from 'phaser';
import slide1 from '../resources/cutscenes/slide1-the-cave-warm.png';
import slide2 from '../resources/cutscenes/slide2-the-dwarf-warm.png';
import slide3 from '../resources/cutscenes/slide3-the-invitation-warm.png';
import slide4 from '../resources/cutscenes/slide4-the-gate-warm.png';
import slide5 from '../resources/cutscenes/slide5-the-monster-warm.png';
import gameOverImg from '../resources/cutscenes/game-over.png';
import cover from '../resources/cover/cover.png';
import fiodorSprite from '../resources/sprites/characters-sprites.png';
import consumablesSprite from '../resources/sprites/consumables-sprites.png';
import itemsSprite from '../resources/sprites/items-sprites.png';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.image('slide1', slide1);
        this.load.image('slide2', slide2);
        this.load.image('slide3', slide3);
        this.load.image('slide4', slide4);
        this.load.image('slide5', slide5);
        this.load.image('gameOver', gameOverImg);
        this.load.image('cover', cover);
        this.load.spritesheet('fiodor', fiodorSprite, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('consumables', consumablesSprite, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('items', itemsSprite, { frameWidth: 32, frameHeight: 32 });

        const g = this.make.graphics({ x: 0, y: 0 });

        // --- ARTE ---
        // PAREDES
        g.clear(); g.fillStyle(0x505050); g.fillRect(0, 0, 32, 32); g.lineStyle(1, 0x303030); g.moveTo(0, 10); g.lineTo(32, 10); g.moveTo(0, 22); g.lineTo(32, 22); g.moveTo(10, 0); g.lineTo(10, 10); g.moveTo(20, 10); g.lineTo(20, 22); g.moveTo(5, 22); g.lineTo(5, 32); g.generateTexture('wall', 32, 32);

        // CHÃOS
        g.clear(); g.fillStyle(0x2c3e50); g.fillRect(0, 0, 32, 32); g.fillStyle(0x34495e); for (let i = 0; i < 5; i++) g.fillRect(Phaser.Math.Between(0, 28), Phaser.Math.Between(0, 28), 2, 2); g.generateTexture('mine_floor', 32, 32);
        g.clear(); g.fillStyle(0x7f8c8d); g.fillRect(0, 0, 32, 32); g.lineStyle(1, 0x95a5a6); g.strokeRect(2, 2, 28, 28); g.generateTexture('ruin_floor', 32, 32);
        g.clear(); g.fillStyle(0xe67e22); g.fillRect(0, 0, 32, 32); g.fillStyle(0xd35400); for (let i = 0; i < 8; i++) g.fillRect(Phaser.Math.Between(0, 30), Phaser.Math.Between(0, 30), 1, 1); g.generateTexture('sand_floor', 32, 32);

        // PERSONAGENS
        g.clear(); g.fillStyle(0xe0ac69); g.fillRect(8, 4, 16, 14); g.fillStyle(0x8fbc8f); g.fillRect(8, 18, 16, 14); g.fillStyle(0x000000); g.fillRect(12, 8, 2, 2); g.fillRect(20, 8, 2, 2); g.generateTexture('denise', 32, 48);
        g.clear(); g.fillStyle(0x1a1a1a); g.fillRect(4, 12, 24, 16); g.fillStyle(0xffffff); g.fillTriangle(6, 12, 10, 8, 14, 12); g.fillTriangle(20, 12, 24, 8, 28, 12); g.generateTexture('maron', 32, 32);
        // g.clear(); g.fillStyle(0xfff8dc); g.fillRect(4, 12, 24, 16); g.fillStyle(0x000000); g.fillRect(6, 14, 2, 4); g.fillRect(26, 14, 2, 4); g.generateTexture('fiodor', 32, 32);
        g.clear(); g.fillStyle(0xd2b48c); g.fillRect(4, 12, 24, 16); g.fillStyle(0x8b4513); g.fillRect(14, 12, 6, 16); g.generateTexture('orpheu', 32, 32);
        g.clear(); g.fillStyle(0x8b4513); g.fillCircle(16, 16, 12); g.fillStyle(0xffffff); g.fillCircle(12, 12, 4); g.generateTexture('koffe', 32, 32);

        // NPCs e Inimigos
        g.clear(); g.fillStyle(0x8b0000); g.fillRect(6, 10, 20, 20); g.fillStyle(0xffd700); g.fillRect(8, 2, 16, 6); g.generateTexture('dwarf', 32, 32);
        g.clear(); g.fillStyle(0xbdc3c7); g.fillRect(8, 4, 16, 24); g.generateTexture('statue', 32, 32);
        g.clear(); g.fillStyle(0x800000); g.fillRect(0, 0, 64, 80); g.fillStyle(0xffd700); g.fillRect(10, 10, 44, 20); g.generateTexture('boss', 64, 80);

        // ITENS
        // texturas de formulário agora vêm do spritesheet 'items' (frames configurados na MainScene)
        g.clear(); g.fillStyle(0x2ecc71); g.fillRect(8, 8, 16, 16); g.generateTexture('stamp_auth', 32, 32);
        g.clear(); g.fillStyle(0xf1c40f); g.fillRect(4, 4, 24, 24); g.fillStyle(0x000000); g.fillRect(6, 10, 20, 2); g.fillRect(6, 16, 20, 2); g.generateTexture('visa', 32, 32);

        // OBJETOS ESPECIAIS
        g.clear(); g.fillStyle(0x8b4513); g.fillRect(0, 0, 32, 32); g.fillStyle(0xcd853f); g.fillRect(4, 4, 24, 24); g.fillStyle(0x000000); g.fillCircle(24, 16, 2); g.generateTexture('door', 32, 32);
        g.clear(); g.fillStyle(0x333333); g.fillRect(0, 0, 32, 32); g.fillStyle(0xff0000); g.fillRect(4, 8, 24, 16); g.generateTexture('password_screen', 32, 32);

        // PEDRAS
        g.clear(); g.fillStyle(0x95a5a6); g.fillRect(4, 4, 24, 28); g.lineStyle(2, 0xffffff); g.strokeRect(4, 4, 24, 28); g.generateTexture('stone_left', 32, 32);
        g.clear(); g.fillStyle(0x505050); g.fillRect(4, 4, 24, 28); g.lineStyle(2, 0xffd700); g.strokeRect(4, 4, 24, 28); g.generateTexture('stone_right', 32, 32);
        g.clear(); g.fillStyle(0x95a5a6); g.fillRect(2, 10, 28, 12); g.lineStyle(2, 0x000000); g.strokeRect(2, 10, 28, 12); g.generateTexture('stone_top', 32, 32);

        // AMBIENTE
        g.clear(); g.fillStyle(0x000000, 0.4); g.fillEllipse(16, 16, 40, 30); g.generateTexture('shadow', 48, 32);
        g.clear(); g.fillStyle(0x7f8c8d); g.fillRect(4, 10, 24, 22); g.fillStyle(0x000000); g.fillRect(12, 20, 8, 12); g.generateTexture('tomb', 32, 32);
        g.clear(); g.fillStyle(0x95a5a6, 0.5); g.fillRect(0, 0, 96, 32); g.generateTexture('dolmen_base', 96, 32);

        // CENÁRIO & PROJÉTEIS
        g.clear(); g.fillStyle(0x00ffff); g.fillEllipse(16, 16, 20, 28); g.generateTexture('portal', 32, 32);
        g.clear(); g.fillStyle(0xff00ff); g.fillEllipse(16, 16, 20, 28); g.generateTexture('portal_back', 32, 32);
        g.clear(); g.fillStyle(0x8b4513); g.fillRect(2, 2, 28, 28); g.lineStyle(2, 0x5c3a1e); g.strokeRect(2, 2, 28, 28); g.lineStyle(1, 0x5c3a1e); g.moveTo(2, 2); g.lineTo(30, 30); g.moveTo(30, 2); g.lineTo(2, 30); g.generateTexture('heavybox', 32, 32);
        g.clear(); g.fillStyle(0xff0000); g.fillRect(0, 0, 24, 24); g.generateTexture('projectile', 24, 24);

        // BOSS
        g.clear(); g.fillStyle(0xffffff); g.fillRect(0, 0, 20, 10); g.lineStyle(1, 0x000000); g.strokeRect(0, 0, 20, 10); g.generateTexture('paper_attack', 20, 10);
        g.clear(); g.fillStyle(0x000000, 0.3); g.fillCircle(32, 32, 30); g.generateTexture('stamp_shadow', 64, 64);
        g.clear(); g.fillStyle(0x8b0000); g.fillCircle(32, 32, 28); g.fillStyle(0xffffff); g.fillRect(16, 28, 32, 6); g.fillRect(20, 36, 24, 4); g.generateTexture('stamp_giant', 64, 64);

        // --- TEXTURAS TRANSITION ---
        g.clear(); g.fillStyle(0xffffff); g.beginPath(); g.moveTo(20, 0); g.lineTo(40, 20); g.lineTo(20, 20); g.lineTo(20, 30); g.lineTo(10, 30); g.lineTo(15, 20); g.lineTo(0, 20); g.closePath(); g.fill(); g.generateTexture('plane', 40, 30);
        g.clear(); g.fillStyle(0x3498db); g.fillRect(0, 0, 800, 600); g.fillStyle(0x27ae60); g.fillCircle(200, 300, 100); g.fillCircle(600, 350, 120); g.generateTexture('world_map', 800, 600);

        // --- TEXTURAS BOLO ---
        g.clear(); g.fillStyle(0xFFB6C1); g.fillRect(0, 20, 64, 44); g.fillStyle(0xFFFFFF); g.fillRect(0, 20, 64, 10); g.fillStyle(0xFF0000); g.fillRect(28, 0, 8, 20); g.fillStyle(0xFFA500); g.fillCircle(32, 0, 4); g.generateTexture('cake', 64, 64);

        // --- NOVAS TEXTURAS (PARTÍCULAS) ---
        // Poeira (Círculo difuso)
        g.clear(); g.fillStyle(0xffffff, 0.8); g.fillCircle(4, 4, 4); g.generateTexture('particle_dust', 8, 8);
        // Brilho (Estrela)
        g.clear(); g.fillStyle(0xffffff); g.beginPath(); g.moveTo(4, 0); g.lineTo(5, 3); g.lineTo(8, 4); g.lineTo(5, 5); g.lineTo(4, 8); g.lineTo(3, 5); g.lineTo(0, 4); g.lineTo(3, 3); g.closePath(); g.fill(); g.generateTexture('particle_star', 8, 8);
        // Impacto (Quadrado irregular)
        g.clear(); g.fillStyle(0xffffff); g.fillRect(0, 0, 8, 8); g.generateTexture('particle_impact', 8, 8);
    }

    create() {
        this.scene.start('IntroScene');
    }
}
