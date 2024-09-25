import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(Node)
    uiLevelFailure: Node;
    @property(Node)
    uiLevelSuccessful: Node;
    @property(Node)
    uiLevelComplete: Node;
    start() {
        director.getScene().on('level_failed', this.onEvent_LevelFailed, this);
        director.getScene().on('level_successful', this.onEvent_LevelSuccessful, this);
    }

    update(deltaTime: number) {
        
    }

    onBtnReplay() {
        director.loadScene(director.getScene().name);
    }

    onBtnMainManu() {
        director.loadScene('main');
    }

    protected onDestroy(): void {
    }

    onBtnNext() {
        let level = director.getScene().name;
        if(level == 'level-001'){
            director.loadScene('level-002');
        }else if(level == 'level-002'){
            director.loadScene('level-003');
        }
    }

    onEvent_LevelFailed() {
        console.log("trigger onEvent_LevelFailed ...............");
        this.uiLevelFailure.active = true;
    }

    onEvent_LevelSuccessful(){
        if(director.getScene().name == 'level-003') {
            this.uiLevelComplete.active = true;
        }else {
            this.uiLevelSuccessful.active = true;
        }
        
    }
 }


