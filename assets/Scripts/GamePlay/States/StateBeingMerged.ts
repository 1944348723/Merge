import { _decorator, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { DataManager } from '../../Data/DataManager';
import State from './State';
const { ccclass, property } = _decorator;

@ccclass('StateBeingMerged')
export class StateBeingMerged extends State {
    private _mergedBy: Node;
    private readonly _MERGE_SPEED: number = 2000;
    private _waitTime: number = 0.1;

    onEnter(): void {
        this._ball.disableCollider();
        const rigidBody = this._ball.getComponent(RigidBody2D);
        rigidBody.enabled = false;
    }

    onExit(): void {
        const rigidBody = this._ball.getComponent(RigidBody2D);
        rigidBody.linearVelocity = new Vec2(0, 0);
        rigidBody.angularVelocity = 0;
    }

    onUpdate(deltaTime: number) {
        if (this._waitTime > 0) {
            this._waitTime -= deltaTime;
            return;
        }
        const fromPos = this._ball.node.getPosition();
        const toPos = this._mergedBy.getPosition();
        const distance: number = toPos.clone().subtract(fromPos).length();

        // 移动
        const moveDistance: number = this._MERGE_SPEED * deltaTime;
        let direction: Vec3 = toPos.clone().subtract(fromPos).normalize();
        let newPosition: Vec3 = null;
        if (moveDistance > distance) {
            newPosition = toPos;
        } else {
            newPosition = fromPos.clone().add(direction.multiplyScalar(moveDistance));
        }
        this._ball.node.setPosition(newPosition);
    }

    setMergedBy(mergedBy: Node) {
        this._mergedBy = mergedBy;
    }
}


