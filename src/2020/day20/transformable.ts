export interface Transformable<T> {
    flip(): T;
    rotate(): T;
}

export type Transform = "flip" | "rotate";

export function applyTransforms<T extends Transformable<T>>(target: T, transforms: Transform[]): T {
    for (const transform of transforms) {
        if (transform === "flip") {
            target = target.flip();
        } else {
            target = target.rotate();
        }
    }
    return target;
}
