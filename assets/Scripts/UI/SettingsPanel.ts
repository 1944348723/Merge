import { _decorator, Component, director, Input, Node } from 'cc';
import { EventType } from '../Data/EventType';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
    @property({type: Node})
    closeButton: Node = null;

    @property({type: Node})
    restartButton: Node = null;

    @property({type: Node})
    homeButton: Node = null;

    protected onLoad(): void {
        this.node.parent.on(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
        this.closeButton.on(Input.EventType.TOUCH_END, this.onCloseButtonClicked, this);
        this.restartButton.on(Input.EventType.TOUCH_END, this.onRestartButtonClicked, this);
        this.homeButton.on(Input.EventType.TOUCH_END, this.onHomeButtonClicked, this);
    }

    protected onDestroy(): void {
        this.node.parent.off(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
    }

    onSettingsButtonClicked() {
        this.node.parent.setSiblingIndex(1000);
        this.node.active = true;
        director.emit(EventType.SETTINGS_PANEL_OPENED);
    }

    onCloseButtonClicked() {
        this.node.active = false;
        director.emit(EventType.SETTINGS_PANEL_CLOSED);
    }

    onRestartButtonClicked() {
        director.emit(EventType.GAME_START);
        this.node.active = false;
    }

    onHomeButtonClicked() {
        director.loadScene('Home');
    }
}


