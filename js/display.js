export default function display(canvas, image) {
  const context = canvas.getContext("2d");
  const imageData = context.createImageData(canvas.width, canvas.height);

  console.time("displaying");

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      if (!image[x][y]) continue;
      let pixelIndex = (y * canvas.width + x) * 4;

      imageData.data[pixelIndex] = image[x][y][0];
      imageData.data[pixelIndex + 1] = image[x][y][1];
      imageData.data[pixelIndex + 2] = image[x][y][2];
      imageData.data[pixelIndex + 3] = 255;
    }
  }

  console.timeEnd("displaying");

  context.putImageData(imageData, 0, 0);
}
