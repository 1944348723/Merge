import { _decorator, Component, Node, EventTouch, Input, input, instantiate, view, Prefab, RigidBody2D, Vec2 } from 'cc';
import { BallType } from './BallType';
import { BallManager } from './BallManager';
const { ccclass, property } = _decorator;

@ccclass('BallGenerator')
export class BallGenerator extends Component {
    private generatePositionX: number = 0; 
    private generatePositionY: number = 0;

    @property({type: [Prefab], tooltip: "球的预制体数组"})
    ballPrefabs: Prefab[] = [];
    private ballToDrop: Node | null = null;

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected start(): void {
        this.generatePositionX = this.node.worldPositionX
        this.generatePositionY = this.node.worldPositionY + view.getVisibleSize().height * 3 / 8;
        this.ballToDrop = this.generateRandomBall(this.generatePositionX, this.generatePositionY);
    }

    onTouchMove(event: EventTouch) {
        if (!this.ballToDrop) {
            return;
        }
        //TODO: 快速移动时会穿出屏幕
        this.ballToDrop.worldPositionX += event.getDeltaX();
    }

    onTouchEnd() {
        // 让当前预览的球掉落
        this.dropBall(this.ballToDrop);
        this.ballToDrop = null;
        this.scheduleOnce(() => {
            this.ballToDrop = this.generateRandomBall(this.generatePositionX, this.generatePositionY);
        }, 1)
    }

    private generateRandomBall(x:number, y:number) {
        const type:BallType = Math.floor(Math.random() * this.ballPrefabs.length);
        return this.generateBall(x, y, type);
    }

    private generateBall(x:number, y:number, type: BallType): Node {
        const ball = instantiate(this.ballPrefabs[type]);
        ball.getComponent(BallManager).init(type);
        ball.setParent(this.node.parent);

        ball.worldPositionX = x;
        ball.worldPositionY = y;

        const rigidBody:RigidBody2D = ball.getComponent(RigidBody2D);
        rigidBody.gravityScale = 0;

        return ball;
    }

    private dropBall(ball: Node) {
        const rigidBody: RigidBody2D = ball?.getComponent(RigidBody2D);
        if (rigidBody) {
            rigidBody.gravityScale = 1;
            const downwardImpulse = new Vec2(0, -0.1);
            let rigidBodyCenter = rigidBody.getWorldCenter(new Vec2());
            rigidBody.applyLinearImpulse(downwardImpulse, rigidBodyCenter, true);
        }
    }
}


