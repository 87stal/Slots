(function () {
    var RESOURCES_PLIST_PATH = "res/icons.plist";

    var MainScene = cc.Scene.extend({
        onEnter: function () {
            this._super();
            let layerPopup = new PopupLayer.extend();
            layerPopup.init();
            this.addChild( layerPopup, 5 );

            //make a clipping node less than game canvas by 200px, see index.html for gameCanvas size
            CLIPPING_RECTANGLE =
                [cc.p(200, 160), cc.p(200, 700),
                    cc.p(1024, 700), cc.p(1024, 160)];
            FIELD_BET =
                [cc.p(605, 80), cc.p(605, 140),
                    cc.p(665, 140), cc.p(665, 80)];
            //see icons.plist for details
            TEXTURES_NAMES = ["CC", "DD", "EE", "WC_X2", "AA", "BB"];
            GENERAL_TEXTURE_PATH = "icons/";
            HERO_ADD_POSITION = cc.p(300, 750);

            HEROES_POSITIONS = [340, 620, 890];

            START_Y = 261;
            GENERAL_MOVING_DURATION = 4;
            MOVING_DURATION = 1;
            ELEMENT_HEIGHT = 180;
            BTN_SOUND = "res/btns.mp3";
            BTN_POSITION = cc.p(870, 110);
            BTN_PLUS_POSITION = cc.p(700, 110);
            TEXT_RES_POSITION = cc.p(200, 80);
            BTN_MINUS_POSITION = cc.p(570, 110);
            BET_FIELD_POSITION = cc.p(605, 80);
            sumMovingDuration = 0;

            clippingLayer = null;
            heroes = [[], [], []];
            moveButton = null;
            let line1 = [];
            let line2 = [];
            let line3 = [];
            textField = null;


            betSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
            betIndex = 0;


            this.init = function () {
                this.createClippingNode();
                this.gameLogic();
                this.createMoveButton();
                this.createBetPlusButton();
                this.createBetMinusButton();
                this.createBetField(betSteps[0]);
                this.createText("Result:", TEXT_RES_POSITION);
            }

            this.createClippingNode = function () {
                this.lineWinLayer = cc.Node.create();
                this.clippingLayer = cc.Node.create();

                var drowedClip = new cc.DrawNode();

                drowedClip.drawPoly(CLIPPING_RECTANGLE, 0, 5, cc.color.GREEN);
                drowedClip.drawSegment(cc.p(470, 160), cc.p(470, 700), 1, cc.color.GRAY);
                drowedClip.drawSegment(cc.p(760, 160), cc.p(760, 700), 1, cc.color.GRAY);
                drowedClip.drawSegment(cc.p(203, 340), cc.p(1020, 340), 1, cc.color.GRAY);
                drowedClip.drawSegment(cc.p(203, 520), cc.p(1020, 520), 1, cc.color.GRAY);

                var clippingNode = new cc.ClippingNode(drowedClip);
                clippingNode.addChild(this.lineWinLayer, 1);
                clippingNode.addChild(this.clippingLayer);
                this.addChild(clippingNode);
            };

            this.createHero = function (position, index) {
                var texturePath = this.getRandomTexturePath();
                let hero = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(texturePath));
                hero.setAnchorPoint(0.5, 0.5);
                hero.setPosition(position);
                hero['url'] = texturePath;
                this.clippingLayer.addChild(hero);
                return hero;
            };

            this.gameLogic = function () {
                for (var i = 0; i < HEROES_POSITIONS.length; i++) {
                    let elementY = START_Y;
                    for (var j = 0; j < 4; j++) {
                        let position = cc.p(HEROES_POSITIONS[i], elementY);
                        heroes[i].push({hero: this.createHero(position)});
                        elementY += ELEMENT_HEIGHT;
                    }
                }
            };

            this.createMoveButton = function () {
                this.moveButton = new ccui.Button.create("res/btn_normal.png", "res/btn_pressed.png", "res/btn_disabled.png");
                this.moveButton.addTouchEventListener(this.moveHeroes, this);
                this.moveButton.setPosition(BTN_POSITION);
                this.addChild(this.moveButton, 1, 1);
            };

            this.createBetPlusButton = function () {
                this.betPlusButton = new ccui.Button.create("res/btn_plus_normal.png", "res/btn_plus_pressed.png", "res/btn_plus_disabled.png");
                this.betPlusButton.addTouchEventListener(this.changeBet, this);
                this.betPlusButton.setPosition(BTN_PLUS_POSITION);
                this.addChild(this.betPlusButton, 2);
            };

            this.createBetMinusButton = function () {
                this.betMinusButton = new ccui.Button.create("res/btn_minus_normal.png", "res/btn_minus_pressed.png", "res/btn_minus_disabled.png");
                this.betMinusButton.addTouchEventListener(this.changeBet, this);
                this.betMinusButton.setPosition(BTN_MINUS_POSITION);
                this.addChild(this.betMinusButton, 2);
            };

            this.createBetField = function (text) {
                if (!this.textBet) {
                    this.textBet = new ccui.Text(text, "Arial", 48);
                    this.textBet.setAnchorPoint(0, 0);
                    this.textBet.setPosition(BET_FIELD_POSITION);
                    this.textBet.setColor(cc.color(0, 0, 0));
                    this.addChild(this.textBet, 2);
                    if (text == betSteps[0]) {
                        this.enableBetMinusButton(false);
                    }
                } else {
                    this.textBet.setString(text);
                }
                var drowedField = new cc.DrawNode();
                this.addChild(drowedField, 2);
                drowedField.drawPoly(FIELD_BET, 0, 2, cc.color.GREEN);
            }
            /**
             * @param {ccui.Widget} _sender
             * @param {ccui.Widget.TOUCH_BEGAN|ccui.Widget.TOUCH_MOVED|ccui.Widget.TOUCH_ENDED|ccui.Widget.TOUCH_CANCELED} _type
             *
             */
            this.changeBet = function (_sender, _type) {
                if (_type === ccui.Widget.TOUCH_ENDED) {
                    if (_sender === this.betMinusButton) {

                        if (betIndex == betSteps.length - 1) {
                            this.enableBetPlusButton(true);
                        }
                        betIndex -= 1;
                        let bet = betSteps[betIndex];
                        this.createBetField(bet);

                        if (betIndex == 0) {
                            this.enableBetMinusButton(false);
                        }
                    }

                    if (_sender === this.betPlusButton) {
                        if (betIndex == 0) {
                            this.enableBetMinusButton(true);
                        }
                        betIndex += 1;
                        if (betIndex == betSteps.length - 1) {
                            this.enableBetPlusButton(false);
                        }
                        let bet = betSteps[betIndex];
                        this.createBetField(bet);
                    }
                }

            }

            this.createText = function (text, position) {
                let defaultText = "Result: ";
                if (textField == null) {
                    this.text = new ccui.Text(text, "Arial", 48);
                    this.text.setAnchorPoint(0, 0);
                    this.text.setPosition(position);
                    this.text.setColor(cc.color(0, 0, 0));
                    this.addChild(this.text, 1);
                    textField = this.text;
                } else {
                    this.text.setString(defaultText + text);
                }
            };
            /**
             * @param {ccui.Widget} _sender
             * @param {ccui.Widget.TOUCH_BEGAN|ccui.Widget.TOUCH_MOVED|ccui.Widget.TOUCH_ENDED|ccui.Widget.TOUCH_CANCELED} _type
             */
            this.moveHeroes = function (_sender, _type) {
                if (_type === ccui.Widget.TOUCH_ENDED) {
                    this.lineWinLayer.removeAllChildren();
                    cc.audioEngine.playEffect(BTN_SOUND, false);
                    this.enableMoveButton(false);
                    this.heroesActions();
                    this.lineWinLayer.removeAllChildren();
                }
            }

            this.heroesActions = function () {
                this.createText("...");
                this.iterateOverHeroes(heroes);
            }

            this.iterateOverHeroes = function(_heroes) {
                _heroes.map((reel, idx, arr) => {
                    reel.map((element, index, array) => {
                        element.hero.runAction(cc.sequence(
                                cc.moveTo(MOVING_DURATION, cc.p(element.hero.x, element.hero.y - element.hero.height-22)),
                                cc.callFunc(function () {
                                    if (index == array.length - 1) {
                                        this.replaceElement(reel);
                                    }
                                    if (idx == arr.length - 1 && index == array.length - 1) {
                                        if(sumMovingDuration < GENERAL_MOVING_DURATION){
                                            this.iterateOverHeroes(_heroes);
                                            sumMovingDuration+=MOVING_DURATION;

                                         }else if(sumMovingDuration >= GENERAL_MOVING_DURATION) {
                                            //this.findPictureView();
                                            line1.splice(0, line1.length);
                                            line2.splice(0, line2.length);
                                            line3.splice(0, line3.length);
                                            this.removeChildrenByTag(3);
                                            this.enableMoveButton(true);
                                            sumMovingDuration=0;
                                         }
                                     }
                                }, this),
                            )
                        );
                    })
                });

            }
            this.replaceElement = function (_element) {
                _element.map((element, index, array) => {
                    if (element.hero.y < element.hero.height + element.hero.height / 2) {
                        element.hero.removeFromParent();
                        array[index].hero = this.createHero(cc.p(element.hero.x, 801));
                    }
                });
            }

            this.removeChildrenByTag = function (tag) {
                let childrenToRemove = this.getChildByTag(tag)

                if (childrenToRemove != null) {
                    this.removeChildByTag(tag);
                }
            }

            //function for finding identical pictures 
            this.findPictureView = function () {
                heroes.map((reel, idx, arr) => {
                    let counter = 0;
                    reel.map((element, index, array) => {
                        if (isElementVisible(element.hero)) {
                            cc.log('counter = ' + counter);
                            this.drawLineWin(getWinLineByIndex(counter), element);
                            counter++;
                        }
                    });
                });

                if (this.lineWinLayer.getChildrenCount() > 0) {
                    this.createText("You win");
                } else {
                    this.createText("You lose");
                }
            };

            function isElementVisible(_element) {
                if (_element.y > 160 && _element.y < 700) {
                    return true;
                }
                return false;
            }

            function getWinLineByIndex(_index) {
                if (_index == 0) {
                    return line1;
                } else if (_index == 1) {
                    return line2;
                } else if (_index == 2) {
                    return line3;
                }
            }

            //function for drawing lines
            this.drawLineWin = function (line, picture) {
                line.push(picture.hero.url);

                let samePictures = line.filter(function (elem, pos, arr) {
                    return pos !== arr.indexOf(elem) || pos !== arr.lastIndexOf(elem);
                });

                if (samePictures.length > 1) {
                    var drowedLine = new cc.DrawNode();
                    drowedLine.drawSegment(cc.p(203, picture.hero.y), cc.p(1020, picture.hero.y), 2, cc.color.RED);
                    this.lineWinLayer.addChild(drowedLine);
                }

            }

            /** @param {boolean} _enabled */
            this.enableMoveButton = function (_enabled) {
                this.moveButton.setEnabled(_enabled);
                this.moveButton.setBright(_enabled);
            };

            /** @param {boolean} _enabled */
            this.enableBetMinusButton = function (_enabled) {
                this.betMinusButton.setEnabled(_enabled);
                this.betMinusButton.setBright(_enabled);
            };

            /** @param {boolean} _enabled */
            this.enableBetPlusButton = function (_enabled) {
                this.betPlusButton.setEnabled(_enabled);
                this.betPlusButton.setBright(_enabled);
            };
            /** @returns {string} */
            this.getRandomTexturePath = function () {
                var randomName = Math.floor(Math.random() * TEXTURES_NAMES.length);
                return GENERAL_TEXTURE_PATH + TEXTURES_NAMES[randomName] + ".png";
            };
            cc.log(this.getChildByTag(1));
            this.init();
        }
    });

    window.onload = function () {
        cc.game.onStart = function () {
            //load resources
            cc.LoaderScene.preload([RESOURCES_PLIST_PATH], function () {
                cc.spriteFrameCache.addSpriteFrames(RESOURCES_PLIST_PATH);
                cc.director.runScene(new MainScene());
            }, this);
        };
        cc.game.run("gameCanvas");
    };
})();