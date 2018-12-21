
export interface Vector {
    x: number;
    y: number;
}

export const length2 = ({ x, y }: Vector) => (x * x + y * y);

export const length = (a: Vector) => Math.sqrt(length2(a));

export const sum = (a: Vector, b: Vector): Vector => ({ x: a.x + b.x, y: a.y + b.y });

export const difference = (a: Vector, b: Vector): Vector => ({ x: a.x - b.x, y: a.y - b.y });

export const dist = (a: Vector, b: Vector) => length(difference(a, b));

export const scale = ({ x, y }: Vector, factor: number): Vector => ({ x: x * factor, y: y * factor });

export const scaleTo = (a: Vector, newLength: number) => scale(a, newLength / length(a));

export const normalize = (a: Vector) => scaleTo(a, 1);

export const copyTo = (from: Vector, to: Vector) => { to.x = from.x; to.y = from.y; };

export const zero = () => ({ x: 0, y: 0 });
