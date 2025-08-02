import { _decorator, Component, Node, Toggle } from 'cc';
import { AudioMgr } from '../Audio/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Toggles')
export class Toggles extends Component {
    @property(Toggle)
    bgmToggle: Toggle = null;

    @property(Toggle)
    sfxToggle: Toggle = null;

    protected onLoad(): void {
        this.bgmToggle.node.on(Toggle.EventType.TOGGLE, this.onBGMToggleTriggered, this);
        this.sfxToggle.node.on(Toggle.EventType.TOGGLE, this.onSFXToggleTriggered, this);
    }

    protected start(): void {
        this.bgmToggle.isChecked = AudioMgr.inst.enableBGM;
        this.sfxToggle.isChecked = AudioMgr.inst.enableSFX;
    }

    onBGMToggleTriggered() {
        console.log('onBGMToggleTriggered', this.bgmToggle.isChecked);
        AudioMgr.inst.enableBGM = this.bgmToggle.isChecked;
    }

    onSFXToggleTriggered() {
        console.log('onSFXToggleTriggered', this.sfxToggle.isChecked);
        AudioMgr.inst.enableSFX = this.sfxToggle.isChecked;
    }
}


