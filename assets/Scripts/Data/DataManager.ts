import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: DataManager | null = null;
    private _balls: Set<Node> = new Set();
    private _defaultBallY = 0;

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
   
    get balls() {
        return this._balls;
    }

    getDefaultBallY() {
        return this._defaultBallY;
    }

    setDefaultBallY(worldPositionY: number) {
        this._defaultBallY = worldPositionY;
    }
}


