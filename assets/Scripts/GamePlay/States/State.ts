import { _decorator, Collider2D, Component, EventTouch, IPhysics2DContact, Node } from 'cc';
import { BallManager } from '../BallManager';
const { ccclass, property } = _decorator;

@ccclass('State')
export default class State extends Component {
    protected _ball: BallManager | null = null;

    constructor(ball: BallManager) {
        super();
        this._ball = ball;
    }

    onEnter() {}

    onExit() {}

    onUpdate(deltaTime: number) {}

    onTouchMove(event: EventTouch) {}

    onTouchEnd() {}

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {}

    protected switchToState(stateName: string): void {
        if (this._ball && this._ball.animator) {
            this._ball.animator.switchState(stateName);
        }
    }
}


