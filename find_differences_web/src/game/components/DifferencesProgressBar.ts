import * as PIXI from 'pixi.js';
import CSprite from "../../components/CSprite";
import CContainer from "../../components/CContainer";
import CText from "../../components/CText";
import CSlice9 from "../../components/CSlice9";
import CBMText from "../../components/CBMText";
import * as constants from "../../constants/constants";
import PicturesProgressBar from "./PicturesProgressBar";
import BalanceBar from "./BalanceBar";
import LevelDifference from "./LevelDifference";

export default class DifferencesProgressBar extends CContainer {

    private _differencesText: CBMText;
    private _differencesCountText: CBMText;
    private _differences: Array<CContainer>;

    private _differencesCount: number = 0;

    private _differencesFound:Array<number> = [];

    constructor( props: any ) {
        super( props );

        this._differencesText = this.getComponentByName("differencesText");

        this._differencesCountText = this.getComponentByName("differencesCountText");

        this._differences = this.getComponentsByType(constants.COMPONENT_LEVEL_DIFFERENCE);
    }

    getNewComponentByType( props: any ): any {

        let comp:any = super.getNewComponentByType( props );

        if ( !comp ) {
            const type: string = props[constants.KEY_TYPE];
            if ( type == constants.COMPONENT_LEVEL_DIFFERENCE ) {
                comp = new LevelDifference(props);
            }
        }

        return comp;
    }

    setCount( num: number ) : void {
        this._differencesCount = num;

        this._differencesCountText.text = this._differencesCount.toString();

        for ( let i : number = 0; i < this._differences.length && i < this._differencesCount; i++ ) {
            this._differences[i].visible = true;
        }

        this._differencesCountText.x = this._differences[Math.min(this._differencesCount-1,this._differences.length-1)].x + 30;
        this.x = ( (window as any).APP_WIDTH - this.width) >> 1;
    }
}
