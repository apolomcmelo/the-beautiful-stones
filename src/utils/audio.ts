import maronMeow from '../resources/audio/maron-meow.mp3';
import fiodorMeow from '../resources/audio/fiodor-meow.mp3';
import orphewMeow from '../resources/audio/orphew-meow.mp3';
import koffeBark from '../resources/audio/koffe-bark.mp3';

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

// Bark sintetizado com camada de ruído e dois pulsos para soar mais natural (fallback)
const playBark = () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const trigger = (offset: number) => {
        const start = audioCtx.currentTime + offset;

        const gain = audioCtx.createGain();
        gain.connect(audioCtx.destination);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.6, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        const osc = audioCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(260, start);
        osc.frequency.exponentialRampToValueAtTime(180, start + 0.18);
        osc.connect(gain);
        osc.start(start);
        osc.stop(start + 0.3);

        const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.connect(gain);
        noise.start(start);
        noise.stop(start + 0.2);
    };

    trigger(0);
    trigger(0.18);
};

// --- PLAYER DE CLIP (BUFFER) ---
const clipCache = new Map<string, AudioBuffer>();

const getClip = async (url: string) => {
    if (clipCache.has(url)) return clipCache.get(url)!;
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    const buf = await audioCtx.decodeAudioData(arr);
    clipCache.set(url, buf);
    return buf;
};

const playClip = async (url: string, volume: number = 0.8) => {
    try {
        const buf = await getClip(url);
        const gain = audioCtx.createGain();
        gain.gain.value = volume;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start();
    } catch (e) {
        console.error('playClip failed', e);
    }
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
    bark: () => playClip(koffeBark).catch(() => playBark()),  // Latido real com fallback síntese
    win: () => {
        [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => playTone(0.3, f, 0.05, 0.3, 1), i * 150);
        });
    }
};

export const playAssistantVoice = (name: string): Promise<void> | void => {
    if (name === 'Maron') return playClip(maronMeow, 0.6);
    if (name === 'Fiódor' || name === 'Fiodor') return playClip(fiodorMeow, 0.6);
    if (name === 'Orpheu' || name === 'Orphew') return playClip(orphewMeow, 0.6);
    if (name === 'Koffe') return playClip(koffeBark, 0.6);
    return;
};
