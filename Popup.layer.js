let PopupLayer = {}
PopupLayer.extend = cc.Layer.extend({
    init: function () {
        this._super();
        let game = this;
        PopupLayer.start(game);
    }
});

PopupLayer.start = function (game) {
    let size = cc.director.getWinSize();
    let uiLayout = new ccui.Layout();

    let picture = new cc.Sprite("res/popup.jpg");
    picture.setPosition(size.width * 0.5, size.height * 0.5);
    uiLayout.setPosition(size.width * 0.5, size.height * 0.5);
    uiLayout.setLocalZOrder(5);
    uiLayout.setContentSize(1224, 968);
    uiLayout.setColor(0,0,0);
    uiLayout.setTouchEnabled(false);

    picture.setVisible(false);
    game.addChild(picture, 2);
    game.addChild(uiLayout);

    /**
     * @param {ccui.Widget} _sender
     * @param {ccui.Widget.TOUCH_BEGAN|ccui.Widget.TOUCH_MOVED|ccui.Widget.TOUCH_ENDED|ccui.Widget.TOUCH_CANCELED} _type
     */
    let openPopup = function (_sender, _type) {
        if (_type === ccui.Widget.TOUCH_ENDED) {
            picture.setVisible(true);
            closeButton.setVisible(true);
        }
    }
    let openButton = new ccui.Button.create("res/btn_plus_normal.png", "res/btn_plus_pressed.png");
    openButton.addTouchEventListener(openPopup, game);
    openButton.setPosition(cc.p(500, 110));
    game.addChild(openButton, 1);

    /**
     * @param {ccui.Widget} _sender
     * @param {ccui.Widget.TOUCH_BEGAN|ccui.Widget.TOUCH_MOVED|ccui.Widget.TOUCH_ENDED|ccui.Widget.TOUCH_CANCELED} _type
     */
    let closePopup = function (_sender, _type) {
        if (_type === ccui.Widget.TOUCH_ENDED) {
            picture.setVisible(false);
            closeButton.setVisible(false);
        }
    }

    let closeButton = new ccui.Button.create("res/btn_plus_normal.png", "res/btn_plus_pressed.png");
    closeButton.addTouchEventListener(closePopup, game);
    closeButton.setPosition(cc.p(50, 900));
    closeButton.setVisible(false);
    game.addChild(closeButton, 3);
}



