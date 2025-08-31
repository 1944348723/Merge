import { _decorator, Component, Node, RigidBody2D, CircleCollider2D, Sprite, resources, SpriteFrame, ERigidBody2DType, UITransform, CCInteger } from 'cc';
import { BallManager } from './BallManager';
import { DataManager } from '../Data/DataManager';
const { ccclass, property } = _decorator;

@ccclass('BallItem')
class BallItem {
    @property({type: CCInteger})
    id: number = 0;

    @property({type: SpriteFrame})
    image: SpriteFrame = null;

    @property({type: CCInteger})
    score: number = 0;
}

@ccclass('BallGenerator')
export class BallGenerator extends Component {
    @property({type: [BallItem]})
    ballConfig: BallItem[] = []

    @property(Node)
    ballContainer: Node = null;

    private MAX_GENERATABLE_TYPE: number = 3;

    generateRandomBall(): Node {
        const type:number = Math.floor(Math.random() * this.MAX_GENERATABLE_TYPE);
        const ball = this.generateBall(type);
        return ball;
    }

    // TODO: 池化
    generateBall(type: number): Node {
        if (!this.ballConfig[type]) {
            return null;
        }

        const ball = new Node();
        // 设置图片
        const ballSprite = ball.addComponent(Sprite);
        const spriteFrame = this.ballConfig[type].image;
        if (!spriteFrame) {
            console.error('BallGenerator: Ball image[' + type + '] is null');
            return;
        }
        ballSprite.spriteFrame = spriteFrame;
        ballSprite.sizeMode = Sprite.SizeMode.TRIMMED;
        // 刚体
        const rigidBody:RigidBody2D = ball.addComponent(RigidBody2D);
        rigidBody.type = ERigidBody2DType.Dynamic;
        rigidBody.gravityScale = 0;
        rigidBody.enabledContactListener = true;
        // 碰撞
        const collider:CircleCollider2D = ball.addComponent(CircleCollider2D);
        collider.radius = spriteFrame.rect.width / 2;
        collider.apply();
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

