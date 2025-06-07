import { _decorator, Component, director, Input, Node } from 'cc';
import { EventType } from './EventType';
const { ccclass, property } = _decorator;

@ccclass('SettingsManager')
export class SettingsManager extends Component {
    @property({type: Node})
    settingsButton: Node = null;

    @property({type: Node})
    settingsPanel: Node = null;

    protected onLoad(): void {
        this.settingsButton?.on(Input.EventType.TOUCH_END, this.onSettingsButtonClicked, this);
    }

    protected onDestroy(): void {
        this.settingsButton?.off(Input.EventType.TOUCH_END, this.onSettingsButtonClicked, this);
    }

    protected start(): void {
        this.settingsPanel.active =false;
    }

    onSettingsButtonClicked() {
        if (this.settingsPanel) {
            this.settingsPanel.active = true;
        }
        director.emit(EventType.SETTINGS_PANEL_OPENED);
    }
}


