import { image } from "./input";

function decodeImage(width: number, height: number, data: string) {
    const layerCount = data.length / (width * height);
    const layers: number[][][] = [];
    let dataIndex = 0;
    for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        const layer: number[][] = [];
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            const row: number[] = [];
            for (let colIndex = 0; colIndex < width; colIndex++) {
                row.push(parseInt(data[dataIndex], 10));
                dataIndex++;
            }
            layer.push(row);
        }
        layers.push(layer);
    }

    return flattenImage(width, height, layers);
}

function flattenImage(width: number, height: number, layers: number[][][]) {
    const flat: number[][] = [];
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        const row: number[] = [];
        for (let colIndex = 0; colIndex < width; colIndex++) {
            for (const layer of layers) {
                const layerValue = layer[rowIndex][colIndex];
                if (layerValue !== 2) {
                    row.push(layerValue);
                    break;
                }
            }
        }
        flat.push(row);
    }
    return flat;
}

const result = decodeImage(25, 6, image);
for (const row of result) {
    console.log(row.map(x => (x === 1 ? "#" : " ")).join(" "));
}
