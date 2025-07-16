import { _decorator, Component, Node, instantiate, Prefab, RigidBody2D } from 'cc';
import { BallType } from '../Data/BallType';
import { BallManager } from './BallManager';
import { DataManager } from '../Data/DataManager';
const { ccclass, property } = _decorator;

@ccclass('BallGenerator')
export class BallGenerator extends Component {
    @property({type: [Prefab], tooltip: "球的预制体数组"})
    ballPrefabs: Prefab[] = [];

    public generateRandomBall(x:number, y:number) {
        const type:BallType = Math.floor(Math.random() * this.ballPrefabs.length);
        const ball = this.generateBall(x, y, type);
        DataManager.instance.addBall(ball);
        return ball;
    }

    public generateBall(x:number, y:number, type: BallType): Node {
        const ball = instantiate(this.ballPrefabs[type]);
        ball.getComponent(BallManager).init(type);
        ball.setParent(this.node.parent);

        const rigidBody:RigidBody2D = ball.getComponent(RigidBody2D);
        rigidBody.gravityScale = 0;

        ball.worldPositionX = x;
        ball.worldPositionY = y;


        DataManager.instance.addBall(ball);
        return ball;
    }
}

