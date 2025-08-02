import { _decorator, Component, director, Node } from 'cc';
import { AudioMgr } from '../Audio/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends Component {
    protected start(): void {
        // 防止从游戏场景返回时，背景音乐被重置
        if (!AudioMgr.inst.getBGM_AudioSource().playing) {
            console.log('Home: play BGM');
            AudioMgr.inst.playBGM();
        }
    }

    onStartButtonClicked() {
        AudioMgr.inst.playButtonClick();
        director.loadScene('Game');
    }
}


