import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, director, EventTouch, IPhysics2DContact, Node, RigidBody2D, tween, Vec2, Vec3 } from 'cc';
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
    
    protected onLoad(): void {
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
    
    init(type: number) {
        this._type = type;
        this._hasCollided = false;
        if (!this._animator) {
            this._animator = new Animator();
            this._animator.addState('Preview', new StatePreview(this));
            this._animator.addState('Normal', new StateNormal(this));
            this._animator.addState('Merging', new StateMerging(this));
            this._animator.addState('BeingMerged', new StateBeingMerged(this));
        }
        if (this._animator.getCurrentStateName() !== 'Preview') {
            this._animator.switchState('Preview');
        }
    }

    unuse() {
        this.node.active = false;
    }

    reuse() {
        this.node.active = true;
        this._animator.switchState('Preview');
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
        const rigidBody = this.getComponent(RigidBody2D);
        if (!rigidBody) {
            return 0;
        }
        
        const velocity = rigidBody.linearVelocity;
        return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
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

    playSpawnAnimation(): void {
        this.node.setScale(0, 0, 1);
        
        tween(this.node)
            .to(0.2, { scale: new Vec3(1, 1, 1) }, {
                easing: 'linear'
            })
            .start();
    }
}


