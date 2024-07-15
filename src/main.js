import { dialogueData, scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { displayDialogue, setCamScale } from "./utils";

k.loadSprite("spritesheet", "/spritesheet.png", {
    sliceX: 39, 
    sliceY: 31,
    anims: {
        // from = start frame, to = end frame, speed = fps
     "idle-down": 936,
     "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
     "idle-side": 975,
     "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
     "idle-up": 1014,
     "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
    },
});

k.loadSprite("map", "./map.png");

k.setBackground(k.Color.fromHex("#311047"));

//game logic
k.scene("main", async () => {
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers; // this is how layers are accessed and likewise there objects

    const map = k.add([
        k.sprite("map"),
        k.pos(0),
        k.scale(scaleFactor),
    ]);

    const player = k.make([
        k.sprite("spritesheet", { anim: "idle-down" }), //defualt anim
        k.area({shape: new k.Rect(k.vec2(0,3), 10, 10)}),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scaleFactor), 
        {
            speed: 250, 
            direction: "down",
            isInDialogue: false,
        },
        "player",  
    ]);
    //
    for (const layer of layers) {
        if (layer.name === "boundries") {
            for (const boundry of layer.objects) {
                map.add([ //this make a boundry when collision is found. it does it with the rect function and gets the heihgt and width from th json file
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundry.width, boundry.height),
                    }),
                    k.body({isStatic: true}),
                    k.pos(boundry.x, boundry.y),
                    boundry.name,
                ]);

                if (boundry.name) {
                    player.onCollide(boundry.name, () => { //this prevents player from moving while reading text
                        player.isInDialogue = true; 
                        displayDialogue(dialogueData[boundry.name], () => (player.isInDialogue = false)); // lets player move again
                    });
                }
            }
            continue;
        }

        if (layer.name === "spawnpoint") {
            for (const entity of layer.objects) {
                if (entity.name === "spawnpoint") { 
                    //this is bad naming, but it gets the layer spawnpoint from the json and then looks through the layer itself
                    //for the spawnpoint object. spawnpoint in in the 2nd if should be called "player" but im to lazy, so hopefully this isnt 
                    //bad in the future
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scaleFactor,
                        (map.pos.y + entity.y) * scaleFactor
                    );
                    k.add(player);  
                    continue;
                }
            }
        }
    }

    //this helps adjust game with screen sizes
    setCamScale(k)
    k.onResize(() => {
        setCamScale(k);
    });

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y - 100);
    });

    k.onMouseDown((mouseBtn) => {
        if (mouseBtn !== "left" || player.isInDialogue) return;
        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        // the below is used for different anims of the player moving
        //if the mouse/tap is found at a specific angle(think of a circle around player) then thats the anim
        const mouseAngle = player.pos.angle(worldMousePos)

        const lowerBound = 50;
        const upperBound = 125;

        if (
            (mouseAngle > lowerBound) && (mouseAngle < upperBound) && (player.curAnim() !== "walk-up") 
        ) {
            player.play("walk-up");
            player.direction = "up";
            return;
        }
        if (
            mouseAngle < -lowerBound &&
            mouseAngle > -upperBound &&
            player.curAnim() !== "walk-down"
          ) {
            player.play("walk-down");
            player.direction = "down";
            return;
          }
      
          if (Math.abs(mouseAngle) > upperBound) {
            player.flipX = false;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "right";
            return;
          }
      
          if (Math.abs(mouseAngle) < lowerBound) {
            player.flipX = true;
            if (player.curAnim() !== "walk-side") player.play("walk-side");
            player.direction = "left";
            return;
          }
     });
     // start of stopping anims
     function stopAnims() {
        if (player.direction === "down") {
          player.play("idle-down");
          return;
        }
        if (player.direction === "up") {
          player.play("idle-up");
          return;
        }
    
        player.play("idle-side");
      }
    
      k.onMouseRelease(stopAnims);
    
      k.onKeyRelease(() => {
        stopAnims();
      });
      k.onKeyDown((key) => {
        const keyMap = [
          k.isKeyDown("right"),
          k.isKeyDown("left"),
          k.isKeyDown("up"),
          k.isKeyDown("down"),
        ];
    
        let nbOfKeyPressed = 0;
        for (const key of keyMap) {
          if (key) {
            nbOfKeyPressed++;
          }
        }
    
        if (nbOfKeyPressed > 1) return;
    
        if (player.isInDialogue) return;
        if (keyMap[0]) {
          player.flipX = false;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "right";
          player.move(player.speed, 0);
          return;
        }
    
        if (keyMap[1]) {
          player.flipX = true;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "left";
          player.move(-player.speed, 0);
          return;
        }
    
        if (keyMap[2]) {
          if (player.curAnim() !== "walk-up") player.play("walk-up");
          player.direction = "up";
          player.move(0, -player.speed);
          return;
        }
    
        if (keyMap[3]) {
          if (player.curAnim() !== "walk-down") player.play("walk-down");
          player.direction = "down";
          player.move(0, player.speed);
        }
      });
});

k.go("main");

