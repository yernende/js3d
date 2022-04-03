import {Sphere} from "./meshes.js";
import render from "./render.js";
import display from "./display.js";
import {colors, materials} from "./library.js";

const canvas = document.getElementById("canvas");

const scene = {
  width: canvas.width,
  height: canvas.height,
  objects: [
    new Sphere(
      {x: 0, y: 0, z: 0},
      null,
      {radius: 200, material: materials.red}
    ),
    new Sphere(
      {x: 200, y: -200, z: 400},
      null,
      {radius: 200, material: materials.green}
    ),
    new Sphere(
      {x: -200, y: -200, z: 400},
      null,
      {radius: 200, material: materials.blue}
    )
  ],
  lights: [
    {position: {x: 400, y: 400, z: 800}, intensity: 0.8}
  ],
  ambientOcclusionIntensity: 0,
  camera: {position: {x: 0, y: 0, z: 2000}, defaultPosition: {x: 0, y: 0, z: 2000}, distance: 1000}
}

const materialKeywords = ["red", "blue", "green"];
setInterval(() => {
  for (let i = 0; i < 3; i++) {
    scene.objects[i].properties.material = materials[materialKeywords[Math.floor(Math.random() * 3)]];
  }

  display(canvas, render(scene));
}, 1000);
