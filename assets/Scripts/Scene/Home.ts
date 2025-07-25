import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends Component {
    onStartButtonClicked() {
        director.loadScene('Game');
    }
}


