import { _decorator, Component, director, Node, RigidBody2D, Vec2 } from 'cc';
import State from './State';
import { EventType } from '../../Data/EventType';
import { BallManager } from '../BallManager';
const { ccclass, property } = _decorator;

@ccclass('StateMerging')
export class StateMerging extends State {
    private _mergingTarget: Node;
    private readonly _MERGE_DISTASNCE: number = 30;

    onExit(): void {
        const rigidBody = this._ball.getComponent(RigidBody2D);
        rigidBody.linearVelocity = new Vec2(0, 0);
        rigidBody.angularVelocity = 0;
    }

    onUpdate(deltaTime: number) {
        const myPos = this._ball.node.getPosition();
        const mergingTargetPos = this._mergingTarget.getPosition();
        const distance: number = mergingTargetPos.subtract(myPos).length();
        if (distance < this._MERGE_DISTASNCE) {
            const mergePosition = this._ball.node.worldPosition.toVec2();
            director.emit(EventType.BALL_MERGED, mergePosition, this._ball, this._mergingTarget.getComponent(BallManager));
        }
    }

    setMergingTarget(target: Node) {
        this._mergingTarget = target;
    }
}


