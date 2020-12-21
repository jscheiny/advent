import { readFileSync } from "fs";
import { Tile } from "./tile";
import { getTileGrid } from "./tileGrid";
import { TileImage } from "./tileImage";
import { TILE_ORIENTATIONS } from "./tileOrientation";
import { applyTransforms } from "./transformable";

const tiles = readFileSync("src/2020/day20/input.txt", { encoding: "utf-8" })
    .split("\n\n")
    .map(Tile.parse);

const tileGrid = getTileGrid(tiles);
const tileImages = tileGrid.map(row => row.map(tile => tile.data.image.removeBorder()));

function joinImages(images: TileImage[], join: (a: TileImage, b: TileImage) => TileImage) {
    const [head, ...tail] = images;
    return tail.reduce(join, head);
}

const assembedRows = tileImages.map(row => joinImages(row, TileImage.joinRight));
const assembledImage = joinImages(assembedRows, TileImage.joinBelow);
const monster = new TileImage([
    // Nessie!
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   ",
]);

for (const orientation of TILE_ORIENTATIONS) {
    const orientedMonster = applyTransforms(monster, orientation.transforms);
    const count = assembledImage.countImage(orientedMonster);
    if (count !== 0) {
        console.log(assembledImage.getPixelCount() - monster.getPixelCount() * count);
        break;
    }
}
