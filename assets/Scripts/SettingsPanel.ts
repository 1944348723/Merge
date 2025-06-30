import { _decorator, Component, director, Input, Node } from 'cc';
import { EventType } from './EventType';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
    @property({type: Node})
    closeButton: Node = null;

    protected onLoad(): void {
        this.node.parent.on(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
        this.closeButton?.on(Input.EventType.TOUCH_END, this.onCloseButtonClicked, this);
    }

    protected onDestroy(): void {
        this.node.parent.off(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
        this.closeButton?.off(Input.EventType.TOUCH_END, this.onCloseButtonClicked, this);
    }

    onSettingsButtonClicked() {
        this.node.active = true;
        director.emit(EventType.SETTINGS_PANEL_OPENED);
    }

    onCloseButtonClicked() {
        this.node.active = false;
        director.emit(EventType.SETTINGS_PANEL_CLOSED);
    }
}


