import { _decorator, Component, Node, instantiate, Prefab, RigidBody2D, BoxCollider2D, CircleCollider2D, Sprite, resources, SpriteFrame, ERigidBody2DType, UITransform } from 'cc';
import { BallManager } from './BallManager';
import { DataManager } from '../Data/DataManager';
const { ccclass, property } = _decorator;

class BallItem {
    type: number;
    image: string;
    radius: number;
    score: number;
}

export const ballConfig: BallItem[] = [
    {type: 0, image: 'img/fruit_1/spriteFrame', radius: null, score: 2},
    {type: 1, image: 'img/fruit_2/spriteFrame', radius: null, score: 4},
    {type: 2, image: 'img/fruit_3/spriteFrame', radius: null, score: 8},
    {type: 3, image: 'img/fruit_4/spriteFrame', radius: null, score: 16},
    {type: 4, image: 'img/fruit_5/spriteFrame', radius: null, score: 32},
    {type: 5, image: 'img/fruit_6/spriteFrame', radius: null, score: 64},
    {type: 6, image: 'img/fruit_7/spriteFrame', radius: null, score: 128},
    {type: 7, image: 'img/fruit_8/spriteFrame', radius: null, score: 256},
    {type: 8, image: 'img/fruit_9/spriteFrame', radius: null, score: 512},
    {type: 9, image: 'img/fruit_10/spriteFrame', radius: null, score: 1024},
    {type: 10, image: 'img/fruit_11/spriteFrame', radius: null, score: 2048},
]

@ccclass('BallGenerator')
export class BallGenerator extends Component {
    private MAX_GENERATABLE_TYPE: number = 3;
    @property(Node)
    ballContainer: Node = null;

    generateRandomBall(): Node {
        const type:number = Math.floor(Math.random() * this.MAX_GENERATABLE_TYPE);
        const ball = this.generateBall(type);
        return ball;
    }

    // TODO: 1.生成时从小变大   2.粒子特效   3.音效
    generateBall(type: number): Node {
        if (!ballConfig[type]) {
            return null;
        }

        const ball = new Node();
        // 刚体
        const rigidBody:RigidBody2D = ball.addComponent(RigidBody2D);
        rigidBody.type = ERigidBody2DType.Dynamic;
        rigidBody.gravityScale = 0;
        rigidBody.enabledContactListener = true;
        // 设置碰撞
        const collider:CircleCollider2D = ball.addComponent(CircleCollider2D);
        // 设置图片
        const ballSprite = ball.addComponent(Sprite);
        resources.load(ballConfig[type].image, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            ballSprite.spriteFrame = spriteFrame;
            ballSprite.sizeMode = Sprite.SizeMode.TRIMMED;
            // 设置碰撞半径
            collider.radius = spriteFrame.rect.width / 2;
            collider.apply();
        });
        // 对象脚本
        ball.addComponent(BallManager).init(type);
        if (!this.ballContainer) {
            this.ballContainer = this.node;
        }
        ball.setParent(this.ballContainer);

        DataManager.instance.addBall(ball);
        return ball;
    }
}

