import * as PIXI from 'pixi.js';
import { BaseClass } from './BaseClass';

export class Background extends BaseClass {
    
    constructor(app: PIXI.Application, texture: PIXI.Texture, visible: boolean = true) {
        super(app, texture);
        this.sprite.width = app.screen.width;
        this.sprite.height = app.screen.height;
        this.sprite.visible = visible;
        app.stage.addChild(this.sprite);
    }
} 