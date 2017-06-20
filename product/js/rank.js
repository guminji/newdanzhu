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
            top:460,
            width:710,
            height:430,
        })
        container.addChild(allBlank_Container);
        var allBlank_ContainerBG = this.allBlank_ContainerBG =new laya.display.Sprite();
        allBlank_ContainerBG.graphics.drawRect(14,0,682,420,'#005ebe');
        //allBlank_ContainerBG.centerX = 0;
        allBlank_Container.addChild(allBlank_ContainerBG);
        this.create_topRank();
        this.create_rankTab();
        this.create_mainRank_type1();
        this.create_mainRank_type2();
        this.create_mainRank_type3();

    }
    //创建头部奖杯排名
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
                height:55,
                color:'black',
                fontSize:24,
                valign:'middle'
            })
            BG.addChild(names)
            var account = this.account = new laya.ui.Label();
            self.setSprite(account,{
                width:170,
                height:55,
                color:'black',
                fontSize:24,
                valign:'middle'
            })
            BG.addChild(account)
        }
        Laya.class(topRank_renderBox, "topRank_renderBox", Laya.Box);
        var topContainer = this.topContainer = new laya.ui.List();
        this.setSprite(topContainer,{
            itemRender:topRank_renderBox,
            repeatX : 1,
            repeatY :3,
            left:267,
            top:160,
            //vScrollBarSkin :''
        })
        topContainer.renderHandler = new Handler(this, updateItem);
        function updateItem(cell,index){
            var picName,topValue,nameleft,accountleft;
            switch(index)
            {
                case 0:
                    picName = 'first.png';
                    nameleft=80;
                    topValue =0;
                    accountleft = 270;
                    break;
                case 1:
                    picName = 'second.png';
                    nameleft=100;
                    topValue = 7;
                    accountleft = 280;
                    break;
                case 2:
                    picName = 'third.png';
                    topValue = 0;
                    nameleft=110;
                    accountleft = 290;
                    break;
                default:

            }
            self.setSprite(cell.BG,{
                top:topValue,
                source:webgm.rankPop.getTexture(picName),
                height:webgm.rankPop.getTexture(picName).height,
                width:webgm.rankPop.getTexture(picName).width,

            })
            self.setSprite(cell.names,{
                text:cell.dataSource.data.names?cell.dataSource.data.names:'虚位以待',
                left:nameleft
            })
            self.setSprite(cell.account,{
                text:cell.dataSource.data.account?cell.dataSource.data.account:'',
                left:accountleft
            })

        };
        topContainer.array = [{data:{names:'顾敏吉',account:'81237'}},{data:{names:'顾敏吉1',account:'812237'}},{data:{names:'顾敏吉2',account:'8132237'}}];
        self.container.addChild(topContainer);
        console.log(topContainer);
    }
    //创建排行榜tab
    create_rankTab(){
        var self = this;
        var tabText = ['分奖榜','日排行','周排行','月排行','我的战绩']
        var rankTab = this.rankTab = new laya.ui.Tab();
        this.setSprite(rankTab,{
            height:700,
            //centerX:0,
            height:63,
            top:400,
        })
        rankTab.initItems();
        for(let i= 0;i<5;i++){
            let ranktab = this['ranktab'+i] = new laya.ui.Button();
            this.setSprite(ranktab,{
                height:65,
                width:120,
                left:120*i+40
            })
            var tabBG = this['tabBG'+i] = new laya.ui.Image();
            this.setSprite(tabBG,{
                source:webgm.rankPop.getTexture('ranksTab.png'),
                sizeGrd:[12,12,0,12],
                height:webgm.rankPop.getTexture('ranksTab.png').height,
                width:i!=4?webgm.rankPop.getTexture('ranksTab.png').width:webgm.rankPop.getTexture('ranksTab.png').width+40,
                bottom:4,
                visible:i!=0?false:true
            })
            var tabLabel = this['tabLabel'+i] = new laya.ui.Label();
            this.setSprite(tabLabel,{
                text:tabText[i],
                height:65,
                width:i!=4?120:160,
                valign:'middle',
                align:'center',
                fontSize:30,
                color:i!=0?'#8b8092':'white'
            })
            ranktab.addChild(tabBG);
            ranktab.addChild(tabLabel);
            this.rankTab.addItem(ranktab);
            this.rankTab.selectedIndex = 0;
        }
        self.container.addChild(rankTab);
        console.log(self.container);
    }
    create_mainRank_type1(){
        var self = this;
        //分奖榜
        var billboardType1 = this.billboardType1 = new laya.ui.Box();
        this.setSprite(billboardType1,{
            width:682,
            height:420,
            centerX:0
        })
        var Type1_title = new laya.ui.Box();
        this.setSprite(Type1_title,{
            height:40,
            width:682
        })
        var titleBG = new laya.display.Sprite();
        titleBG.graphics.drawRect(0,0,682,40,'#339ff5');
        Type1_title.addChild(titleBG);
        billboardType1.addChild(Type1_title);
        this.createType_title('type1',Type1_title);
        this.allBlank_Container.addChild(billboardType1);
        function billboard1_renderBox() {
            billboard1_renderBox.__super.call(this);
            this.size(682, 46);
            var BG = this.BG = new laya.ui.Image();
            BG.graphics.drawRect(0,0,682,46,'#0267ce');
            this.addChild(BG);
            var time = this.time = new laya.ui.Label();
            self.setSprite(time,{
                width:199,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
            })
            this.addChild(time)
            var names = this.names = new laya.ui.Label();
            self.setSprite(names,{
                width:263,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:200
            })
            this.addChild(names)
            var account = this.account = new laya.ui.Label();
            self.setSprite(account,{
                width:220,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:460
            })
            this.addChild(account)

        }
        Laya.class(billboard1_renderBox, "billboard1_renderBox", Laya.Box);
        var billboard1 = this.billboard1 = new laya.ui.List();
        this.setSprite(billboard1,{
            itemRender:billboard1_renderBox,
            repeatX : 1,
            repeatY :7,
            centerX:0,
            top:55,
            vScrollBarSkin :''
        })
        billboard1.renderHandler = new Handler(this, updateItem);
        billboardType1.addChild(billboard1)
        function updateItem(cell,index){
            var picName,topValue,nameleft,accountleft;
            if(index%2){
                self.setSprite(cell.BG,{
                    visible:false
                })
            }
            self.setSprite(cell.names,{
                text:cell.dataSource.data.names?cell.dataSource.data.names:'虚位以待',

            })
            self.setSprite(cell.account,{
                text:cell.dataSource.data.account?cell.dataSource.data.account:'',

            })
            self.setSprite(cell.time,{
                text:cell.dataSource.data.time?cell.dataSource.data.time:'',

            })
        }
            billboard1.array = [{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉',account:'81237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉1',account:'812237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30'}}];

    }
    create_mainRank_type2(){
        var self = this;
        //分奖榜
        var billboardType2 = this.billboardType2 = new laya.ui.Box();
        this.setSprite(billboardType2,{
            width:682,
            height:420,
            centerX:0,
            visible:false
        })
        var Type2_title = new laya.ui.Box();
        this.setSprite(Type2_title,{
            height:40,
            width:682
        })
        var titleBG = new laya.display.Sprite();
        titleBG.graphics.drawRect(0,0,682,40,'#339ff5');
        Type2_title.addChild(titleBG);
        billboardType2.addChild(Type2_title);
        this.createType_title('type2',Type2_title);
        this.allBlank_Container.addChild(billboardType2);
        function billboard2_renderBox() {
            billboard2_renderBox.__super.call(this);
            this.size(682, 46);
            var BG = this.BG = new laya.ui.Image();
            BG.graphics.drawRect(0,0,682,46,'#0267ce');
            this.addChild(BG);
            var rankNum = this.rankNum = new laya.ui.Label();
            self.setSprite(rankNum,{
                width:154,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
            })
            this.addChild(rankNum)
            var rankImg = this.rankImg = new laya.ui.Image();
            self.setSprite(rankImg,{
                centerX:0,
                centerY:0
            })
            rankNum.addChild(rankImg);
            var names = this.names = new laya.ui.Label();
            self.setSprite(names,{
                width:193,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:154
            })
            this.addChild(names)
            var account = this.account = new laya.ui.Label();
            self.setSprite(account,{
                width:189,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:350
            })
            this.addChild(account)
            var statusContainer = this.statusContainer = new laya.ui.Label();
            self.setSprite(statusContainer,{
                width:146,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:540
            })
            this.addChild(statusContainer)
            var status = this.status = new laya.ui.Image();
            self.setSprite(status,{
                centerX:0,
                centerY:0
            })
            statusContainer.addChild(status)

        }
        Laya.class(billboard2_renderBox, "billboard2_renderBox", Laya.Box);
        var billboard2 = this.billboard2 = new laya.ui.List();
        this.setSprite(billboard2,{
            itemRender:billboard2_renderBox,
            repeatX : 1,
            repeatY :7,
            centerX:0,
            top:55,
            vScrollBarSkin :''
        })
        billboard2.renderHandler = new Handler(this, updateItem);
        billboardType2.addChild(billboard2)
        function updateItem(cell,index){
            console.log(index);
            var statusImg,rankImgsrc;
            if(index%2){
                self.setSprite(cell.BG,{
                    visible:false
                })
            }
            self.setSprite(cell.rankNum,{
                text:index+1
            })
            if(index>='0'&&index<='2'){
                //console.log(index);
                var indexd = index+1;
                self.setSprite(cell.rankImg,{
                    source:webgm.rankPop.getTexture('ranks'+indexd+'.png'),
                    height:webgm.rankPop.getTexture('ranks'+indexd+'.png').height,
                    width:webgm.rankPop.getTexture('ranks'+indexd+'.png').width,

                })
                self.setSprite(cell.rankNum,{
                    text:''
                })
            }
            self.setSprite(cell.names,{
                text:cell.dataSource.data.names?cell.dataSource.data.names:'虚位以待',

            })
            self.setSprite(cell.account,{
                text:cell.dataSource.data.account?cell.dataSource.data.account:'',

            })
            switch(cell.dataSource.data.status){
                case 0:
                    statusImg = 'ranks_tops.png'
                    break;
                case 1:
                    statusImg = 'ranks_down.png'
                    break;
                case 2:
                    statusImg = 'ranks_maintain.png'
                    break;

            }
            self.setSprite(cell.status,{
                source:webgm.rankPop.getTexture(statusImg),
                height:webgm.rankPop.getTexture(statusImg).height,
                width:webgm.rankPop.getTexture(statusImg).width,

            })

        }
        billboard2.array = [{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:0}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:2}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}},{data:{names:'顾敏吉2',account:'8132237',time:'1993-10-20 10:30',status:1}}];

    }
    create_mainRank_type3(){
        var self = this;
        //分奖榜
        var billboardType3 = this.billboardType3 = new laya.ui.Box();
        this.setSprite(billboardType3,{
            width:682,
            height:420,
            centerX:0,
            visible:false
        })
        var Type3_title = new laya.ui.Box();
        this.setSprite(Type3_title,{
            height:40,
            width:682
        })
        var titleBG = new laya.display.Sprite();
        titleBG.graphics.drawRect(0,0,682,40,'#339ff5');
        Type3_title.addChild(titleBG);
        billboardType3.addChild(Type3_title);
        this.createType_title('type3',Type3_title);
        this.allBlank_Container.addChild(billboardType3);
        function billboard3_renderBox() {
            billboard3_renderBox.__super.call(this);
            this.size(682, 46);
            var BG = this.BG = new laya.ui.Image();
            BG.graphics.drawRect(0,0,682,46,'#0267ce');
            this.addChild(BG);
            var NUM = this.NUM = new laya.ui.Label();
            self.setSprite(NUM,{
                width:90,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
            })
            this.addChild(NUM)
            var describe = this.describe = new laya.ui.Label();
            self.setSprite(describe,{
                width:130,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:90
            })
            this.addChild(describe)
            var account = this.account = new laya.ui.Label();
            self.setSprite(account,{
                width:218,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:220
            })
            this.addChild(account)
            var time = this.time = new laya.ui.Label();
            self.setSprite(time,{
                width:230,
                height:46,
                color:'white',
                fontSize:24,
                valign:'middle',
                align:'center',
                left:438
            })
            this.addChild(time)

        }
        Laya.class(billboard3_renderBox, "billboard3_renderBox", Laya.Box);
        var billboard3 = this.billboard3 = new laya.ui.List();
        this.setSprite(billboard3,{
            itemRender:billboard3_renderBox,
            repeatX : 1,
            repeatY :7,
            centerX:0,
            top:55,
            vScrollBarSkin :''
        })
        billboard3.renderHandler = new Handler(this, updateItem);
        billboardType3.addChild(billboard3)
        function updateItem(cell,index){
            var picName,topValue,nameleft,accountleft;
            if(index%2){
                self.setSprite(cell.BG,{
                    visible:false
                })
            }
            self.setSprite(cell.NUM,{
                text:index+1,
            })
            self.setSprite(cell.describe,{
                text:cell.dataSource.data.describe?cell.dataSource.data.describe:'',
            })
            self.setSprite(cell.account,{
                text:cell.dataSource.data.account?cell.dataSource.data.account:'',

            })
            self.setSprite(cell.time,{
                text:cell.dataSource.data.time?cell.dataSource.data.time:'',

            })
        }
        billboard3.array = [{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},{data:{account:'8132237',time:'1993-10-20 10:30',describe:'中大奖'}},];

    }
    createType_title(type,target){
        var self = this;
        var titleText,width,left;
        switch(type){
            case 'type1':
                titleText = ['时间','玩家名','分得金额'];
                width = [199,263,220];
                left =[0,200,460]
                break;
            case 'type2':
                titleText = ['排名','玩家名','投币金额','排名变化'];
                width = [154,193,189,146];
                left =[0,154,350,540]
                break;
            case 'type3':
                titleText = ['序号','中奖说明','奖励','时间'];
                width = [90,130,218,230];
                left =[0,90,220,438]
                break;
        }
        for(let i = 0;i<titleText.length;i++){
            var title = new laya.ui.Label();
            self.setSprite(title,{
                width:width[i],
                text:titleText[i],
                left:left[i],
                valign:'middle',
                align:'center',
                fontSize:24,
                color:'white',
                height:40,

            })
            target.addChild(title);
        }
    }
    bindEvent(){
        var self = this;
        this.closeBtn.on('click',this,function(){
            this.close();
        })
        this.rankTab.selectHandler = new Laya.Handler(self,function(index){
            //var skinchoose = ['type1','type2','type3'];
            console.log(index);
            for(let i =0;i<5;i++){
                this['tabLabel'+i].color= '#8b8092';
                this['tabBG'+i].visible= false;
            }
            this['tabLabel'+index].color= 'white';
            this['tabBG'+index].visible= true;
            for(let i =1;i<4;i++){
                this['billboardType'+i].visible= false;
            }
            if(index>=1&&index<=3){
                this.billboardType2.visible = true;
            }
            else if(index == 0){
                this.billboardType1.visible = true;
            }
            else if(index == 4){
                this.billboardType3.visible = true;
            }
        })
    }
}