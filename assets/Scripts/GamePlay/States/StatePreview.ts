import { _decorator, Component, director, EventTouch, Node, RigidBody2D, UITransform, Vec2 } from 'cc';
import State from './State';
import { DataManager } from '../../Data/DataManager';
import { EventType } from '../../Data/EventType';
const { ccclass, property } = _decorator;

@ccclass('StatePreview')
export class StatePreview extends State {
    onEnter(): void {
        const rigidBody = this._ball.getComponent(RigidBody2D);
        rigidBody.linearVelocity = new Vec2(0, 0);
        rigidBody.angularVelocity = 0;
        rigidBody.enabled = false;
        this._ball.disableCollider();
    }

    onTouchMove(event: EventTouch): void {
        let newX = this._ball.node.worldPositionX + event.getDeltaX();
        
        const halfBallWidth = this._ball.node.getComponent(UITransform).width / 2;
        const leftBound = DataManager.instance.getLeftBound();
        const rightBound = DataManager.instance.getRightBound();

        if (leftBound !== null) {
            const minX = leftBound + halfBallWidth;
            if (newX < minX) newX = minX;
        }
        if (rightBound !== null) {
            const maxX = rightBound - halfBallWidth;
            if (newX > maxX) newX = maxX;
        }

        this._ball.node.worldPositionX = newX;
    }

    // 状态转移
    onTouchEnd(): void {
        this.switchToState('Normal');
        director.emit(EventType.PLAYER_DROPPED_BALL);
    }
}


