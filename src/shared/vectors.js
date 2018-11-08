
export const length2 = ({ x, y }) => (x * x + y * y);

export const length = (a) => Math.sqrt(length2(a));

export const sum = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });

export const difference = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });

export const dist = (a, b) => length(difference(a, b));

export const scale = ({ x, y }, factor) => ({ x: x * factor, y: y * factor });

export const scaleTo = (a, newLength) => scale(a, newLength / length(a));

export const normalize = (a) => scale(a, 1);

export const copyTo = (from, to) => { to.x = from.x; to.y = from.y };
