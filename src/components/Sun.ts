import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { BaseClass } from './BaseClass';

export class Sun extends BaseClass {
    
    private light: PIXI.Graphics;
    private intervalSun: number = 30000;
    private isEnabled: boolean = true;
    private color: number = 0x808080;
    
    private speed: number = 200;
    constructor(app: PIXI.Application, texture: PIXI.Texture) {
        super(app, texture);
        this.sprite.width = 100;
        this.sprite.height = 100;
        this.sprite.alpha = 0.8;
        this.sprite.x = this.app.screen.width/2 - 100;
        this.sprite.y = 100;
        

        // Add blur filter for glow effect using the new property
        const blurFilter = new PIXI.BlurFilter();
        blurFilter.blur = 1; // Using strength instead of blur
        this.sprite.filters = [blurFilter];

        // Create ambient light
        this.light = new PIXI.Graphics();
        this.light
            .fill({ color: this.color, alpha: 0.2 })
            .rect(0, 0, app.screen.width, app.screen.height);
        this.light.alpha = 0.8;

        // Add to stage
        app.stage.addChild(this.light);
        app.stage.addChild(this.sprite);
    }

    private createSunTexture(): PIXI.Texture {
        // Create a radial gradient for the sun
        const graphics = new PIXI.Graphics();
        const radius = 100;
        
        // Create gradient effect
        for (let i = 0; i < radius; i++) {
            const alpha = 1 - (i / radius);
            graphics
                .fill({ color: this.color, alpha })
                .circle(radius, radius, radius - i)
        }

        return this.app.renderer.generateTexture(graphics);
    }


    createEffect() {
        if (this.isEnabled) {


            // Reset position
            // this.sprite.x = -200;
            console.log(this.sprite.x)
            // Animate sun
            gsap.timeline()
                .to(this.sprite, {
                    x: -100,
                    y: this.sprite.y + 100,
                    duration: this.speed,
                    ease: 'none',
                    alpha: 1,
                    
                })
                .to(this.sprite, {
                    alpha: 0,
                    duration: 0.1,
                    ease: 'none',
                })
                .to(this.sprite, {
                    x: this.app.screen.width,
                    alpha: 0,
                    duration: 0.1,
                    ease: 'none',
                })
                .to(this.sprite, {
                    x: this.app.screen.width/2 - 100,
                    y: this.sprite.y,
                    alpha: 1,
                    duration: this.speed,
                    ease: 'none',
                })
                .repeat(-1);

            // Animate ambient light
            // gsap.timeline()
            //     .to(this.light, {
            //         alpha: 1,
            //         duration: 5,
            //         ease: 'power1.in'
            //     })
            //     .to(this.light, {
            //         alpha: 0,
            //         duration: 5,
            //         delay: 10,
            //         ease: 'power1.out'
            //     });
        }
    }

    setInterval(interval: number) {
        this.intervalSun = interval * 1000;
    }

    toggleEffect() {
        this.isEnabled = !this.isEnabled;
    }

    startEffect() {
        const triggerSun = () => {
            const delay = this.intervalSun + Math.random() * 5000;
            this.createEffect();
            // setTimeout(() => {

            //   console.log('triggerSun', this.sprite.x, this.app.screen.width);
            //     this.createEffect();
            //     triggerSun();
            // }, 0);
        };

        triggerSun();
    }
} 