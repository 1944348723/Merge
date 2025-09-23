import { _decorator, Component, director, Node, Vec2 } from 'cc';
import { EventType } from './EventType';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: DataManager | null = null;
    private _balls: Set<Node> = new Set();
    private _defaultSpawnPosition: Vec2 = new Vec2(0, 0);
    private _leftBound: number = null;
    private _rightBound: number = null;
    private _score = 0;
    private _ballContainer: Node = null;
    public heightOfGameOverLine = 0;

    protected onLoad(): void {
        // 将当前实例注册为单例实例
        if (!DataManager._instance) {
            DataManager._instance = this;
        } 
    }

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
        this._balls.clear();
    }
   
    get balls() {
        return this._balls;
    }

    getDefaultSpawnPosition(): Vec2 {
        return this._defaultSpawnPosition;
    }

    // 这里是直接使用传入的引用，可以考虑换成只赋值，避免外部修改
    setDefaultSpawnPosition(spawnPosition: Vec2) {
        this._defaultSpawnPosition = spawnPosition;
    }

    updateHighScore(): boolean {
        const highScore = this.getHighScore();
        console.log('[DataManager] updateHighScore', this._score, highScore);
        if (this._score > highScore) {
            localStorage.setItem('highScore', this._score.toString());
            console.log('high score changed');
            director.emit(EventType.HIGH_SCORE_CHANGED, this._score);
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

    get score() {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
        director.emit(EventType.SCORE_CHANGED, this._score);
    }

    getLeftBound(): number {
        return this._leftBound;
    }

    getRightBound(): number {
        return this._rightBound;
    }

    setBounds(left: number, right: number) {
        this._leftBound = left;
        this._rightBound = right;
    }

    get ballContainer() {
        return this._ballContainer;
    }

    set ballContainer(value: Node) {
        this._ballContainer = value;
    }

}


