import { BallType } from "./BallType";

// TODO: 这样配置不太好，分数不应该属于球的配置
export class BallConfig {
    private static readonly SCORE_MAP: Map<BallType, number> = new Map([
        [BallType.RED, 2],
        [BallType.ORINGE, 4],
        [BallType.YELLOW, 8],
        [BallType.GREEN, 16],
        [BallType.CYAN, 32],
        [BallType.BLUE, 64],
        [BallType.PURPLE, 128]
    ]);

    static getScore(type: BallType) {
        return this.SCORE_MAP.get(type) || 0;
    }
};
