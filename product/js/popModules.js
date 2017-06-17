/**
 * Created by guminji on 2017/6/7.
 */
//弹层的背后半透明背景以及一些公共的弹层方法
class popBG extends laya.ui.Component{
    constructor(){
        super();
    }
    close(){
        this.parent.popHide();
    }
    setSprite(target,options){
        for(var key in options){
            target[key] = options[key];
        }
    }
}
//example
class example extends popBG{
    constructor(){
        super();
        this.zOrder = 99999;
        this.init();
        this.bindEvent()
    }
    init(){
        var container = this.container = new Images();
        this.setSprite(container,{
            source:webgm.winPop.getTexture('bigwinBG.png'),
            height:webgm.winPop.getTexture('bigwinBG.png').height,
            width:webgm.winPop.getTexture('bigwinBG.png').width,
        })
        this.addChild(container);
    }
    bindEvent(){

    }
}
//有遮罩背景的基类弹层
class myPOP extends laya.ui.Component{
    constructor(){
        super();
        this.popBG = new laya.display.Sprite();
         this.setSprite(this.popBG,{
         height:this.stage.height,
         width:this.stage.width,
         alpha:0.6
         })
         this.popBG.graphics.drawRect(0,0,this.popBG.width,this.popBG.height,'black');
         this.addChild(this.popBG);
         this.popBG.on('click',this,function(){
         this.close();
         })
    }
    close(){
        this.visible = false;
    }
    show(){
        this.visible = true;
    }
    setSprite(target,options){
        for(var key in options){
            target[key] = options[key];
        }
    }
}
//公共弹出框基类
class commonPOP extends popBG{
    constructor(){
        super();
        var BG = this.BG = new laya.ui.Image();
        this.zOrder = 99999;
        this.setSprite(BG,{
            source:webgm.framesPop.getTexture('commonbird.png'),
            height:webgm.framesPop.getTexture('commonbird.png').height,
            width:webgm.framesPop.getTexture('commonbird.png').width,
            centerX:0,
            //top:140
        })
        this.addChild(BG);
        var closeBtn  =this.common_closeBtn  = new laya.ui.Image();
        this.setSprite(closeBtn,{
            source:webgm.framesPop.getTexture('common_closebtn.png'),
            height:webgm.framesPop.getTexture('common_closebtn.png').height,
            width:webgm.framesPop.getTexture('common_closebtn.png').width,
            top:-40,
            right:-10
        })
        BG.addChild(closeBtn);
        closeBtn.on('click',this,function(){
            this.close();
        })
    }
}
//余额充值弹层
class toChargePOP extends popBG{
    constructor(){
        super();
        this.BG = null;
        this.closeBtn = null;
        this.zOrder = 999999;
        this.init();
        this.bindEvent();
    }
    init(){
        var self =this;
        //充值弹框背景
        var popBG;
        popBG = this.BG = new laya.ui.Image();
        this.setSprite(popBG,{
            source:webgm.framesPop.getTexture('tochargeBg.png'),
            width : webgm.framesPop.getTexture('tochargeBg.png').width,
            height : webgm.framesPop.getTexture('tochargeBg.png').height,
            top :164
        })
        this.addChild(popBG);

        //取消按钮
        var closeBtn;
        closeBtn = this.closeBtn = new laya.ui.Button();
        this.setSprite(closeBtn,{
            height:78,
            width:78,
            top:14,
            right:4
        })
        popBG.addChild(closeBtn);
        //确定按钮
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            height:97,
            width:217,
            bottom:20,
            left:267
        })
        popBG.addChild(sureBtn);
        //选择金额充值容器
        var choseMoney = this.choseMoney = new laya.ui.Tab();
        this.setSprite(choseMoney,{
            centerX:0,
            top:175,
            heigth:222,
            width:707,
            space:7
        })
        choseMoney.initItems();
        for(var i = 0;i<4;i++){
            let moneyType = self["moneyType"+i] = new laya.ui.Button();
            //moneyType.height = 247;
            //moneyType.width = 167;
            moneyType.stateNum =2;
            moneyType.left = 167*i+7*(i+1);
            moneyType.skin = 'popModules/moneyType.png';
            //initItems()
            self.choseMoney.addItem(moneyType);
        }
        popBG.addChild(choseMoney);
        choseMoney.selectedIndex = -1;

        //输入框
        var moneyBlank = this.moneyBlank = new laya.ui.Image();
        this.setSprite(moneyBlank,{
            source:webgm.framesPop.getTexture('chargeBlank.png'),
            width:webgm.framesPop.getTexture('chargeBlank.png').width,
            height:webgm.framesPop.getTexture('chargeBlank.png').height,
            centerX:0,
            top:422
        })
        var inputLabel = this.inputLabel = new laya.ui.Label();
        this.setSprite(inputLabel,{
            height:moneyBlank.height,
            width:moneyBlank.width-20,
            centerX :0,
            valign :'middle',
            text :"请输入大于零的整数",
            color :'#735a62',
            fontSize:24
        })
        moneyBlank.addChild(inputLabel);
        popBG.addChild(moneyBlank);
    }
    bindEvent(){
        var self = this;
        this.closeBtn.on('click',this,function(){
            pops.tocharge.popHide();
        })
        this.sureBtn.on('click',this,function(){
            pops.tocharge.popHide();
        })
        this.choseMoney.selectHandler = new Laya.Handler(self,function(index){
            var moneychoose = [10,50,100,500];
            this.inputLabel.text = moneychoose[index];
        })
    }
}
class settingsPOP extends myPOP{
    constructor(){
        super();
        //this.BG =null;
        this.zOrder = 999999;
        this.init();
        this.bindEvent();
    }
    init(){
        //设置弹窗背景
        var BG;
        BG = this.BG = new laya.ui.Image();
        this.setSprite(BG,{
            source : webgm.framesPop.getTexture('settingsBg.png'),
            width :webgm.framesPop.getTexture('settingsBg.png').width,
            height : webgm.framesPop.getTexture('settingsBg.png').height,
            top : 110 ,
            right : 2
        })
        this.addChild(BG);
        //声音关闭icon
        var soundIcon = this.soundIcon = new laya.ui.Image();
        this.setSprite(soundIcon,{
            source : webgm.framesPop.getTexture('closeSound.png'),
            width :webgm.framesPop.getTexture('closeSound.png').width,
            height : webgm.framesPop.getTexture('closeSound.png').height,
            top : 30 ,
            centerX:0,
            visible:false
        })
        if(localStorage.getItem('localVoiceStatus') == 'false'){
            soundIcon.visible = true;
        }
        BG.addChild(soundIcon);
        //设置声音按钮
        var soundBtn =this.soundBtn= new laya.ui.Button;
        this.setSprite(soundBtn,{
            height:63,
            width:74,
            top:30,
            centerX:0,
        })
        BG.addChild(soundBtn);
        //换肤按钮
        var skinBtn =this.skinBtn= new laya.ui.Button;
        this.setSprite(skinBtn,{
            height:70,
            width:90,
            top:275,
            centerX:0,
        })
        BG.addChild(skinBtn);
        //换肤按钮
        var helpBtn =this.helpBtn= new laya.ui.Button;
        this.setSprite(helpBtn,{
            height:73,
            width:74,
            top:150,
            centerX:0,
        })
        BG.addChild(helpBtn);
    }
    bindEvent() {
        this.soundBtn.on('click',this,function(){
            var storage = window.localStorage;
            if(storage.getItem('localVoiceStatus') == 'false'){
                storage.setItem('localVoiceStatus','true');
                this.soundIcon.visible = false;
                Laya.SoundManager.soundMuted =true;
            }
            else{
                storage.setItem('localVoiceStatus','false');
                this.soundIcon.visible = true;
                Laya.SoundManager.soundMuted =false;
            }
        })
        this.skinBtn.on('click',this,function(){
            this.close();
            pops.skinChange = new laya.components.Popup({
                name: 'skinPOP',
                box: new skinPOP(),
                closeBtnShow: false,
                shadeShow: false,
            }),
            pops.skinChange.popShow();
            //pops.settings.popHide();
        })
        this.helpBtn.on('click',this,function(){
            this.close();
            pops.help = new laya.components.Popup({
                name: 'helpPOP',
                box: new helpPOP(),
                closeBtnShow: false,
                shadeShow: false,
            }),
            pops.help.popShow();
            //pops.settings.popHide();
        })
    }
}
//皮肤切换弹层
class skinPOP extends popBG{
    constructor(){
        super();
        this.zOrder = 999999;
        this.init();
        this.bindEvent();
    }
    init(){
        var self = this;
        //换肤背景
        var BG = this.BG = new laya.ui.Image();
        this.setSprite(BG,{
            source:webgm.framesPop.getTexture('changeSkinBg.png'),
            width:webgm.framesPop.getTexture('changeSkinBg.png').width,
            height:webgm.framesPop.getTexture('changeSkinBg.png').height,
        })
        this.addChild(BG);
        //关闭按钮
        var closeBtn = this.closeBtn = new laya.ui.Button();
        this.setSprite(closeBtn,{
            height:78,
            width:78,
            top:30,
            right:5
        })
        BG.addChild(closeBtn);
        //确定按钮
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            height:80,
            width:217,
            bottom:17,
            centerX:0
        })
        BG.addChild(sureBtn);
        //选择皮肤容器
        var choseSkin = this.choseSkin = new laya.ui.Tab();
        this.setSprite(choseSkin,{
            centerX:0,
            top:130,
            heigth:410,
            width:680,
            space:17
        })
        choseSkin.initItems();
        for(var i = 0;i<3;i++){
            let skinType = self["moneyType"+i] = new laya.ui.Button();
            //moneyType.height = 247;
            //moneyType.width = 167;
            skinType.stateNum =2;
            skinType.left = 232*i;
            skinType.skin = 'popModules/skin1.png';
            //initItems()
            self.choseSkin.addItem(skinType);
        }
        BG.addChild(choseSkin);
        choseSkin.selectedIndex = -1;
    }
    bindEvent(){
        var self = this;
        this.closeBtn.on('click',this,function(){
            this.parent.popHide();
        })
        this.sureBtn.on('click',this,function(){
            this.parent.popHide();
        })
        this.choseSkin.selectHandler = new Laya.Handler(self,function(index){
            var skinchoose = ['type1','type2','type3'];
            console.log(skinchoose[index]);
        })
    }
}
//提示信息弹层
class commonMessage extends commonPOP{
    constructor(message){
        super();
        this.Message = message;
        this.init();
        this.bindEvent();
    }
    init(){
        var self = this;
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            skin:'popModules/common_sure.png',
            centerX:0,
            bottom:20,
            stateNum:1
        })
        this.BG.addChild(sureBtn);
        var messageLabel = this.messageLabel = new laya.ui.Label();
        this.setSprite(messageLabel,{
            height:221,
            width:710,
            top:70,
            color:'#30dbfc',
            fontSize:36,
            valign:'middle',
            align:'center',
            wordWrap :true,
            text:self.Message
        })
        this.BG.addChild(messageLabel);
    }
    bindEvent(){
        this.sureBtn.on('click',this,function(){
            this.close();
        })
    }
}
//代入金额确定弹框
class takeinPOP extends commonPOP{
    //参数 ownNum（自己的余额） takeNum(带入金额)
    constructor(params){
        super();
        this.init(params);
        this.bindEvent();
    }
    init(params){
        var yourBalance_title = this.yourBalance_title = new laya.ui.Image();
        this.setSprite(yourBalance_title,{
            source:webgm.framesPop.getTexture('common_tips1.png'),
            width:webgm.framesPop.getTexture('common_tips1.png').width,
            height:webgm.framesPop.getTexture('common_tips1.png').height,
            top:123,
            left:54
        })
        this.BG.addChild(yourBalance_title)
        var yourBalance_num = this.yourBalance_num = new laya.ui.Label();
        this.setSprite(yourBalance_num,{
            text:params.ownNum,
            color:'white',
            top:123,
            left:345,
            height:webgm.framesPop.getTexture('common_tips1.png').height,
            fontSize:50,
            valign:'middle',
            align:'center',
        })
        this.BG.addChild(yourBalance_num);
        var takein_title = this.takein_title = new Images();
        this.setSprite(takein_title,{
            source:webgm.framesPop.getTexture('common_tips2.png'),
            width:webgm.framesPop.getTexture('common_tips2.png').width,
            height:webgm.framesPop.getTexture('common_tips2.png').height,
            top:230,
            left:54
        })
        this.BG.addChild(takein_title);
        var takein_container = this.takein_container = new Images();
        this.setSprite(takein_container,{
            source:webgm.framesPop.getTexture('common_tips3.png'),
            width:webgm.framesPop.getTexture('common_tips3.png').width,
            height:webgm.framesPop.getTexture('common_tips3.png').height,
            top:221,
            left:360
        })
        this.BG.addChild(takein_container);
        var takein_input = this.takein_input = new Label();
        this.setSprite(takein_input,{
            width:webgm.framesPop.getTexture('common_tips3.png').width,
            height:webgm.framesPop.getTexture('common_tips3.png').height,
            top:0,
            left:0,
            color:'white',
            valign:'middle',
            align:'center',
            text:params.takeNum,
            fontSize:50
        })
        this.takein_container.addChild(takein_input);
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            skin:'popModules/common_sure.png',
            left:87,
            bottom:33,
            stateNum:1
        })
        this.BG.addChild(sureBtn);
        var cannelBtn = this.cannelBtn = new laya.ui.Button();
        this.setSprite(cannelBtn,{
            skin:'popModules/common_cannel.png',
            right:87,
            bottom:33,
            stateNum:1
        })
        this.BG.addChild(cannelBtn);
    }
    bindEvent(){
        this.cannelBtn.on('click',this,function(){
            this.close();
        })
        this.sureBtn.on('click',this,function(){
            //带入金额
            this.close();
        })
    }
}
class exwin extends commonPOP{
    constructor(params){
        super();
        this.zOrder = 99999;
        this.init(params);
        this.bindEvent()
    }
    init(params){
        var title = this.title = new Images();
        this.setSprite(title,{
            source:webgm.winPop.getTexture('otherreward1.png'),
            height:webgm.winPop.getTexture('otherreward1.png').height,
            width:webgm.winPop.getTexture('otherreward1.png').width,
            top:-50,
            centerX:0
        })
        this.BG.addChild(title);
        var task_name  = this.task_name  = new laya.ui.Image();
        this.setSprite(task_name,{
            source:webgm.winPop.getTexture('otherreward3.png'),
            height:webgm.winPop.getTexture('otherreward3.png').height,
            width:webgm.winPop.getTexture('otherreward3.png').width,
            top:100,
            centerX:0
        })
        var task_name_label = this.task_name_label = new laya.ui.Label();
        this.setSprite(task_name_label,{
            color:'#30dbfc',
            fontSize:36,
            text:'任务目标：',
            left:100,
            height:webgm.winPop.getTexture('otherreward3.png').height,
            valign:'middle',
            bold:true
        })
        task_name.addChild(task_name_label);
        var task_name_content = this.task_name_content = new laya.ui.Label();
        this.setSprite(task_name_content,{
            color:'#ffffff',
            fontSize:36,
            text:params.task,
            left:260,
            height:webgm.winPop.getTexture('otherreward3.png').height,
            valign:'middle'

        })
        task_name.addChild(task_name_content);
        this.BG.addChild(task_name);
        var task_reward  = this.task_reward  = new laya.ui.Image();
        this.setSprite(task_reward,{
            source:webgm.winPop.getTexture('otherreward3.png'),
            height:webgm.winPop.getTexture('otherreward3.png').height,
            width:webgm.winPop.getTexture('otherreward3.png').width,
            top:220,
            centerX:0
        })
        var task_reward_label = this.task_reward_label = new laya.ui.Label();
        this.setSprite(task_reward_label,{
            color:'#30dbfc',
            fontSize:48,
            text:'奖   励：',
            left:100,
            height:webgm.winPop.getTexture('otherreward3.png').height,
            valign:'middle',
            bold:true
        })
        task_reward.addChild(task_reward_label);
        var task_reward_icon = this.task_reward_icon = new laya.ui.Image();
        this.setSprite(task_reward_icon,{
            source:webgm.winPop.getTexture('otherreward2.png'),
            height:webgm.winPop.getTexture('otherreward2.png').height,
            width:webgm.winPop.getTexture('otherreward2.png').width,
            top:6,
            left:260
        })
        task_reward.addChild(task_reward_icon);
        var task_reward_content = this.task_reward_content = new laya.ui.Label();
        this.setSprite(task_reward_content,{
            color:'#fffc00',
            fontSize:60,
            text:params.account,
            left:330,
            height:webgm.winPop.getTexture('otherreward3.png').height,
            valign:'middle',
            bold:true
        })
        task_reward.addChild(task_reward_content);
        this.BG.addChild(task_reward);
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            skin:'popModules/common_sure.png',
            centerX:0,
            bottom:30,
            stateNum:1
        })
        this.BG.addChild(sureBtn);
    }
    bindEvent(){
        this.sureBtn.on('click',this,function(){
            this.close();
        })
    }
}
class win extends popBG{
    constructor(){
        super();
        this.zOrder = 99999;
        this.init();
        this.bindEvent()
    }
    init(){
        var container = this.container = new Images();
        this.setSprite(container,{
            source:webgm.winPop.getTexture('reward.png'),
            height:webgm.winPop.getTexture('reward.png').height,
            width:webgm.winPop.getTexture('reward.png').width
        })
        this.addChild(container);
    }
    bindEvent(){

    }
}
class bigwin extends popBG{
    constructor(params){
        super();
        this.zOrder = 99999;
        this.init(params);
        this.bindEvent()
    }
    init(params){
        var container = this.container = new Images();
        this.setSprite(container,{
            source:webgm.winPop.getTexture('bigwinBG.png'),
            height:webgm.winPop.getTexture('bigwinBG.png').height,
            width:webgm.winPop.getTexture('bigwinBG.png').width,
        })
        this.addChild(container);
        var bigwin_num = this.bigwin_num = new laya.ui.Label();
        this.setSprite(bigwin_num,{
            height:106,
            width:630,
            centerX:0,
            top:278,
            fontSize:90,
            color:'white',
            align:'center',
            text:params.num
        })
        this.container.addChild(bigwin_num);
        var sureBtn = this.sureBtn = new laya.ui.Button();
        this.setSprite(sureBtn,{
            skin:'popModules/common_sure.png',
            left:107,
            bottom:53,
            stateNum:1
        })
        this.container.addChild(sureBtn);
        var cannelBtn = this.cannelBtn = new laya.ui.Button();
        this.setSprite(cannelBtn,{
            skin:'winpop/bigwin_share.png',
            right:107,
            bottom:53,
            stateNum:1
        })
        this.container.addChild(cannelBtn);
    }
    bindEvent(){
        this.cannelBtn.on('click',this,function(){
            this.close();
        })
        this.sureBtn.on('click',this,function(){
            this.close();
        })
    }
}

