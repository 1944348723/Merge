import { _decorator, Component, director, Node, UITransform, view } from 'cc';
import { EventType } from './EventType';
import { BallGenerator } from './BallGenerator';
import { Controller } from './Controller';
import { BallType } from './BallType';
import { BallManager } from './BallManager';
import { BallConfig } from './BallConfig';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(BallGenerator)
    ballGenerator: BallGenerator | null = null;

    @property(Controller)
    controller: Controller | null = null;

    private generatePositionX: number = 0; 
    private generatePositionY: number = 0;
    
    private score: number = 0;

    protected start(): void {
        const uitransform = this.getComponent(UITransform);
        if (uitransform) {
            this.controller?.setBounds(0, uitransform.width);
        }

        this.generatePositionX = this.node.worldPositionX
        this.generatePositionY = this.node.worldPositionY + view.getVisibleSize().height * 3 / 8;
        const ball = this.ballGenerator.generateRandomBall(this.generatePositionX, this.generatePositionY);
        this.controller.currentBall = ball;
    }

    protected onLoad(): void {
        director.on(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
        director.on(EventType.BALL_MERGED, this.onBallMerged, this);
    }

    protected onDestroy(): void {
        director.off(EventType.PLAYER_DROPPED_BALL, this.onPlayerDroppedBall, this);
        director.off(EventType.BALL_MERGED, this.onBallMerged, this);
    }

    onPlayerDroppedBall() {
        this.scheduleOnce(() => {
            const ball = this.ballGenerator.generateRandomBall(this.generatePositionX, this.generatePositionY);
            this.controller.currentBall = ball;
        }, 1);
    }

    onBallMerged(x: number, y: number, type: BallType) {
        this.score += BallConfig.getScore(type);
        director.emit(EventType.SCORE_CHANGED, this.score);
        
        const newBall = this.ballGenerator.generateBall(x, y, type + 1);
        newBall.getComponent(BallManager)?.drop();
    }
}


