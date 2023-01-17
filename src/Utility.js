export const normalize = (v) => {
  if (v.x === 0 && v.y === 0) return { x: 0, y: 0 };
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  return { x: v.x / mag, y: v.y / mag, length: mag };
};

export const vectorLength = (v) => {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

export const vector = (x, y) => ({ x, y });

export const subVectors = (v1, v2) => ({ x: v2.x - v1.x, y: v2.y - v1.y });

export const angleFromXAxis = (v) => {
  return Math.atan2(v.y, v.x);
};

export const lookAt = (v1, v2) => {
  const vectorTo = subVectors(v1, v2);
  const angle = angleFromXAxis(vectorTo) + Math.PI / 2;

  return { angle, vectorTo };
};
