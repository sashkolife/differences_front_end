import CText from "../../../components/CText";
import Localization from "../../../data/Localization";
import {LevelModel} from "../../../models/ApiModels";
import Tooltip from "../common/Tooltip";

export default class MapLevelTooltip extends Tooltip {
    private _levelNumLabel: CText;
    private _picturesLabel: CText;
    private _picturesNumLabel: CText;
    private _differencesLabel: CText;
    private _differencesNumLabel: CText;

    constructor( props: any ) {
        super( props );
        this._levelNumLabel = this.getComponentByName("levelNumLabel");
        this._picturesLabel = this.getComponentByName("picturesLabel");
        this._picturesNumLabel = this.getComponentByName("picturesNumLabel");
        this._differencesLabel = this.getComponentByName("differencesLabel");
        this._differencesNumLabel = this.getComponentByName("differencesNumLabel");
    }

    override show( data: LevelModel ) : void {
        if ( data ) {
            this._levelNumLabel.text = Localization.get("lobby_level") + " " + data.id;
            this._picturesNumLabel.text = data.picturesCount;
            this._differencesNumLabel.text = data.differencesCount;
        }

        super.show();
    }
}
