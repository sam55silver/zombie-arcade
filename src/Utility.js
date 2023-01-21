export const lookAt = (v1, v2) => {
  const vectorTo = v2.clone().sub(v1.clone());
  const angle = Math.atan2(vectorTo.y, vectorTo.x) + Math.PI / 2;

  return { angle, vectorTo };
};

export const updateContainer = (container, pos) => {
  container.x = pos.x;
  container.y = pos.y;
};
