import { _decorator, Component, director, Input, Label, Node } from 'cc';
import { EventType } from '../Data/EventType';
import { DataManager } from '../Data/DataManager';
import { AudioMgr } from '../Audio/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('GameOverMenu')
export class GameOverMenu extends Component {
    @property({type: Node})
    scoreLabel: Node | null = null;

    @property({type: Node})
    highScoreLabel: Node | null = null;
    
    @property({type: Node})
    maskSprite: Node | null = null; // 遮罩Sprite节点

    @property({type: Node})
    playAgainButton: Node | null = null;

    @property({type: Node})
    homeButton: Node | null = null;

    protected onLoad(): void {
        this.node.active = false;
        director.on(EventType.GAME_START, this.onGameStart, this);
        director.on(EventType.GAME_OVER, this.onGameOver, this);
        director.on(EventType.HIGH_SCORE_CHANGED, this.onHighScoreChanged, this);
        this.playAgainButton.on(Input.EventType.TOUCH_END, this.onPlayAgainButtonClicked, this);
        this.homeButton.on(Input.EventType.TOUCH_END, this.onHomeButtonClicked, this);
    }

    protected onDestroy(): void {
        director.off(EventType.GAME_START, this.onGameStart, this);
        director.off(EventType.GAME_OVER, this.onGameOver, this);
        director.off(EventType.HIGH_SCORE_CHANGED, this.onHighScoreChanged, this);
    }

    onGameStart() {
        this.node.active = false;
    }

    onGameOver() {
        this.node.setSiblingIndex(1000);
        
        if (this.maskSprite) {
            this.maskSprite.active = true;
        }
        this.scoreLabel.getComponent(Label).string = '本局分数: ' + DataManager.instance.score.toString();
        this.highScoreLabel.getComponent(Label).string = '最高分数: ' + DataManager.instance.getHighScore().toString();
        this.node.active = true;
    }

    onPlayAgainButtonClicked() {
        AudioMgr.inst.playOneShot('Audio/ButtonClicked');
        this.node.active = false;
        director.emit(EventType.GAME_START);
    }

    onHomeButtonClicked() {
        AudioMgr.inst.playOneShot('Audio/ButtonClicked');
        director.loadScene('Home');
    }

    onHighScoreChanged(score: number) {
        this.highScoreLabel.getComponent(Label).string = '最高分数: ' + score.toString();
        console.log('on high score changed', score);
    }
}
