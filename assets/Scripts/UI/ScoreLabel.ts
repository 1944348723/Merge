import { _decorator, Component, director, Label, Node } from 'cc';
import { EventType } from '../Data/EventType';
const { ccclass, property } = _decorator;

@ccclass('ScoreLabel')
export class ScoreLabel extends Component {
    private label: Label | null = null;

    protected onLoad(): void {
        director.on(EventType.GAME_START, this.onGameStart, this);
        director.on(EventType.SCORE_CHANGED, this.updateScore, this);
    }

    protected onDestroy(): void {
        director.off(EventType.GAME_START, this.onGameStart, this);
        director.off(EventType.SCORE_CHANGED, this.updateScore, this);
    }

    start() {
        this.label = this.getComponent(Label);
        if (!this.label) {
            console.error('ScoreLabel component requires a Label Component');
        }
        this.updateScore(0);
    }

    updateScore(score: number) {
        console.log(`score changed: ${score}`);
        if (this.label) {
            this.label.string = `分数：${score}`;
        }
    }

    onGameStart() {
        this.updateScore(0);
    }
}


