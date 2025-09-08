import { _decorator, Button, Component, director, Input, Node, Slider, Toggle } from 'cc';
import { EventType } from '../Data/EventType';
import { AudioMgr } from '../Audio/AudioMgr';
import { SwitchButton } from './SwitchButton';
import { SwitchState } from './SwitchButton';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
    @property({type: Node})
    closeButton: Node = null;

    @property({type: Node})
    restartButton: Node = null;

    @property({type: Node})
    homeButton: Node = null;

    @property({type: Slider})
    bgmSlider: Slider = null;

    @property({type: Slider})
    sfxSlider: Slider = null;

    @property({type: SwitchButton})
    bgmSwitchButton: SwitchButton = null;

    @property({type: SwitchButton})
    sfxSwitchButton: SwitchButton = null;

    protected onLoad(): void {
        this.node.parent.on(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
        this.closeButton.on(Input.EventType.TOUCH_END, this.onCloseButtonClicked, this);
        this.restartButton.on(Input.EventType.TOUCH_END, this.onRestartButtonClicked, this);
        this.homeButton.on(Input.EventType.TOUCH_END, this.onHomeButtonClicked, this);
        this.bgmSlider.node.on('slide', this.onBGMSliderSlide, this);
        this.sfxSlider.node.on('slide', this.onSFXSliderSlide, this);
        this.bgmSwitchButton.node.on(SwitchButton.EventType.SWITCH_STATE_CHANGED, this.onBGMSwitchButtonStateChanged, this);
        this.sfxSwitchButton.node.on(SwitchButton.EventType.SWITCH_STATE_CHANGED, this.onSFXSwitchButtonStateChanged, this);
    }

    protected onDestroy(): void {
        this.node.parent.off(EventType.SETTINGS_BUTTON_CLICKED, this.onSettingsButtonClicked, this);
    }

    protected start(): void {
        this.bgmSlider.progress = AudioMgr.inst.BGM_VOLUME;
        this.sfxSlider.progress = AudioMgr.inst.SFX_VOLUME;
        this.bgmSwitchButton.setState(AudioMgr.inst.enableBGM ? SwitchState.On : SwitchState.Off);
        this.sfxSwitchButton.setState(AudioMgr.inst.enableSFX ? SwitchState.On : SwitchState.Off);
    }

    protected onEnable(): void {
        // 重置按钮状态，否则重新打开设置面板时，按钮状态会保持上一次的点击状态
        const buttons = [this.closeButton, this.restartButton, this.homeButton];
        buttons.forEach(button => {
            const buttonComponent = button.getComponent(Button);
            buttonComponent.interactable = false;
            buttonComponent.interactable = true;
        });
    }

    onSettingsButtonClicked() {
        AudioMgr.inst.playButtonClick();
        this.node.parent.setSiblingIndex(1000);
        this.node.active = true;
    }

    onCloseButtonClicked() {
        AudioMgr.inst.playButtonClick();
        this.node.active = false;
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

    onBGMSliderSlide(slider: Slider) {
        console.log('onBGMSliderSlide', slider.progress);
        AudioMgr.inst.BGM_VOLUME = slider.progress;
    }

    onSFXSliderSlide(slider: Slider) {
        console.log('onSFXSliderSlide', slider.progress);
        AudioMgr.inst.SFX_VOLUME = slider.progress;
    }

    onBGMSwitchButtonStateChanged(state: SwitchState) {
        console.log('onBGMSwitchButtonStateChanged', state === SwitchState.On ? 'On' : 'Off');
        AudioMgr.inst.enableBGM = state === SwitchState.On;
    }

    onSFXSwitchButtonStateChanged(state: SwitchState) {
        console.log('onSFXSwitchButtonStateChanged', state === SwitchState.On ? 'On' : 'Off');
        AudioMgr.inst.enableSFX = state === SwitchState.On;
    }
}


