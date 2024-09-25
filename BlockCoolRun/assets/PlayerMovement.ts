import { _decorator, Component, EventKeyboard, input, Node, RigidBody, Vec3, Vec2, Input, KeyCode, director, Animation, SkelAnimDataHub, SkeletalAnimation} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    @property(RigidBody)
    rigidBody: RigidBody;
    @property
    speed: number;
    @property
    forceForward: number = 0;
    @property
    forceSide : number = 0;
    @property({type: SkeletalAnimation})
    public CocosAnim:SkeletalAnimation | null = null;
    // jump step
    private jumpupStep : number = 0;
    // current role's position
    private roleCurPos : Vec3 = new Vec3();
    // role's target position
    private roleTargetPos: Vec3 = new Vec3();
    // jump delta pos
    private roleJumpDeltaPos: Vec3 = new Vec3();
    private curMoveIndex: number = 0;
    // jump one step time.
    private roleJumpTime: number = 0.4;

    // current jump time
    private roleCurJumpTime:  number = 0;
    // current jump speed
    private roleCurJumpSpeed: number = 0;
    // Whether to accept jump instructions
    private isJumpUp: boolean = false;
    // Whether left('A') key is down
    private isLeftDown : boolean = false;
    // whether right('D') key is down
    private isRightDown: boolean = false;

    // 滑动
    private startPos: Vec2 = new Vec2();
    private endPos: Vec2 = new Vec2();

    start() {
        
        console.log("Game start ..............................");
        input.on(Input.EventType.KEY_UP, this.onKeyUp,this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        director.getScene().on('level_failed', this.onEvent_LevelFailed, this);
        director.getScene().on('level_successful', this.onEvent_LevelSuccessful, this);
        // 监听触摸开始事件
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // 监听触摸结束事件
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    onEvent_LevelFailed() {
        this.isJumpUp = false; // end jump flag
        this.enabled = false;
        this.CocosAnim.play('cocos_anim_idle');
    }
    onEvent_LevelSuccessful() {
        this.isJumpUp = false; // end jump flag
        this.enabled = false;
        this.CocosAnim.play('cocos_anim_idle');
    }
    
    protected onEnable(): void {
        this.CocosAnim.play('cocos_anim_run');
    }
    update(deltaTime: number) {
        //console.log(deltaTime);
        if(this.enabled == false){
            return;
        }
        let forceForward = new  Vec3(0,0,this.forceForward * deltaTime);
        this.rigidBody.applyForce(forceForward);
        
        if(this.isLeftDown){
            let forceLeft = new Vec3(this.forceSide*deltaTime, 0 , 0);
            this.rigidBody.applyForce(forceLeft);
            console.log("add left force ...");
        }
        
        if(this.isRightDown) {
            let forceRight = new Vec3(-this.forceSide*deltaTime, 0 , 0);
            this.rigidBody.applyForce(forceRight);
        }

        // handle jump
        if(this.isJumpUp) {
            this.roleCurJumpTime += deltaTime; // jump time
            if(this.roleCurJumpTime > this.roleJumpTime) { // end jump
                this.node.setPosition(this.roleTargetPos);
                this.isJumpUp = false; // end jump flag
                this.onOnceJumpEnd();
            }else { // jumping
                this.node.getPosition(this.roleCurPos); // get current position
                this.roleJumpDeltaPos.z = this.roleCurJumpSpeed * deltaTime; // calulate each frame's step length
                Vec3.add(this.roleCurPos, this.roleCurPos, this.roleJumpDeltaPos); // add step length to current pos
                this.node.setPosition(this.roleCurPos);
            }
        }
        
        let forceBack = new Vec3(0,0,1000*deltaTime);
        //this.rigidBody.applyForce(forceBack);

        if(this.node.position.y < -10) {
            console.log("You lose !!!");
            this.enabled = false;
            //director.loadScene(director.getScene().name);
            director.getScene().emit('level_failed');
        }

    }
    onTouchStart(event: any) {
        // 记录触摸开始的位置
        const touch = event.getTouches()[0];
        if (touch) {
            this.startPos.set(touch.getLocationX(), touch.getLocationY());
        }
    }

    onTouchEnd(event: any) {
        // 记录触摸结束的位置
        const touch = event.getTouches()[0];
        if (touch) {
            this.endPos.set(touch.getLocationX(), touch.getLocationY());
            this.detectSwipeDirection();
        }
        if(this.isLeftDown){
           // this.isLeftDown = false;
        }
        if(this.isRightDown){
           // this.isRightDown = false;
        }
    }

    detectSwipeDirection() {
        const delta = this.endPos.subtract(this.startPos);
        const deltaX = delta.x;

        if (Math.abs(deltaX) > 10) { // 可以调整阈值来决定何时算作滑动
            if (deltaX > 0) {
                console.log('Right swipe detected');
                this.onSwipeRight();
            } else {
                console.log('Left swipe detected');
                this.onSwipeLeft();
            }
        }
    }

    onSwipeLeft() {
        // 处理左滑事件
        console.log('Left swipe');
        this.isLeftDown = true;
    }

    onSwipeRight() {
        // 处理右滑事件
        console.log('Right swipe');
        this.isRightDown = true;
    }

    onKeyDown(event:EventKeyboard){
        console.log("key down event :", event.keyCode);
        if(event.keyCode == KeyCode.KEY_A) {
                this.isLeftDown = true;
                console.log("Key A down");
        }
        if(event.keyCode == KeyCode.KEY_D) {
            this.isRightDown = true;
            console.log("Key D down");
        }
    }

    onKeyUp(event:EventKeyboard) {
        console.log("key up event :", event.keyCode);
        if(event.keyCode == KeyCode.KEY_A) {
            this.isLeftDown = false;
            console.log("Key A down");
        }
        if(event.keyCode == KeyCode.KEY_D) {
            this.isRightDown = false;
            console.log("Key D down");
        }
        if(event.keyCode == KeyCode.SPACE && this.enabled == true){
            console.log("Key Space Down");
            this.jumpByStep(2);
        }
    }
    onOnceJumpEnd() {
        if (this.CocosAnim) {
            this.CocosAnim.play('cocos_anim_run');
        }

        this.node.emit('JumpEnd', this.curMoveIndex);
    }
    jumpByStep(step : number){
        if(this.isJumpUp){
            return;
        }
        // this.isJumpUp = true; // start jump
        // this.jumpupStep = step; // jump step
        // this.roleCurJumpTime = 0; //jump time
        // this.roleCurJumpSpeed = this.jumpupStep / this.roleJumpTime; // jump speed
        // this.node.getPosition(this.roleCurPos); // Node position
        // Vec3.add(this.roleTargetPos, this.roleCurPos, new Vec3( 0, 0,this.jumpupStep));

        this.isJumpUp = true; // start jump
        this.jumpupStep = step; // jump step
        this.roleCurJumpTime = 0; //jump time
        this.roleCurJumpSpeed = this.jumpupStep / this.roleJumpTime; // jump speed
        this.node.getPosition(this.roleCurPos); // Node position
        Vec3.add(this.roleTargetPos, this.roleCurPos, new Vec3( 0, 0,this.jumpupStep));

        if (this.CocosAnim) {
            this.CocosAnim.getState('cocos_anim_jump').speed = 3; // 跳跃动画时间比较长，这里加速播放
            this.CocosAnim.play('cocos_anim_jump'); // 播放跳跃动画
        }
        this.curMoveIndex += step;
    }
    protected onDestroy(): void {
        input.off(Input.EventType.KEY_UP, this.onKeyUp,this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // 移除事件监听器
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}


