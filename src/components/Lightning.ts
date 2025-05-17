import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { Sound } from './Sound';

export class Lightning {
    private sprite: PIXI.Sprite;
    private app: PIXI.Application;
    private sound: Sound;
    private intervalThunder: number = 10000;
    private isInteractionEnabled: boolean = true;

    constructor(app: PIXI.Application, texture: PIXI.Texture, sound: Sound, intervalThunder: number = 15000) {
        this.app = app;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = app.screen.width;
        this.sprite.height = app.screen.height;
        this.sprite.alpha = 0;
        this.sound = sound;
        this.intervalThunder = intervalThunder;
        app.stage.addChild(this.sprite);
    }

    createEffect() {

        console.log(this.isInteractionEnabled);
        if (this.isInteractionEnabled) {
            gsap.timeline()
                .to(this.sprite, {
                    alpha: 1,
                    duration: 1,
                    ease: 'power1.in'
                })
                .to(this.sprite, {
                    alpha: 0,
                    duration: 3,
                    ease: 'power1.out'
                });
            // Screen shake
            gsap.to(this.app.stage, {
                x: 10,
                duration: 0.1,
                ease: 'steps(3)',
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    this.app.stage.x = 0;
                }
            });
        }
    }

    setIntervalThunder( interval: number) {
        this.intervalThunder = interval * 1000;
    }

    toggleInteraction() {
        this.isInteractionEnabled = !this.isInteractionEnabled;
    }

    startWeatherEffects() {
        const triggerLightning = () => {
            const delay = this.intervalThunder + Math.random() * 2000;
            setTimeout(() => {
                this.createEffect();
                triggerLightning();
            }, delay);
        };

        triggerLightning();
    }
} 