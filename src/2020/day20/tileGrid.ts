import { Tile, TileNeighbor } from "./tile";
import { TileCorner, TileOrientation } from "./tileOrientation";
import { applyTransforms } from "./transformable";

type TileMap = { [id: number]: Tile };
type NeighborsMap = { [id: number]: TileNeighbor[] };

export function getTileGrid(tiles: Tile[]) {
    const sideLength = Math.sqrt(tiles.length);
    const tileMap: TileMap = {};
    const neighborsMap: NeighborsMap = {};

    for (const tile of tiles) {
        tileMap[tile.id] = tile;
        neighborsMap[tile.id] = tile.findNeighbors(tiles);
    }

    const tileGrid: Tile[][] = [];
    for (let row = 0; row < sideLength; row++) {
        const firstTile =
            row === 0
                ? getFirstRowHeaderTile(tiles, neighborsMap)
                : getRowHeaderTile(tileGrid[row - 1][0], tileMap, neighborsMap);
        tileGrid.push(getTileGridRow(firstTile, sideLength, tileMap, neighborsMap));
    }
    return tileGrid;
}

function getFirstRowHeaderTile(tiles: Tile[], neighborsMap: NeighborsMap) {
    const tile = tiles.find(tile => neighborsMap[tile.id].length === 2)!;
    const firstCornerNeighbors = neighborsMap[tile.id];
    const [rightNeighbor, bottomNeighbor] = firstCornerNeighbors;

    const rightCorners = Array.from(rightNeighbor.cornerMap.keys());
    const bottomCorners = Array.from(bottomNeighbor.cornerMap.keys());

    const bottomRightCorner = bottomCorners.filter(corner => rightCorners.includes(corner))[0];
    const topRightCorner = rightCorners.filter(corner => corner !== bottomRightCorner)[0];
    const bottomLeftCorner = bottomCorners.filter(corner => corner !== bottomRightCorner)[0];

    const orientation = TileOrientation.findMatchingOrientation([
        undefined,
        topRightCorner,
        bottomRightCorner,
        bottomLeftCorner,
    ]);
    return applyTransforms(tile, orientation.transforms);
}

function getRowHeaderTile(topTile: Tile, tileMap: TileMap, neighborsMap: NeighborsMap) {
    const [, , bottomRightCorner, bottomLeftCorner] = topTile.data.orientation.corners;
    const topTileNeighbor = findNeighborWithMatchingCorners(
        topTile,
        [bottomRightCorner, bottomLeftCorner],
        neighborsMap,
    );

    const topLeftCorner = topTileNeighbor.cornerMap.get(bottomLeftCorner)!;
    const topRightCorner = topTileNeighbor.cornerMap.get(bottomRightCorner)!;
    const bottomTileOrientation = TileOrientation.findMatchingOrientation([
        topLeftCorner,
        topRightCorner,
        undefined,
        undefined,
    ]);

    const bottomTile = tileMap[topTileNeighbor.id];
    return applyTransforms(bottomTile, bottomTileOrientation.transforms);
}

function getTileGridRow(firstTile: Tile, sideLength: number, tileMap: TileMap, neighborsMap: NeighborsMap) {
    const row = [firstTile];
    let leftTile = firstTile;
    for (let column = 1; column < sideLength; column++) {
        leftTile = getRowTile(leftTile, tileMap, neighborsMap);
        row.push(leftTile);
    }
    return row;
}

function getRowTile(leftTile: Tile, tileMap: TileMap, neighborsMap: NeighborsMap) {
    const [, topRightCorner, bottomRightCorner] = leftTile.data.orientation.corners;
    const rightTileNeighbor = findNeighborWithMatchingCorners(
        leftTile,
        [topRightCorner, bottomRightCorner],
        neighborsMap,
    );

    const topLeftCorner = rightTileNeighbor.cornerMap.get(topRightCorner)!;
    const bottomLeftCorner = rightTileNeighbor.cornerMap.get(bottomRightCorner)!;
    const rightTileOrientation = TileOrientation.findMatchingOrientation([
        topLeftCorner,
        undefined,
        undefined,
        bottomLeftCorner,
    ]);

    const rightTile = tileMap[rightTileNeighbor.id];
    return applyTransforms(rightTile, rightTileOrientation.transforms);
}

function findNeighborWithMatchingCorners(tile: Tile, matchingCorners: TileCorner[], neighborsMap: NeighborsMap) {
    return neighborsMap[tile.id].find(neighbor => {
        const cornerKeys = Array.from(neighbor.cornerMap.keys());
        return cornerKeys.every(key => matchingCorners.includes(key));
    })!;
}
