import * as PIXI from 'pixi.js';
import gsap from 'gsap';

export class Lightning {
    private sprite: PIXI.Sprite;
    private app: PIXI.Application;

    constructor(app: PIXI.Application, texture: PIXI.Texture) {
        this.app = app;
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = app.screen.width;
        this.sprite.height = app.screen.height;
        this.sprite.alpha = 0;
        app.stage.addChild(this.sprite);
    }

    createEffect() {
        gsap.timeline()
            .to(this.sprite, {
                alpha: 1,
                duration: 1,
                ease: 'power1.in'
            })
            .to(this.sprite, {
                alpha: 0,
                duration: 1,
                ease: 'power1.out'
            });

        // Screen shake
        gsap.to(this.app.stage, {
            x: 10,
            duration: 0.1,
            ease: 'steps(2)',
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.app.stage.x = 0;
            }
        });
    }

    startWeatherEffects() {
        const triggerLightning = () => {
            const delay = 5000 + Math.random() * 5000;
            setTimeout(() => {
                this.createEffect();
                triggerLightning();
            }, delay);
        };

        triggerLightning();
    }
} 