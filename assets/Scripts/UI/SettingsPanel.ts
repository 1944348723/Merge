import { _decorator, Component, director, Input, Node, Slider, Toggle } from 'cc';
import { EventType } from '../Data/EventType';
import { AudioMgr } from '../Audio/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
    @property({type: Node})
    closeButton: Node = null;

    @property({type: Node})
    restartButton: Node = null;

    @property({type: Node})
    homeButton: Node = null;

    @property({type: Toggle})
    bgmToggle: Toggle = null;

    @property({type: Toggle})
    sfxToggle: Toggle = null;

    @property({type: Slider})
    bgmSlider: Slider = null;

    @property({type: Slider})
    sfxSlider: Slider = null;

    protected onLoad(): void {
        this.node.parent.on(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
        this.closeButton.on(Input.EventType.TOUCH_END, this.onCloseButtonClicked, this);
        this.restartButton.on(Input.EventType.TOUCH_END, this.onRestartButtonClicked, this);
        this.homeButton.on(Input.EventType.TOUCH_END, this.onHomeButtonClicked, this);
        this.bgmToggle.node.on(Toggle.EventType.TOGGLE, this.onBGMToggleTriggered, this);
        this.sfxToggle.node.on(Toggle.EventType.TOGGLE, this.onSFXToggleTriggered, this);
        this.bgmSlider.node.on('slide', this.onBGMSliderSlide, this);
        this.sfxSlider.node.on('slide', this.onSFXSliderSlide, this);
    }

    protected onDestroy(): void {
        this.node.parent.off(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
    }

    protected start(): void {
        this.bgmToggle.isChecked = AudioMgr.inst.enableBGM;
        this.sfxToggle.isChecked = AudioMgr.inst.enableSFX;
        this.bgmSlider.progress = AudioMgr.inst.BGM_VOLUME;
        this.sfxSlider.progress = AudioMgr.inst.SFX_VOLUME;
    }

    onSettingsButtonClicked() {
        AudioMgr.inst.playButtonClick();
        this.node.parent.setSiblingIndex(1000);
        this.node.active = true;
        director.emit(EventType.SETTINGS_PANEL_OPENED);
    }

    onCloseButtonClicked() {
        AudioMgr.inst.playButtonClick();
        this.node.active = false;
        director.emit(EventType.SETTINGS_PANEL_CLOSED);
    }

    onRestartButtonClicked() {
        AudioMgr.inst.playButtonClick();
        this.node.active = false;
        director.emit(EventType.GAME_START);
    }

    onHomeButtonClicked() {
        AudioMgr.inst.playButtonClick();
        director.loadScene('Home');
    }

    onBGMToggleTriggered() {
        console.log('onBGMToggleTriggered', this.bgmToggle.isChecked);
        AudioMgr.inst.enableBGM = this.bgmToggle.isChecked;
    }

    onSFXToggleTriggered() {
        console.log('onSFXToggleTriggered', this.sfxToggle.isChecked);
        AudioMgr.inst.enableSFX = this.sfxToggle.isChecked;
    }

    onBGMSliderSlide(slider: Slider) {
        console.log('onBGMSliderSlide', slider.progress);
        AudioMgr.inst.BGM_VOLUME = slider.progress;
    }

    onSFXSliderSlide(slider: Slider) {
        console.log('onSFXSliderSlide', slider.progress);
        AudioMgr.inst.SFX_VOLUME = slider.progress;
    }
}


