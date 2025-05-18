import * as PIXI from 'pixi.js';

export class BaseClass {
    protected app: PIXI.Application;
    protected texture: PIXI.Texture;
    protected sprite: PIXI.Sprite;
    constructor(app: PIXI.Application, texture: PIXI.Texture) {
        this.app = app;
        this.texture = texture;
        this.sprite = new PIXI.Sprite(this.texture);
    }

    toggleVisibility() {
      this.sprite.visible = !this.sprite.visible;
  }

    getVisibility() {
        return this.sprite.visible;
    }
}
