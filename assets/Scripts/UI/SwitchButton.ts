import { _decorator, Button, Component, Node, SpriteFrame, Enum} from 'cc';
const { ccclass, property } = _decorator;

export enum SwitchState {
    On,
    Off
}

// 将enum注册到Cocos Creator的枚举系统
Enum(SwitchState);

@ccclass('SwitchButton')
export class SwitchButton extends Button {
    @property({type: SpriteFrame})
    onSpriteFrame: SpriteFrame = null;

    @property({type: SpriteFrame})
    offSpriteFrame: SpriteFrame = null;

    @property({type: SwitchState})
    defaultState: SwitchState = SwitchState.On;

    private _state: SwitchState = this.defaultState;

    static EventType = {
        ...Button.EventType,
        SWITCH_STATE_CHANGED: 'switch-state-changed'
    };

    protected start(): void {
        this.updateVisuals();
    }

    protected _onTouchEnded(event: any): void {
        super._onTouchEnded(event);
        this.flip();
    }

    /**
     * 翻转
     */
    public flip(): void {
        const newState = this._state === SwitchState.On ? SwitchState.Off : SwitchState.On;
        this.setState(newState);
    }

    public setState(state: SwitchState): void {
        if (this._state === state) {
            return;
        }
        this._state = state;
        this.updateVisuals();
        this.notifyStateChanged();
    }

    public isOn(): boolean {
        return this._state === SwitchState.On;
    }

    private updateVisuals(): void {
        this.normalSprite = this._state === SwitchState.On ? this.onSpriteFrame : this.offSpriteFrame;
    }

    private notifyStateChanged(): void {
        this.node.emit(SwitchButton.EventType.SWITCH_STATE_CHANGED, this._state);
    }
}


