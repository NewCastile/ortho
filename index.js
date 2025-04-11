const r = require("raylib");

/**
 * Vector3
 * @typedef {object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * BoundingBox
 * @typedef {object} BoundingBox
 * @property {Vector3} min
 * @property {Vector3} max
 */

/**
 * BoundingBox
 * @typedef {object} Rectangle
 * @property {Vector3} min
 * @property {Vector3} max
 */

/**
 * Color
 * @typedef {object} Color
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} a
 */

/**
 * @typedef {object} Pike
 * @property {Vector3} position
 * @property {number} topRadius
 * @property {number} bottomRadius
 * @property {number} height
 * @property {number} slices
 * @property {Color} color
 */

const screenWidth = 800;
const screenHeight = 450;
const zoomSpeed = 5.0;

r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

// Define the camera to look into our 3d world
let camera = {
  position: { x: 2.0, y: 1.5, z: 2.0 },
  target: { x: 0.0, y: 0.0, z: 0.0 },
  up: { x: 0.0, y: 1.0, z: 0.0 },
  fovy: 10.0,
  projection: r.CAMERA_ORTHOGRAPHIC,
};

const originalCamera = {
  position: { x: 2.0, y: 1.5, z: 2.0 },
  target: { x: 0.0, y: 0.0, z: 0.0 },
  up: { x: 0.0, y: 1.0, z: 0.0 },
  fovy: 10.0,
  projection: r.CAMERA_ORTHOGRAPHIC,
};

const topCamera = {
  position: { x: 4.0, y: 50.0, z: 0.0 },
  target: { x: 0.0, y: 0.0, z: 0.0 },
  up: { x: 0.0, y: 1.0, z: 0.0 },
  fovy: 10.0,
  projection: r.CAMERA_ORTHOGRAPHIC,
};

const sideCamera = {
  position: { x: 0.0, y: 50.0, z: 1000.0 },
  target: { x: 0.0, y: 0.0, z: 0.0 },
  up: { x: 0.0, y: 1.0, z: 0.0 },
  fovy: 10.0,
  projection: r.CAMERA_ORTHOGRAPHIC,
};

/**
 * @param {"top" | "side" | "original"} view
 * @returns {void}
 */
const changeCamera = (view) => {
  switch (view) {
    case "top":
      camera = topCamera;
      break;
    case "side":
      camera = sideCamera;
      break;
    case "original":
      camera = originalCamera;
      break;
    default:
      camera = originalCamera;
      break;
  }
};

const jumpBase = 0.0;
const jumpCeil = 2.5;
const jumpDisplacement = 0.5;

const displacement = 0.2;
const speed = 0.5;
const jumpSpeed = 0.25;

const playerHeight = 1.0;
const playerWidth = 1.0;
const playerLength = 1.0;
/**
 * @type {Vector3}
 */
const playerPos = { x: 0.0, y: 0.0, z: 0.0 };

/**
 * @returns {BoundingBox}
 */
const getPlayerBox = () => {
  return {
    min: {
      x: playerPos.x - playerWidth / 2.0,
      y: playerPos.y - playerHeight / 2.0,
      z: playerPos.z - playerLength / 2.0,
    },
    max: {
      x: playerPos.x + playerWidth / 2.0,
      y: playerPos.y + playerHeight / 2.0,
      z: playerPos.z + playerLength / 2.0,
    },
  };
};

let jumping = false;
let collision = false;
let flying = false;

let playerColorIdle = r.GREEN;
let playerColorDanger = r.RED;
let playerColor = playerColorIdle;

/**
 * Represents a pike
 * @param {Pike} pike
 */

function pike(pike) {
  return {
    position: pike.position,
    bottomRadius: pike.bottomRadius,
    topRadius: pike.topRadius,
    height: pike.height,
    slices: pike.slices,
    color: pike.color,
  };
}

/**
 * @param {BoundingBox} box1
 * @param {BoundingBox} box2
 *
 * @returns {boolean}
 */
function isColliding(box1, box2) {
  if (r.CheckCollisionBoxes(box1, box2)) {
    return true;
  }

  return false;
}

const pike1 = pike({
  position: { x: -2.0, y: 0.0, z: -2.0 },
  topRadius: 0.0,
  bottomRadius: 0.5,
  height: 1.0,
  slices: 8,
  color: r.BLUE,
});

const pike2 = pike({
  position: { x: -2.0, y: 0.0, z: 2.0 },
  topRadius: 0.0,
  bottomRadius: 0.5,
  height: 1.0,
  slices: 8,
  color: r.BLUE,
});

/**
 * Logs the player box
 * @returns {string}
 */
const logPlayerBox = () => {
  return `
  posX: ${playerPos.x} posZ: ${playerPos.z} posY: ${playerPos.y}
  maxX: ${playerPos.x + playerWidth / 2.0} maxZ: ${
    playerPos.z + playerLength / 2.0
  } 
  minX: ${playerPos.x - playerWidth / 2.0} minZ: ${
    playerPos.z - playerLength / 2.0
  }
  `;
};

/**
 *
 * @param {Pike} pike
 * @returns {string}
 */
const logPikeBox = (pike) => {
  return `
  posX: ${pike.position.x} posZ: ${pike.position.z} posY: ${pike.position.y}
  maxX: ${pike.position.x + pike.bottomRadius} maxZ: ${
    pike.position.z + pike.bottomRadius
  }
  minX: ${pike.position.x - pike.bottomRadius} minZ: ${
    pike.position.z - pike.bottomRadius
  }
  `;
};

r.SetTargetFPS(60);

while (!r.WindowShouldClose()) {
  // r.UpdateCamera(camera, r.CAMERA_FREE);

  let mouseWheelMove = r.GetMouseWheelMove();

  if (r.IsKeyDown(r.KEY_W)) {
    playerPos.x -= displacement * speed;
    logPlayerBox();
    logPikeBox(pike1);
  }

  if (r.IsKeyDown(r.KEY_S)) {
    playerPos.x += displacement * speed;
    logPlayerBox();
    logPikeBox(pike1);
  }

  if (r.IsKeyDown(r.KEY_A)) {
    playerPos.z += displacement * speed;
    logPlayerBox();
    logPikeBox(pike1);
  }

  if (r.IsKeyDown(r.KEY_D)) {
    playerPos.z -= displacement * speed;
    logPlayerBox();
    logPikeBox(pike1);
  }

  if (r.IsKeyDown(r.KEY_UP)) {
    if (flying) {
      playerPos.y += displacement * speed;
    }
  }

  if (r.IsKeyDown(r.KEY_DOWN)) {
    if (flying) {
      playerPos.y -= displacement * speed;
    }
  }

  if (r.IsKeyPressed(r.KEY_SPACE)) {
    jumping = true;
  }

  if (r.IsKeyPressed(r.KEY_F)) {
    flying = !flying;
    playerPos.y = 0.0;
  }

  if (!flying) {
    if (jumping) {
      if (playerPos.y < jumpCeil) {
        playerPos.y += jumpDisplacement * jumpSpeed;
      } else {
        jumping = false;
      }
    }

    if (!jumping) {
      if (playerPos.y > jumpBase) {
        playerPos.y -= jumpDisplacement * jumpSpeed;
      }
    }
  }

  if (mouseWheelMove != 0) {
    camera.fovy -= mouseWheelMove * zoomSpeed;
    if (camera.fovy < 1.0) camera.fovy = 1.0;
    if (camera.fovy > 170.0) camera.fovy = 170.0;
  }

  if (
    isColliding(
      {
        min: {
          x: pike1.position.x - pike1.bottomRadius / 2.0,
          y: pike1.position.y - pike1.height / 2.0,
          z: pike1.position.z - pike1.bottomRadius / 2.0,
        },
        max: {
          x: pike1.position.x + pike1.bottomRadius / 2.0,
          y: pike1.position.y + pike1.height / 2.0,
          z: pike1.position.z + pike1.bottomRadius / 2.0,
        },
      },
      getPlayerBox()
    ) ||
    isColliding(
      {
        min: {
          x: pike2.position.x - pike2.bottomRadius / 2.0,
          y: pike2.position.y - pike2.height / 2.0,
          z: pike2.position.z - pike2.bottomRadius / 2.0,
        },
        max: {
          x: pike2.position.x + pike2.bottomRadius / 2.0,
          y: pike2.position.y + pike2.height / 2.0,
          z: pike2.position.z + pike2.bottomRadius / 2.0,
        },
      },
      getPlayerBox()
    )
  ) {
    collision = true;
  } else {
    collision = false;
  }

  if (collision) {
    playerColor = playerColorDanger;
  } else {
    playerColor = playerColorIdle;
  }

  r.BeginDrawing();

  r.ClearBackground(r.RAYWHITE);

  r.BeginMode3D(camera);

  r.DrawPlane(
    playerPos,
    {
      x: getPlayerBox().max.x - getPlayerBox().min.x,
      y: getPlayerBox().max.z - getPlayerBox().min.z,
    },
    r.DARKGRAY
  );

  r.DrawCube(playerPos, playerWidth, playerHeight, playerLength, playerColor);

  r.DrawCubeWiresV(
    playerPos,
    { x: playerWidth, y: playerHeight, z: playerLength },
    { r: 39, g: 245, b: 219, a: 255 }
  );

  r.DrawCylinderWires(
    pike1.position,
    pike1.topRadius,
    pike1.bottomRadius,
    pike1.height,
    pike1.slices,
    r.BLUE
  );

  r.DrawCubeWiresV(
    pike1.position,
    { x: pike1.bottomRadius, y: pike1.height, z: pike1.bottomRadius },
    { r: 39, g: 245, b: 219, a: 255 }
  );

  r.DrawCylinderWires(
    pike2.position,
    pike2.topRadius,
    pike2.bottomRadius,
    pike2.height,
    pike2.slices,
    r.BLUE
  );

  r.DrawCubeWiresV(
    pike2.position,
    { x: pike2.bottomRadius, y: pike2.height, z: pike2.bottomRadius },
    { r: 39, g: 245, b: 219, a: 255 }
  );

  r.DrawGrid(10, 1.0);

  r.EndMode3D();

  r.DrawText(`Flying: ${flying}`, 10, 10, 10, r.DARKGRAY);
  r.DrawText(`Player: ${logPlayerBox()}`, 10, 30, 10, r.DARKGRAY);
  r.DrawText(`Pike 1: ${logPikeBox(pike1)}`, 10, 150, 10, r.DARKGRAY);
  r.DrawText(`Pike 2: ${logPikeBox(pike2)}`, 10, 270, 10, r.DARKGRAY);

  const topViewButton = r.GuiButton(
    { width: 200, height: 30, x: 550, y: 10 },
    "Top View"
  );
  if (topViewButton) {
    changeCamera("top");
  }

  const sideViewButton = r.GuiButton(
    { width: 200, height: 30, x: 550, y: 50 },
    "Side View"
  );

  if (sideViewButton) {
    changeCamera("side");
  }

  const originalViewButton = r.GuiButton(
    { width: 200, height: 30, x: 550, y: 90 },
    "Original View"
  );

  if (originalViewButton) {
    changeCamera("original");
  }

  r.EndDrawing();

  // Controls
}
r.CloseWindow();
