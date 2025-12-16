// --- MOTOR DE SOM ROBUSTO ---
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
const audioCtx = new AudioContext();

// Helper global para garantir desbloqueio do áudio no primeiro clique
export const unlockAudio = () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            console.log("Audio Context Resumed/Unlocked");
        });
    }
};

// Função Geradora de Som
const playTone = (vol: number, freq: number, attack: number, decay: number, type: number = 1, slide: number = 0) => {
    // Tentativa de segurança de resume se ainda estiver suspenso
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const types: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];

    if (type === 4) {
        // Noise
        const bufferSize = audioCtx.sampleRate * (attack + decay);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = buffer;
        noiseSrc.connect(gainNode);
        noiseSrc.start();
    } else {
        osc.type = types[type] || 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (slide !== 0) {
            osc.frequency.linearRampToValueAtTime(freq + slide, audioCtx.currentTime + attack + decay);
        }
        osc.connect(gainNode);
        osc.start();
        osc.stop(audioCtx.currentTime + attack + decay);
    }

    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    // CORREÇÃO: Aumentei o volume base (removi o * 0.1 que estava a abafar o som)
    gainNode.gain.linearRampToValueAtTime(vol, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);
};

// --- PALETA DE SONS (Ajustada) ---
export const sfx = {
    step: () => playTone(0.1, 150, 0.01, 0.05, 3, -50),       // Passos (Volume reduzido para não incomodar)
    collect: () => playTone(0.3, 1200, 0.01, 0.2, 1, 0),     // Ding agudo
    hurt: () => playTone(0.4, 150, 0.05, 0.4, 2, -100),       // Dano grave
    swap: () => playTone(0.2, 600, 0.01, 0.1, 0, 200),        // Troca
    action: () => playTone(0.3, 400, 0.05, 0.3, 1, 400),      // Técnico
    shoot: () => playTone(0.3, 300, 0.01, 0.2, 2, -150),      // Laser Boss
    explosion: () => playTone(0.5, 0, 0.05, 0.5, 4),          // Explosão
    win: () => {
        [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => playTone(0.3, f, 0.05, 0.3, 1), i * 150);
        });
    }
};
