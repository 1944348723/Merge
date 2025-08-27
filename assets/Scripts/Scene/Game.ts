import { _decorator, Component, director, UITransform, view, Node, CircleCollider2D, Collider, PhysicsSystem2D, EPhysics2DDrawFlags, RigidBody2D, ERigidBody2DType, Sprite, resources, SpriteFrame} from 'cc';
import { EventType } from '../Data/EventType';
import { ballConfig, BallGenerator } from '../GamePlay/BallGenerator';
import { BallManager } from '../GamePlay/BallManager';
import { DataManager } from '../Data/DataManager';
import { AudioMgr } from '../Audio/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(BallGenerator)
    ballGenerator: BallGenerator | null = null;

    private defaultBallX: number = 0; 
    private defaultBallY: number = 0;
    private gameOver: boolean = false;

    // 初始化游戏
    protected start(): void {
        // 调试碰撞体
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        EPhysics2DDrawFlags.Pair |
        EPhysics2DDrawFlags.CenterOfMass |
        EPhysics2DDrawFlags.Joint |
        EPhysics2DDrawFlags.Shape;

        // 设置默认球的位置
        this.defaultBallX = this.node.worldPositionX
        this.defaultBallY = this.node.worldPositionY + view.getVisibleSize().height * 3 / 8;
        DataManager.instance.setDefaultBallY(this.defaultBallY);
        DataManager.instance.setBounds(0, view.getVisibleSize().width);

        director.emit(EventType.GAME_START);
    }

    protected onLoad(): void {
        director.on(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
        director.on(EventType.BALL_MERGED, this.onBallMerged, this);
        director.on(EventType.GAME_START, this.onGameStart, this);
        director.on(EventType.GAME_OVER, this.onGameOver, this);
    }

    protected onDestroy(): void {
        director.off(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
        director.off(EventType.BALL_MERGED, this.onBallMerged, this);
        director.off(EventType.GAME_START, this.onGameStart, this);
        director.off(EventType.GAME_OVER, this.onGameOver, this);
    }

    protected update(dt: number): void {
        if (!this.gameOver) {
            this.checkGameOver();
        }
    }

    private checkGameOver() {
        let count: number = 0;
        for (const ball of DataManager.instance.balls) {
            const uitransform = ball.getComponent(UITransform);
            if (uitransform && ball.worldPositionY + uitransform.height / 2 > DataManager.instance.heightOfGameOverLine) {
                ++count;
            }
        }
        if (count > 3) {
            console.log('game over');
            director.emit(EventType.GAME_OVER);
        }
    }

    onGameStart() {
        this.gameOver = false;
        DataManager.instance.clearBalls();
        DataManager.instance.score = 0;

        // 生成第一个球
        const ball = this.ballGenerator.generateRandomBall();
        ball.setWorldPosition(this.defaultBallX, this.defaultBallY, 0);
    }

    onGameOver() {
        this.gameOver = true;
        DataManager.instance.updateHighScore();
    }

    onPlayerDroppedBall() {
        this.scheduleOnce(() => {
            const ball = this.ballGenerator.generateRandomBall();
            ball.setWorldPosition(this.defaultBallX, this.defaultBallY, 0);
        }, 1);
    }

    onBallMerged(x: number, y: number, type: number) {
        // 音效
        AudioMgr.inst.playBallMerge();
        // 分数
        DataManager.instance.score += ballConfig[type].score;

        // 生成新球
        const newBall = this.ballGenerator.generateBall(type + 1);
        newBall.setWorldPosition(x, y, 0);
        const ballManager = newBall.getComponent(BallManager);
        ballManager?.animator.switchState('Normal');
    }

}


