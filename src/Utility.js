export const normalize = (v) => {
  if (v.x === 0 && v.y === 0) return { x: 0, y: 0 };
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  return { x: v.x / mag, y: v.y / mag };
};
