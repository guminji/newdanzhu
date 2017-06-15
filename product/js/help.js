/**
 * Created by guminji on 2017/6/15.
 */
class helpPOP extends laya.ui.Component{
    constructor(){
        super();
        this.zOrder= 99999;
        this.init()
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
        var swiperWrap = this.swiperWrap = new laya.ui.Box();
        this.setSprite(swiperWrap,{
            height:578,
            width:709,
            centerX:0,
            top:137,
        })
        this.HelpContainer.addChild(swiperWrap);
        var swiperContainer = this.swiperContainer = new laya.ui.List();
        this.setSprite(swiperContainer,{
            repeatX:1,
            repeatY:1,
            height:578,
            width:709,
        })
        swiperContainer.array=[];
        for(var i = 0;i<4;i++){
            var viewBox = new laya.ui.Box();
            //swiperContainer.initItems();
            //var viewBox = swiperContainer.createItem();
            console.log(viewBox);
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
            swiperContainer.addItem(viewBox);
        }

        //swiperContainer.refresh();
        /*var viewBox = new laya.ui.Box();
        swiperContainer.initItems();
        //var viewBox = swiperContainer.createItem();
        console.log(viewBox);
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
        swiperContainer.addChild(viewBox);*/
        //swiperContainer.createItem();
        this.swiperWrap.addChild(swiperContainer);
        console.log(swiperContainer.itemRender);
        console.log(this);
        console.log(swiperContainer.page);
        setTimeout(function(){
            swiperContainer.tweenTo	(3,200)
        },3000)
    }
}