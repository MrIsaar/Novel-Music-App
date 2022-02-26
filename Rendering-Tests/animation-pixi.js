let app = new PIXI.Application();
const loader = app.loader;
document.body.appendChild(app.view);

loader.add("fighter", "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json");
loader.load((loader, resources) => {
  let fighter = PIXI.AnimatedSprite.fromFrames(
    Object.getOwnPropertyNames(resources["fighter"].textures)
  );
  fighter.loop = false;
  fighter.interactive = true;
  fighter.click = () => {
    fighter.gotoAndPlay(0);
  };

  app.stage.addChild(fighter);
});
