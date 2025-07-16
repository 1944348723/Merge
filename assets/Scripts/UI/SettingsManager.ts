import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SettingsManager')
export class SettingsManager extends Component {
    @property({type: Node})
    settingsPanel: Node = null;

    protected start(): void {
        this.settingsPanel.active =false;
    }
}
