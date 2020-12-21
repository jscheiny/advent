import { TileCorner } from "./tileOrientation";
import { reverse } from "./utils";

export class TileSide {
    constructor(public readonly data: string, public readonly corners: [TileCorner, TileCorner]) {}

    public flip(): TileSide {
        const [first, second] = this.corners;
        return new TileSide(reverse(this.data), [second, first]);
    }

    public getMatch(other: TileSide): Map<TileCorner, TileCorner> | undefined {
        const cornerMap = new Map<TileCorner, TileCorner>();
        if (this.data === other.data) {
            cornerMap.set(this.corners[0], other.corners[0]);
            cornerMap.set(this.corners[1], other.corners[1]);
        }

        if (this.data === reverse(other.data)) {
            cornerMap.set(this.corners[0], other.corners[1]);
            cornerMap.set(this.corners[1], other.corners[0]);
        }

        if (cornerMap.size !== 0) {
            return cornerMap;
        }

        return undefined;
    }
}
