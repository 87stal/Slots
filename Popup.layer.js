let PopupLayer = {}
PopupLayer.extend = cc.Layer.extend({
    init: function () {
        this._super();
        let game = this;
        PopupLayer.start(this);
    }
});

PopupLayer.start = function (game) {
    let picture = new cc.Sprite("res/popup.jpg");
    let uiLayout = new ccui.Layout();
    let closeButton = null;
    /**
     * @param {ccui.Widget} _sender
     * @param {ccui.Widget.TOUCH_BEGAN|ccui.Widget.TOUCH_MOVED|ccui.Widget.TOUCH_ENDED|ccui.Widget.TOUCH_CANCELED} _type
     */
    let openPopup = function (_sender, _type) {
        if (_type === ccui.Widget.TOUCH_ENDED) {
            doOpenPopup();
        }
    }

    function doOpenPopup() {
        let size = cc.director.getWinSize();

        picture.setPosition(size.width * 0.5, size.height * 0.5);
        uiLayout.setPosition(0, 0);
        uiLayout.setContentSize(1224, 968);
        uiLayout.setBackGroundImage("res/popup.jpg", ccui.Widget.LOCAL_TEXTURE);
        uiLayout.setTouchEnabled(true);
        game.addChild(picture, 2);
        game.addChild(uiLayout);

        closeButton = new ccui.Button.create("res/btn_plus_normal.png", "res/btn_plus_pressed.png");
        closeButton.addTouchEventListener(closePopup, game);
        closeButton.setPosition(cc.p(50, 900));
        game.addChild(closeButton, 3);
    }

    let openButton = new ccui.Button.create("res/btn_plus_normal.png", "res/btn_plus_pressed.png");
    openButton.addTouchEventListener(openPopup, game);
    openButton.setPosition(cc.p(500, 110));
    game.addChild(openButton);

    /**
     * @param {ccui.Widget} _sender
     * @param {ccui.Widget.TOUCH_BEGAN|ccui.Widget.TOUCH_MOVED|ccui.Widget.TOUCH_ENDED|ccui.Widget.TOUCH_CANCELED} _type
     */
    let closePopup = function (_sender, _type) {
        if (_type === ccui.Widget.TOUCH_ENDED) {
            game.removeChild(picture);
            game.removeChild(uiLayout);
            game.removeChild(closeButton);
        }
    }
}



