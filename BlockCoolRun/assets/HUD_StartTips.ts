import { _decorator, Component, Node } from 'cc';
import { PlayerMovement } from './PlayerMovement';
const { ccclass, property } = _decorator;

@ccclass('HUD_StartTips')
export class HUD_StartTips extends Component {
    @property(PlayerMovement)
    playerMovement: PlayerMovement;
    start() {

    }

    update(deltaTime: number) {
        
    }

    onBtnStart(){
        this.playerMovement.enabled = true;
        this.node.active = false;
    }
}


