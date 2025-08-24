import { _decorator, Component, director, Node } from 'cc';
import State from './State';
import { DataManager } from '../../Data/DataManager';
import { EventType } from '../../Data/EventType';
const { ccclass, property } = _decorator;

@ccclass('StateMerging')
export class StateMerging extends State {
    private _mergingTarget: Node;
    private readonly _MERGE_DISTASNCE: number = 30;

    onUpdate(deltaTime: number) {
        const myPos = this._ball.node.getPosition();
        const mergingTargetPos = this._mergingTarget.getPosition();
        const distance: number = mergingTargetPos.subtract(myPos).length();
        if (distance < this._MERGE_DISTASNCE) {
            const ballType = this._ball.type;
            const positionX = this._ball.node.worldPositionX;
            const positionY = this._ball.node.worldPositionY;
            
            this._ball.node.destroy();
            DataManager.instance.deleteBall(this._ball.node);
            this._mergingTarget.destroy();
            DataManager.instance.deleteBall(this._mergingTarget);
            director.emit(EventType.BALL_MERGED, positionX, positionY, ballType);
        }
    }

    setMergingTarget(target: Node) {
        this._mergingTarget = target;
    }
}


