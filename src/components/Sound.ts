export class Sound {
    private sound: HTMLAudioElement;
    private isPlaying: boolean = false;

    constructor(soundPath: string, loop: boolean = false) {
        this.sound = new Audio(soundPath);
        this.sound.loop = loop;
    }

    async play() {

        try {
            if (this.sound.paused) {
                await this.sound.play();
                this.isPlaying = true;
            } else {
                this.sound.pause();
                this.isPlaying = false;
            }
        } catch (error) {
            console.log('Audio playback requires user interaction first');
        }
    }

    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
        this.isPlaying = false;
    }

    isActive(): boolean {
        return !this.sound.muted;
    }

    setVolume(volume: number) {
        this.sound.volume = Math.max(0, Math.min(1, volume));
    }

    setPlaybackRate(rate: number) {
        this.sound.playbackRate = Math.max(0.1, Math.min(2, rate));
    }

    isCurrentlyPlaying(): boolean {
        return this.isPlaying;
    }
} 