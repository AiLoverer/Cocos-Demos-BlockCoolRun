import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HUD_Distance')
export class HUD_Distance extends Component {
    @property(Node)
    player: Node;
    hudDistanceLabel: Label;
    start() {
        this.hudDistanceLabel = this.node.getComponent(Label);
    }
    
    update(deltaTime: number) {
        this.hudDistanceLabel.string = this.player.position.z.toFixed(1).toString();
    }
}


