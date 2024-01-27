import {BaseWindow} from "./BaseWindow";
import CButton from "../../components/CButton";
import CContainer from "../../components/CContainer";
import {ComponentModel, ContainerModel, ContentWindowModel} from "../../models/PropertiesModels";
import {WindowContent} from "./WindowContent";
import {COMPONENT_SHOP_ITEM} from "../../constants/constants";
import CBMText from "../../components/CBMText";
import CSprite from "../../components/CSprite";
import CText from "../../components/CText";
import * as constants from "../../constants/constants";
import {ShopModel} from "../../models/ApiModels";
import Shop from "../../data/Shop";
import Localization from "../../data/Localization";

export default class ShopWindow extends BaseWindow {
    private _closeBtn:CButton;
    private _items: ShopItem[];

    constructor() {
        super();
        this._closeBtn = this._content.getComponentByName("closeBtn");
        this._closeBtn.setActionUp( this.onCloseClick.bind(this) );

        this._items = this._content.getComponentsByType(COMPONENT_SHOP_ITEM);
        const shopModels: ShopModel[] = Shop.getShop();
        this._items.forEach( item => item.init(shopModels.find(model => model.id == item.properties.id)));
    }

    override getNewComponentByType( props:ComponentModel ) : any {
        if ( props.type === constants.COMPONENT_WINDOW_CONTENT ) {
            return new ShopContent( props as ContentWindowModel );
        }
        return super.getNewComponentByType( props );
    }

    public getName(): string {
        return super.getName()+"shop";
    }

    private onCloseClick() : void {
        this.hide();
    }

    show(params?: any) {
        super.show(params);

    }
}

class ShopContent extends WindowContent {

    constructor( props: ContentWindowModel ) {
        super( props );
    }

    override getNewComponentByType(props: ComponentModel): any {
        if ( props.type === COMPONENT_SHOP_ITEM ) {
            return new ShopItem(props);
        }
        return super.getNewComponentByType(props);
    }
}

class ShopItem extends CContainer {
    private _amountText:CBMText;
    private _bonusBg:CSprite;
    private _bonusText:CText;
    private _buyBtn:CButton;
    constructor(props: ContainerModel) {
        super(props);
        this._amountText = this.getComponentByName("amountText");
        this._bonusText = this.getComponentByName("bonusText");
        this._buyBtn = this.getComponentByName("buyBtn");
        this._buyBtn.setActionUp(this.buyProduct.bind(this))
    }

    public init(shopModel: ShopModel): void {
        this._amountText.text = shopModel.coins.toString();
        this._bonusText.text = Localization.replaceString(Localization.get(this._bonusText.textKey), [shopModel.bonusPercentage]);
        this._buyBtn.setBtnText(shopModel.platformPrice ? shopModel.platformPrice.toUpperCase() : shopModel.price.toFixed(2)+" USD");
    }

    private buyProduct(): void {

    }
}