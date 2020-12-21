import { TileData } from "./tileData";
import { TileCorner } from "./tileOrientation";
import { Transformable } from "./transformable";

export interface TileNeighbor {
    id: number;
    cornerMap: Map<TileCorner, TileCorner>;
}

export class Tile implements Transformable<Tile> {
    public static parse(input: string): Tile {
        const [head, ...rawImage] = input.split("\n");
        const id = parseInt(head.substring(5, head.length - 1), 10);
        return new Tile(id, TileData.parse(rawImage));
    }

    private constructor(public readonly id: number, public readonly data: TileData) {}

    public flip() {
        return new Tile(this.id, this.data.flip());
    }

    public rotate() {
        return new Tile(this.id, this.data.rotate());
    }

    public findNeighbors(tiles: Tile[]): TileNeighbor[] {
        return tiles
            .filter(tile => tile.id !== this.id)
            .map(tile => this.findNeighbor(tile))
            .filter((match): match is TileNeighbor => match !== undefined);
    }

    private findNeighbor(other: Tile): TileNeighbor | undefined {
        const { id } = other;
        for (let thisSide of this.data.border.clockwiseSides) {
            for (const otherSide of other.data.border.clockwiseSides) {
                const cornerMap = thisSide.getMatch(otherSide);
                if (cornerMap !== undefined) {
                    return { id, cornerMap };
                }
            }
        }

        return undefined;
    }
}
