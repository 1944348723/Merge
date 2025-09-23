import { _decorator, Component, EventTouch, Node } from 'cc';
import { BallManager } from './BallManager';
const { ccclass, property } = _decorator;

@ccclass('Controller')
export class Controller extends Component {
    private _currentBall: BallManager = null;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchEnd() {
        if (this._currentBall) {
            this._currentBall.onTouchEnd();
        }
    }

    onTouchMove(event: EventTouch) {
        if (this._currentBall) {
            this._currentBall.onTouchMove(event);
        }
    }

    setCurrentBall(ball: BallManager) {
        this._currentBall = ball;
    }
}


