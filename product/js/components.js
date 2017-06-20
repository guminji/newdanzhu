/**
 * Created by guminji on 2017/6/19.
 */
"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}();!function(t,e,i){var s=(i.un,i.uns,i.static,i.class),a=(i.getset,i.__newvec,laya.resource.Bitmap,laya.utils.Browser,laya.events.Event),n=(laya.events.EventDispatcher,laya.utils.Handler),o=(laya.net.LoaderManager,laya.maths.Rectangle,laya.renders.Render,laya.display.Sprite,laya.display.Stage,laya.resource.Texture,laya.utils.Utils,laya.webgl.WebGL,laya.webgl.WebGLContext,laya.ui.Component),h=laya.ui.Image,r=(laya.ui.Box,laya.ui.Label),l=(laya.ui.List,laya.ui.Dialog),p=function(){function t(){}return s(t,"laya.components"),t.Isbn=function(t){function e(t){_classCallCheck(this,e);var i=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));if("string"!=typeof GM.gamePublishInfo||""===GM.gamePublishInfo)return _possibleConstructorReturn(i);var s={orientation:{top:22,centerX:0},height:24,fontColor:"#efefef",fontSize:18,bgShow:!0},a=t||{};return a=Object.assign(s,a),i._params=a,i.isbn=JSON.parse(GM.gamePublishInfo).publishInfo,i._formart(),0===i.isbn.length?_possibleConstructorReturn(i):(i.init(),i)}return _inherits(e,t),_createClass(e,[{key:"init",value:function(){var t=this,e=0,i=0;this.isbn.map(function(s,a){var n=new r;n.text=s,n.overflow="hidden",n.height=t._params.height,n.top=n.height*a+15,n.centerX=0,n.color=t._params.fontColor,n.fontSize=t._params.fontSize,n.align="center",n.valign="milddle",n.wordWrap=!1,n.zOrder=100,t.addChild(n),e<t.measureWidth&&(e=t.measureWidth),i+=n.height}),this.width=e+40,this.height=i+30;for(var s in this._params.orientation)"left"!==s&&"right"!==s&&"top"!==s&&"bottom"!==s&&"centerX"!==s&&"centerY"!==s||(this[s]=this._params.orientation[s]);if(this._params.bgShow){var a=new h;a.skin=GM.cdnPath+"game/public/images/isbn/bg.png",a.sizeGrid="20, 20, 20, 20, 0",a.width=this.width,a.height=this.height,this.addChild(a)}}},{key:"_formart",value:function(){var t=[];"undefined"!=typeof this.isbn.copyrightOwner&&""!==this.isbn.copyrightOwner&&t.push("著作权人："+this.isbn.copyrightOwner),"undefined"!=typeof this.isbn.publishCompany&&""!==this.isbn.publishCompany&&t.push("出版服务："+this.isbn.publishCompany),"undefined"==typeof this.isbn.publicationNo&&"undefined"==typeof this.isbn.publishCopyright||""===this.isbn.publicationNo&&""===this.isbn.publishCopyright||t.push("ISBN："+this.isbn.publicationNo+" "+this.isbn.publishCopyright),"undefined"!=typeof this.isbn.copyright&&""!==this.isbn.copyright&&t.push("备案号："+this.isbn.copyright);var e="",s=[];i.stage.screenMode===i.Stage.SCREEN_VERTICAL?s=t:t.map(function(i,a){e+=" "+i+" ",(a+1)%2!==0&&a!==t.length-1||(s.push(e),e="")}),this.isbn=s}}]),e}(o),t.Popup=function(t){function e(t){_classCallCheck(this,e);var i=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));if("object"!==("undefined"==typeof t?"undefined":_typeof(t))||"string"!=typeof t.name||"object"!==_typeof(t.box))return _possibleConstructorReturn(i);var s={name:null,box:null,closeBtnShow:!0,closeBtnOrientation:{right:15,top:20},closeBtnTexture:null,closeBtnSkin:GM.cdnPath+"game/public/images/popup/btn_close.png",shadeShow:!0,shadeAlpha:.8,animateMode:"fade",animateTime:300,mouseThrough:!1,onShowStart:null,onShowEnd:null,onHideStart:null,onHideEnd:null},a=t||{};return a=Object.assign(s,a),i._params=a,i._params.shadeShow||(i._params.shadeAlpha=0),i.init(),i}return _inherits(e,t),_createClass(e,[{key:"init",value:function(){if(this.name=this._params.name,this.zOrder=1e3,this.visible=!1,this.width=i.stage.width,this.height=i.stage.height,this.mouseThrough=this._params.mouseThrough,i.stage.addChild(this),this.shade=new h,this.shade.alpha=0,this.shade.skin=GM.cdnPath+"game/public/images/popup/bg.png",this.shade.sizeGrid="0, 0, 0, 0, 0",this.shade.width=this.width,this.shade.height=this.height,this.addChild(this.shade),this.box=this._params.box,this.box.alpha=0,this.box.centerX=0,this.box.centerY=0,this.addChild(this.box),this._params.closeBtnShow){this.btnClose=new h,null===this._params.closeBtnTexture?this.btnClose.skin=this._params.closeBtnSkin:this.btnClose.source=this._params.closeBtnTexture;for(var t in this._params.closeBtnOrientation)"left"!==t&&"right"!==t&&"top"!==t&&"bottom"!==t&&"centerX"!==t&&"centerY"!==t||(this.btnClose[t]=this._params.closeBtnOrientation[t]);this.btnClose.on(a.CLICK,this,this._handlerHide),this.box.addChild(this.btnClose)}}},{key:"_handlerHide",value:function(){this.popHide()}},{key:"popShow",value:function(){this.visible&&(this.shade.alpha=0,this.box.alpha=0,this.visible=!1,this.close()),"function"==typeof this._params.onShowStart&&this._params.onShowStart(this),this._animateShow()}},{key:"popHide",value:function(){"function"==typeof this._params.onHideStart&&this._params.onHideStart(this),this._animateHide()}},{key:"popRemove",value:function(){Tween.clearAll(this.shade),Tween.clearAll(this.box),Tween.clearAll(this),this.destroy()}},{key:"_animateShow",value:function(){var t=this;if(l.manager.numChildren>0)this.shade.alpha=this._params.shadeAlpha,this.box.alpha=1,"function"==typeof this._params.onShowEnd&&this._params.onShowEnd(this);else switch(this._params.animateMode){case"fade":Tween.to(this.shade,{alpha:this._params.shadeAlpha},this._params.animateTime,null,null,10),Tween.to(this.box,{alpha:1},this._params.animateTime,null,n.create(this,function(){"function"==typeof t._params.onShowEnd&&t._params.onShowEnd(t)}),10);break;default:this.shade.alpha=this._params.shadeAlpha,this.box.alpha=1,"function"==typeof this._params.onShowEnd&&this._params.onShowEnd(this)}this.visible=!0,this.show(!0)}},{key:"_animateHide",value:function(){var t=this;switch(this._params.animateMode){case"fade":Tween.to(this.shade,{alpha:0},this._params.animateTime),Tween.to(this.box,{alpha:0},this._params.animateTime,null,n.create(this,function(){t.visible=!1,t.close(),"function"==typeof t._params.onHideEnd&&t._params.onHideEnd(t),t.destroy()}));break;default:this.shade.alpha=0,this.box.alpha=0,this.visible=!1,this.close(),"function"==typeof this._params.onHideEnd&&this._params.onHideEnd(this),this.destroy()}}}]),e}(l),t.__init$=function(){},t}();i.__init([p])}(window,document,Laya);