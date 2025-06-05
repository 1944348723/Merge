import { BallType } from "./BallType";

export class BallConfig {
    private static readonly SCORE_MAP: Map<BallType, number> = new Map([
        [BallType.RED, 2],
        [BallType.ORINGE, 4],
        [BallType.YELLOW, 8],
        [BallType.GREEN, 16],
        [BallType.CYAN, 32]
    ]);

    static getScore(type: BallType) {
        return this.SCORE_MAP.get(type) || 0;
    }
};
