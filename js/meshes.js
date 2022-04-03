import {materials} from "./library.js";

class Mesh {
  constructor(position = {x: 0, y: 0, z: 0}, rotation = {x: 0, y: 0, z: 0}, properties) {
    this.position = position;
    this.rotation = rotation;
    this.properties = properties;
  }
}

export const Sphere = class Sphere extends Mesh {
  constructor(position, rotation, properties = {radius: 2, material: materials.simple}) {
    super(position, rotation, properties);
  }
}
