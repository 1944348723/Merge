import { _decorator, Component, director, Node } from 'cc';
import { EventType } from '../Data/EventType';
const { ccclass, property } = _decorator;

@ccclass('Console')
export class Console extends Component {
    onGameOverButtonClicked() {
        director.emit(EventType.GAME_OVER);
    }
}


