import { _decorator, Component, director, EventTouch, Input, input, Node, UITransform } from 'cc';
import { BallManager } from './BallManager';
import { EventType } from '../Data/EventType';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {
    public currentBall: Node = null;
    private leftBound: number = null;
    private rightBound: number = null;

    protected onEnable(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchMove(event: EventTouch) {
        if (!this.currentBall) return;

        let newX = this.currentBall.worldPositionX + event.getDeltaX();
        
        const halfBallWidth = this.currentBall.getComponent(UITransform).width / 2;
        if (this.leftBound !== null) {
            const minX = this.leftBound + halfBallWidth;
            if (newX < minX) newX = minX;
        }
        if (this.rightBound !== null) {
            const maxX = this.rightBound - halfBallWidth;
            if (newX > maxX) newX = maxX;
        }

        this.currentBall.worldPositionX = newX;
    }

    onTouchEnd() {
        if (!this.currentBall) return;

        // 让当前预览的球掉落
        this.currentBall.getComponent(BallManager)?.drop();
        this.currentBall = null;

        director.emit(EventType.PLAYER_DROPPED_BALL);
    }

    setBounds(left: number, right: number) {
        this.leftBound = left;
        this.rightBound = right;
    }
}


