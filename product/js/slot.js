/* 2. PAGE
 -----------------------------------------------------------------------------------------------
 ===============================================================================================*/
/*------ 2.4 ROOM ------*/
class Slot extends Component {
  /**
   * @param (object) params 参数
   * params.framesBg 背景纹理
   * params.framesIcon 图标纹理
   * params.framesWord 文字纹理
   **/
  constructor(params) {
    super();

    // 判断是否处于移动状态
    this.isMove = false;
    // 奖励金额
    this.award = 0;
    // 动画时间
    this.animateTime = 300;
    // 动画状态
    this.isAnimate = false;
    // 显示获奖的图标索引值
    this.iconAwardArr = [];
    // 列数
    this.column = 3;
    // 行数
    this.line = 30;
    // 随机图标数组
    this.randomIconArr = this.createRandomIconLib();

    // 雪碧图 - 背景
    this.framesBg = params.framesBg;

    // 雪碧图 - 图标
    this.framesIcon = params.framesIcon;

    // 雪碧图 - 文字
    this.framesWord = params.framesWord;

    // 图标
    this.icons = [{
      name: '樱桃',
      pic: 'icon_cherry.png',
      left: 19,
      index: 0,
    }, {
      name: '苹果',
      pic: 'icon_apple.png',
      left: 19,
      index: 1
    }, {
      name: '香蕉',
      pic: 'icon_banner.png',
      left: 13,
      index: 2
    }, {
      name: '草莓',
      pic: 'icon_strawberry.png',
      left: 26,
      index: 3
    }, {
      name: '7字',
      pic: 'icon_seven.png',
      left: 14,
      index: 4
    }, {
      name: '钻石',
      pic: 'icon_diamond.png',
      left: 16,
      index: 5
    }, {
      name: 'BAR',
      pic: 'icon_bar.png',
      left: 14,
      index: 6
    }];

    // 数字
    this.nums = [
      'word_num0.png',
      'word_num1.png',
      'word_num2.png',
      'word_num3.png',
      'word_num4.png',
      'word_num5.png',
      'word_num6.png',
      'word_num7.png',
      'word_num8.png',
      'word_num9.png'
    ];

    // 中奖状态
    this.isAward = false;

    // 获取数字和图标纹理
    this.getTextureNumsAndIcons();

    // 初始化
    this.init();
  }

  // 初始化
  init() {
    // 容器
    this.source = this.framesBg.getTexture('bg_shade.png');
    this.width = this.stage.width;
    this.height = this.stage.height;
    this.centerX = 0;
    this.centerY = 0;
    this.graphics.drawTexture(this.source, -this.width / 2, -this.height / 2, this.width * 2, this.height * 2);

    this.box = new Box();
    this.box.width = 560;
    this.box.height = 607;
    this.box.pos(this.width / 2, this.height / 2);
    this.box.pivot(this.box.width / 2, this.box.height / 2);
    this.box.scale(0, 0);
    this.box.graphics.loadImage(IMG_PATH + 'slot/bg_slot.png', 0, 0, this.box.width, this.box.height);
    this.addChild(this.box);

    // 显示 - 筹码
    // this.labelChip = new Label();
    // this.labelChip.text = this.chip;
    // this.labelChip.overflow = 'hidden';
    // this.labelChip.width = 264;
    // this.labelChip.height = 58;
    // this.labelChip.left = 143;
    // this.labelChip.bottom = 43;
    // this.labelChip.color = '#756fbb';
    // this.labelChip.fontSize = 36;
    // this.labelChip.align = 'center';
    // this.labelChip.valign = 'middle';
    // this.box.addChild(this.labelChip);

    // // 显示 - 奖励
    // this.labelAward = new Box();
    // this.labelAward.left = 0;
    // this.labelAward.top = 31;
    // this.box.addChild(this.labelAward);

    // // 显示 - 图标
    // this.rolls = [];

    // for (let i = 0; i < this.column; i++) {
    //   let panelRoll = new Panel();
    //   panelRoll.lineIndex = 0;
    //   panelRoll.columnIndex = i;
    //   panelRoll.isAnimate = false;
    //   panelRoll.width = 130;
    //   panelRoll.height = 174;
    //   panelRoll.left = 73 + (panelRoll.width + 4) * i;
    //   panelRoll.top = 214;
    //   this.box.addChild(panelRoll);

    //   // 绘制图标
    //   this.drawIcon(panelRoll, 0);

    //   this.rolls.push(panelRoll);
    // }

    // // 动效 - 闪光
    // this.flash = new Clip(IMG_PATH + 'slot/animate_flash.png', 1, 8);
    // this.flash.visible = false;
    // this.flash.autoPlay = true;
    // this.flash.interval = 100;
    // this.flash.width = 600;
    // this.flash.height = 246;
    // this.flash.left = -27;
    // this.flash.top = 162;
    // this.box.addChild(this.flash);

    // // 更新奖励金额
    // this.updateAward(0);
  }

  // 事件 - 开始
  handlerPlay(evt) {
    let _elem = evt.target;

    if (!this.isAnimate) {
      this.iconAwardArr = [];
      this.isAnimate = true;
      this.isAward = false;
      this.flash.visible = false;

      // 更新奖励金额
      this.updateAward(0);

      this.rolls.map((obj, index) => {
        // 动画 - 滚动
        Laya.timer.once(200 * index, this, () => {
          obj.isAnimate = true;

          this.animateFirstIconScroll(obj);

          this.animateIconScroll(obj);

          Laya.timer.loop(this.animateTime, obj, this.startScroll.bind(this), [obj]);
        });
      });

      // 获取中奖结果
      this.getAwardResult();
    }
  }

  // 获取中奖结果
  getAwardResult() {
    let _this = this;

    this.ajax({
      url: this.ajaxUrl,
      dataType: 'json',
      data: {
        'amount': this.chip,
        'isAuto': 0,
        'token': webgm.account.token,
        'channel': webgm.account.userId,
        'gameId': GM.gameId
      },
      type: 'post',
      success: (data) => {
        // 获取筹码和余额信息
        webgm.socketEmit({
          cmd: webgm.cmd.getUserInfo,
          params: {
            token: webgm.account.token
          }
        });

        if (typeof data === 'object' && data.maintain_code == 1) { //系统维护中
          location.reload();

          _this.stopRoll();

          return;
        }

        let icon_award_arr = [];

        switch (data.statusCode) {
          case '0000':
            _this.isAward = data.prizePoint > 0 ? true : false;
            _this.award = Number(data.prizePoint);

            icon_award_arr = data.type;

            break;
          case '100': // 未登录
            location.href = '?act=user&st=login';
            break;
          case '1100': // 游戏币不足
            // 显示提示
            _this.showPrompt('您的账户游戏币不足，请充值');
            break;
          default: // 系统异常
            // 显示提示
            _this.showPrompt('网络异常，请检查下您的网络');
            break;
        }

        _this.stopScroll(icon_award_arr);
      },
      error: () => {
        _this.stopScroll();

        // 显示提示
        _this.showPrompt('网络异常，请检查下您的网络');
      }
    });
  }

  /**
   * 更新奖励金额
   * @param (number) amount 金额
   **/
  updateAward(amount) {
    if (typeof amount === 'number') {
      this.award = amount;
    }

    this.labelAward.graphics.clear();

    let _arr = ('' + this.award).split('');
    let _width = 0;

    _arr.map((item, index) => {
      let _texture = this.nums[Number(item)];

      _width += _texture.width + 3;

      if (index === 0) {
        _width -= 3;
      }

      this.labelAward.graphics.drawTexture(_texture, (_texture.width + 3) * index, 0, _texture.width, _texture.height);
    });

    this.labelAward.left = (550 - _width) / 2;
  }

  // 获取数字和图标纹理
  getTextureNumsAndIcons() {
    let _arr = [];

    this.nums.map((item) => {
      let _texture = this.framesWord.getTexture(item);
      _arr.push(_texture);
    });

    this.nums = _arr;

    this.icons.map((obj) => {
      obj.texture = this.framesIcon.getTexture(obj.pic);
      obj.width = obj.texture.width;
      obj.height = obj.texture.height;
    });
  }

  /**
   * 生成一行3个随机不同图标
   **/
  createRandomIcon() {
    let _arr = [];

    for (let i = 0; i < this.column; i++) {
      let _str = '' + _arr;
      // 筛选出不在_arr中的数字
      let filter_arr = [0, 1, 2, 3, 4, 5, 6].filter((item) => {
        return _str.indexOf(item) === -1;
      });
      // 起始数字
      let _start = 0;
      // 结束数字
      let _end = filter_arr.length;

      _arr.push(filter_arr[parseInt(Math.random() * (_end - _start) + _start)]);
    }

    return _arr;
  }

  /**
   * 生成随机图标库
   * 一次性生成多个随机图标数组, 每行滚动时随机从图标库中获取图标数组显示
   **/
  createRandomIconLib() {
    let _arr = [];

    for (let i = 0; i < this.line; i++) {
      _arr.push(this.createRandomIcon());
    }

    return _arr;
  }

  /**
   * 绘制图标
   * @param (object) obj 父级对象
   * @param (number) status 图标状态 0: 滚动开始, 1: 滚动中, 2: 滚动结束
   * @param (array) iconAwardArr 中奖图标
   **/
  drawIcon(obj, status, iconAwardArr) {
    let icon = new Box();
    icon.name = '' + obj.lineIndex;

    if (status === 2 && Array.isArray(iconAwardArr) && iconAwardArr.length > 0) {
      icon.source = this.icons[this.iconAwardArr[obj.columnIndex]];
    } else {
      icon.source = this.icons[this.randomIconArr[obj.lineIndex][obj.columnIndex]];
    }

    icon.width = obj.width;
    icon.height = obj.height;

    switch (status) {
      case 0:
        icon.top = 0;
        break;
      case 1:
        icon.top = obj.height;
        break;
      case 2:
        icon.top = obj.height;
        break;
    }

    icon.centerX = 0;
    icon.graphics.drawTexture(icon.source.texture, (icon.width - icon.source.width + icon.source.left / 2) / 2, (icon.height - icon.source.height) / 2, icon.source.width, icon.source.height);
    obj.addChild(icon);
  }

  /**
   * 显示提示
   * @param (string) str 提示文案
   **/
  showPrompt(str) {
    this.prompt.visible = true;
    this.labelPrompt.text = str;

    Tween.to(this.prompt, {
      alpha: 1,
    }, 300, null, Handler.create(this, () => {
      Laya.timer.once(3000, this, () => {
        Tween.to(this.prompt, {
          alpha: 0,
        }, 300, null, Handler.create(this, () => {
          this.prompt.visible = false;
        }));
      });
    }));
  }

  /**
   * 开始滚动
   * @param (object) obj 滚动对象
   **/
  startScroll(obj) {
    if (obj.isAnimate) {
      this.animateIconScroll(obj);
    } else {
      Laya.timer.clearAll(obj);

      this.animateLastIconScroll(obj);
    }
  }

  /**
   * 停止滚动
   * @param (array) arr 获奖图标数组
   **/
  stopScroll(arr) {
    this.iconAwardArr = arr || [];

    this.rolls.map((obj, index) => {
      // 动画 - 滚动
      Laya.timer.once(200 * index, this, () => {
        obj.isAnimate = false;
      });
    });
  }

  /**
   * 第一个图标滚动动画
   * @param (object) obj 滚动对象
   **/
  animateFirstIconScroll(obj) {
    let icon = obj.getChildByName('' + obj.lineIndex);

    Tween.to(icon, {
      top: -icon.height,
    }, this.animateTime, null, Handler.create(this, () => {
      icon.destroy();
    }));
  }

  /**
   * 中间图标滚动动画
   * @param (object) obj 滚动对象
   **/
  animateIconScroll(obj) {
    obj.lineIndex++;

    if (obj.lineIndex === this.line) {
      obj.lineIndex = 0;
    }

    this.drawIcon(obj, 1);

    let icon = obj.getChildByName('' + obj.lineIndex);

    Tween.to(icon, {
      top: -icon.height,
    }, 3 * this.animateTime / 2, null, Handler.create(this, () => {
      icon.destroy();
    }));
  }

  /**
   * 最一个图标滚动动画
   * @param (object) obj 滚动对象
   **/
  animateLastIconScroll(obj) {
    obj.lineIndex++;

    if (obj.lineIndex === this.line) {
      obj.lineIndex = 0;
    }

    this.drawIcon(obj, 2, this.iconAwardArr);

    let icon = obj.getChildByName('' + obj.lineIndex);

    Tween.to(icon, {
      top: 0,
    }, this.animateTime, null, Handler.create(this, () => {
      if (obj.columnIndex === this.column - 1) {
        // 如果中奖显示中奖动效
        if (this.isAward) {
          this.flash.visible = true;

          // 更新奖励金额
          this.updateAward();
        }

        Laya.timer.once(600, this, () => {
          this.isAnimate = false;
        });
      }
    }));
  }
}