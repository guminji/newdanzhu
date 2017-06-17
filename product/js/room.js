/* 2. PAGE
 -----------------------------------------------------------------------------------------------
 ===============================================================================================*/
/*------ 2.3 ROOM ------*/
// 初始化物理引擎
let Engine = Matter.Engine;
let Render = Matter.Render;
let Runner = Matter.Runner;
let Body = Matter.Body;
let Events = Matter.Events;
let Composite = Matter.Composite;
let Composites = Matter.Composites;
let Common = Matter.Common;
let MouseConstraint = Matter.MouseConstraint;
let Mouse = Matter.Mouse;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Vector = Matter.Vector;
let Vertices = Matter.Vertices;

class Room extends Component {
  constructor() {
    super();

    // 初始化
    this.init();
  }

  // 初始化
  init() {
    // 容器
    this.visible = true;
    this.alpha = 1;
    this.zOrder = 400;
    this.source = Laya.loader.getRes(IMG_PATH + 'room/skin1/bg.jpg');
    this.width = this.stage.width;
    this.height = this.stage.height;
    this.centerX = 0;
    this.centerY = 0;
    this.graphics.drawTexture(this.source, 0, 0, this.width, this.height);
    Laya.stage.addChild(this);

    // console.log(this.width, this.width * this.source.height / this.source.width);

    // 组件 - 头部
    let header = new RoomHeader();
    this.addChild(header);

    // 组件 - 弹珠机
    let pachinko = new RoomPachinko();
    pachinko.top = 253;
    pachinko.centerX = 0;
    this.addChild(pachinko);

    // 按钮 - 自动发射
    let btnAuto = new Images();
    btnAuto.isAuto = false;
    btnAuto.source = webgm.framesBtn.getTexture('btn_auto.png');
    btnAuto.width = btnAuto.source.width;
    btnAuto.height = btnAuto.source.height;
    btnAuto.left = 35;
    btnAuto.top = 1110;
    btnAuto.on(Event.CLICK, this, this.handlerAuto);
    this.addChild(btnAuto);

    // 组件 - 弹珠消耗
    let ballNums = new RoomBallNums();
    ballNums.left = 35;
    ballNums.top = 1190;
    this.addChild(ballNums);
  }

  // 事件 - 自动发射
  handlerAuto(evt) {
    let node = evt.target;

    node.isAuto = node.isAuto ? false : true;

    if (node.isAuto) {
      node.source = webgm.framesBtn.getTexture('btn_auto_checked.png');
    } else {
      node.source = webgm.framesBtn.getTexture('btn_auto.png');
    }

    // 设置自动发射
    this.stage.event(Event.SET_AUTO_LAUNCH, [evt.target.isAuto]);

    console.log('按钮 - 自动发射', evt.target.isAuto);
  }
}

/* 组件 - 弹珠机 */
class RoomPachinko extends Component {
  constructor() {
    super();

    // matter世界
    this.world = null;
    // matter 引擎
    this.engine = null;

    // 雪碧图 - 洞
    this.framesSprite = new SpriteFrames({
      jsonUrl: IMG_PATH + 'room/skin1/sprite.json',
      imageUrl: IMG_PATH + 'room/skin1/sprite.png'
    });

    // 初始化
    this.init();

    // 初始化物理引擎
    this.initPhysicsEngine();
  }

  // 初始化
  init() {
    this.source = [
      Laya.loader.getRes(IMG_PATH + 'room/skin1/bg_pachinko.png'),
      Laya.loader.getRes(IMG_PATH + 'room/skin1/bg_pachinko_power.png')
    ];
    this.width = this.source[0].width;
    this.height = this.source[0].height;
    this.graphics.drawTexture(this.source[1], -(this.source[1].width - this.width) / 2, 242, this.source[1].width, this.source[1].height);
    this.graphics.drawTexture(this.source[0], 0, 0, this.width, this.height);

    // 组件 - 倒计时
    this.countDown = new RoomCountDown({
      framesSprite: this.framesSprite,
      callback: (isStart) => {
        this.switchBigHole(isStart)
      }
    });
    this.countDown.top = 550;
    this.countDown.centerX = 0;
    this.addChild(this.countDown);

    // 物理世界容器
    this.box = new Box();
    this.box.width = this.width;
    this.box.height = this.height;
    this.addChild(this.box);

    // 轨道遮罩
    let pathWay = new Images();
    pathWay.source = Laya.loader.getRes(IMG_PATH + 'room/skin1/bg_pachinko_pathway.png');
    pathWay.width = pathWay.source.width;
    pathWay.height = pathWay.source.height;
    pathWay.centerX = 0;
    pathWay.centerY = 0;
    this.addChild(pathWay);

    // 组件 - 发射力道
    this.power = new RoomPower({
      framesSprite: this.framesSprite,
      handlerLeft: -20,
      handlerTop: -57,
      handlerPivotX: 55,
      handlerPivotY: 92,
      handlerAngle: -22,
      powerLeft: -118,
      powerTop: 22,
      callback: this.launchBall.bind(this)
    });
    this.power.left = 499;
    this.power.top = 837;
    this.addChild(this.power);
  }

  // 初始化物理引擎
  initPhysicsEngine() {
    // create engine
    this.engine = Engine.create({
      enableSleeping: true,
      timing: {
        // 引擎速度 default:1
        timeScale: 1
      }
    });

    this.world = this.engine.world;

    Engine.run(this.engine);

    let render = LayaRender.create({
      engine: this.engine,
      container: this.box,
      width: this.width,
      height: this.height,
      options: {
        wireframes: false
      }
    });

    LayaRender.run(render);

    // 创建环形轨道
    this.createAnnularPathway();

    // 创建钢柱
    this.createPilingBar();

    //创建奖洞
    this.createHole();

    // 创建装饰品
    this.createDecoration();

    // 碰撞后事件
    Events.on(this.engine, 'collisionEnd', function(evt) {
      let _pairs = evt.pairs;

      _pairs.map((obj) => {
        let _ball = null;

        // 判断是否小球
        if (obj.bodyA.label === 'ball') {
          _ball = obj.bodyA;
        } else if (obj.bodyB.label === 'ball') {
          _ball = obj.bodyB;
        }

        // 钢珠停止后移除
        if (_ball !== null && _ball.angularSpeed === 0 && _ball.speed === 0) {
          World.remove(this.world, _ball);
        }
      });
    });
  }

  // 创建环形轨道
  createAnnularPathway() {
    let _bodies = [];
    let _centerX = 405;
    let _centerY = 405;

    // 内环环形轨道
    let innerCircleCoordinates = this.getCircleCoordinates(328, 9);
    let exCircleCoordinates = this.getCircleCoordinates(340, 9);
    let concaveCoordinates = this.getConcaveSurfaceCoordinates(innerCircleCoordinates, exCircleCoordinates, [26, 34]);

    concaveCoordinates.map((item) => {
      let concave = Bodies.fromVertices(_centerX + item[0].x, _centerY + item[0].y, item, {
        isStatic: true,
        isSleeping: true,
        angle: -0.08,
        render: {
          visible: false
        }
      });

      _bodies.push(concave);
    });

    // 外环环形轨道
    let innerCircleCoordinates2 = this.getCircleCoordinates(370, 9);
    let exCircleCoordinates2 = this.getCircleCoordinates(385, 9);
    let concaveCoordinates2 = this.getConcaveSurfaceCoordinates(innerCircleCoordinates2, exCircleCoordinates2);

    concaveCoordinates2.map((item) => {
      let concave = Bodies.fromVertices(_centerX + item[0].x, _centerY + item[0].y, item, {
        isStatic: true,
        isSleeping: true,
        angle: -0.08,
        render: {
          visible: false
        }
      });

      _bodies.push(concave);
    });

    // 部分轨道
    let pathwayPartCoordinates = [
      [{
        x: 216,
        y: 127
      }, {
        x: 224,
        y: 137
      }, {
        x: 196,
        y: 160
      }, {
        x: 187,
        y: 150
      }],
      [{
        x: 616,
        y: 109
      }, {
        x: 630,
        y: 120
      }, {
        x: 615,
        y: 164
      }, {
        x: 602,
        y: 154
      }]
    ];

    pathwayPartCoordinates.map((item) => {
      // 获取刚体中心坐标
      let _center = Vertices.centre(item);

      let part = Bodies.fromVertices(_center.x, _center.y, item, {
        isStatic: true,
        isSleeping: true,
        render: {
          visible: false
        }
      });

      _bodies.push(part);
    });

    World.add(this.world, _bodies);
  }

  // 创建钢柱
  createPilingBar() {
    const _arr = [{
      x: 321,
      y: 92
    }, {
      x: 360,
      y: 92
    }, {
      x: 398,
      y: 92
    }, {
      x: 434,
      y: 92
    }, {
      x: 473,
      y: 92
    }, {
      x: 398,
      y: 104
    }, {
      x: 285,
      y: 126
    }, {
      x: 274,
      y: 133
    }, {
      x: 264,
      y: 141
    }, {
      x: 256,
      y: 151
    }, {
      x: 247,
      y: 160
    }, {
      x: 337,
      y: 129
    }, {
      x: 327,
      y: 135
    }, {
      x: 317,
      y: 144
    }, {
      x: 309,
      y: 154
    }, {
      x: 301,
      y: 164
    }, {
      x: 294,
      y: 174
    }, {
      x: 373,
      y: 132
    }, {
      x: 373,
      y: 145
    }, {
      x: 363,
      y: 154
    }, {
      x: 354,
      y: 163
    }, {
      x: 346,
      y: 174
    }, {
      x: 422,
      y: 132
    }, {
      x: 422,
      y: 145
    }, {
      x: 431,
      y: 154
    }, {
      x: 440,
      y: 163
    }, {
      x: 448,
      y: 174
    }, {
      x: 457,
      y: 129
    }, {
      x: 467,
      y: 135
    }, {
      x: 477,
      y: 144
    }, {
      x: 486,
      y: 154
    }, {
      x: 493,
      y: 164
    }, {
      x: 500,
      y: 174
    }, {
      x: 509,
      y: 126
    }, {
      x: 520,
      y: 133
    }, {
      x: 530,
      y: 141
    }, {
      x: 538,
      y: 151
    }, {
      x: 547,
      y: 160
    }, {
      x: 205,
      y: 180
    }, {
      x: 178,
      y: 216
    }, {
      x: 208,
      y: 237
    }, {
      x: 234,
      y: 207
    }, {
      x: 242,
      y: 215
    }, {
      x: 278,
      y: 232
    }, {
      x: 315,
      y: 204
    }, {
      x: 324,
      y: 214
    }, {
      x: 399,
      y: 236
    }, {
      x: 471,
      y: 214
    }, {
      x: 480,
      y: 204
    }, {
      x: 516,
      y: 232
    }, {
      x: 553,
      y: 215
    }, {
      x: 561,
      y: 207
    }, {
      x: 587,
      y: 237
    }, {
      x: 617,
      y: 216
    }, {
      x: 589,
      y: 180
    }, {
      x: 119,
      y: 251
    }, {
      x: 124,
      y: 262
    }, {
      x: 130,
      y: 271
    }, {
      x: 111,
      y: 326
    }, {
      x: 171,
      y: 278
    }, {
      x: 181,
      y: 320
    }, {
      x: 213,
      y: 294
    }, {
      x: 247,
      y: 265
    }, {
      x: 547,
      y: 265
    }, {
      x: 581,
      y: 294
    }, {
      x: 613,
      y: 320
    }, {
      x: 623,
      y: 278
    }, {
      x: 683,
      y: 326
    }, {
      x: 665,
      y: 271
    }, {
      x: 670,
      y: 262
    }, {
      x: 676,
      y: 251
    }, {
      x: 81,
      y: 375
    }, {
      x: 86,
      y: 386
    }, {
      x: 93,
      y: 398
    }, {
      x: 99,
      y: 407
    }, {
      x: 132,
      y: 363
    }, {
      x: 132,
      y: 376
    }, {
      x: 167,
      y: 365
    }, {
      x: 167,
      y: 378
    }, {
      x: 204,
      y: 350
    }, {
      x: 211,
      y: 361
    }, {
      x: 219,
      y: 370
    }, {
      x: 252,
      y: 342
    }, {
      x: 542,
      y: 342
    }, {
      x: 575,
      y: 370
    }, {
      x: 583,
      y: 361
    }, {
      x: 591,
      y: 350
    }, {
      x: 627,
      y: 378
    }, {
      x: 627,
      y: 365
    }, {
      x: 662,
      y: 376
    }, {
      x: 662,
      y: 363
    }, {
      x: 696,
      y: 407
    }, {
      x: 702,
      y: 398
    }, {
      x: 708,
      y: 386
    }, {
      x: 714,
      y: 375
    }, {
      x: 113,
      y: 459
    }, {
      x: 137,
      y: 429
    }, {
      x: 162,
      y: 457
    }, {
      x: 186,
      y: 416
    }, {
      x: 193,
      y: 426
    }, {
      x: 232,
      y: 410
    }, {
      x: 240,
      y: 419
    }, {
      x: 243,
      y: 467
    }, {
      x: 251,
      y: 476
    }, {
      x: 258,
      y: 485
    }, {
      x: 289,
      y: 444
    }, {
      x: 296,
      y: 452
    }, {
      x: 303,
      y: 461
    }, {
      x: 309,
      y: 470
    }, {
      x: 364,
      y: 446
    }, {
      x: 373,
      y: 440
    }, {
      x: 399,
      y: 470
    }, {
      x: 399,
      y: 484
    }, {
      x: 422,
      y: 440
    }, {
      x: 431,
      y: 446
    }, {
      x: 485,
      y: 470
    }, {
      x: 491,
      y: 461
    }, {
      x: 498,
      y: 452
    }, {
      x: 505,
      y: 444
    }, {
      x: 554,
      y: 419
    }, {
      x: 562,
      y: 410
    }, {
      x: 601,
      y: 426
    }, {
      x: 608,
      y: 416
    }, {
      x: 633,
      y: 457
    }, {
      x: 658,
      y: 429
    }, {
      x: 682,
      y: 459
    }, {
      x: 537,
      y: 485
    }, {
      x: 543,
      y: 476
    }, {
      x: 551,
      y: 467
    }, {
      x: 142,
      y: 488
    }, {
      x: 142,
      y: 499
    }, {
      x: 180,
      y: 488
    }, {
      x: 180,
      y: 499
    }, {
      x: 226,
      y: 526
    }, {
      x: 206,
      y: 557
    }, {
      x: 206,
      y: 568
    }, {
      x: 244,
      y: 557
    }, {
      x: 244,
      y: 568
    }, {
      x: 278,
      y: 539
    }, {
      x: 283,
      y: 550
    }, {
      x: 285,
      y: 562
    }, {
      x: 315,
      y: 585
    }, {
      x: 322,
      y: 537
    }, {
      x: 329,
      y: 547
    }, {
      x: 344,
      y: 498
    }, {
      x: 352,
      y: 489
    }, {
      x: 367,
      y: 525
    }, {
      x: 399,
      y: 539
    }, {
      x: 429,
      y: 525
    }, {
      x: 443,
      y: 489
    }, {
      x: 451,
      y: 498
    }, {
      x: 466,
      y: 547
    }, {
      x: 473,
      y: 537
    }, {
      x: 480,
      y: 585
    }, {
      x: 510,
      y: 562
    }, {
      x: 512,
      y: 550
    }, {
      x: 517,
      y: 539
    }, {
      x: 569,
      y: 526
    }, {
      x: 551,
      y: 557
    }, {
      x: 551,
      y: 568
    }, {
      x: 588,
      y: 557
    }, {
      x: 588,
      y: 568
    }, {
      x: 615,
      y: 488
    }, {
      x: 615,
      y: 499
    }, {
      x: 652,
      y: 488
    }, {
      x: 652,
      y: 499
    }, {
      x: 296,
      y: 617
    }, {
      x: 296,
      y: 628
    }, {
      x: 334,
      y: 617
    }, {
      x: 334,
      y: 628
    }, {
      x: 461,
      y: 617
    }, {
      x: 461,
      y: 628
    }, {
      x: 498,
      y: 617
    }, {
      x: 498,
      y: 628
    }];

    let _bodies = [];

    _arr.map((obj) => {
      let _circle = Bodies.circle(obj.x + 6, obj.y + 6, 6, {
        isStatic: true,
        isSleeping: true,
        render: {
          sprite: {
            texture: webgm.framesIcon.getTexture('icon_pilingbar.png'),
            xOffset: 6,
            yOffset: 6,
          }
        }
      });

      _bodies.push(_circle);
    });

    World.add(this.world, _bodies);
  }

  // 创建奖洞
  createHole() {
    let _bodies = [];
    /**
     * label 名称
     * position 位置
     * width 宽
     * height 高
     * times 奖洞倍数
     * isOpen 奖洞是否开启
     * texture 纹理名称
     * textureOffset 纹理偏移量
     **/
    let _arr = [{
      label: 'hole',
      position: {
        x: 385,
        y: 704
      },
      width: 40,
      height: 30,
      times: 0,
      isOpen: true,
      texture: ['hole.png'],
      textureOffset: {
        x: 69,
        y: 21
      }
    }, {
      label: 'hole',
      position: {
        x: 151,
        y: 511
      },
      width: 35,
      height: 7,
      times: 2,
      isOpen: true,
      texture: ['hole_2.png', 'hole_2_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 214,
        y: 580
      },
      width: 35,
      height: 7,
      times: 4,
      isOpen: true,
      texture: ['hole_4.png', 'hole_4_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 305,
        y: 640
      },
      width: 35,
      height: 7,
      times: 6,
      isOpen: true,
      texture: ['hole_6.png', 'hole_6_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 623,
        y: 511
      },
      width: 35,
      height: 7,
      times: 8,
      isOpen: true,
      texture: ['hole_8.png', 'hole_8_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 560,
        y: 580
      },
      width: 35,
      height: 7,
      times: 10,
      isOpen: true,
      texture: ['hole_10.png', 'hole_10_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 469,
        y: 640
      },
      width: 35,
      height: 7,
      times: 12,
      isOpen: true,
      texture: ['hole_12.png', 'hole_12_highlight.png'],
      textureOffset: {
        x: 26,
        y: 4
      }
    }, {
      label: 'hole',
      position: {
        x: 388,
        y: 612
      },
      width: 35,
      height: 7,
      times: 20,
      isOpen: false,
      texture: ['hole_20.png', 'hole_20_highlight.png'],
      textureOffset: {
        x: 51,
        y: 15
      }
    }];

    _arr.map((obj) => {
      let _texture = [];

      obj.texture.map((item) => {
        _texture.push(this.framesSprite.getTexture(item));
      });

      let _hole = Bodies.rectangle(obj.position.x + obj.width / 2, obj.position.y + obj.height / 2, obj.width, obj.height, {
        isStatic: true,
        isSensor: true,
        isSleeping: true,
        label: obj.label,
        render: {
          sprite: {
            texture: _texture[0],
            xOffset: obj.textureOffset.x,
            yOffset: obj.textureOffset.y,
          }
        },
        times: obj.times,
        isOpen: obj.isOpen,
        texture: _texture,
        textureOffset: obj.textureOffset
      });

      _bodies.push(_hole);
    });

    World.add(this.world, _bodies);

    // 当钢珠碰到洞口时, 60ms后从引擎中移除钢珠
    Events.on(this.engine, 'collisionStart', function(evt) {
      let _pairs = evt.pairs;

      _pairs.map((obj) => {
        let _hole = null;
        let _ball = null;

        // 判断是否小球和洞碰撞
        if (obj.bodyA.label === 'hole') {
          _hole = obj.bodyA;
          _ball = obj.bodyB;
        } else if (obj.bodyB.label === 'hole') {
          _hole = obj.bodyB;
          _ball = obj.bodyA;
        }

        if (_hole !== null && _ball !== null && _hole.isOpen) {
          // 非大奖洞钢球进洞效果
          if (_hole.texture.length > 1) {
            switch (_hole.times) {
              case 20:
                break;
              default:
                let _sprite = _hole.layaSprite;

                _sprite.graphics.clear();
                _sprite.graphics.drawTexture(_hole.texture[1]);

                Laya.timer.once(200, this, () => {
                  _sprite.graphics.clear();
                  _sprite.graphics.drawTexture(_hole.texture[0]);
                });
                break;
            }
          }

          Laya.timer.once(60, this, () => {
            World.remove(this.world, _ball);
          });
        }
      });
    });
  }

  // 创建装饰品
  createDecoration() {
    let _bodies = [];
    let _arr = [{
      label: 'arrow_top',
      position: {
        x: 373,
        y: 181
      },
      width: 64,
      height: 28,
      texture: ['arrow_top.png', 'arrow_top_highlight.png'],
      textureOffset: {
        x: 32,
        y: 14
      },
      timer: null
    }, {
      label: 'arrow_bottom',
      position: {
        x: 370,
        y: 208
      },
      width: 70,
      height: 25,
      texture: ['arrow_bottom.png', 'arrow_bottom_highlight.png'],
      textureOffset: {
        x: 35,
        y: 13
      },
      timer: null
    }];

    _arr.map((obj) => {
      let _texture = [];

      obj.texture.map((item) => {
        _texture.push(this.framesSprite.getTexture(item));
      });

      let _decoration = Bodies.trapezoid(obj.position.x + obj.width / 2, obj.position.y + obj.height / 2, obj.width, obj.height, 0.2, {
        label: obj.label,
        isStatic: true,
        isSensor: true,
        isSleeping: true,
        render: {
          sprite: {
            texture: _texture[0],
            xOffset: obj.textureOffset.x,
            yOffset: obj.textureOffset.y,
          }
        },
        texture: _texture,
        textureOffset: obj.textureOffset
      });

      _bodies.push(_decoration);
    });

    World.add(this.world, _bodies);

    let _stage = this.stage;

    /*
     * 当钢珠碰经过箭头时, 箭头高亮, 200ms还原
     * 如果在200ms内再有钢珠经过, 则移除定时器, 重新定时
     */
    Events.on(this.engine, 'collisionStart', function(evt) {
      let _pairs = evt.pairs;

      _pairs.map((obj) => {
        let _decoration = null;
        let _ball = null;

        // 判断是否小球和箭头碰撞
        if ((obj.bodyA.label).indexOf('arrow') !== -1) {
          _decoration = obj.bodyA;
          _ball = obj.bodyB;
        } else if ((obj.bodyB.label).indexOf('arrow') !== -1) {
          _decoration = obj.bodyB;
          _ball = obj.bodyA;
        }

        if (_decoration !== null && _ball !== null) {
          if (_decoration.texture.length > 1) {
            clearTimeout(_decoration.timer);

            let _sprite = _decoration.layaSprite;

            _sprite.graphics.clear();
            _sprite.graphics.drawTexture(_decoration.texture[1]);

            _decoration.timer = setTimeout(() => {
              _sprite.graphics.clear();
              _sprite.graphics.drawTexture(_decoration.texture[0]);
            }, 200);

            // 开始倒计时
            if (_decoration.label === 'arrow_top') {
              _stage.event(Event.START_COUNT_DOWN);
            }
          }
        }
      });
    });
  }

  /**
   * 发射钢球
   * @param (number) power 力道
   **/
  launchBall(power) {
    const _forceX = -12.5 - power / 10;
    const _forceY = Matter.Common.random(0.01, 0.03);

    // 创建钢球
    let _circle = Bodies.circle(405, 760, 8, {
      label: 'ball',
      density: 0.785, // 密度
      restitution: 0.3, // 弹性
      isSleeping: true,
      render: {
        sprite: {
          texture: webgm.framesIcon.getTexture('icon_ball_red.png'),
          xOffset: 8,
          yOffset: 8,
        }
      },
      // 钢球之间互相不发生碰撞
      collisionFilter: {
        group: -1
      }
    });

    // 给钢球施加X轴力和Y轴力
    Body.applyForce(_circle, _circle.position, {
      x: _forceX,
      y: _forceY
    });

    // 添加钢球到物理世界
    World.add(this.world, _circle);

    // 增加钢珠消耗数量
    this.stage.event(Event.ADD_BALL_NUM);

    console.log(_forceX, _forceY);
  }

  /**
   * 开关大奖洞
   * @param (boolean) isOpen 奖洞是否开启 
   **/
  switchBigHole(isOpen) {
    this.world.bodies.map((obj) => {
      if (obj.label === 'hole' && typeof obj.times === 'number' && obj.times === 20) {
        let _sprite = obj.layaSprite;

        _sprite.graphics.clear();

        if (isOpen) {
          obj.isOpen = true;
          _sprite.graphics.drawTexture(obj.texture[1]);
        } else {
          obj.isOpen = false;
          _sprite.graphics.drawTexture(obj.texture[0]);
        }
      }
    });
  }

  /**
   * 通过圆参数方程获取圆坐标
   * @param (number) radius 半径
   * @param (number) angle 角度
   **/
  getCircleCoordinates(radius, angle) {
    let _arr = [];
    // 弧度
    let _radian = 0;

    const _nums = 360 / angle;

    for (let i = 0; i < _nums; i++) {
      _radian = (2 * Math.PI / 360) * angle * i;

      _arr.push({
        x: Math.cos(_radian) * radius,
        y: Math.sin(_radian) * radius
      });
    }

    return _arr;
  }

  /**
   * 通过两个同心圆坐标获取凹面刚体顶点坐标
   * 两个同心圆构成圆环, 圆环分解成多个刚体
   * 一个刚体由4个顶点构成, 2个内圆相邻坐标, 2个外圆相邻坐标
   * @param (array) innerCircleCoordinates 内圆坐标数组
   * @param (array) exCircleCoordinates 外圆坐标数组
   * @param (array) emptyRegionn 空区域索引值
   **/
  getConcaveSurfaceCoordinates(innerCircleCoordinates, exCircleCoordinates, emptyRegionn) {
    let _arr = [];

    const ex_arr = exCircleCoordinates;
    const in_arr = innerCircleCoordinates;
    const _empty = Array.isArray(emptyRegionn) ? emptyRegionn : [-1, -1];

    in_arr.map((obj, index, arr) => {
      if (index < _empty[0] || index > _empty[1]) {
        if (index < arr.length - 1) {
          _arr.push([obj, ex_arr[index], ex_arr[index + 1], arr[index + 1]]);
        } else {
          _arr.push([obj, ex_arr[index], ex_arr[0], arr[0]]);
        }
      }
    });

    return _arr;
  }
}

/* 组件 - 头部 */
class RoomHeader extends Component {
  constructor() {
    super();

    // 初始化
    this.init();
  }

  // 初始化
  init() {
    this.source = webgm.framesBg.getTexture('bg_header.png');
    this.width = this.stage.width;
    this.height = this.source.height;
    this.top = 14;
    this.centerX = 0;

    let bg = new Images();
    bg.source = webgm.framesBg.getTexture('bg_header.png');
    bg.sizeGrid = '39, 20, 39, 20, 1';
    bg.width = this.width;
    bg.height = this.height;
    this.addChild(bg);

    let btnBg = new Box();
    btnBg.source = webgm.framesBg.getTexture('bg_header_btn.png');
    btnBg.width = this.width;
    btnBg.height = this.height;
    btnBg.graphics.drawTexture(btnBg.source, btnBg.width / 2 - 250 - btnBg.source.width, -10, btnBg.source.width, btnBg.source.height);
    btnBg.graphics.drawTexture(btnBg.source, btnBg.width / 2 - 130 - btnBg.source.width, -10, btnBg.source.width, btnBg.source.height);

    // 右边两个按钮背景翻转
    let matrix = new Matrix();
    // 缩放或旋转图像时影响像素沿 x 轴定位的值
    matrix.a = -1;
    // 沿 x 轴平移每个点的距离
    matrix.tx = btnBg.source.width;

    btnBg.graphics.drawTexture(btnBg.source, -(btnBg.width / 2 + 130), -10, btnBg.source.width, btnBg.source.height, matrix);
    btnBg.graphics.drawTexture(btnBg.source, -(btnBg.width / 2 + 250), -10, btnBg.source.width, btnBg.source.height, matrix);
    this.addChild(btnBg);

    // 按钮
    let btns = [{
      name: '返回',
      img: 'icon_back.png',
      centerX: -270,
      handler: this.handlerBack,
    }, {
      name: '排行榜',
      img: 'icon_rank.png',
      centerX: -150,
      handler: this.handlerRank,
    }, {
      name: '首页',
      img: 'icon_home.png',
      centerX: 150,
      handler: this.handlerHome,
    }, {
      name: '设置',
      img: 'icon_config.png',
      centerX: 270,
      handler: this.handlerConfig,
    }];

    btns.map((obj) => {
      let btn = new Box();
      btn.source = webgm.framesIcon.getTexture(obj.img);
      btn.width = 90;
      btn.height = 90;
      btn.top = 0;
      btn.centerX = obj.centerX < 0 ? obj.centerX - btn.width / 2 : obj.centerX + btn.width / 2;
      btn.graphics.drawTexture(btn.source, (btn.width - btn.source.width) / 2, (btn.height - btn.source.height) / 2, btn.source.width, btn.source.height);
      btn.on(Event.CLICK, this, obj.handler);
      this.addChild(btn);
    });

    // 显示 - 筹码
    let amountBox = new Images();
    amountBox.source = webgm.framesBg.getTexture('bg_header_amount.png');
    amountBox.sizeGrid = '34, 30, 34, 30, 1';
    amountBox.width = 230;
    amountBox.height = amountBox.source.height;
    amountBox.centerX = 0;
    amountBox.centerY = 0;
    this.addChild(amountBox);

    let amountIcon = new Images();
    amountIcon.source = webgm.framesIcon.getTexture('icon_coin.png');
    amountIcon.left = -23;
    amountIcon.centerY = 0;
    amountBox.addChild(amountIcon);

    this.amountLabel = new Label();
    this.amountLabel.text = '1234567890';
    this.amountLabel.overflow = 'hidden';
    this.amountLabel.width = 144;
    this.amountLabel.height = 58;
    this.amountLabel.left = 60;
    this.amountLabel.color = '#fffec6';
    this.amountLabel.fontSize = 36;
    this.amountLabel.align = 'right';
    this.amountLabel.valign = 'middle';
    amountBox.addChild(this.amountLabel);
  }

  // 事件 - 返回
  handlerBack() {
    pops.takeIn = new laya.components.Popup({
      name: 'win',
      box: new win({
        task:'完成新手任务',
        account:972324
      }),
      closeBtnShow: false,
      shadeShow: false,
    })
    pops.takeIn.popShow();
    console.log('按钮 - 返回');
  }

  // 事件 - 排行榜
  handlerRank() {
    pops.commonMessage = new laya.components.Popup({
      name: 'commonMessage',
      box: new commonMessage('暂未开放此功能！！'),
      closeBtnShow: false,
      shadeShow: false,
    })
    pops.commonMessage.popShow();
    console.log('按钮 - 排行榜');
  }

  // 事件 - 首页
  handlerHome() {
    pops.tocharge = new laya.components.Popup({
      name: 'skinPOP',
      box: new toChargePOP(),
      closeBtnShow: false,
      shadeShow: false,
    })
    pops.tocharge.popShow();
    console.log('按钮 - 首页');
  }

  // 事件 - 设置
  handlerConfig() {
    pops.settings = new settingsPOP();
    Laya.stage.addChild(pops.settings);
    console.log('按钮 - 设置');
  }

  /**
   * 设置筹码数量
   * @param (number) amount 筹码数量
   **/
  setAmount(amount) {
    this.amountLabel = '' + amount;
  }
}

/* 组件 - 刚珠消耗 */
class RoomBallNums extends Component {
  constructor() {
    super();

    // 钢珠数量
    this.num = 0;

    // 初始化
    this.init();

    // 初始化自定义事件
    this.initCustomEvent();
  }

  // 初始化
  init() {
    this.source = webgm.framesBg.getTexture('bg_ball_nums.png');
    this.width = this.source.width;
    this.height = this.source.height;
    this.graphics.drawTexture(this.source, 0, 0, this.width, this.height);

    // 刚珠消耗数量
    this.numsLabel = new Label();
    this.numsLabel.text = '' + this.num;
    this.numsLabel.overflow = 'hidden';
    this.numsLabel.width = 68;
    this.numsLabel.height = 36;
    this.numsLabel.right = 16;
    this.numsLabel.top = 12;
    this.numsLabel.color = '#fffc00';
    this.numsLabel.fontSize = 30;
    this.numsLabel.align = 'right';
    this.numsLabel.valign = 'middle';
    this.addChild(this.numsLabel);
  }

  // 初始化自定义事件
  initCustomEvent() {
    Event.ADD_BALL_NUM = 'ADD_BALL_NUM';
    Event.RESET_BALL_NUM = 'RESET_BALL_NUM';
    Event.SET_BALL_NUM = 'SET_BALL_NUM';

    // 增加钢珠消耗数量
    this.stage.on(Event.ADD_BALL_NUM, this, this.addNum);

    // 重置钢珠消耗数量
    this.stage.on(Event.RESET_BALL_NUM, this, this.resetNum);

    // 设置钢珠消耗数量
    this.stage.on(Event.SET_BALL_NUM, this, this.setNum);
  }

  // 增加钢珠消耗数量
  addNum() {
    this.num += 1;

    this.setNum();
  }

  // 重置钢珠消耗数量
  resetNum() {
    this.num = 0;

    this.setNum();
  }

  /**
   * 设置钢珠消耗数量
   * @param (number) num 弹珠码数量
   **/
  setNum(num) {
    let _num = num || this.num;

    if (typeof _num !== 'number' && _num < 0) {
      return;
    }

    if (_num > 9999) {
      _num = 9999;
    }

    this.num = _num;

    this.numsLabel.text = '' + this.num;
  }
}

/* 组件 - 倒计时 */
class RoomCountDown extends Component {
  /**
   * constructor
   * @param (object) params 配置
   * framesSprite (function) 雪碧图纹理
   * time (numer) 倒计时时间
   * callback (function) 回调函数
   **/
  constructor(params) {
    super();

    if (!(typeof params === 'object' && typeof params.framesSprite === 'object')) {
      return;
    }

    let _defaults = {
      framesSprite: null,
      time: 15,
      callback: null,
    };

    let _params = params || {};

    _params = Object.assign(_defaults, _params);

    this.params = _params;

    // 数字
    this.num = 0;
    // 时间间隔 
    this.interval = 1000;

    // 初始化
    this.init();

    // 初始化自定义事件
    this.initCustomEvent();
  }

  // 初始化
  init() {
    this.source = this.params.framesSprite.getTexture('bg_countdown.png');
    this.width = this.source.width;
    this.height = this.source.height;
    this.graphics.drawTexture(this.source, 0, 0, this.width, this.height);

    // 显示 - 时间
    this.nums = new Box();
    this.nums.width = this.width;
    this.nums.height = this.height;
    this.renderNums();
    this.addChild(this.nums);
  }

  // 初始化自定义事件
  initCustomEvent() {
    Event.START_COUNT_DOWN = 'START_COUNT_DOWN';
    Event.STOP_COUNT_DOWN = 'STOP_COUNT_DOWN';
    Event.RESET_COUNT_DOWN = 'RESET_COUNT_DOWN';

    // 开始倒计时
    this.stage.on(Event.START_COUNT_DOWN, this, this.start);

    // 停止倒计时
    this.stage.on(Event.STOP_COUNT_DOWN, this, this.stop);

    // 重置倒计时
    this.stage.on(Event.RESET_COUNT_DOWN, this, this.reset);
  }

  // 渲染时间
  renderNums() {
    // 两2个数字间距
    let _space = 2;
    let _num = this.num;
    let tens_img = null;
    let digits_img = null;
    let tens_texture = null;
    let digits_texture = null;

    if (_num < 10) {
      _num = ('0' + _num);
    } else {
      _num = '' + _num;
    }

    _num = _num.split('');

    if (this.num < 10) {
      tens_img = 'num_blue_' + _num[0] + '.png';
    } else {
      tens_img = 'num_yellow_' + _num[0] + '.png';
    }

    if (this.num === 0) {
      digits_img = 'num_blue_' + _num[1] + '.png';
    } else {
      digits_img = 'num_yellow_' + _num[1] + '.png';
    }

    tens_texture = this.params.framesSprite.getTexture(tens_img);
    digits_texture = this.params.framesSprite.getTexture(digits_img);

    this.nums.graphics.clear();
    this.nums.graphics.drawTexture(tens_texture, this.nums.width / 2 - tens_texture.width - _space, (this.nums.height - tens_texture.height) / 2, tens_texture.width, tens_texture.height);
    this.nums.graphics.drawTexture(digits_texture, this.nums.width / 2 + _space, (this.nums.height - digits_texture.height) / 2, digits_texture.width, digits_texture.height);
  }

  // 开始倒计时
  start() {
    // 移除之前倒计时, 重新倒计时
    Laya.timer.clear(this, this._countDown);

    this.num = this.params.time;

    // 渲染时间
    this.renderNums();

    Laya.timer.loop(this.interval, this, this._countDown);

    if (typeof this.params.callback === 'function') {
      this.params.callback(true);
    }
  }

  // 停止倒计时
  stop() {
    Laya.timer.clear(this, this._countDown);

    if (typeof this.params.callback === 'function') {
      this.params.callback(false);
    }
  }

  // 重置倒计时
  reset() {
    this.num = 0;

    // 渲染时间
    this.renderNums();
  }

  // 倒计时
  _countDown() {
    this.num--;

    // 渲染时间
    this.renderNums();

    if (this.num === 0) {
      this.stop();
    }
  }
}

/* 组件 - 发射力道 */
class RoomPower extends Component {
  /**
   * constructor
   * @param (object) params 配置
   * framesSprite (function) 雪碧图纹理
   * handlerLeft (number) 把手水平距离
   * handlerTop (number) 把手垂直距离
   * handlerPivotX (number) 把手X轴心点
   * handlerPivotY (number) 把手Y轴心点
   * handlerAngle (number) 把手起始角度
   * powerLeft (number) 力道水平距离
   * powerTop (number) 力道垂直距离
   * callback (function) 回调函数
   **/
  constructor(params) {
    super();

    if (!(typeof params === 'object' && typeof params.framesSprite === 'object')) {
      return;
    }

    let _defaults = {
      framesSprite: null,
      handlerLeft: 0,
      handlerTop: 0,
      handlerPivotX: 0,
      handlerPivotY: 0,
      handlerAngle: 0,
      powerLeft: 0,
      powerTop: 0,
      callback: null,
    };

    let _params = params || {};

    _params = Object.assign(_defaults, _params);

    this.params = _params;

    // Y轴开始位置
    this.startY = 0;
    // Y轴结束位置
    this.endY = 0;
    // 最小旋转角度
    this.minAngle = this.params.handlerAngle;
    // 最大旋转角度
    this.maxAngle = this.params.handlerAngle + 100;
    // 力道值
    this.power = 0;
    // 是否处于移动状态
    this.isMove = false;
    // 是否可以抬起
    this.isMouseUp = false;
    // 是否自动发射
    this.isAuto = false;
    // 是否处于自动发射状态
    this.isAutoing = false;
    // 自动发射时间间隔
    this.launchInterval = 600;
    // 点击时间间隔
    this.mouseUpInterval = 600;

    // 初始化
    this.init();

    // 初始化自定义事件
    this.initCustomEvent();
  }

  // 初始化
  init() {
    this.width = 70;
    this.height = 70;

    // 把手
    this.handler = new Images();
    this.handler.source = this.params.framesSprite.getTexture('handle.png');
    this.handler.width = this.handler.source.width;
    this.handler.height = this.handler.source.height;
    this.handler.left = this.params.handlerLeft;
    this.handler.top = this.params.handlerTop;
    this.handler.rotation = this.params.handlerAngle;
    this.handler.pivot(this.params.handlerPivotX, this.params.handlerPivotY);
    this.addChild(this.handler);

    // 把手触发区域
    this.handlerArea = new Box();
    this.handlerArea.width = 90;
    this.handlerArea.height = 90;
    this.handlerArea.right = 0;
    this.handlerArea.top = 0;
    this.handler.addChild(this.handlerArea);

    this.stage.on(Event.MOUSE_DOWN, this, this.mouseDownHandler);
    this.stage.on(Event.MOUSE_MOVE, this, this.mouseMoveHandler);
    this.stage.on(Event.MOUSE_UP, this, this.mouseUpHandler);

    // 力道
    this.powerLabel = new Label();
    this.powerLabel.source = this.params.framesSprite.getTexture('bg_power.png');
    this.powerLabel.text = '' + this.power;
    this.powerLabel.overflow = 'hidden';
    this.powerLabel.width = this.powerLabel.source.width;
    this.powerLabel.height = this.powerLabel.source.height;
    this.powerLabel.left = this.params.powerLeft;
    this.powerLabel.top = this.params.powerTop;
    this.powerLabel.padding = '0, 15, 0, 15';
    this.powerLabel.color = '#fca904';
    this.powerLabel.bold = true;
    this.powerLabel.fontSize = 30;
    this.powerLabel.align = 'right';
    this.powerLabel.valign = 'middle';
    this.powerLabel.graphics.drawTexture(this.powerLabel.source, 0, 0, this.powerLabel.width, this.powerLabel.height);
    this.addChild(this.powerLabel);
  }

  // 初始化自定义事件
  initCustomEvent() {
    Event.SET_AUTO_LAUNCH = 'SET_AUTO_LAUNCH';

    // 设置自动发射
    this.stage.on(Event.SET_AUTO_LAUNCH, this, this.setAutoLaunch);
  }

  // 事件 - 按下
  mouseDownHandler(evt) {
    evt.stopPropagation();

    if (this.isMouseUp) {
      return;
    }

    if (!this.handlerArea.hitTestPoint(this.stage.mouseX, this.stage.mouseY)) {
      return;
    }

    this.isMove = true;
    this.startY = this.stage.mouseY;

    // 如果处于自动发射状态中, 先原有移除自动发射, 再以最新力道自动发射 
    if (this.isAutoing) {
      this.isAutoing = false;

      Laya.timer.clear(this, this.autoLaunch);
    }
  }

  // 事件 - 移动
  mouseMoveHandler(evt) {
    evt.stopPropagation();

    if (!this.isMove) {
      return;
    }

    this.endY = this.stage.mouseY;

    let offsetY = this.endY - this.startY;

    // 设置把手旋转角度
    this.setHandlerAngle(this.handler.rotation + Math.floor(offsetY / 2));

    this.startY = this.endY;
  }

  // 事件 - 抬起
  mouseUpHandler(evt) {
    if (this.isMouseUp) {
      return;
    }

    if (!this.isMove) {
      return;
    }

    this.isMouseUp = true;
    this.isMove = false;

    if (!this.isAuto) { // 手动模式
      if (typeof this.params.callback === 'function' && this.power > 0) {
        this.params.callback(this.power);
      }

      // 设置把手旋转角度
      this.setHandlerAngle(this.minAngle);
    } else { // 自动模式
      if (!this.isAutoing) {
        this.isAutoing = true;

        this.autoLaunch();

        // 自动发射
        Laya.timer.loop(this.launchInterval, this, this.autoLaunch);
      }
    }

    // 恢复点击
    Laya.timer.once(this.mouseUpInterval, this, () => {
      this.isMouseUp = false;
    });
  }

  /**
   * 设置把手旋转角度
   * @param (number) angle 旋转角度
   **/
  setHandlerAngle(angle) {
    let _angle = angle;

    if (_angle < this.minAngle) {
      _angle = this.minAngle;
    }

    if (_angle > this.maxAngle) {
      _angle = this.maxAngle;
    }

    this.handler.rotation = _angle;

    this.power = _angle - this.minAngle;

    // 设置把手力道值
    this.setPowerNum(this.power);
  }

  /**
   * 设置把手力道值
   * @param (number) power 力道值
   **/
  setPowerNum(power) {
    this.powerLabel.text = '' + power;
  }

  /**
   * 设置自动发射
   * @param (boolean) isAuto 是否自动发射
   **/
  setAutoLaunch(isAuto) {
    this.isAuto = isAuto || false;
  }

  // 自动发射
  autoLaunch() {
    if (this.isAuto) {
      if (typeof this.params.callback === 'function' && this.power > 0) {
        this.params.callback(this.power);
      }
    } else {
      this.isAutoing = false;

      Laya.timer.clear(this, this.autoLaunch);

      // 设置把手旋转角度
      this.setHandlerAngle(this.minAngle);
    }

  }
}