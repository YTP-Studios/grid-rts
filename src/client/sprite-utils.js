export function createCenteredSprite(filePath, width, height = width) {
    let sprite = new PIXI.Sprite(PIXI.loader.resources[filePath].texture);
    sprite.pivot.x = sprite.width / 2;
    sprite.pivot.y = sprite.height / 2;
    sprite.width = width;
    sprite.height = height;
    return sprite;
}