import { _decorator, Component, director, Node } from 'cc';
import { EventType } from './EventType';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: DataManager | null = null;
    private _balls: Set<Node> = new Set();
    private _defaultBallY = 0;
    public heightOfGameOverLine = 0;
    public score = 0;

    public static get instance(): DataManager {
        if (!DataManager._instance) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }

    addBall(ball: Node) {
        if (ball) {
            this.balls.add(ball);
            console.log(this._balls);
        }
    }

    deleteBall(ball: Node) {
        if (ball) {
            this.balls.delete(ball);
            console.log(this._balls);
        }
    }

    clearBalls() {
        for (const ball of this._balls) {
            ball.destroy();
        }
        this._balls.clear();
    }
   
    get balls() {
        return this._balls;
    }

    getDefaultBallY() {
        return this._defaultBallY;
    }

    setDefaultBallY(worldPositionY: number) {
        this._defaultBallY = worldPositionY;
    }

    updateHighScore(): boolean {
        const highScore = this.getHighScore();
        console.log('[DataManager] updateHighScore', this.score, highScore);
        if (this.score > highScore) {
            localStorage.setItem('highScore', this.score.toString());
            console.log('high score changed');
            director.emit(EventType.HIGH_SCORE_CHANGED, this.score);
            return true;
        }
        return false;
    }

    getHighScore(): number {
        const highScore = localStorage.getItem('highScore');
        if (highScore) {
            return parseInt(highScore);
        }
        return 0;
    }
}


