import { _decorator, Component, director, UITransform, view, Node, Vec3, Vec2} from 'cc';
import { EventType } from '../Data/EventType';
import { BallPoolManager } from '../GamePlay/BallPoolManager';
import { DataManager } from '../Data/DataManager';
import { AudioMgr } from '../Audio/AudioMgr';
import { MergeEffect } from '../GamePlay/MergeEffect';
import { Controller } from '../GamePlay/Controller';
import { BallManager } from '../GamePlay/BallManager';
const { ccclass, property } = _decorator;

// TODO: 存档功能
@ccclass('Game')
export class Game extends Component {
    @property(BallPoolManager)
    ballPoolManager: BallPoolManager | null = null;

    @property(MergeEffect)
    mergeEffect: MergeEffect | null = null;

    @property({type: Controller})
    controller: Controller | null = null;

    @property({type: Node})
    ballContainer: Node | null = null;

    private gameOver: boolean = false;

    // 初始化游戏
    protected start(): void {
        // 调试碰撞体
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        // EPhysics2DDrawFlags.Pair |
        // EPhysics2DDrawFlags.CenterOfMass |
        // EPhysics2DDrawFlags.Joint |
        // EPhysics2DDrawFlags.Shape;

        DataManager.instance.setBounds(0, view.getVisibleSize().width);
        this.ballPoolManager.initPool();
        director.emit(EventType.GAME_START);
    }

    protected onLoad(): void {
        if (!this.ballContainer) {
            this.ballContainer = this.node;
        }
        director.on(EventType.BALL_MERGED, this.onBallMerged, this);
        director.on(EventType.GAME_START, this.onGameStart, this);
        director.on(EventType.GAME_OVER, this.onGameOver, this);
        director.on(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
    }

    protected onDestroy(): void {
        director.off(EventType.BALL_MERGED, this.onBallMerged, this);
        director.off(EventType.GAME_START, this.onGameStart, this);
        director.off(EventType.GAME_OVER, this.onGameOver, this);
        director.off(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
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
        console.info('game start');
        this.gameOver = false;
        DataManager.instance.score = 0;
        for (const ball of DataManager.instance.balls) {

            this.ballPoolManager.returnBall(ball);
        }
        DataManager.instance.clearBalls();

        // 生成第一个球
        const firstBall = this.generateRandomBallAtDefaultPosition();
        this.controller.setCurrentBall(firstBall);
    }

    onGameOver() {
        this.gameOver = true;
        this.controller.setCurrentBall(null);
        DataManager.instance.updateHighScore();
    }

    onPlayerDroppedBall() {
        console.info('onPlayerDroppedBall');
        this.scheduleOnce(() => {
            const ball = this.generateRandomBallAtDefaultPosition();
            this.controller.setCurrentBall(ball);
        }, 1);
    }

    onBallMerged(mergePosition: Vec2, mergingBall: BallManager, targetBall: BallManager) {
        const type = mergingBall.type;
        const ballWidth = mergingBall.getComponent(UITransform).width;
        // 音效
        AudioMgr.inst.playBallMerge();
        // 特效
        this.mergeEffect.play(type, mergePosition.toVec3(), ballWidth);

        // 分数
        DataManager.instance.score += this.ballPoolManager.ballConfig[type].score;

        // 回收球
        this.ballPoolManager.returnBall(mergingBall.node);
        DataManager.instance.deleteBall(mergingBall.node);
        this.ballPoolManager.returnBall(targetBall.node);
        DataManager.instance.deleteBall(targetBall.node);

        // 生成新球
        const newBall = this.ballPoolManager.generateBall(type + 1);
        newBall.setParent(this.ballContainer);
        newBall.setWorldPosition(mergePosition.x, mergePosition.y, 0);
        newBall.getComponent(BallManager)?.playSpawnAnimation();
        const ballManager = newBall.getComponent(BallManager);
        ballManager?.animator.switchState('Normal');
    }

    generateRandomBallAtDefaultPosition(): BallManager {
        const ball = this.ballPoolManager.generateRandomBall();
        ball.setParent(this.ballContainer);
        ball.setWorldPosition(DataManager.instance.getDefaultSpawnPosition().x, DataManager.instance.getDefaultSpawnPosition().y, 0);
        ball.getComponent(BallManager)?.playSpawnAnimation();
        return ball.getComponent(BallManager);
    }
}


