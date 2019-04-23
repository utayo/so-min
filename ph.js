// グローバルに展開
phina.globalize();

// 定数
var ASSETS = {
  image: {
    bg: "http://jsrun.it/assets/a/G/5/Y/aG5YD.png",
    tomapiko: 'http://cdn.rawgit.com/phi-jp/phina.js/v0.2.0/assets/images/tomapiko_ss.png',
  },
};
var SCREEN_WIDTH  = 465;              // スクリーン幅
var SCREEN_HEIGHT = 465;              // スクリーン高さ
var SPEED         = 10;
var is_jump       = false;
var jump_frame    = 0;
var jump_speed    = 0;

/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',

  // 初期化
  init: function(options) {
    // super init
    this.superInit(options);

    // 背景
    this.bg = Sprite("bg").addChildTo(this);
    this.bg.origin.set(0, 0); // 左上基準に変更

    // プレイヤー
    this.player = Sprite('tomapiko', 64, 64).addChildTo(this);
    this.player.setPosition(400, 400);
    this.player.frameIndex = 0;
  },

  // 更新
  update: function(app) {
    var p = app.pointer;
    var key = app.keyboard;

    if (key.getKey('w') && !is_jump) {
      jump_speed = 30;
      is_jump = true;
    }
    if (is_jump) {
      this.player.y -= jump_speed;
      jump_speed -= 2.5;
      this.player.frameIndex = jump_frame + 1;
      jump_frame = (jump_frame + 1) % 3;

      if (this.player.y > 400) {
        this.player.y = 400;
        is_jump = false;
      }
    }

    if ((!key.getKey('a') && !key.getKey('d')) || key.getKey('a') && key.getKey('d'))  {
      // 待機
      if (!is_jump) {
        if (key.getKey('s')) this.player.frameIndex = 5;
        else this.player.frameIndex = 0;
      }
      return;
    }

    if (key.getKey('a')) {
      if (this.player.x > 32) {
        this.player.x -= SPEED;
        this.player.scaleX = 1;
      }
    }else if(app.keyboard.getKey('d')) {
      if (this.player.x < SCREEN_WIDTH - 32) {
        this.player.x += SPEED;
        this.player.scaleX = -1;
      }
    }
    if (is_jump) {
      this.player.frameIndex = jump_frame + 1;
      jump_frame = (jump_frame + 1) % 3;
      return;
    }
    // フレームアニメーション
    this.player.frameIndex = (this.player.frameIndex === 12) ? 13:12;
  }
});

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    startLabel: 'main',   // MainScene から開始
    width: SCREEN_WIDTH,  // 画面幅
    height: SCREEN_HEIGHT,// 画面高さ
    assets: ASSETS,       // アセット読み込み
  });

  app.enableStats();

  // 実行
  app.run();
});
