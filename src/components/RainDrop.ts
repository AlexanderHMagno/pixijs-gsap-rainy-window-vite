import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { BaseClass } from './BaseClass';

export class RainDrop extends BaseClass {

    constructor(app: PIXI.Application, texture: PIXI.Texture) {
        super(app, texture);
    }

    create() {
        const drop = new PIXI.Sprite(this.texture);
        drop.x = Math.random() * this.app.screen.width;
        drop.y = -Math.random() * 200;
        drop.alpha = 0.5 + Math.random() * 0.5;
        drop.scale.set(0.05 + Math.random() * 0.1);
        this.app.stage.addChild(drop);

        gsap.to(drop, {
            y: this.app.screen.height + 100,
            duration: Math.random() * 2,
            ease: 'none',
            repeat: -1,
            delay: Math.random() * 5,
            onRepeat: () => {
                drop.x = Math.random() * this.app.screen.width;
                drop.y = -Math.random() * 200;
            }
        });
    }

    createMultiple(count: number) {
        for (let i = 0; i < count; i++) {
            this.create();
        }
    }
} 