import { _decorator, Component, Node, EventTouch, Input, input, instantiate, view, Prefab, RigidBody2D, UITransform, Sprite, Vec2, RigidBody} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BallGenerator')
export class BallGenerator extends Component {
    private generatePositionX: number = 0; 
    private generatePositionY: number = 0;

    @property({type: Prefab})
    ballPrefab: Prefab | null = null;
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
        this.ballToDrop = this.generateBall(this.generatePositionX, this.generatePositionY);
    }

    onTouchMove(event: EventTouch) {
        if (!this.ballToDrop) {
            return;
        }
        this.ballToDrop.worldPositionX += event.getDeltaX();
    }

    onTouchEnd() {
        // 让当前预览的球掉落
        const rigidBody: RigidBody2D = this.ballToDrop?.getComponent(RigidBody2D) as RigidBody2D;
        if (rigidBody) {
            rigidBody.gravityScale = 1;
            rigidBody.applyLinearImpulse(new Vec2(0, -0.1), rigidBody.getWorldCenter(new Vec2()), true);
        }
        this.ballToDrop = null;

        // 稍微等一会再生成下一个
        this.scheduleOnce(() => {
            this.ballToDrop = this.generateBall(this.generatePositionX, this.generatePositionY);
            console.log(`Ball instantiated:`, this.ballToDrop);
        }, 1)
    }

    generateBall(x:number, y:number): Node {
        const ball = instantiate(this.ballPrefab);
        const rigidBody:RigidBody2D = ball.getComponent(RigidBody2D);
        rigidBody.gravityScale = 0;
        ball.setParent(this.node.parent);
        ball.worldPositionX = x;
        ball.worldPositionY = y;
        return ball;
    }
}


