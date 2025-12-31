import Phaser from 'phaser';
import { LEVEL_1_DATA, LEVEL_2_DATA, WORLD_WIDTH, WORLD_HEIGHT } from '../consts';
import { sfx, playAssistantVoice } from '../utils/audio';

const STONE_FRAMES = {
    west: 0,   // 1ª coluna, 1ª fileira
    east: 3,   // 1ª coluna, 2ª fileira
    north: 6,  // 1ª coluna, 3ª fileira (boss)
    top: 9     // 1ª coluna, 4ª fileira
};

export class MainScene extends Phaser.Scene {
    private isGameStarted: boolean = false;
    private isDialogueOpen: boolean = false;
    private currentRoom: number = 1;
    private player!: Phaser.Physics.Arcade.Sprite;
    private assistants: Phaser.Physics.Arcade.Sprite[] = [];
    private activeAssistantIndex: number = 0;
    private playerHealth: number = 100;
    private selector!: Phaser.GameObjects.Triangle;
    private boss: Phaser.Physics.Arcade.Sprite | null = null;
    private bossHealth: number = 100;
    private bossAttackTimer: number = 0;
    private lastHeatDamage: number = 0;
    private lastHealTime: number = 0;
    private screenFixed: boolean = false;
    private buffSpeed: boolean = false;
    private buffDefense: boolean = false;
    private buffTimer: number = 0;
    private stepTimer: number = 0; // Timer para sons de passos
    private isGameOver: boolean = false;
    private isInvincible: boolean = false;
    private invincibleTimer: Phaser.Time.TimerEvent | null = null;
    private invincibleTween: Phaser.Tweens.Tween | null = null;
    private pendingTransition: boolean = false;
    private dialogueQueue: { name: string; text: string }[] = [];
    private doorRoom1Opened: boolean = false;
    private doorRoom2Opened: boolean = false;
    private gateOpened: boolean = false;
    private gateBlock: Phaser.Physics.Arcade.Sprite | null = null;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: any;
    private keys123!: any;
    private keys4K!: any;
    private keySpace!: Phaser.Input.Keyboard.Key;
    private keyZ!: Phaser.Input.Keyboard.Key;
    private keyX!: Phaser.Input.Keyboard.Key;
    private keyC!: Phaser.Input.Keyboard.Key;

    // Consumíveis em inventário
    private cinnamonCount = 0;
    private cloveCount = 0;
    private pastelCount = 0;
    private iconCache: Map<string, string> = new Map();

    // Emissores de Partículas
    private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    private sparkleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
    private impactEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    private startLevel: number = 1;
    private isNewGame: boolean = false;

    // Groups
    private walls!: Phaser.Physics.Arcade.StaticGroup;
    private bg!: Phaser.GameObjects.TileSprite;
    private items!: Phaser.Physics.Arcade.StaticGroup;
    private spices!: Phaser.Physics.Arcade.StaticGroup;
    private npcs!: Phaser.Physics.Arcade.StaticGroup;
    private specialObjects!: Phaser.Physics.Arcade.StaticGroup;
    private heavyBoxes!: Phaser.Physics.Arcade.Group;
    private projectiles!: Phaser.Physics.Arcade.Group;
    private gems!: Phaser.Physics.Arcade.StaticGroup;
    private pedestals!: Phaser.Physics.Arcade.StaticGroup;
    private shadows!: Phaser.Physics.Arcade.StaticGroup;
    private tombs!: Phaser.Physics.Arcade.StaticGroup;
    private dolmenBase!: Phaser.Physics.Arcade.Sprite;
    private bossAttackGroup!: Phaser.Physics.Arcade.Group;
    private portals!: Phaser.Physics.Arcade.Group;

    private stoneSprites: { west?: Phaser.GameObjects.Sprite; east?: Phaser.GameObjects.Sprite; north?: Phaser.GameObjects.Sprite; top?: Phaser.GameObjects.Sprite; final?: Phaser.GameObjects.Sprite } = {};
    private clearStoneSprites() {
        Object.values(this.stoneSprites).forEach(s => s?.destroy());
        this.stoneSprites = {};
    }

    constructor() {
        super({ key: 'MainScene' });
    }

    private playStoneAnim(frameStart: number, depth: number, x: number, y: number): Phaser.GameObjects.Sprite {
        const animKey = `stone-anim-${frameStart}`;
        if (!this.anims.exists(animKey)) {
            this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers('items', { start: frameStart, end: frameStart + 2 }),
                frameRate: 6,
                repeat: -1
            });
        }
        const sprite = this.add.sprite(x, y, 'items', frameStart).setDepth(depth);
        sprite.play(animKey);
        return sprite;
    }

    private stopStoneAnim(sprite?: Phaser.GameObjects.Sprite) {
        if (sprite && sprite.anims.isPlaying) {
            sprite.anims.pause(sprite.anims.currentAnim?.frames[0]);
        }
    }

    init(data: { level?: number, newGame?: boolean }) {
        this.startLevel = data.level || 1;
        this.isNewGame = data.newGame || false;
        this.isGameOver = false;
        this.isInvincible = false;
        this.clearInvincibility();
        this.doorRoom1Opened = false;
        this.doorRoom2Opened = false;
        this.gateOpened = false;
        this.gateBlock = null;
        this.pendingTransition = false;
        if (this.isNewGame) {
            this.cinnamonCount = 0;
            this.cloveCount = 0;
            this.pastelCount = 0;
            this.playerHealth = 100;
            this.bossHealth = 100;
        }
    }

    create() {
        (window as any).gameScene = this;

        // Create Animations for Fiódor
        if (!this.anims.exists('fiodor-walk-down')) {
            this.anims.create({ key: 'fiodor-walk-down', frames: this.anims.generateFrameNumbers('fiodor', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'fiodor-walk-right', frames: this.anims.generateFrameNumbers('fiodor', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'fiodor-walk-up', frames: this.anims.generateFrameNumbers('fiodor', { start: 8, end: 11 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'fiodor-walk-left', frames: this.anims.generateFrameNumbers('fiodor', { start: 12, end: 15 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'fiodor-idle-down', frames: this.anims.generateFrameNumbers('fiodor', { start: 16, end: 19 }), frameRate: 5, repeat: -1 });
        }

        if (!this.anims.exists('green-guard-idle')) {
            this.anims.create({
                key: 'green-guard-idle',
                frames: this.anims.generateFrameNumbers('green_guard', { start: 0, end: 3 }),
                frameRate: 4,
                repeat: -1
            });
        }
        if (!this.anims.exists('red-guard-idle')) {
            this.anims.create({
                key: 'red-guard-idle',
                frames: this.anims.generateFrameNumbers('red_guard', { start: 0, end: 3 }),
                frameRate: 4,
                repeat: -1
            });
        }
        // Reset de referências
        this.walls = null as any;
        this.bg = null as any;
        this.items = null as any;
        this.spices = null as any;
        this.npcs = null as any;
        this.specialObjects = null as any;
        this.heavyBoxes = null as any;
        this.projectiles = null as any;
        this.boss = null;
        this.gems = null as any;
        this.pedestals = null as any;
        this.shadows = null as any;
        this.tombs = null as any;
        this.dolmenBase = null as any;
        this.bossAttackGroup = null as any;
        this.portals = null as any;

        if (this.isNewGame) {
            this.registry.set('hasFormGreen', false); this.registry.set('hasFormRed', false); this.registry.set('hasStamp', false); this.registry.set('hasVisa', false);
            this.registry.set('hasStoneWest', false); this.registry.set('hasStoneEast', false); this.registry.set('hasStoneNorth', false); this.registry.set('hasStoneTop', false);
            this.registry.set('hasFormGreenAuth', false);
            this.registry.set('placedWest', false); this.registry.set('placedEast', false); this.registry.set('placedNorth', false); this.registry.set('placedTop', false);
            this.registry.set('doorRoom2Opened', false);
            this.registry.set('gateOpened', false);
            this.registry.set('screenFixed', false);
        }

        this.registry.events.on('changedata', this.updateInventoryUI, this);

        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        // --- SISTEMAS DE PARTÍCULAS ---
        // Poeira
        this.dustEmitter = this.add.particles(0, 0, 'particle_dust', {
            lifespan: 300,
            scale: { start: 1, end: 0 },
            alpha: { start: 0.5, end: 0 },
            speed: 15,
            frequency: 100,
            // follow: null, // Será anexado ao jogador manualmente ou via update
            stopAfter: 0
        });
        this.dustEmitter.setDepth(5);
        this.dustEmitter.stop(); // Começa parado

        // Brilhos
        this.sparkleEmitter = this.add.particles(0, 0, 'particle_star', {
            lifespan: 600,
            speed: { min: 50, max: 100 },
            scale: { start: 1, end: 0 },
            rotate: { start: 0, end: 360 },
            emitting: false
        });
        this.sparkleEmitter.setDepth(30);

        // Impacto
        this.impactEmitter = this.add.particles(0, 0, 'particle_impact', {
            lifespan: 400,
            speed: { min: 50, max: 150 },
            scale: { start: 1.5, end: 0 },
            tint: [0xff0000, 0x000000],
            emitting: false
        });
        this.impactEmitter.setDepth(30);

        this.createPlayerAndCats();

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = this.input.keyboard!.addKeys('W,A,S,D');
        this.keys123 = this.input.keyboard!.addKeys('ONE,TWO,THREE');
        this.keys4K = this.input.keyboard!.addKeys({ FOUR: Phaser.Input.Keyboard.KeyCodes.FOUR, K: Phaser.Input.Keyboard.KeyCodes.K });
        this.keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyZ = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyX = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.keyC = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.selector = this.add.triangle(0, 0, 0, 0, 5, 10, 10, 0, 0xffff00).setDepth(20).setVisible(false);

        this.startGameplay();
    }

    createPlayerAndCats() {
        this.player = this.physics.add.sprite(100, 300, 'main_character', 1).setDepth(10).setVisible(false);
        (this.player.body as Phaser.Physics.Arcade.Body).setSize(20, 20);
        (this.player.body as Phaser.Physics.Arcade.Body).setOffset(6, 28);
        this.player.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5);

        this.assistants = [
            this.physics.add.sprite(80, 300, 'maron').setName("Maron"),
            this.physics.add.sprite(60, 300, 'fiodor').setName("Fiódor"),
            this.physics.add.sprite(40, 300, 'orpheu').setName("Orpheu"),
            this.physics.add.sprite(20, 300, 'koffe').setName("Koffe") // Index 3
        ];
        this.assistants.forEach(c => {
            c.setDepth(10).setVisible(false);
            c.setCollideWorldBounds(true);
            c.setBounce(0.5);
            (c.body as Phaser.Physics.Arcade.Body).setSize(20, 20);
        });
    } startGameplay() {
        this.isGameStarted = true;
        this.player.setVisible(true);
        this.assistants.forEach(c => c.setVisible(true));
        this.selector.setVisible(true);
        this.loadLevel(this.startLevel);
        this.updateInventoryUI();
        this.updateUI();
    }

    loadLevel(level: number) {
        this.currentRoom = level;
        this.lastHeatDamage = 0;
        this.buffSpeed = false;
        this.buffDefense = false;
        this.player.setVelocity(0);
        this.updateBuffUI();

        // Update Dust Color
        if (level === 4) this.dustEmitter.setParticleTint(0xd35400); // Laranja no deserto
        else this.dustEmitter.setParticleTint(0xcccccc); // Cinza no resto

        // Clear groups
        if (this.walls) this.walls.clear(true, true);
        if (this.bg) this.bg.destroy();
        if (this.items) this.items.clear(true, true);
        if (this.spices) this.spices.clear(true, true);
        if (this.npcs) this.npcs.clear(true, true);
        if (this.specialObjects) this.specialObjects.clear(true, true);
        if (this.heavyBoxes) this.heavyBoxes.clear(true, true);
        if (this.projectiles) this.projectiles.clear(true, true);
        if (this.boss) this.boss.destroy();
        if (this.gems) this.gems.clear(true, true);
        if (this.pedestals) this.pedestals.clear(true, true);
        if (this.shadows) this.shadows.clear(true, true);
        if (this.tombs) this.tombs.clear(true, true);
        if (this.dolmenBase) this.dolmenBase.destroy();
        if (this.bossAttackGroup) this.bossAttackGroup.clear(true, true);
        if (this.portals) this.portals.clear(true, true);
        else this.portals = this.physics.add.group();

        this.clearStoneSprites();

        this.walls = this.physics.add.staticGroup();
        this.items = this.physics.add.staticGroup();
        this.spices = this.physics.add.staticGroup();
        this.npcs = this.physics.add.staticGroup();
        this.specialObjects = this.physics.add.staticGroup();
        this.gems = this.physics.add.staticGroup();
        this.pedestals = this.physics.add.staticGroup();
        this.shadows = this.physics.add.staticGroup();
        this.tombs = this.physics.add.staticGroup();
        this.heavyBoxes = this.physics.add.group({ bounceX: 0, bounceY: 0, dragX: 800, dragY: 800 });
        this.projectiles = this.physics.add.group();
        this.bossAttackGroup = this.physics.add.group();

        this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.assistants, this.walls);
        this.physics.add.collider(this.assistants, this.heavyBoxes);
        this.physics.add.collider(this.heavyBoxes, this.walls);
        this.physics.add.collider(this.player, this.heavyBoxes);
        this.physics.add.collider(this.player, this.specialObjects);
        this.physics.add.collider(this.assistants, this.specialObjects);
        this.physics.add.collider(this.player, this.npcs);
        this.physics.add.collider(this.assistants, this.npcs);

        if (level === 1) this.setupLevel1_Mines();
        else if (level === 2) this.setupLevel2_Ruins();
        else if (level === 3) this.setupLevel3_Boss();
        else if (level === 4) this.setupLevel4_Desert();

        // Add boss collision if boss exists
        if (this.boss) {
            this.physics.add.collider(this.player, this.boss);
        }
    }

    // ================= HELPER DE PARTÍCULAS =================
    triggerSparkles(x: number, y: number, tint: number = 0xffff00) {
        this.sparkleEmitter.setParticleTint(tint);
        this.sparkleEmitter.explode(10, x, y);
    }

    triggerImpact(x: number, y: number) {
        this.impactEmitter.explode(8, x, y);
        sfx.explosion(); // Som de explosão
    }

    // ================= FASES =================
    setupLevel1_Mines() {
        this.doorRoom2Opened = !!this.registry.get('doorRoom2Opened');
        this.gateOpened = !!this.registry.get('gateOpened');
        this.bg = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'mine_floor').setOrigin(0).setDepth(0);
        const data = LEVEL_1_DATA;
        for (let y = 0; y < data.height; y++) { for (let x = 0; x < data.width; x++) { if (data.layout[y * data.width + x] === 1) this.walls.create(x * 32 + 16, y * 32 + 16, 'wall'); } }

        const buildRoom = (x1: number, x2: number, y1: number, y2: number, doorX: number, doorY: number) => {
            for (let x = x1; x <= x2; x++) {
                for (let y = y1; y <= y2; y++) {
                    const isPerimeter = x === x1 || x === x2 || y === y1 || y === y2;
                    if (isPerimeter && !(x === doorX && y === doorY)) {
                        this.walls.create(x * 32 + 16, y * 32 + 16, 'wall');
                    }
                }
            }
        };
        data.objects.forEach(obj => {
            const pixelX = obj.x * 32 + 16; const pixelY = obj.y * 32 + 16;
            if (obj.type === 'player_start') { this.player.setPosition(pixelX, pixelY); this.assistants.forEach(a => a.setPosition(pixelX - 20, pixelY)); }
            else if (obj.type === 'stone_left') {
                if (!this.registry.get('hasStoneWest') && !this.registry.get('placedWest')) {
                    const stone = this.items.create(pixelX, pixelY, 'items', STONE_FRAMES.west);
                    stone.setData('type', 'stone_left');
                }
            }
            else if (obj.type === 'spice_cinnamon') { const cin = this.spices.create(pixelX, pixelY, 'consumables', 0).setData('type', 'cinnamon'); this.physics.add.overlap(this.player, cin, this.collectSpice, undefined, this); }
            else if (obj.type === 'guard_gate') {
                if (!this.gateOpened) {
                    const npc = this.npcs.create(pixelX, pixelY, 'green_guard');
                    npc.setData('type', 'guard_gate');
                    npc.setName('Analista de Políticas de Inmigración');
                    npc.setSize(48, 48).setOffset(2, 16); // Mantém colisão no piso
                    npc.refreshBody();
                    npc.play('red-guard-idle');
                }
            }
            else if (obj.type === 'guard_room2') {
                if (!this.doorRoom2Opened) {
                    const npc = this.npcs.create(pixelX, pixelY, 'green_guard');
                    npc.setOrigin(0.5, 1);
                    npc.setData('type', 'guard_room2');
                    npc.setName('Axente de Visados');
                    npc.setSize(48, 48).setOffset(2, 16); // Mantém colisão no piso
                    npc.refreshBody();
                    npc.play('green-guard-idle');
                }
            }
            else if (obj.type === 'door_room1') { const door = this.specialObjects.create(pixelX, pixelY, 'door'); door.setData('type', 'door_room1'); }
            else if (obj.type === 'door_room2') {
                if (!this.doorRoom2Opened) {
                    const door = this.specialObjects.create(pixelX, pixelY, 'door'); door.setData('type', 'door_room2');
                }
            }
            else if (obj.type === 'form_green') {
                if (!this.registry.get('hasFormGreen')) {
                    const form = this.items.create(pixelX, pixelY, 'items', 15);
                    form.setData('type', 'form_green');
                }
            }
            else if (obj.type === 'form_red') {
                if (!this.registry.get('hasFormRed')) {
                    const form = this.items.create(pixelX, pixelY, 'items', 16);
                    form.setData('type', 'form_red');
                }
            }
        });
        // Construir salas fechadas (exceto no tile da porta) para manter formulários dentro
        buildRoom(4, 8, 4, 8, 6, 8);   // Sala 1 (form 1B azul)
        buildRoom(10, 14, 6, 9, 12, 9); // Sala 2 (anão + form 2B rosa)
        this.removeWallAt(6, 8);  // Tile da porta da sala 1
        this.removeWallAt(6, 7);  // Tile interno logo atrás da porta 1
        if (this.doorRoom2Opened) {
            this.removeWallAt(12, 9); // Tile da porta da sala 2 já aberta
        }

        // Bloqueio do portão até liberação
        if (!this.gateOpened) {
            this.gateBlock = this.walls.create(21 * 32 + 16, 9 * 32 + 16, 'wall');
            this.triggerDialogue("Denise", "Koffe, encontre a porta trancada sem guarda...");
        } else {
            this.createExit(650, 300, 2);
        }
    }

    setupLevel2_Ruins() {
        this.bg = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'ruin_floor').setOrigin(0).setDepth(0);
        this.screenFixed = !!this.registry.get('screenFixed');
        const data = LEVEL_2_DATA;
        for (let y = 0; y < data.height; y++) { for (let x = 0; x < data.width; x++) { if (data.layout[y * data.width + x] === 1) this.walls.create(x * 32 + 16, y * 32 + 16, 'wall'); } }
        this.createReturnPortal(50, 300, 1);
        let queueIndex = 0; // Counter for queue NPCs to assign unique frames
        data.objects.forEach(obj => {
            const pixelX = obj.x * 32 + 16; const pixelY = obj.y * 32 + 16;
            if (obj.type === 'player_start') { this.player.setPosition(pixelX, pixelY); this.assistants.forEach(a => a.setPosition(pixelX - 20, pixelY)); }
            else if (obj.type === 'password_screen') {
                const screen = this.specialObjects.create(pixelX, pixelY, 'password_screen');
                screen.setData('type', 'broken_screen');
                screen.setData('fixed', this.screenFixed);
                if (this.screenFixed) screen.setTint(0x00ff00);
            }
            else if (obj.type === 'clerk') {
                const npc = this.npcs.create(pixelX, pixelY, 'npc', 0);
                npc.setImmovable(true);
                npc.setData('type', 'clerk');
                if (this.screenFixed && this.registry.get('hasStamp')) {
                    npc.x = 1000; // afasta se já entregou o selo
                }
            }
            else if (obj.type === 'npc_queue') {
                const frame = 1 + (queueIndex % 3); // Cycle through frames 1, 2, 3 for queue NPCs
                queueIndex++;
                const npc = this.npcs.create(pixelX, pixelY, 'npc', frame);
                npc.setImmovable(true);
                npc.setData('type', 'queue');
            }
            else if (obj.type === 'stone_right') {
                if (!this.registry.get('hasStoneEast') && !this.registry.get('placedEast')) {
                    const stone = this.items.create(pixelX, pixelY, 'items', STONE_FRAMES.east);
                    stone.setData('type', 'stone_right');
                }
            }
            else if (obj.type === 'spice_clove') { const clove = this.spices.create(pixelX, pixelY, 'consumables', 1).setData('type', 'clove'); this.physics.add.overlap(this.player, clove, this.collectSpice, undefined, this); }
        });
        if (this.screenFixed && this.registry.get('hasStamp') && (this.registry.get('hasStoneEast') || this.registry.get('placedEast'))) {
            this.createExit(650, 300, 3);
        }
        this.triggerDialogue("Denise", "Que sala de espera... A senha parou no AA04?");
    }

    setupLevel3_Boss() {
        this.player.setPosition(100, 300);
        this.playerHealth = 100;
        this.updateUI();
        this.bg = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'ruin_floor').setTint(0xffd700).setOrigin(0).setDepth(0);
        this.createWallsRect(0, 0, 25, 19);
        this.createReturnPortal(50, 300, 2);
        if (!this.registry.get('hasVisa')) {
            this.bossHealth = 100;
            this.boss = this.physics.add.sprite(600, 300, 'boss').setImmovable(true).setScale(0.75);
            const bossHealthBar = document.getElementById('boss-health-bar');
            if (bossHealthBar) {
                bossHealthBar.style.display = 'block';
                const bossHealthFill = document.getElementById('boss-health-fill');
                if (bossHealthFill) bossHealthFill.style.width = this.bossHealth + '%';
            }
            this.triggerDialogue("Don Escribán", "PARADA! Onde está a Licença de Campo B7-Alfa?");
        } else { this.createExit(650, 300, 4); }
    }

    setupLevel4_Desert() {
        this.player.setPosition(200, 300);
        this.assistants.forEach(a => a.setPosition(180, 300));
        this.bg = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'sand_floor').setOrigin(0).setDepth(0);
        const bossHealthBar = document.getElementById('boss-health-bar');
        if (bossHealthBar) bossHealthBar.style.display = 'none';
        this.createWallsRect(0, 0, 25, 2); this.createWallsRect(0, 17, 25, 2);
        this.createReturnPortal(50, 300, 3);
        this.shadows.create(200, 200, 'shadow'); this.shadows.create(500, 400, 'shadow'); this.shadows.create(100, 300, 'shadow');
        this.tombs.create(300, 150, 'tomb').setData('hasStone', false).setImmovable(true);
        this.tombs.create(400, 500, 'tomb').setData('hasStone', false).setImmovable(true);
        const topTomb = this.tombs.create(600, 150, 'tomb').setImmovable(true) as Phaser.Physics.Arcade.Sprite;
        const hasTop = this.registry.get('hasStoneTop') || this.registry.get('placedTop');
        topTomb.setData('hasStone', !hasTop);
        if (hasTop) topTomb.setTint(0x555555);
        this.dolmenBase = this.physics.add.staticSprite(600, 300, 'dolmen_base');
        const pastel = this.spices.create(500, 350, 'consumables', 2).setData('type', 'pastel');
        pastel.setFrame(2); // Garante o frame correto do pastel de nata
        this.physics.add.overlap(this.player, pastel, this.collectSpice, undefined, this);
        this.restoreDolmenState();
    }

    // ================= UPDATE =================
    update(time: number, delta: number) {
        if (!this.isGameStarted) return;

        let currentSpeed = 150;
        if (this.buffSpeed) currentSpeed += 100;

        this.player.setVelocity(0);
        if (!this.isDialogueOpen) {
            if (this.cursors.left.isDown || this.wasd.A.isDown) { this.player.setVelocityX(-currentSpeed); this.player.setFrame(2); }
            else if (this.cursors.right.isDown || this.wasd.D.isDown) { this.player.setVelocityX(currentSpeed); this.player.setFrame(3); }
            if (this.cursors.up.isDown || this.wasd.W.isDown) { this.player.setVelocityY(-currentSpeed); this.player.setFrame(0); }
            else if (this.cursors.down.isDown || this.wasd.S.isDown) { this.player.setVelocityY(currentSpeed); this.player.setFrame(1); }
        }

        // --- CONTROLO DA POEIRA & SOM DE PASSOS ---
        if (this.player.body!.velocity.length() > 10) {
            // Atualiza a posição da poeira para os pés da Denise
            this.dustEmitter.setPosition(this.player.x, this.player.y + 20);
            this.dustEmitter.start();
            // Som de passos
            if (time > this.stepTimer) {
                sfx.step();
                this.stepTimer = time + 300; // Intervalo entre passos
            }
        } else {
            this.dustEmitter.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys123.ONE)) this.changeAssistant(0);
        if (Phaser.Input.Keyboard.JustDown(this.keys123.TWO)) this.changeAssistant(1);
        if (Phaser.Input.Keyboard.JustDown(this.keys123.THREE)) this.changeAssistant(2);
        if (Phaser.Input.Keyboard.JustDown(this.keys4K.FOUR) || Phaser.Input.Keyboard.JustDown(this.keys4K.K)) this.changeAssistant(3);
        if (Phaser.Input.Keyboard.JustDown(this.keyZ)) this.useConsumable('cinnamon');
        if (Phaser.Input.Keyboard.JustDown(this.keyX)) this.useConsumable('clove');
        if (Phaser.Input.Keyboard.JustDown(this.keyC)) this.useConsumable('pastel');

        const activeCat = this.assistants[this.activeAssistantIndex];
        if (activeCat) this.selector.setPosition(activeCat.x, activeCat.y - 25);

        this.assistants.forEach((cat, i) => {
            if (cat.name === "Koffe" && cat.getData('mode') === 'hint') {
                const target = cat.getData('target');
                if (target) {
                    this.physics.moveTo(cat, target.x, target.y, 200);
                    if (Phaser.Math.Distance.Between(cat.x, cat.y, target.x, target.y) < 50) {
                        (cat.body as Phaser.Physics.Arcade.Body).setVelocity(0); cat.setData('mode', 'follow');
                        this.showFloatingText(cat.x, cat.y - 30, "Woof! Aqui!", 0xffff00);
                    }
                }
            } else {
                const dist = Phaser.Math.Distance.Between(cat.x, cat.y, this.player.x, this.player.y);
                if (dist > 60 + (i * 20)) this.physics.moveToObject(cat, this.player, currentSpeed * 0.9);
                else (cat.body as Phaser.Physics.Arcade.Body).setVelocity(0);
            }

            // Animation Logic for Fiódor
            if (cat.name === "Fiódor") {
                const vel = (cat.body as Phaser.Physics.Arcade.Body).velocity;
                if (vel.length() > 5) {
                    if (Math.abs(vel.x) > Math.abs(vel.y)) {
                        if (vel.x > 0) cat.play('fiodor-walk-right', true);
                        else cat.play('fiodor-walk-left', true);
                    } else {
                        if (vel.y > 0) cat.play('fiodor-walk-down', true);
                        else cat.play('fiodor-walk-up', true);
                    }
                } else {
                    // cat.stop(); // Don't stop animation completely, play idle
                    cat.play('fiodor-idle-down', true);
                }
            }
        });

        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
            if (this.isDialogueOpen) this.closeDialogue();
            else {
                let interacted = this.handleInteractions();
                if (!interacted) this.performAssistantAction(time);
            }
        }

        if (this.currentRoom === 3 && this.boss && this.boss.active && !this.isDialogueOpen) {
            if (time > this.bossAttackTimer) { this.bossAttackTimer = time + 2500; this.bossAttackRoutine(); }
        }

        if (this.currentRoom === 4 && !this.isDialogueOpen && !this.registry.get('placedTop')) {
            const isSafe = this.physics.overlap(this.player, this.shadows);
            if (!isSafe && time > this.lastHeatDamage + 1000) {
                this.damagePlayer(2);
                this.showFloatingText(this.player.x, this.player.y - 20, "Calor!", 0xff0000);
                this.lastHeatDamage = time;
            }
        }

        if (this.buffSpeed || this.buffDefense) {
            this.buffTimer -= delta;
            if (this.buffTimer <= 0) {
                this.buffSpeed = false; this.buffDefense = false;
                this.updateBuffUI();
                this.showFloatingText(this.player.x, this.player.y - 20, "Buff terminou", 0xffffff);
            }
        }
    }

    performAssistantAction(time: number) {
        const activeCat = this.assistants[this.activeAssistantIndex];
        playAssistantVoice(activeCat.name);
        if (activeCat.name === "Maron") {
            if (time > this.lastHealTime + 2000) {
                this.playerHealth = Math.min(100, this.playerHealth + 10);
                this.triggerSparkles(activeCat.x, activeCat.y, 0x00ff00); // Brilho verde de cura
                sfx.collect(); // Som de cura (reutiliza o ding)
                this.updateUI(); this.showFloatingText(activeCat.x, activeCat.y - 20, "Purr... +10 HP", 0x2ecc71);
                this.lastHealTime = time;
            }
        }
        else if (activeCat.name === "Koffe") { this.activateKoffeHint(); }
        //else if (activeCat.name === "Fiódor") { this.showFloatingText(activeCat.x, activeCat.y - 20, "Preciso de algo para consertar...", 0x3498db); }
        //else if (activeCat.name === "Orpheu") { this.showFloatingText(activeCat.x, activeCat.y - 20, "Preciso de uma porta trancada...", 0xffffff); }
    }

    handleSpecialInteraction(target: Phaser.GameObjects.GameObject) {
        const activeCat = this.assistants[this.activeAssistantIndex];
        const type = target.getData('type');
        const targetSprite = target as Phaser.Physics.Arcade.Sprite;

        if (type === 'door_room1') {
            if (this.doorRoom1Opened) {
                this.triggerDialogue("Denise", "A porta já está aberta.");
                return true;
            }
            if (activeCat.name === 'Orpheu') {
                this.doorRoom1Opened = true;
                playAssistantVoice('Orpheu');
                this.triggerSparkles(targetSprite.x, targetSprite.y, 0xffffff);
                sfx.action();
                targetSprite.disableBody(true, true);
                targetSprite.destroy();
                this.removeWallAt(6, 8);
                this.removeWallAt(6, 7);
            } else {
                this.triggerDialogue("Denise", "Não alcanço essa maçaneta. Se eu tivesse alguém que conseguisse abrir portas pulando...");
            }
            return true;
        }

        if (type === 'door_room2') {
            if (this.doorRoom2Opened) {
                return false;
            }
            this.triggerDialogue("Denise", "O Axente de Visados tem a chave. Preciso passar por ele.");
            return true;
        }

        if (type === 'broken_screen' && activeCat.name === 'Fiódor') {
            if (!target.getData('fixed')) {
                playAssistantVoice('Fiódor');
                this.cameras.main.flash(400); // Flash ao consertar
                this.triggerSparkles(targetSprite.x, targetSprite.y, 0x00ffff); // Brilho ciano
                sfx.action(); // Som de ação
                target.setData('fixed', true);
                targetSprite.setTint(0x00ff00);
                this.screenFixed = true;
                this.registry.set('screenFixed', true);
                return true;
            }
        } else if (type === 'broken_screen') {
            if (!target.getData('fixed')) {
                this.triggerDialogue("Denise", "Esse ecrã parece estar quebrado. E tem muitas peças mecânicas com óleo...");
                return true;
            }
        }
        return false;
    }

    activateKoffeHint() {
        const koffe = this.assistants[3];
        let target: { x: number, y: number } | null = null;
        if (this.currentRoom === 1) {
            if (!this.registry.get('hasFormGreen')) {
                target = { x: 6 * 32 + 16, y: 8 * 32 + 16 }; // Porta sem guarda
            } else if (!this.registry.get('hasFormGreenAuth')) {
                target = { x: 20 * 32 + 16, y: 9 * 32 + 16 }; // Analista para autenticar 1B
            } else if (!this.registry.get('hasFormRed')) {
                target = { x: 12 * 32 + 16, y: 9 * 32 + 16 }; // Axente para liberar 2B
            } else {
                target = { x: 20 * 32 + 16, y: 9 * 32 + 16 }; // Analista abre portal
            }
        } else if (this.currentRoom === 2) {
            if (!this.screenFixed) target = { x: 13 * 32 + 16, y: 4 * 32 + 16 };
            else if (!this.registry.get('hasStamp')) target = { x: 13 * 32 + 16, y: 5 * 32 + 16 };
            else if (!this.registry.get('hasStoneEast') && !this.registry.get('placedEast')) target = { x: 22 * 32 + 16, y: 5 * 32 + 16 };
        } else if (this.currentRoom === 4) {
            if (!this.registry.get('hasStoneTop')) target = { x: 600, y: 150 };
        }

        if (target) {
            koffe.setData('mode', 'hint'); koffe.setData('target', target);
            sfx.collect(); // Som de dica
            this.showFloatingText(koffe.x, koffe.y - 20, "Sniff sniff...", 0xffff00);
        } else {
            this.showFloatingText(koffe.x, koffe.y - 20, "Nada por aqui.", 0xcccccc);
        }
    }

    bossAttackRoutine() {
        if (!this.boss) return;
        const rand = Phaser.Math.RND.integerInRange(1, 3);
        if (rand === 1) { this.fireProjectile(); }
        else if (rand === 2) {
            this.showFloatingText(this.boss.x, this.boss.y - 50, "Afogue-se em burocracia!", 0xffffff);
            for (let i = 0; i < 5; i++) {
                const paper = this.bossAttackGroup.create(100 + (i * 100), 0, 'paper_attack');
                paper.setVelocityY(200); paper.setVelocityX(Phaser.Math.RND.integerInRange(-50, 50));
            }
        }
        else if (rand === 3) {
            this.showFloatingText(this.boss.x, this.boss.y - 50, "REJEITADO!", 0xff0000);
            const shadow = this.add.image(this.player.x, this.player.y, 'stamp_shadow').setAlpha(0.5);
            this.tweens.add({
                targets: shadow, alpha: 1, scale: 0.1, duration: 1000,
                onComplete: () => {
                    if (Phaser.Math.Distance.Between(this.player.x, this.player.y, shadow.x, shadow.y) < 40) { this.damagePlayer(25); }
                    this.triggerImpact(shadow.x, shadow.y); // Impacto Visual
                    const stamp = this.add.image(shadow.x, shadow.y, 'stamp_giant');
                    shadow.destroy(); this.time.delayedCall(500, () => stamp.destroy());
                }
            });
        }
        this.physics.add.overlap(this.player, this.bossAttackGroup, (_p, obj) => { obj.destroy(); this.damagePlayer(15); });
    }

    collectSpice(player: any, spice: any) {
        const type = spice.getData('type'); spice.destroy();
        this.triggerSparkles(player.x, player.y, 0x00ff00);
        sfx.collect();

        if (type === 'cinnamon') {
            this.cinnamonCount++;
            this.showFloatingText(player.x, player.y - 20, "+1 Canela", 0xffff00);
            this.triggerDialogue("Denise", "Canela coletada! Para usar, pressione Z.");
            this.updateInventoryUI();
        }
        else if (type === 'clove') {
            this.cloveCount++;
            this.showFloatingText(player.x, player.y - 20, "+1 Cravo", 0xffff00);
            this.triggerDialogue("Denise", "Cravo coletado! Para usar, pressione X.");
            this.updateInventoryUI();
        }
        else if (type === 'pastel') {
            this.pastelCount++;
            this.showFloatingText(player.x, player.y - 20, "+1 Pastel de Nata", 0xffff00);
            this.triggerDialogue("Denise", "Pastel de Nata coletado! Para usar, pressione C.");
            this.updateInventoryUI();
        }
    }

    updateBuffUI() {
        const container = document.getElementById('buff-container');
        if (!container) return;
        container.innerHTML = '';
        if (this.buffSpeed) container.innerHTML += '<div class="buff-tag">⚡ Canela (Vel)</div>';
        if (this.buffDefense) container.innerHTML += '<div class="buff-tag">🛡️ Cravo (Def)</div>';
    }

    handleInteractions() {
        const px = this.player.x; const py = this.player.y;
        let npc = this.npcs.getChildren().find(n => Phaser.Math.Distance.Between(px, py, (n as any).x, (n as any).y) < 60);
        if (npc) { this.handleNPC(npc as Phaser.Physics.Arcade.Sprite); return true; }
        let item = this.items.getChildren().find(i => Phaser.Math.Distance.Between(px, py, (i as any).x, (i as any).y) < 40);
        if (item) { this.collectItem(item as Phaser.Physics.Arcade.Sprite); return true; }

        let gem = this.gems.getChildren().find(g => Phaser.Math.Distance.Between(px, py, (g as any).x, (g as any).y) < 40);
        if (gem) { this.collectGem(gem as Phaser.Physics.Arcade.Sprite); return true; }

        let ped = this.pedestals.getChildren().find(p => Phaser.Math.Distance.Between(px, py, (p as any).x, (p as any).y) < 40);
        if (ped) { this.interactPedestal(ped as Phaser.Physics.Arcade.Sprite); return true; }
        let tomb = this.tombs.getChildren().find(t => Phaser.Math.Distance.Between(px, py, (t as any).x, (t as any).y) < 50);
        if (tomb) { this.checkTomb(tomb as Phaser.Physics.Arcade.Sprite); return true; }
        if (this.dolmenBase && this.dolmenBase.active && Phaser.Math.Distance.Between(px, py, this.dolmenBase.x, this.dolmenBase.y) < 60) { this.buildDolmen(); return true; }
        if (this.currentRoom === 3 && this.boss && this.boss.active && Phaser.Math.Distance.Between(px, py, this.boss.x, this.boss.y) < 80) { this.attackBoss(); return true; }

        let special = this.specialObjects.getChildren().find(o => Phaser.Math.Distance.Between(px, py, (o as any).x, (o as any).y) < 50);
        if (special) {
            return this.handleSpecialInteraction(special);
        }

        return false;
    }

    handleNPC(npc: Phaser.Physics.Arcade.Sprite) {
        if (this.currentRoom === 1) {
            const type = npc.getData('type');
            if (type === 'guard_room2') {
                if (this.doorRoom2Opened) {
                    this.triggerDialogue("Axente de Visados", "A porta já está aberta. Anda lá.");
                    return;
                }
                if (!this.registry.get('hasFormGreen')) {
                    this.triggerDialogue("Axente de Visados", "Tráz-me o Formulário Verde.");
                    return;
                }

                if (this.registry.get('hasFormGreen') && !this.registry.get('hasFormGreenAuth')) {
                    this.startDialogueSequence([
                        { name: "Axente de Visados", text: "Preciso do Formulário Verde autenticado." },
                        { name: "Denise", text: "Você não disse isso antes!" },
                        { name: "Axente de Visados", text: "Esse é o processo. Autentica com o Analista de Políticas de Inmigración." },
                        { name: "Denise", text: "C'um carago. Isso só pode ser galego." }
                    ]);
                    return;
                }

                if (this.registry.get('hasFormGreenAuth') && !this.registry.get('hasFormRed')) {
                    this.doorRoom2Opened = true;
                    this.registry.set('doorRoom2Opened', true);
                    this.triggerDialogue("Axente de Visados", "Agora sim. Pode passar.");
                    sfx.action();
                    const door = this.specialObjects.getChildren().find(o => o.getData('type') === 'door_room2') as Phaser.Physics.Arcade.Sprite;
                    if (door) { door.disableBody(true, true); door.destroy(); }
                    this.removeWallAt(12, 9);
                    this.tweens.add({ targets: npc, alpha: 0, duration: 400, onComplete: () => npc.disableBody(true, true) });
                    return;
                }

                this.triggerDialogue("Axente de Visados", "Já tens o Formulário Vermelho? Então avança.");
            } else if (type === 'guard_gate') {
                const name = npc.name || "Analista de Políticas de Inmigración";
                if (this.gateOpened) {
                    this.triggerDialogue(name, "O portão já está aberto.");
                    return;
                }

                if (this.registry.get('hasFormRed')) {
                    this.gateOpened = true;
                    this.registry.set('gateOpened', true);
                    this.triggerDialogue(name, "Formulário Vermelho? Aprovado. Abrindo o portão.");
                    sfx.action();
                    this.createExit(650, 300, 2);
                    if (this.gateBlock) { this.gateBlock.destroy(); this.gateBlock = null; }
                    this.tweens.add({ targets: npc, alpha: 0, duration: 400, onComplete: () => npc.disableBody(true, true) });
                    return;
                }

                if (this.registry.get('hasFormGreen') && !this.registry.get('hasFormGreenAuth')) {
                    this.registry.set('hasFormGreenAuth', true);
                    this.triggerDialogue(name, "Formulário Verde autenticado. Agora traga o Formulário Vermelho.");
                    sfx.collect();
                    return;
                }

                this.triggerDialogue(name, "Preciso do Formulário Vermelho, senão não abro.");
            }
        } else if (this.currentRoom === 2) {
            const type = npc.getData('type');
            if (type === 'queue') {
                this.triggerDialogue("Estátua Viva", "A senha é AM69... o painel travou em AA04 faz anos.");
            } else if (type === 'clerk') {
                if (this.screenFixed) {
                    if (!this.registry.get('hasStamp')) {
                        this.registry.set('hasStamp', true);
                        this.triggerDialogue("Atendente", "Vocês arrumaram? Gracias. Como agradecimento, vou te poupar tempo. Pode seguir sua jornada.");
                        this.triggerSparkles(npc.x, npc.y, 0x00ff00); // Brilho de sucesso
                        sfx.collect(); // Som de item importante
                        npc.x = 1000;
                        if (this.registry.get('hasStoneEast') || this.registry.get('placedEast')) {
                            this.createExit(650, 300, 3);
                        }
                    } else {
                        this.triggerDialogue("Atendente", "Próximo!");
                        if (this.registry.get('hasStoneEast') || this.registry.get('placedEast')) this.createExit(650, 300, 3);
                    }
                } else {
                    this.triggerDialogue("Atendente", "Esse ecrã está quebrado há tempos. Se ao menos tivéssemos um mecânico...");
                }
            }
        }
    }

    collectItem(item: Phaser.Physics.Arcade.Sprite) {
        const key = (item.getData('type') as string) || item.texture.key;
        this.triggerSparkles(item.x, item.y, 0xffff00); // Brilho amarelo
        sfx.collect(); // Som de coleta
        item.destroy();

        // Flash ao coletar itens importantes
        if (['stone_left', 'stone_right', 'stone_top', 'stamp_auth', 'form_red', 'form_green', 'visa'].includes(key)) {
            this.cameras.main.flash(400);
        }

        if (key === 'stone_left') { this.registry.set('hasStoneWest', true); this.announceStoneCollection(); }
        else if (key === 'stone_right') {
            this.registry.set('hasStoneEast', true);
            this.announceStoneCollection();
            if (this.registry.get('hasStamp')) this.createExit(650, 300, 3);
        }
        else if (key === 'stamp_auth') { this.registry.set('hasStamp', true); this.triggerDialogue("Denise", "Carimbo obtido!"); }
        else if (key === 'form_green') {
            this.registry.set('hasFormGreen', true);
            this.triggerDialogue("Denise", "Formulário Verde em mãos!");
        }
        else if (key === 'form_red') {
            this.triggerSparkles(item.x, item.y, 0xff69b4);
            this.registry.set('hasFormRed', true); this.triggerDialogue("Denise", "Pronto. Já estou com Formulário Vermelho!");
        }
        this.updateInventoryUI();

        if (this.currentRoom === 2 && this.registry.get('hasStamp') && (this.registry.get('hasStoneEast') || this.registry.get('placedEast'))) {
            this.createExit(650, 300, 3);
        }
    }

    collectGem(_gem: Phaser.Physics.Arcade.Sprite) { }
    interactPedestal(_ped: Phaser.Physics.Arcade.Sprite) { }
    checkPuzzle() { }

    checkTomb(tomb: Phaser.Physics.Arcade.Sprite) {
        if (tomb.getData('hasStone')) {
            if (!this.registry.get('hasStoneTop')) {
                this.registry.set('hasStoneTop', true);
                this.announceStoneCollection();
                tomb.setTint(0x555555);
                tomb.setData('hasStone', false);
                this.triggerSparkles(tomb.x, tomb.y, 0xffd700); // Ouro
                sfx.collect();
            } else this.triggerDialogue("Denise", "Já está vazia.");
        } else this.triggerDialogue("Denise", "Apenas pó.");
    }

    buildDolmen() {
        const r = this.registry;
        if (r.get('hasStoneWest') && !r.get('placedWest')) {
            r.set('placedWest', true);
            r.set('hasStoneWest', false);
            if (this.stoneSprites.west) this.stoneSprites.west.destroy();
            this.stoneSprites.west = this.playStoneAnim(STONE_FRAMES.west, 5, this.dolmenBase.x - 30, this.dolmenBase.y - 10);
            this.triggerSparkles(this.dolmenBase.x - 30, this.dolmenBase.y, 0xffffff);
            sfx.action();
            this.time.delayedCall(3000, () => this.stopStoneAnim(this.stoneSprites.west));
            this.updateInventoryUI();
        }
        else if (r.get('hasStoneEast') && !r.get('placedEast')) {
            r.set('placedEast', true);
            r.set('hasStoneEast', false);
            if (this.stoneSprites.east) this.stoneSprites.east.destroy();
            this.stoneSprites.east = this.playStoneAnim(STONE_FRAMES.east, 5, this.dolmenBase.x + 30, this.dolmenBase.y - 10);
            this.triggerSparkles(this.dolmenBase.x + 30, this.dolmenBase.y, 0xffffff);
            sfx.action();
            this.time.delayedCall(3000, () => this.stopStoneAnim(this.stoneSprites.east));
            this.updateInventoryUI();
        }
        else if (r.get('hasStoneNorth') && !r.get('placedNorth')) {
            r.set('placedNorth', true);
            r.set('hasStoneNorth', false);
            if (this.stoneSprites.north) this.stoneSprites.north.destroy();
            this.stoneSprites.north = this.playStoneAnim(STONE_FRAMES.north, 4, this.dolmenBase.x, this.dolmenBase.y - 10);
            this.triggerSparkles(this.dolmenBase.x, this.dolmenBase.y, 0xffffff);
            sfx.action();
            this.time.delayedCall(3000, () => this.stopStoneAnim(this.stoneSprites.north));
            this.updateInventoryUI();
        }
        else if (r.get('hasStoneTop') && !r.get('placedTop') && r.get('placedWest') && r.get('placedEast') && r.get('placedNorth')) {
            r.set('placedTop', true);
            r.set('hasStoneTop', false);
            if (this.stoneSprites.top) this.stoneSprites.top.destroy();
            this.stoneSprites.top = this.playStoneAnim(STONE_FRAMES.top, 6, this.dolmenBase.x, this.dolmenBase.y - 32);
            this.triggerSparkles(this.dolmenBase.x, this.dolmenBase.y - 32, 0xffff00);
            sfx.win(); // Fanfarra inicial
            this.updateInventoryUI();
            this.time.delayedCall(3000, () => {
                // remover pedras antigas
                ['west', 'east', 'north', 'top'].forEach(k => {
                    const key = k as keyof typeof this.stoneSprites;
                    if (this.stoneSprites[key]) { this.stoneSprites[key]!.destroy(); this.stoneSprites[key] = undefined; }
                });
                // pedra final (5ª fileira) frames 12-14
                const finalAnimStart = 12;
                const finalKey = `stone-anim-${finalAnimStart}`;
                if (!this.anims.exists(finalKey)) {
                    this.anims.create({ key: finalKey, frames: this.anims.generateFrameNumbers('items', { start: finalAnimStart, end: finalAnimStart + 2 }), frameRate: 6, repeat: -1 });
                }
                if (this.stoneSprites.final) this.stoneSprites.final.destroy();
                this.stoneSprites.final = this.add.sprite(this.dolmenBase.x, this.dolmenBase.y - 32, 'items', finalAnimStart).setDepth(6);
                this.stoneSprites.final.play(finalKey);
                this.time.delayedCall(3000, () => {
                    this.stoneSprites.final?.anims.pause(this.stoneSprites.final.anims.currentAnim?.frames[0]);
                    this.winGame();
                });
            });
        }
    }

    changeAssistant(index: number) {
        this.activeAssistantIndex = index;
        const cat = this.assistants[index];
        sfx.swap(); // Som de troca
        this.tweens.add({ targets: cat, y: cat.y - 10, duration: 100, yoyo: true });
    }

    private getStoneCount(): number {
        const r = this.registry;
        const flags = ['hasStoneWest', 'hasStoneEast', 'hasStoneNorth', 'hasStoneTop'] as const;
        return flags.reduce((acc, key) => acc + (r.get(key) ? 1 : 0), 0);
    }

    private getStoneLine(count: number): string | null {
        if (count === 1) return "Essa é uma beeela pedra.";
        if (count === 2) return "Outra bela pedra";
        if (count === 4) return "Mas que bela pedra. Uma beela pedra";
        return null;
    }

    private announceStoneCollection() {
        const msg = this.getStoneLine(this.getStoneCount());
        if (msg) this.triggerDialogue("Denise", msg);
    }

    attackBoss() {
        if (!this.boss) return;
        this.bossHealth -= 20;
        const bossHealthFill = document.getElementById('boss-health-fill');
        if (bossHealthFill) bossHealthFill.style.width = this.bossHealth + '%';
        this.showFloatingText(this.boss.x, this.boss.y - 60, "Isso é um suborno?!", 0xff0000);
        this.triggerImpact(this.boss.x, this.boss.y); // Impacto Visual no Boss

        if (this.bossHealth <= 0) {
            this.boss.destroy();
            this.projectiles.clear(true, true);
            this.bossAttackGroup.clear(true, true);
            const bossHealthBar = document.getElementById('boss-health-bar');
            if (bossHealthBar) bossHealthBar.style.display = 'none';

            this.cameras.main.flash(1000); // Grande flash ao vencer
            sfx.win(); // Fanfarra de vitória

            this.registry.set('hasVisa', true);
            this.registry.set('hasStoneNorth', true);

            this.pendingTransition = true;
            this.triggerDialogue("Don Escribán", "APROVADO! TOME O VISTO E A PEDRA NORTE! AGORA SUMAM!");
            this.announceStoneCollection();
        }
    }

    fireProjectile() {
        if (!this.boss) return;
        const p = this.projectiles.create(this.boss.x, this.boss.y, 'projectile');
        sfx.shoot(); // Som de tiro
        this.physics.moveToObject(p, this.player, 200);
        this.physics.add.overlap(this.player, p, () => { p.destroy(); this.damagePlayer(10); this.triggerImpact(this.player.x, this.player.y); });
    }

    damagePlayer(amount: number) {
        if (this.isInvincible) return;
        if (this.buffDefense) amount = Math.floor(amount / 2);
        this.playerHealth = Math.max(0, this.playerHealth - amount);
        this.updateUI();
        sfx.hurt(); // Som de dano
        this.cameras.main.shake(200, 0.01); // Shake da Câmera (Juice)
        if (this.playerHealth <= 0) this.handleGameOver();
    }

    private handleGameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.cameras.main.fadeOut(400);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameOverScene');
        });
    }

    private removeWallAt(tileX: number, tileY: number) {
        const targetX = tileX * 32 + 16;
        const targetY = tileY * 32 + 16;
        const wall = this.walls.getChildren().find(w => (w as any).x === targetX && (w as any).y === targetY) as Phaser.Physics.Arcade.Sprite | undefined;
        if (wall) wall.destroy();
    }

    private triggerInvincibility(duration: number = 5000) {
        this.isInvincible = true;
        if (this.invincibleTimer) this.invincibleTimer.remove(false);
        if (this.invincibleTween) this.invincibleTween.stop();
        this.player.setAlpha(1);

        this.invincibleTween = this.tweens.add({
            targets: this.player,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: -1
        });

        this.invincibleTimer = this.time.delayedCall(duration, () => {
            this.clearInvincibility();
        });
    }

    private clearInvincibility() {
        this.isInvincible = false;
        if (this.invincibleTimer) { this.invincibleTimer.remove(false); this.invincibleTimer = null; }
        if (this.invincibleTween) { this.invincibleTween.stop(); this.invincibleTween = null; }
        if (this.player) this.player.setAlpha(1);
    }

    private useConsumable(type: 'cinnamon' | 'clove' | 'pastel') {
        if (type === 'cinnamon') {
            if (this.cinnamonCount <= 0) return;
            this.cinnamonCount--;
            this.buffSpeed = true;
            this.buffTimer = 15000;
            this.updateBuffUI();
            this.showFloatingText(this.player.x, this.player.y - 20, "Velocidade!", 0xffff00);
            this.updateInventoryUI();
        }
        else if (type === 'clove') {
            if (this.cloveCount <= 0) return;
            this.cloveCount--;
            this.buffDefense = true;
            this.buffTimer = 15000;
            this.updateBuffUI();
            this.showFloatingText(this.player.x, this.player.y - 20, "Defesa!", 0x00ffff);
            this.updateInventoryUI();
        }
        else if (type === 'pastel') {
            if (this.pastelCount <= 0) return;
            this.pastelCount--;
            this.triggerInvincibility(5000);
            this.showFloatingText(this.player.x, this.player.y - 20, "Invencível!", 0xffff00);
            this.updateInventoryUI();
        }
    }

    // ... helpers ...
    restorePuzzleState() { }
    restoreDolmenState() {
        const r = this.registry;
        this.clearStoneSprites();
        if (r.get('placedWest')) this.stoneSprites.west = this.add.sprite(this.dolmenBase.x - 30, this.dolmenBase.y - 10, 'items', STONE_FRAMES.west).setDepth(5);
        if (r.get('placedEast')) this.stoneSprites.east = this.add.sprite(this.dolmenBase.x + 30, this.dolmenBase.y - 10, 'items', STONE_FRAMES.east).setDepth(5);
        if (r.get('placedNorth')) this.stoneSprites.north = this.add.sprite(this.dolmenBase.x, this.dolmenBase.y - 10, 'items', STONE_FRAMES.north).setDepth(4);
        if (r.get('placedTop')) this.stoneSprites.top = this.add.sprite(this.dolmenBase.x, this.dolmenBase.y - 32, 'items', STONE_FRAMES.top).setDepth(6);
    }
    createWallsRect(x: number, y: number, w: number, h: number) { for (let i = x; i < x + w; i++) { this.walls.create(i * 32 + 16, y * 32 + 16, 'wall'); this.walls.create(i * 32 + 16, (y + h) * 32 + 16, 'wall'); } for (let j = y; j <= y + h; j++) { this.walls.create(x * 32 + 16, j * 32 + 16, 'wall'); this.walls.create((x + w) * 32 + 16, j * 32 + 16, 'wall'); } }
    createExit(x: number, y: number, nextLevel: number) { const portal = this.portals.create(x, y, 'portal'); this.physics.add.overlap(this.player, portal, () => { this.loadLevel(nextLevel); }); }
    createReturnPortal(x: number, y: number, prevLevel: number) { const portal = this.portals.create(x, y, 'portal_back'); this.physics.add.overlap(this.player, portal, () => { this.loadLevel(prevLevel); }); }
    private showDialogueEntry(entry: { name: string; text: string }) {
        this.isDialogueOpen = true;
        const ui = document.getElementById('ui-layer');
        const uiName = document.getElementById('ui-name');
        const uiText = document.getElementById('ui-text');
        if (ui && uiName && uiText) {
            uiName.innerText = entry.name;
            uiText.innerText = entry.text;
            ui.style.display = 'block';
        }
    }

    triggerDialogue(name: string, text: string) {
        this.dialogueQueue = [];
        this.showDialogueEntry({ name, text });
    }

    private startDialogueSequence(dialogues: { name: string; text: string }[]) {
        if (!dialogues.length) return;
        const [first, ...rest] = dialogues;
        this.dialogueQueue = rest;
        this.showDialogueEntry(first);
    }

    closeDialogue() {
        if (this.dialogueQueue.length > 0) {
            const next = this.dialogueQueue.shift();
            if (next) {
                this.showDialogueEntry(next);
                return;
            }
        }

        this.isDialogueOpen = false;
        const ui = document.getElementById('ui-layer');
        if (ui) ui.style.display = 'none';
        if (this.currentRoom === 3 && this.boss && this.boss.active) {
            this.bossAttackTimer = this.time.now + 1500; // pausa breve após diálogo
        }
        if (this.pendingTransition) {
            this.pendingTransition = false;
            this.time.delayedCall(200, () => {
                this.scene.start('TransitionScene');
            });
        }
    }
    updateUI() {
        const healthFill = document.getElementById('health-fill');
        const healthValue = document.getElementById('health-value');
        if (healthFill) healthFill.style.width = this.playerHealth + '%';
        if (healthValue) healthValue.innerText = Math.floor(this.playerHealth).toString();
    }
    showFloatingText(x: number, y: number, message: string, color: number) {
        const colorStr = '#' + color.toString(16).padStart(6, '0');
        const text = this.add.text(x, y, message, { fontSize: '12px', color: colorStr, stroke: '#000', strokeThickness: 2 });
        this.tweens.add({ targets: text, y: y - 30, alpha: 0, duration: 1000, onComplete: () => text.destroy() });
    }
    private getFrameDataURL(textureKey: string, frameIndex: number): string | null {
        const cacheKey = `${textureKey}-${frameIndex}`;
        if (this.iconCache.has(cacheKey)) return this.iconCache.get(cacheKey)!;

        const texture = this.textures.exists(textureKey) ? this.textures.get(textureKey) : null;
        if (!texture) return null;
        const frame = texture.get(frameIndex);
        const source = texture.getSourceImage() as HTMLImageElement | HTMLCanvasElement | undefined;
        if (!frame || !source) return null;

        const canvas = document.createElement('canvas');
        canvas.width = frame.cutWidth;
        canvas.height = frame.cutHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(source, frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight, 0, 0, frame.cutWidth, frame.cutHeight);
        const dataUrl = canvas.toDataURL();
        this.iconCache.set(cacheKey, dataUrl);
        return dataUrl;
    }

    updateInventoryUI() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const r = this.registry;
        const items = [
            { key: 'cinnamon', label: 'Canela', collected: this.cinnamonCount > 0, frame: { texture: 'consumables', index: 0 }, count: this.cinnamonCount },
            { key: 'clove', label: 'Cravo', collected: this.cloveCount > 0, frame: { texture: 'consumables', index: 1 }, count: this.cloveCount },
            { key: 'pastel', label: 'Pastel de Nata', collected: this.pastelCount > 0, frame: { texture: 'consumables', index: 2 }, count: this.pastelCount },
            { key: 'form_green', label: 'Formulário 1B (Verde)', collected: r.get('hasFormGreen'), frame: { texture: 'items', index: 15 } },
            { key: 'form_red', label: 'Formulário 2B (Vermelho)', collected: r.get('hasFormRed'), frame: { texture: 'items', index: 16 } },
            { key: 'stone_west', label: 'Pedra Oeste', collected: r.get('hasStoneWest') || r.get('placedWest'), frame: { texture: 'items', index: STONE_FRAMES.west } },
            { key: 'stone_east', label: 'Pedra Leste', collected: r.get('hasStoneEast') || r.get('placedEast'), frame: { texture: 'items', index: STONE_FRAMES.east } },
            { key: 'stone_north', label: 'Pedra Norte', collected: r.get('hasStoneNorth') || r.get('placedNorth'), frame: { texture: 'items', index: STONE_FRAMES.north } },
            { key: 'stone_top', label: 'Pedra Topo', collected: r.get('hasStoneTop') || r.get('placedTop'), frame: { texture: 'items', index: STONE_FRAMES.top } }
        ];

        items.filter(item => item.collected).forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.title = item.label;
            const icon = this.getFrameDataURL(item.frame.texture, item.frame.index);
            if (icon) slot.style.backgroundImage = `url(${icon})`;

            if (item.count && item.count > 0) {
                const countEl = document.createElement('span');
                countEl.className = 'slot-count';
                countEl.textContent = item.count.toString();
                slot.appendChild(countEl);
            }

            grid.appendChild(slot);
        });
    }
    winGame() { this.scene.start('EndingScene'); }
}
