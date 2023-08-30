import * as PIXI from 'pixi.js';
import CSprite from "../../components/CSprite";
import CContainer from "../../components/CContainer";
import CText from "../../components/CText";
import CSlice9 from "../../components/CSlice9";
import CBMText from "../../components/CBMText";
import * as constants from "../../constants/constants";
import PicturesProgressBar from "./PicturesProgressBar";
import BalanceBar from "./BalanceBar";
import LevelProgressDifference from "./LevelProgressDifference";
import {ComponentModel, ContainerModel} from "../../models/PropertiesModels";

export default class DifferencesProgressBar extends CContainer {

    private _differencesText: CBMText;
    private _differencesCountText: CBMText;
    private _differences: Array<CContainer>;

    private _differencesCount: number = 0;

    constructor( props: ContainerModel ) {
        super( props );

        this._differencesText = this.getComponentByName("differencesText");

        this._differencesCountText = this.getComponentByName("differencesCountText");

        this._differences = this.getComponentsByType(constants.COMPONENT_LEVEL_PROGRESS_DIFFERENCE);
    }

    getNewComponentByType( props: ComponentModel ): any {

        let comp:any = super.getNewComponentByType( props );

        if ( !comp ) {
            const type: string = props.type;
            if ( type == constants.COMPONENT_LEVEL_PROGRESS_DIFFERENCE ) {
                comp = new LevelProgressDifference(props);
            }
        }

        return comp;
    }

    setCount( num: number ) : void {
        this._differencesCount = num;

        for ( let i : number = 0; i < this._differences.length && i < this._differencesCount; i++ ) {
            this._differences[i].visible = true;
        }

        this._differencesCountText.x = this._differences[Math.min(this._differencesCount-1,this._differences.length-1)].x + 30;
        this.x = ( (window as any).APP_WIDTH - this.width) >> 1;

        this.updateCounter();
    }

    setFound( idx: number ) : void {
        const solve:CSprite = this._differences[idx].getComponentByName("solve");
        solve.visible = true;
        this.updateCounter();
    }

    reset() : void {
        for ( let i : number = 0; i < this._differences.length && i < this._differencesCount; i++ ) {
            const solve:CSprite = this._differences[i].getComponentByName("solve");
            solve.visible = false;
        }
        this.updateCounter();
    }

    updateCounter() : void {
        let count:number = 0;
        this._differences.forEach( (comp:CContainer) => {
            const solve:CSprite = comp.getComponentByName("solve");
            if ( solve.visible === true ) {
                count++;
            }
        } );
        this._differencesCountText.text = count + "/" + this._differencesCount.toString();
    }
}
