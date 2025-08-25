import { _decorator, Collider2D, Component, director, IPhysics2DContact, Node } from 'cc';
import State from './State';
import { DataManager } from '../../Data/DataManager';
import { AudioMgr } from '../../Audio/AudioMgr';
import { EventType } from '../../Data/EventType';
import { BallManager } from '../BallManager';
import { StateMerging } from './StateMerging';
import { StateBeingMerged } from './StateBeingMerged';
const { ccclass, property } = _decorator;

@ccclass('StateNormal')
export class StateNormal extends State {

    onEnter(): void {
        this._ball.enablePhysics();
        this._ball.drop();
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        this.emitIfFirstCollision(selfCollider.node);

        if (!this.canMerge(otherCollider.node)) {
            return;
        }

        // 优先判断y坐标，下面的merge上面的
        if (selfCollider.node.y < otherCollider.node.y) {
            this.startMerge(otherCollider.node);
        } else if (selfCollider.node.y === otherCollider.node.y) {
            // y坐标相同判断速度，速度慢的merge速度快的
            const otherBallManager = otherCollider.getComponent(BallManager);
            const selfVelocity = this._ball.getLinearVelocityScalar();
            const otherVelocity = otherBallManager.getLinearVelocityScalar();

            if (selfVelocity <= otherVelocity) {
                this.startMerge(otherCollider.node);
            }
        }
    }

    // 开始合并 - 状态转换逻辑
    private startMerge(targetNode: Node): void {
        console.info('startMerge:', this._ball.node, targetNode);
        const targetBallManager = targetNode.getComponent(BallManager);
        if (!targetBallManager) {
            return;
        }

        const mergingState: StateMerging = this._ball.animator.getStates().get('Merging') as StateMerging;
        mergingState.setMergingTarget(targetNode);
        this.switchToState('Merging');

        const beingMergedState: StateBeingMerged = targetBallManager.animator.getStates().get('BeingMerged') as StateBeingMerged;
        beingMergedState.setMergedBy(this._ball.node);
        targetBallManager.animator.switchState('BeingMerged');
    }

    // 传入的不是球会返回false
    private isSameTypeOfBallWith(node: Node): boolean {
        const self: BallManager = this._ball;
        const other: BallManager = node.getComponent(BallManager);
        
        return self && other && self.type === other.type;
    }

    private canMerge(otherCollider: Node): boolean {
        if (!this.isSameTypeOfBallWith(otherCollider)) {
            return false;
        }

        const otherBallManager = otherCollider.getComponent(BallManager);
        if (!otherBallManager) return false;
        
        const otherState = otherBallManager.animator.getCurrentState();
        return otherState && otherState.constructor.name === 'StateNormal';
    }

    private emitIfFirstCollision(selfNode: Node): void {
        if (!this._ball.hasCollided && selfNode.worldPositionY !== DataManager.instance.getDefaultBallY()) {
            this._ball.hasCollided = true;
            AudioMgr.inst.playBallFirstCollision();
            director.emit(EventType.BALL_FIRST_COLLISION, selfNode);
        }
    }
}


