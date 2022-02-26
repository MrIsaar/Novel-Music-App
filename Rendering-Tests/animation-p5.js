var fighterAnim;
var fighter;
const W = 175;
const H = 240;

function preload() {
  loadJSON(
    "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json",
    (fighterData) => {
      let frames = Object.values(fighterData.frames);
      frames.forEach((o) => {
        o.frame.width = o.frame.w;
        o.frame.height = o.frame.h;
      });
      let fighterSheet = loadSpriteSheet(
        "https://pixijs.io/examples/examples/assets/spritesheet/fighter.png",
        frames
      );
      fighterAnim = loadAnimation(fighterSheet);
      fighterAnim.stop();
      fighterAnim.looping = false;
  });
}

function setup() {
  createCanvas(800, 800);
  fighter = createSprite(0, 0, 175, 240);
  fighter.addAnimation("spin", fighterAnim);
}

function draw() {
  background(0);
  fighter.position.x = fighter.width/2 + (W - fighter.width)/2;
  fighter.position.y = fighter.height/2;
  drawSprite(fighter);
}

function mouseClicked() {
  if (fighter.mouseIsOver) {
    fighter.animation.rewind();
    fighter.animation.play();
  }
}
