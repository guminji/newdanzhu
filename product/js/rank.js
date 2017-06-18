/**
 * Created by guminji on 2017/6/18.
 */

class rankPop extends popBG{
    constructor(){
        super();
        this.zOrder = 99999;
        this.init();
        this.bindEvent()
    }
    init(){
        var container = this.container = new Images();
        this.setSprite(container,{
            source:webgm.rankPop.getTexture('rankBG.png'),
            height:webgm.rankPop.getTexture('rankBG.png').height,
            width:webgm.rankPop.getTexture('rankBG.png').width,
        })
        this.addChild(container);
        var closeBtn = this.closeBtn = new laya.ui.Button();
        this.setSprite(closeBtn,{
            skin:'popModules/common_closebtn.png',
            height:webgm.framesPop.getTexture('common_closebtn.png').height,
            width:webgm.framesPop.getTexture('common_closebtn.png').width,
            stateNum:1,
            right:-10,
            top:23
        })
        container.addChild(closeBtn);
        var allBlank_Container = this.allBlank_Container = new laya.ui.Box();
        this.setSprite(allBlank_Container,{
            top:495,
            width:700,
            height:430,
        })
        this.create_topRank();
        /*function Item()
        {
            Item.__super.call(this);
            this.size(373, 60);
            this.Label = new laya.ui.Label();
            this.Label.text = 1;
            //this.Label.height= 60;
            this.Label.color= 'white';
            this.Label.fontSize= 40;
            this.addChild(this.Label);

            this.setText = function(message)
            {
                this.Label.text = message;
            }
        }
        Laya.class(Item, "Item", Laya.Box);
        var allBlank_Container = this.allBlank_Container = new laya.ui.List();
        this.setSprite(allBlank_Container,{
            top:400,
            itemRender:Item,
            repeatX : 1,
            repeatY :7,
            vScrollBarSkin :""

        })
        allBlank_Container.renderHandler = new Handler(this, updateItem);
        function updateItem(cell,index){
            cell.setText(cell.dataSource);
            cell.left = index*70
        }
        var data = [1,2,3]
        /!*for(let i = 0;i<10;i++){
            let win_num = this['win_num'+i] = new laya.ui.Label();
            this.setSprite(win_num,{
                fontSize:50,
                top:70*i,
                height:70,
                color:'white',
                valign:'middle',
                text:i
            })
            allBlank_Container.addChild(win_num)
        }*!/
        allBlank_Container.array = data;
        container.addChild(allBlank_Container);*/

    }
    create_topRank(){
        var self = this;
        function topRank_renderBox() {
            topRank_renderBox.__super.call(this);
            this.size(430, 70);
            var BG = this.BG = new laya.ui.Image();
            this.addChild(BG);
            var names = this.names = new laya.ui.Label();
            self.setSprite(names,{
                width:170,
                height:50,
                color:'white',
                fontSize:40
            })
            BG.addChild(names)
        }
        Laya.class(topRank_renderBox, "topRank_renderBox", Laya.Box);
        var topContainer = this.topContainer = new laya.ui.List();
        this.setSprite(topContainer,{
            itemRender:topRank_renderBox,
            repeatX : 1,
            repeatY :3,
            left:267,
            top:160
        })
        topContainer.renderHandler = new Handler(this, updateItem);
        function updateItem(cell,index){
            var picName,topValue;
            switch(index)
            {
                case 0:
                    picName = 'first.png';
                    topValue =0;
                    break;
                case 1:
                    picName = 'second.png';
                    topValue = 4;
                    break;
                case 2:
                    picName = 'third.png';
                    topValue = 3;
                    break;
                default:

            }
            self.setSprite(cell.BG,{
                source:webgm.rankPop.getTexture(picName),
                height:webgm.rankPop.getTexture(picName).height,
                width:webgm.rankPop.getTexture(picName).width,

            })
            self.setSprite(cell.names,{
                text:cell.dataSource.data.names?cell.dataSource.data.names:'虚位以待',
            })

        };
        topContainer.array = [{data:{names:'顾敏吉'}},{data:{names:'顾敏吉1'}},{data:{names:'顾敏吉2'}}];
        self.container.addChild(topContainer);
        console.log(topContainer);
    }
    bindEvent(){
        this.closeBtn.on('click',this,function(){
            this.close();
        })
    }
}