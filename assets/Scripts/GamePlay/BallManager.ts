import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, director, EventTouch, IPhysics2DContact, Node, RigidBody2D, Vec2 } from 'cc';
import { Animator } from './Animator';
import { StateNormal } from './States/StateNormal';
import { StatePreview } from './States/StatePreview';
import { StateMerging } from './States/StateMerging';
import { StateBeingMerged } from './States/StateBeingMerged';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    private _type: number = null;
    private _animator: Animator = null;
    private _hasCollided: boolean = false;

    init(type: number) {
        this._type = type;
        this._animator = new Animator();
        if (this._animator) {
            this._animator.addState('Preview', new StatePreview(this));
            this._animator.addState('Normal', new StateNormal(this));
            this._animator.addState('Merging', new StateMerging(this));
            this._animator.addState('BeingMerged', new StateBeingMerged(this));
        }
        this._animator.switchState('Preview');
    }
    
    protected onLoad(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.node.parent.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.parent.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected update(dt: number): void {
        this._animator.onUpdate(dt);
    }

    onTouchMove(event: EventTouch) {
        const currentState = this._animator.getCurrentState();
        if (currentState) {
            currentState.onTouchMove(event);
        }
    }

    onTouchEnd() {
        const currentState = this._animator.getCurrentState();
        if (currentState) {
            currentState.onTouchEnd();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        const currentState = this._animator.getCurrentState();
        if (currentState) {
            currentState.onBeginContact(selfCollider, otherCollider, contact);
        }
    }

    get hasCollided() {
        return this._hasCollided;
    }
    set hasCollided(value: boolean) {
        this._hasCollided = value;
    }

    get type() {
        return this._type;
    }

    get animator() {
        return this._animator;
    }

    getLinearVelocityScalar(): number {
        const v: Vec2 = this.getComponent(RigidBody2D).linearVelocity.clone();
        if (!v) {
            return 0;
        }

        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    
    enablePhysics() {
        const rigidBody: RigidBody2D = this.getComponent(RigidBody2D);
        const circleCollider: CircleCollider2D = this.getComponent(CircleCollider2D);
        if (rigidBody) {
            rigidBody.enabled = true;
            rigidBody.gravityScale = 2;
        }
        if (circleCollider) {
            circleCollider.enabled = true;
        }
    }

    disableCollider() {
        const circleCollider: CircleCollider2D = this.getComponent(CircleCollider2D);
        if (circleCollider) {
            circleCollider.enabled = false;
        }
    }

    drop() {
        const rigidBody: RigidBody2D = this.getComponent(RigidBody2D);
        if (rigidBody) {
            const downwardImpulse = new Vec2(0, -0.1);
            let rigidBodyCenter = rigidBody.getWorldCenter(new Vec2());
            rigidBody.applyLinearImpulse(downwardImpulse, rigidBodyCenter, true);
        }
    }
}


