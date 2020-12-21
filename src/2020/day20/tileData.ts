import { TileBorder } from "./tileBorder";
import { TileImage } from "./tileImage";
import { TileOrientation } from "./tileOrientation";
import { TileSide } from "./tileSide";
import { Transformable } from "./transformable";
import { reverse } from "./utils";

export class TileData implements Transformable<TileData> {
    public static parse(rawImage: string[]) {
        const top = rawImage[0];
        const bottom = reverse(rawImage[rawImage.length - 1]);

        let left = "";
        let right = "";
        for (let index = 0; index < rawImage.length; index++) {
            const line = rawImage[index];
            left = line[0] + left;
            right += line[line.length - 1];
        }

        const border = new TileBorder({
            top: new TileSide(top, ["A", "B"]),
            right: new TileSide(right, ["B", "C"]),
            bottom: new TileSide(bottom, ["C", "D"]),
            left: new TileSide(left, ["D", "A"]),
        });
        const image = new TileImage(rawImage);
        return new TileData(TileOrientation.IDENTITY, image, border);
    }

    constructor(
        public readonly orientation: TileOrientation,
        public readonly image: TileImage,
        public readonly border: TileBorder,
    ) {}

    public flip() {
        return new TileData(this.orientation.flip(), this.image.flip(), this.border.flip());
    }

    public rotate() {
        return new TileData(this.orientation.rotate(), this.image.rotate(), this.border.rotate());
    }
}
