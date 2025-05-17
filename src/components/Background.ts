import * as PIXI from 'pixi.js';

export class Background {
    private sprite: PIXI.Sprite;

    constructor(app: PIXI.Application, texture: PIXI.Texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = app.screen.width;
        this.sprite.height = app.screen.height;
        app.stage.addChild(this.sprite);
    }
} 