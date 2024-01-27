import CText from "../../../components/CText";
import Localization from "../../../data/Localization";
import {LevelModel, TrophyTooltipModel} from "../../../models/ApiModels";
import Tooltip from "../common/Tooltip";
import Trophy from "./Trophy";

export default class TrophyTooltip extends Tooltip {
    private _trophyNameLabel: CText;
    private _trophyDescriptorLabel: CText;

    constructor( props: any ) {
        super( props );
        this._trophyNameLabel = this.getComponentByName("trophyNameLabel");
        this._trophyDescriptorLabel = this.getComponentByName("trophyDescriptorLabel");
    }

    override show( data: Trophy ) : void {
        if ( data ) {
            this._trophyNameLabel.text = Localization.get("trophy_name_"+data.properties.id);
            this._trophyDescriptorLabel.text = Localization.get("trophy_descriptor_"+data.properties.id);
            this.x = data.x;
            this.y = data.y+this.properties.y;
        }

        super.show();
    }
}
