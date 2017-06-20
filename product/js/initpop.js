/**
 * Created by guminji on 2017/6/9.
 */
(function(global){
    global.initpops = function(){
        global.pops={
            SkinChange:null,
            CommonMessage:null,
            Settings:null,
            Tocharge:null,
            TakeIn:null,
            Help:null,
            Rank:null
        }

    }
    initpops();

    //注册事件
    function showPOP(name,target){
        pops[name] = new laya.components.Popup({
            name:name,
            box: target,
            closeBtnShow: false,
            shadeShow: false,
        })
        pops[name].popShow();
    }
    function normalShow(){
        pops.settings = new settingsPOP();
        Laya.stage.addChild(pops.settings);
    }
    //注册所有弹窗事件
    for(var key in window.pops){
        if(key == 'Settings'){
            Laya.stage.on(('show'+key),this,normalShow)
        }
        else{
            Laya.stage.on(('show'+key),this,showPOP)
        }
    }
})(window)