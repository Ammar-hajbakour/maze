export const changeBrightness = (canvas: HTMLCanvasElement, factor: number, sprite: HTMLImageElement | null) => {
  if (!sprite) return;
  canvas.width = sprite.width;
  canvas.height = sprite.height;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.drawImage(sprite, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] *= factor;
    data[i + 1] *= factor;
    data[i + 2] *= factor;
  }

  context.putImageData(imageData, 0, 0);

  const output = new Image();
  output.src = canvas.toDataURL();
  return output;
}