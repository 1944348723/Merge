import { _decorator, BoxCollider2D, CircleCollider2D, Collider2D, Component, Contact2DType, director, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { BallType } from '../Data/BallType';
import { calculateDirection } from '../../Utils';
import { EventType } from '../Data/EventType';
import { DataManager } from '../Data/DataManager';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    private type: BallType = null;
    private mergingTarget: Node = null;
    private mergedBy: Node = null;
    private readonly MERGE_SPEED: number = 80;
    private readonly MERGE_DISTASNCE: number = 30;
    private _hasCollided = false;
    private _isDestroyed = false; // 添加销毁标志

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
        if (this._isDestroyed) return; // 如果已经销毁，直接返回
        
        if (this.mergingTarget) {
            const distance = this.node.getPosition().subtract(this.mergingTarget.getPosition()).length();
            if (distance < this.MERGE_DISTASNCE) {
                this.destroyBall();
            }
        } else if (this.mergedBy) {
            const distance = this.node.getPosition().subtract(this.mergedBy.getPosition()).length();
            if (distance < this.MERGE_DISTASNCE) {
                this.destroyBall();
            }
        }
    }
    
    private destroyBall() {
        if (this._isDestroyed) return; // 防止重复销毁
        
        this._isDestroyed = true;
        
        // 在销毁前保存需要的信息
        const worldPosX = this.node.worldPositionX;
        const worldPosY = this.node.worldPositionY;
        const ballType = this.type;
        
        // 先通知 DataManager 删除球
        DataManager.instance.deleteBall(this.node);
        
        // 然后销毁节点
        this.node.destroy();
        
        // 最后发送事件
        director.emit(EventType.BALL_MERGED, worldPosX, worldPosY, ballType);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (this._isDestroyed) return; // 如果已经销毁，直接返回
        
        if (!this.hasCollided && selfCollider.node.worldPositionY !== DataManager.instance.getDefaultBallY()) {
            this._hasCollided = true;
            director.emit(EventType.BALL_FIRST_COLLISION, selfCollider.node);
        }

        if (!this.isSameTypeOfBall(selfCollider.node, otherCollider.node)) {
            return;
        }
        if (this.mergingTarget || this.mergedBy) {
            return;
        }

        // 优先判断y坐标，下面的merge上面的
        if (selfCollider.node.y < otherCollider.node.y) {
            this.merge(otherCollider.node);
        } else if (selfCollider.node.y === otherCollider.node.y) {
            // y坐标相同判断速度，速度慢的merge速度快的
            const otherBallManager = otherCollider.getComponent(BallManager);
            const selfVelocity = this.getLinearVelocityScalar();
            const otherVelocity = otherBallManager.getLinearVelocityScalar();

            if (selfVelocity < otherVelocity) {
                this.merge(otherCollider.node);
            }
        }
    }

    get hasCollided() {
        return this._hasCollided;
    }

    // 传入的不是球会返回false
    isSameTypeOfBall(node1: Node, node2: Node): boolean {
        const ball1: BallManager = node1.getComponent(BallManager);
        const ball2: BallManager = node2.getComponent(BallManager);
        
        return ball1 && ball2 && ball1.type === ball2.type;
    }

    // TODO:当前合并方式有风险，当碰撞后负责merge的球A的速度非常快时，被merge球B朝A原来的位置移动，可能会出现无法靠近到合并距离的情况
    merge(otherBall: Node) {
        if (this._isDestroyed) return; // 如果已经销毁，直接返回
        
        // 被merge的球关闭物理碰撞
        // 被merge的球向当前球移动，需要关闭重力，然后提供一个初速度
        // 接近重合时两个球都销毁，在merge的球的位置生成合并后的球
        this.mergingTarget = otherBall;
        otherBall.getComponent(BallManager)?.mergeTo(this.node);
    }

    mergeTo(otherBall: Node) {
        if (this._isDestroyed) return; // 如果已经销毁，直接返回
        
        this.mergedBy = otherBall;

        const collider = this.getComponent(CircleCollider2D);
        collider.enabled = false;

        // 延迟一下再设置，否则会被弹开，设置的速度会被碰撞覆盖
        this.scheduleOnce(() => {
            if (this._isDestroyed) return; // 再次检查是否已销毁
            
            const rigidBody = this.getComponent(RigidBody2D);
            rigidBody.gravityScale = 0;
            rigidBody.angularVelocity = 0;
            const directionVec = calculateDirection(this.node.getPosition(), otherBall.getPosition()).toVec2();
            rigidBody.linearVelocity = directionVec.multiplyScalar(this.MERGE_SPEED);
        }, 0);
    }

    getLinearVelocityScalar(): number {
        const v: Vec2 = this.getComponent(RigidBody2D).linearVelocity;
        if (!v) {
            return 0;
        }

        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    
    drop() {
        if (this._isDestroyed) return; // 如果已经销毁，直接返回
        
        const rigidBody: RigidBody2D = this.getComponent(RigidBody2D);
        const circleCollider: CircleCollider2D = this.getComponent(CircleCollider2D);
        if (rigidBody) {
            rigidBody.gravityScale = 2;
            const downwardImpulse = new Vec2(0, -0.1);
            let rigidBodyCenter = rigidBody.getWorldCenter(new Vec2());
            rigidBody.applyLinearImpulse(downwardImpulse, rigidBodyCenter, true);
        }
        if (circleCollider) {
            circleCollider.enabled = true;
        }
    }
}


