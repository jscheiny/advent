import { Transform, Transformable } from "./transformable";

export const TILE_ORIENTATIONS: TileOrientation[] = [];

function computeAllTileOrientations() {
    const identity = TileOrientation.IDENTITY;
    TILE_ORIENTATIONS.push(identity);
    let base = identity;
    let flipped = identity.flip();
    for (let r = 0; r < 4; r++) {
        TILE_ORIENTATIONS.push(base);
        TILE_ORIENTATIONS.push(flipped);

        base = base.rotate();
        flipped = flipped.rotate();
    }
}

export type TileCorner = "A" | "B" | "C" | "D";
type FourTuple<T> = [T, T, T, T];

export class TileOrientation implements Transformable<TileOrientation> {
    public static IDENTITY = new TileOrientation(["A", "B", "C", "D"], []);

    public static findMatchingOrientation(matcher: FourTuple<TileCorner | undefined>) {
        const regex = new RegExp(matcher.map(match => match || ".").join(""));
        return TILE_ORIENTATIONS.filter(orientation => regex.test(orientation.key))[0];
    }

    private constructor(public readonly corners: FourTuple<TileCorner>, public readonly transforms: Transform[]) {}

    public flip() {
        const [a, b, c, d] = this.corners;
        return new TileOrientation([b, a, d, c], [...this.transforms, "flip"]);
    }

    public rotate() {
        const [a, b, c, d] = this.corners;
        return new TileOrientation([d, a, b, c], [...this.transforms, "rotate"]);
    }

    public get key() {
        return this.corners.join("");
    }
}

computeAllTileOrientations();
