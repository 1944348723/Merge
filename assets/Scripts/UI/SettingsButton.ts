import { _decorator, Component, Input, Node } from 'cc';
import { EventType } from '../Data/EventType';
const { ccclass, property } = _decorator;

@ccclass('SettingsButton')
export class SettingsButton extends Component {
    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_END, this.onSettingsButtonClicked, this)
    }

    protected onDestroy(): void {
        this.node.off(Input.EventType.TOUCH_END, this.onSettingsButtonClicked, this);
    }

    onSettingsButtonClicked() {
        this.node.parent.emit(EventType.SETTINGS_BUTTON_CLICKED);
    }
}


