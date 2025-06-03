import { _decorator, assert, CircleCollider2D, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { BallType } from './BallType';
import { calculateDirection } from '../Utils';
import { BallGenerator } from './BallGenerator';
import { EventType } from './EventTyp';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    private type: BallType = null;
    private mergingTarget: Node = null;
    private mergedBy: Node = null;
    private readonly MERGE_SPEED: number = 30;
    private readonly MERGE_DISTASNCE: number = 20;

    protected start(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    init(type: BallType) {
        this.type = type;
    }

    protected update(dt: number): void {
        if (this.mergingTarget) {
            const distance = this.node.getPosition().subtract(this.mergingTarget.getPosition()).length();
            if (distance < this.MERGE_DISTASNCE) {
                this.node.destroy();
                director.emit(EventType.MERGE_COMPLETE, this.node.worldPositionX, this.node.worldPositionY, this.type);
            }
        } else if (this.mergedBy) {
            const distance = this.node.getPosition().subtract(this.mergedBy.getPosition()).length();
            if (distance < this.MERGE_DISTASNCE) {
                this.node.destroy();
            }
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (!this.isSameTypeOfBall(selfCollider.node, otherCollider.node)) {
            return;
        }

        // 优先判断y坐标，下面的merge上面的
        if (selfCollider.node.y < otherCollider.node.y) {
            this.mergingTarget = otherCollider.node;
            this.merge(otherCollider.node);
            return;
        } else if (selfCollider.node.y > otherCollider.node.y) {
            this.mergedBy = otherCollider.node;
            return;
        }

        assert(selfCollider.node.y === otherCollider.node.y);
        // y坐标相同判断速度，速度慢的merge速度快的
        const otherBallManager = otherCollider.getComponent(BallManager);
        const selfVelocity = this.getLinearVelocityScalar();
        const otherVelocity = otherBallManager.getLinearVelocityScalar();

        if (selfVelocity < otherVelocity) {
            this.mergingTarget = otherCollider.node;
            this.merge(otherCollider.node);
        } else if (selfVelocity > otherVelocity) {
            this.mergedBy = otherCollider.node;
        }
    }

    // 传入的不是球会返回false
    isSameTypeOfBall(node1: Node, node2: Node): boolean {
        const ball1: BallManager = node1.getComponent(BallManager);
        const ball2: BallManager = node2.getComponent(BallManager);
        
        return ball1 && ball2 && ball1.type === ball2.type;
    }

    merge(otherBall: Node) {
        // 被merge的球关闭物理碰撞
        // 被merge的球向当前球移动，需要关闭重力，然后提供一个初速度
        // 接近重合时两个球都销毁，在merge的球的位置生成合并后的球
        const otherRigidBody = otherBall.getComponent(RigidBody2D);
        const otherCollider = otherBall.getComponent(CircleCollider2D);
        otherCollider.enabled = false;
        this.scheduleOnce(() => {
            otherRigidBody.gravityScale = 0;
            otherRigidBody.angularVelocity = 0;
            const directionVec = calculateDirection(otherBall.getPosition(), this.node.getPosition()).toVec2();
            otherRigidBody.linearVelocity = directionVec.multiplyScalar(this.MERGE_SPEED);
        }, 0)
    }

    getLinearVelocityScalar(): number {
        const v: Vec2 = this.getComponent(RigidBody2D).linearVelocity;
        if (!v) {
            return 0;
        }

        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
}


