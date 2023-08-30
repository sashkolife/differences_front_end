import CContainer from "../../components/CContainer";
import {ContentWindowModel} from "../../models/PropertiesModels";

export class WindowContent extends CContainer {

    properties:ContentWindowModel;

    constructor( props: ContentWindowModel ) {
        super( props );
    }
}