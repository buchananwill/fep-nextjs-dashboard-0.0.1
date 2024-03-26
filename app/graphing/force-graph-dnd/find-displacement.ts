export function findDisplacement(
  nodeX: number,
  x: number,
  svgScale: number,
  nodeY: number,
  y: number
) {
  const xDisplacement = nodeX - x * svgScale;
  const yDisplacement = nodeY - y * svgScale;
  return { xDisplacement, yDisplacement };
}
