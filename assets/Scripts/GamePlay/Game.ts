import { _decorator, Component, director, UITransform, view, Node} from 'cc';
import { EventType } from '../Data/EventType';
import { BallGenerator } from './BallGenerator';
import { Controller } from './Controller';
import { BallType } from '../Data/BallType';
import { BallManager } from './BallManager';
import { BallConfig } from '../Data/BallConfig';
import { DataManager } from '../Data/DataManager';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(BallGenerator)
    ballGenerator: BallGenerator | null = null;

    @property(Controller)
    controller: Controller | null = null;

    private defaultBallX: number = 0; 
    private defaultBallY: number = 0;
    
    private score: number = 0;

    // 初始化游戏
    protected start(): void {
        // 设置默认球的位置
        this.defaultBallX = this.node.worldPositionX
        this.defaultBallY = this.node.worldPositionY + view.getVisibleSize().height * 3 / 8;
        DataManager.instance.setDefaultBallY(this.defaultBallY);

        // 生成第一个球
        const ball = this.ballGenerator.generateRandomBall(this.defaultBallX, this.defaultBallY);

        // 初始化控制器
        const uitransform = this.getComponent(UITransform);
        if (uitransform) {
            this.controller?.setBounds(0, uitransform.width);
        }
        this.controller.currentBall = ball;
        director.emit(EventType.GAME_START);
    }

    protected onLoad(): void {
        director.on(EventType.SETTINGS_PANEL_OPENED, this.onSettingsPanelOpened, this);
        director.on(EventType.SETTINGS_PANEL_CLOSED, this.onSettingsPanelClosed, this);
        director.on(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
        director.on(EventType.BALL_MERGED, this.onBallMerged, this);
        director.on(EventType.BALL_FIRST_COLLISION, this.onBallFirstCollision, this);
    }

    protected onDestroy(): void {
        director.off(EventType.SETTINGS_PANEL_OPENED, this.onSettingsPanelOpened, this);
        director.off(EventType.SETTINGS_PANEL_CLOSED, this.onSettingsPanelClosed, this);
        director.off(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
        director.off(EventType.BALL_MERGED, this.onBallMerged, this);
        director.off(EventType.BALL_FIRST_COLLISION, this.onBallFirstCollision, this);
    }

    onSettingsPanelOpened() {
        this.controller.enabled = false;
    }

    onSettingsPanelClosed() {
        this.controller.enabled = true;
    }

    onPlayerDroppedBall() {
        this.scheduleOnce(() => {
            const ball = this.ballGenerator.generateRandomBall(this.defaultBallX, this.defaultBallY);
            this.controller.currentBall = ball;
        }, 1);
    }

    onBallMerged(x: number, y: number, type: BallType) {
        this.score += BallConfig.getScore(type);
        DataManager.instance.score = this.score;
        director.emit(EventType.SCORE_CHANGED, this.score);
        
        const newBall = this.ballGenerator.generateBall(x, y, type + 1);
        newBall.getComponent(BallManager)?.drop();
    }

    onBallFirstCollision(ball: Node) {
        // 检查是否游戏结束
        this.scheduleOnce(() => {
            for (ball of DataManager.instance.balls) {
                if (ball.worldPositionY > DataManager.instance.heightOfGameOverLine) {
                    director.emit(EventType.GAME_OVER);
                }
            }
        }, 0.5);
    }
}


