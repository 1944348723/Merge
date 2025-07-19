import { _decorator, Component, director, Label, Node } from 'cc';
import { EventType } from '../Data/EventType';
import { DataManager } from '../Data/DataManager';
const { ccclass, property } = _decorator;

@ccclass('GameOverMenu')
export class GameOverMenu extends Component {
    @property({type: Node})
    scoreLabel: Node | null = null;
    
    @property({type: Node})
    maskSprite: Node | null = null; // 遮罩Sprite节点
    
    protected onLoad(): void {
        this.node.active = false;
        director.on(EventType.GAME_START, this.onGameStart, this);
        director.on(EventType.GAME_OVER, this.onGameOver, this);
    }

    protected onDestroy(): void {
        director.off(EventType.GAME_START, this.onGameStart, this);
        director.off(EventType.GAME_OVER, this.onGameOver, this);
    }

    onGameStart() {
        this.node.active = false;
        this.maskSprite.active = false;
    }

    onGameOver() {
        this.node.setSiblingIndex(1000);
        
        if (this.maskSprite) {
            this.maskSprite.active = true;
        }
        this.scoreLabel.getComponent(Label).string += DataManager.instance.score.toString();
        this.node.active = true;
    }
}
