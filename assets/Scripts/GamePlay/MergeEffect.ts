import { _decorator, Component, Node, Sprite, SpriteFrame, Vec2, Vec3, tween, Color, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MergeEffectItem')
class MergeEffectItem{
    @property({type: SpriteFrame})
    fruitGrain: SpriteFrame = null;
    
    @property({type: SpriteFrame})
    Bubble: SpriteFrame = null;
    
    @property({type: SpriteFrame})
    splash: SpriteFrame = null;
}

@ccclass('MergeEffect')
export class MergeEffect extends Component {
    @property({type: [MergeEffectItem]})
    effectItems: MergeEffectItem[] = [];

    @property({type: CCInteger})
    readonly FRUIT_GRAIN_COUNT: number = 10;

    @property({type: CCInteger})
    readonly BUBBLE_COUNT: number = 20; 

    // 合并时的动画效果
    play(id: number, pos: Vec3, width: number) {
        // 安全检查
        if (!this.effectItems || this.effectItems.length === 0) {
            console.warn('MergeEffect: No frames configured');
            return;
        }
        
        if (id < 0 || id >= this.effectItems.length) {
            console.warn(`MergeEffect: Invalid id ${id}, using id 0`);
            id = 0;
        }
        
        const effectItem = this.effectItems[id];
        if (!effectItem) {
            console.warn(`MergeEffect: Frames at index ${id} are null`);
            return;
        }
        
        this.showFruitGrain(effectItem, pos, width);
        this.showBubble(effectItem, pos, width);
        this.showJuice(effectItem, pos, width);
    }

    private showFruitGrain(effectItem: MergeEffectItem, pos: Vec3, width: number) {
        // 果粒
        for (let i = 0; i < this.FRUIT_GRAIN_COUNT; ++i) {
            // 创建果粒
            const node = new Node('Sprite');
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = effectItem.fruitGrain;
            node.setParent(this.node);

            // 计算参数
            const angle = 360 * Math.random();
            const distance = width * (0.5 + 0.1 * Math.random());   // 果粒覆盖范围要比球稍微大一点
            const moveVector = new Vec2(
                Math.sin(angle * Math.PI / 180) * distance,
                Math.cos(angle * Math.PI / 180) * distance
            );
            const targetPos = new Vec2(pos.x + moveVector.x, pos.y + moveVector.y);
            const initScale = 0.5 * Math.random() + width / 100;
            const duration = 0.5 * Math.random();

            // 初始化
            node.setWorldPosition(pos);
            node.setScale(initScale, initScale, 1);

            tween(node)
                .parallel(
                    tween(node).to(duration, { worldPosition: new Vec3(targetPos.x, targetPos.y, 0) }),
                    tween(node).to(duration + 0.5, { scale: new Vec3(0.3, 0.3, 1) }),
                    tween(node).to(duration + 0.5, { angle: this.randomInteger(-360, 360) })
                )
                .call(() => {
                    node.active = false;
                })
                .start();
                
            tween(sprite)
                .delay(duration + 0.5)
                .to(0.1, { color: new Color(255, 255, 255, 0) })
                .start();
        }
    }
    private showBubble(effectItem: MergeEffectItem, pos: Vec3, width: number) {
        // 水珠
        for (let i = 0; i < this.FRUIT_GRAIN_COUNT; ++i) {
            // 创建水珠
            const node = new Node('Sprite');
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = effectItem.Bubble;
            node.setParent(this.node);

            // 计算参数
            const angle = 360 * Math.random();
            const distance = width * (0.5 + 0.1 * Math.random());   // 水珠覆盖范围要比球稍微大一点
            const moveVector = new Vec2(
                Math.sin(angle * Math.PI / 180) * distance,
                Math.cos(angle * Math.PI / 180) * distance
            );
            const targetPos = new Vec2(pos.x + moveVector.x, pos.y + moveVector.y);
            const initScale = 0.5 * Math.random() + width / 100;
            const duration = 0.5 * Math.random();

            // 初始化
            node.setWorldPosition(pos);
            node.setScale(initScale, initScale, 1);

            tween(node)
                .parallel(
                    tween(node).to(duration, { worldPosition: new Vec3(targetPos.x, targetPos.y, 0) }),
                    tween(node).to(duration + 0.5, { scale: new Vec3(0.3, 0.3, 1) }),
                )
                .call(() => {
                    node.active = false;
                })
                .start();
                
            tween(sprite)
                .delay(duration + 0.5)
                .to(0.1, { color: new Color(255, 255, 255, 0) })
                .start();
        }

    }
    private showJuice(effectItem: MergeEffectItem, pos: Vec3, width: number) {
        // 果汁
        const node = new Node('Sprite');
        const sprite = node.addComponent(Sprite);
        sprite.spriteFrame = effectItem.splash;
        node.setParent(this.node);

        node.setWorldPosition(pos);
        node.setScale(0, 0, 1);
        node.angle = this.randomInteger(0, 360);

        tween(node)
            .sequence(
                tween(node).to(0.2, { scale: new Vec3(width / 150, width / 150, 1) })
            )
            .call(() => {
                node.active = false;
            })
            .start();
            
        tween(sprite)
            .to(1, { color: new Color(255, 255, 255, 0) })
            .start();
    }

    private randomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }
}


