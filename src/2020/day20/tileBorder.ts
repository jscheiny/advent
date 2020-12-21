import { TileSide } from "./tileSide";
import { Transformable } from "./transformable";

interface TileSidesProps {
    top: TileSide;
    right: TileSide;
    bottom: TileSide;
    left: TileSide;
}

export class TileBorder implements Transformable<TileBorder> {
    constructor(private readonly props: TileSidesProps) {}

    public flip() {
        const { top, right, bottom, left } = this.props;
        return new TileBorder({
            top: top.flip(),
            right: left,
            bottom: bottom.flip(),
            left: right,
        });
    }

    public rotate() {
        const { top, right, bottom, left } = this.props;
        return new TileBorder({
            top: left,
            right: top,
            bottom: right,
            left: bottom,
        });
    }

    public get clockwiseSides() {
        const { top, right, bottom, left } = this.props;
        return [top, right, bottom, left];
    }
}
