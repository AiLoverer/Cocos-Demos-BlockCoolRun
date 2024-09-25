import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FollowTarget')
export class FollowTarget extends Component {
    @property(Node)
    targetNode : Node;
    @property(Vec3)
    offset: Vec3 = new Vec3();
    start() {

    }

    tmpPos = new Vec3;
    update(deltaTime: number) {
        this.targetNode.getPosition(this.tmpPos);
        this.tmpPos.add(this.offset);
        this.node.position = this.tmpPos;
    }
}


