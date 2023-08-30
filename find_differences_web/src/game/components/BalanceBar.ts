import * as PIXI from 'pixi.js';
import CContainer from "../../components/CContainer";
import CBMText from "../../components/CBMText";
import CButton from "../../components/CButton";
import User from "../../data/User";
import WindowsController from "../windows/WindowsController";
import {ContainerModel} from "../../models/PropertiesModels";

export default class BalanceBar extends CContainer {
    private _balanceValue: CBMText;
    private _plusButton: CButton;

    constructor( props: ContainerModel ) {
        super( props );

        this._balanceValue = this.getComponentByName("balanceValue");
        this._plusButton = this.getComponentByName("plusButton");
        this._plusButton.setActionUp( this.onPlusClick.bind(this) );

        this._balanceValue.text = User.balance.toString();
    }

    onPlusClick() : void {
        //WindowsController.instance().show();
    }

}
