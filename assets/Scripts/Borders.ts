import { _decorator, Component, director, Node, UITransform, view } from 'cc';
import { DataManager } from './DataManager';
import { BallManager } from './BallManager';
import { EventType } from './EventType';
const { ccclass, property } = _decorator;

@ccclass('Borders')
export class Borders extends Component {
    @property({type:Node})
    top: Node | null = null;

    @property({type:Node})
    bottom: Node | null = null;
    
    private alarmThreshold: number = 0.7;

    protected onLoad(): void {
        director.on(EventType.BALL_FIRST_COLLISION, this.onBallFirstCollision, this);
    }

    protected onDestroy(): void {
        director.off(EventType.BALL_FIRST_COLLISION, this.onBallFirstCollision, this);
    }

    start() {
        this.top.active = false;
    }

    update(deltaTime: number) {
        const balls = DataManager.instance.balls;
        for (const ball of balls) {
            if (!ball.getComponent(BallManager).hasCollided) {
                continue;
            }

            const uitransform : UITransform = ball.getComponent(UITransform);
            const topOfBall = ball.worldPositionY + uitransform.height / 2;
            if (uitransform && topOfBall >= this.top.worldPositionY) {
                this.top.active = true;
                return;
            }
        }

        this.top.active = false;
    }

    onBallFirstCollision(ball : Node) {
        const ballUItransform = ball.getComponent(UITransform);
        if (!ballUItransform) return;
        const topOfBall = ball.worldPositionY + ballUItransform.height / 2;

        let bottomOfPlayArea = 0;
        if (this.bottom) {
            const bottomUITransform = this.bottom.getComponent(UITransform);
            bottomOfPlayArea = this.bottom.worldPositionY + (bottomUITransform ? bottomUITransform.height / 2 : 0);
        }
        const ratio = (topOfBall - bottomOfPlayArea) / (this.top.worldPositionY - bottomOfPlayArea);
        if (ratio > this.alarmThreshold) {
            this.top.active = true;
        }
        console.log(topOfBall, bottomOfPlayArea, this.top.worldPositionY, ratio);
    }
}


