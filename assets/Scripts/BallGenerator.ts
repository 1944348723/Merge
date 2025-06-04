import { _decorator, Component, Node, EventTouch, Input, input, instantiate, view, Prefab, RigidBody2D, Vec2, director, UITransform } from 'cc';
import { BallType } from './BallType';
import { BallManager } from './BallManager';
import { EventType } from './EventType';
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
        director.on(EventType.MERGE_COMPLETE, this.onMergeComplete, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        director.off(EventType.MERGE_COMPLETE, this.onMergeComplete, this);
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
        //TODO: 将硬编码切换为获取数据
        const halfBallWidth = this.ballToDrop.getComponent(UITransform).width / 2;
        const leftBound = halfBallWidth;
        const rightBound = 720 - halfBallWidth;
        let newX = this.ballToDrop.worldPositionX + event.getDeltaX();
        if (newX < leftBound) newX = leftBound;
        if (newX > rightBound) newX = rightBound;

        this.ballToDrop.worldPositionX = newX;
    }

    onTouchEnd() {
        if (!this.ballToDrop) {
            return;
        }
        // 让当前预览的球掉落
        this.ballToDrop.getComponent(BallManager)?.drop();
        this.ballToDrop = null;
        this.scheduleOnce(() => {
            this.ballToDrop = this.generateRandomBall(this.generatePositionX, this.generatePositionY);
        }, 1)
    }

    onMergeComplete(x: number, y: number, type: BallType) {
        const newBall = this.generateBall(x, y, type + 1);
        newBall.getComponent(BallManager)?.drop();
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
}


