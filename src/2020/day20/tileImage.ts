import { Transformable } from "./transformable";
import { reverse } from "./utils";

type Coordinate = [number, number];

const ON_PIXEL = "#";

export class TileImage implements Transformable<TileImage> {
    public static joinRight(left: TileImage, right: TileImage) {
        const newPixels = left.pixels.map((row, index) => row + right.pixels[index]);
        return new TileImage(newPixels);
    }

    public static joinBelow(top: TileImage, bottom: TileImage) {
        const newPixels = [...top.pixels, ...bottom.pixels];
        return new TileImage(newPixels);
    }

    constructor(private readonly pixels: string[]) {}

    public get rows() {
        return this.pixels.length;
    }

    public get columns() {
        return this.pixels[0].length;
    }

    public flip() {
        const newPixels = this.pixels.map(row => reverse(row));
        return new TileImage(newPixels);
    }

    public rotate() {
        const newPixels: string[] = [];
        for (let column = 0; column < this.columns; column++) {
            let newRow = "";
            for (let row = this.rows - 1; row >= 0; row--) {
                newRow += this.pixels[row][column];
            }
            newPixels.push(newRow);
        }
        return new TileImage(newPixels);
    }

    public removeBorder() {
        const middle = this.pixels.slice(1, this.pixels.length - 1);
        const newPixels = middle.map(row => row.slice(1, row.length - 1));
        return new TileImage(newPixels);
    }

    public countImage(nestedImage: TileImage): number {
        const nestedPixelCoordinates = nestedImage.getPixelCoordinates();
        let count = 0;

        for (let baseRow = 0; baseRow < this.rows - nestedImage.rows + 1; baseRow++) {
            for (let baseColumn = 0; baseColumn < this.columns - nestedImage.columns + 1; baseColumn++) {
                const foundImage = nestedPixelCoordinates.every(([nestedRow, nestedColumn]) => {
                    const row = baseRow + nestedRow;
                    const column = baseColumn + nestedColumn;
                    return this.pixels[row][column] === ON_PIXEL;
                });
                if (foundImage) {
                    count++;
                }
            }
        }

        return count;
    }

    public toString() {
        return this.pixels.join("\n");
    }

    public getPixelCount() {
        return this.getPixelCoordinates().length;
    }

    private getPixelCoordinates(): Coordinate[] {
        const coordinates: Coordinate[] = [];
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                const pixel = this.pixels[row][column];
                if (pixel === ON_PIXEL) {
                    coordinates.push([row, column]);
                }
            }
        }
        return coordinates;
    }
}
