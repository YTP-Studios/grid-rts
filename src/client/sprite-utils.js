
import * as PIXI from 'pixi.js';

export function createCenteredSprite(filePath, width, height = width) {
  let sprite = new PIXI.Sprite(PIXI.loader.resources[filePath].texture);
  sprite.pivot.x = sprite.width / 2;
  sprite.pivot.y = sprite.height / 2;
  sprite.width = width;
  sprite.height = height;
  return sprite;
}

export function createCircleSprite(size, lineWidth?, lineColour?, fillOpacity?, fillColour = 0xFFFFFF) {
  const circleGraphics = new PIXI.Graphics;
  circleGraphics.clear();
  circleGraphics.lineStyle(lineWidth, lineColour);
  circleGraphics.beginFill(fillColour, fillOpacity);
  circleGraphics.drawCircle(0, 0, size);
  return circleGraphics;
}
