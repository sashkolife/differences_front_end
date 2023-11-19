import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import CContainer from "../../../components/CContainer";
import CText from "../../../components/CText";
import CSprite from "../../../components/CSprite";
import Localization from "../../../data/Localization";
import {LevelModel} from "../../../models/ApiModels";

export default class MapLevelTooltip extends CContainer {
    private _levelNumLabel: CText;
    private _picturesLabel: CText;
    private _picturesNumLabel: CText;
    private _differencesLabel: CText;
    private _differencesNumLabel: CText;

    private _scaleY:number = 1;

    private _isActive: boolean = false;

    constructor( props: any ) {
        super( props );
        this._levelNumLabel = this.getComponentByName("levelNumLabel");
        this._picturesLabel = this.getComponentByName("picturesLabel");
        this._picturesNumLabel = this.getComponentByName("picturesNumLabel");
        this._differencesLabel = this.getComponentByName("differencesLabel");
        this._differencesNumLabel = this.getComponentByName("differencesNumLabel");

        this._scaleY = this.scale.y;
    }

    public destroy(_options?: PIXI.IDestroyOptions | boolean) {
        gsap.killTweensOf(this.scale);
        super.destroy(_options);
    }

    show( levelData: LevelModel ) : void {
        if ( levelData ) {
            this._levelNumLabel.text = Localization.get("lobby_level") + " " + levelData.id;
            this._picturesNumLabel.text = levelData.picturesCount;
            this._differencesNumLabel.text = levelData.differencesCount;
        }

        this._scaleY = this.scale.y;
        this.scale.y = 0;
        this.visible = true;

        gsap.to( this.scale, { duration: 0.02, "y": this._scaleY } );
    }

    hide() : void {
        gsap.killTweensOf(this.scale);
        this.visible = false;
    }
}
