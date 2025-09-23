import { _decorator, Component, Node, CircleCollider2D, Sprite, SpriteFrame, CCInteger, NodePool, Prefab, instantiate, Vec2, view } from 'cc';
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

@ccclass('BallPoolManager')
export class BallPoolManager extends Component {
    @property({type: [BallItem]})
    ballConfig: BallItem[] = []

    @property({type: Prefab})
    ballPrefab: Prefab = null;

    private _pool: NodePool = null;

    private MAX_GENERATABLE_TYPE: number = 3;
    private BALL_POOL_SIZE: number = 30;

    protected onLoad(): void {
        if (!this.ballPrefab) {
            console.error('BallGenerator: ballPrefab is null');
            return;
        }
        DataManager.instance.setDefaultSpawnPosition(new Vec2(view.getVisibleSize().width / 2, view.getVisibleSize().height * 8 / 9));
    }

    protected onDestroy(): void {
        DataManager.instance.clearBalls();
    }

    initPool() {
        console.info('BallPool initialization started');
        this._pool = new NodePool('BallManager');
        while (this._pool.size() < this.BALL_POOL_SIZE) {
            const ball = instantiate(this.ballPrefab);
            ball.getComponent(BallManager).init(0);
            this._pool.put(ball);
        }
        console.info('BallPool initialization completed', this._pool);
    }

    generateRandomBall(): Node {
        const type:number = Math.floor(Math.random() * this.MAX_GENERATABLE_TYPE);
        const ball = this.generateBall(type);
        return ball;
    }

    generateBall(type: number): Node {
        if (!this.ballConfig[type]) {
            return null;
        }

        let ball: Node = null;
        if (this._pool.size() > 0) {
            ball = this._pool.get();
        } else {
            ball = instantiate(this.ballPrefab);
        }

        // 如果从池中取出的球类型不是传入的类型，则需要重新设置类型
        if (ball.getComponent(BallManager).type !== type) {
            const ballSprite = ball.getComponent(Sprite);
            const spriteFrame = this.ballConfig[type].image;
            if (!spriteFrame) {
                console.error('BallGenerator: Ball image[' + type + '] is null');
                return;
            }
            ballSprite.spriteFrame = spriteFrame;

            const collider:CircleCollider2D = ball.getComponent(CircleCollider2D);
            collider.radius = spriteFrame.rect.width / 2;
            collider.apply();
        }

        ball.getComponent(BallManager).init(type);
        DataManager.instance.addBall(ball);
        return ball;
    }


    returnBall(ball: Node) {
        this._pool.put(ball);
    }
}

