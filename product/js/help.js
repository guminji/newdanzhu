/**
 * Created by guminji on 2017/6/15.
 */
class helpPOP extends laya.ui.Component{
    constructor(){
        super();
        this.index= 0;
        this.maxNum =4;
        this.zOrder= 99999;
        this.init();
        this.bindEvent();
    }
    setSprite(target,options){
        for(var key in options){
            target[key] = options[key];
        }
    }
    //创建容器
    init(){
        var HelpContainer = this.HelpContainer = new Images();
        this.setSprite(HelpContainer,{
            source:webgm.helpPop.getTexture('helpContainer.png'),
            width:webgm.helpPop.getTexture('helpContainer.png').width,
            height:webgm.helpPop.getTexture('helpContainer.png').height
        })
        this.addChild(HelpContainer)
        this.creatSwiper()
    }
    creatSwiper(){
        var self = this;
        var swiperWrap = this.swiperWrap = new laya.ui.Box();
        this.setSprite(swiperWrap,{
            height:578,
            width:709,
            centerX:0,
            top:137,
        })
        this.HelpContainer.addChild(swiperWrap);
        swiperWrap.scrollRect={x:0,y:0,width:709,height:578}
        var swiperContainer = this.swiperContainer = new laya.ui.Box();
        this.setSprite(swiperContainer,{
            height:578,
            width:709,
        })

        for(var i = 0;i<4;i++){
            var viewBox = new laya.ui.Box();
            //swiperContainer.initItems();
            //var viewBox = swiperContainer.createItem();
            this.setSprite(viewBox,{
                height:578,
                width:709,
                top:0,
                left:i*709
            })
            //console.log(viewBox);
            var img = new Images();
            this.setSprite(img,{
                source:webgm.helpPop.getTexture('helpview1.png'),
                width:webgm.helpPop.getTexture('helpview1.png').width,
                height:webgm.helpPop.getTexture('helpview1.png').height,
                centerX:0,
                centerY:0,
                name:'img'
            })
            viewBox.addChild(img);
            swiperContainer.addChild(viewBox);
        }
        this.swiperWrap.addChild(swiperContainer);
        //添加底部tab
        var swiperTab = this.swiperTab = new laya.ui.Tab();
        this.setSprite(swiperTab,{
            centerX:0,
            bottom:153,
            space:41
        })
        swiperTab.initItems();
        for(var i = 0;i<4;i++){
            let tab = self["tab"+i] = new laya.ui.Button();
            //moneyType.height = 247;
            //moneyType.width = 167;
            tab.stateNum =2;
            tab.left = 31*i+41*i;
            tab.skin = 'help/helpTabicon.png';
            //initItems()
            self.swiperTab.addItem(tab);
        }
        this.HelpContainer.addChild(swiperTab);
        swiperTab.selectedIndex = this.index;
        //
        //setTimeout(function(){
        //    laya.utils.Tween.to(swiperContainer,{x:-709*2},200)
        //},3000)
    }
    bindEvent(){
        var self = this;
        this.swiperWrap.on(Laya.Event.MOUSE_DOWN, this, function (e) {
            this.mousePosX = e.stageX;

        });

        this.swiperWrap.on(Laya.Event.MOUSE_UP, this, function (e) {
            var diff = this.mousePosX - e.stageX;
            if(diff > 50){
                console.log(1)
                if((this.swiperTab.selectedIndex+1)==this.maxNum){
                    this.index = 0;
                    this.swiperTab.selectedIndex = 0;
                    //return
                }
                else{
                    this.index += 1;
                    this.swiperTab.selectedIndex +=1;
                }
            }else if(diff < -50){
                if(this.swiperTab.selectedIndex==0){
                    this.index = this.maxNum-1;
                    this.swiperTab.selectedIndex = this.maxNum-1;
                    //return
                }
                else{
                    this.index -= 1;
                    this.swiperTab.selectedIndex -=1;
                }

            }
            laya.utils.Tween.to(this.swiperContainer,{x:-709*this.index},200)
        });
        this.swiperTab.selectHandler = new Laya.Handler(self,function(index){
            this.index = index;
            laya.utils.Tween.to(this.swiperContainer,{x:-709*this.index},200)
        })
    }
}