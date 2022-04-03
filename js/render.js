export default function render(scene) {
  let image = new Array(scene.width);
  for (let i = 0; i < image.length; i++) image[i] = new Array(scene.height);

  console.time("rendering");
  let MO = affine.multiplyByScalar(scene.camera.position, scene.camera.distance / affine.abs(scene.camera.position));
  let M = affine.subtract(scene.camera.position, MO);
  console.log(M);

  for (let x = 0; x < scene.width; x++) {
    for (let y = 0; y < scene.height; y++) {
      // Render a pixel
      for (let object of scene.objects) {
        let pixelPosition = {x: x - scene.width / 2, y: -(y - scene.height / 2), z: 0};
        pixelPosition = affine.add(pixelPosition, M);

        let {intersection, normal} = rayTraceSphere(scene.camera, pixelPosition, object);

        if (intersection != null) {
          if (object.properties.material.diffusion) {
            let intensity = scene.ambientOcclusionIntensity;

            for (let light of scene.lights) {
              let lightDirection = affine.subtract(intersection, light.position);
              let cos = -affine.dot(normal, lightDirection) / (affine.abs(normal) * affine.abs(lightDirection));

              if (cos >= 0) {
                intensity += light.intensity * cos;
              }
            }

            let red = object.properties.material.diffusion[0];
            let green = object.properties.material.diffusion[1];
            let blue = object.properties.material.diffusion[2];

            image[x][y] = [red * intensity, green * intensity, blue * intensity];
          }
        }
      }
    }
  }
  console.timeEnd("rendering");

  return image;
}

function rayTraceSphere(camera, pixelPosition, sphere) {
  let OV = affine.subtract(pixelPosition, camera.position);
  // let OV = affine.multiplyByScalar(camera.position, camera.distance / affine.abs(camera.position));
  let OC = affine.subtract(sphere.position, camera.position);

  let k1 = affine.dot(OV, OV);
  let k2 = 2 * affine.dot(OV, OC);
  let k3 = affine.dot(OC, OC) - sphere.properties.radius ** 2;

  let discriminant = k2 ** 2 - 4 * k1 * k3;
  let root = null;
  // console.log(k2);

  if (discriminant > 0) {
    root = (k2 - Math.sqrt(discriminant)) / (2 * k1); // It's enough to find the lowest root
  } else if (discriminant == 0) {
    root = k2 / (2 * k1);
  } else {
    return {intersection: null, normal: null};
  }

  let intersection = affine.add(camera.position, affine.multiplyByScalar(OV, root));
  let normal = affine.subtract(intersection, sphere.position);

  return {intersection, normal};
}

const affine = {
  add(a, b) {
    return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
  },
  subtract(a, b) {
    return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
  },
  dot(a, b) {
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
  },
  cross(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    }
  },
  multiplyByScalar(a, k) {
    return {x: a.x * k, y: a.y * k, z: a.z * k};
  },
  abs(a) {
    return Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
  },
  i: {x: 1, y: 0, z: 0},
  j: {x: 0, y: 1, z: 0},
  k: {x: 1, y: 0, z: 1},
}
