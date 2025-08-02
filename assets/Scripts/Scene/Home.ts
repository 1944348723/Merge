import { _decorator, AudioSource, Component, director, Node } from 'cc';
import { AudioMgr } from '../Audio/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends Component {
    protected start(): void {
        if (!AudioMgr.inst.getBGM_AudioSource().playing) {
            AudioMgr.inst.play('Audio/BGM');
        }
    }

    onStartButtonClicked() {
        director.loadScene('Game');
        AudioMgr.inst.playOneShot('Audio/ButtonClicked');
    }
}


