import * as constants from "../constants/constants";
import CSprite from "./CSprite";
import CSlice9 from "./CSlice9";
import CGraphics from "./CGraphics";
import CContainer from "./CContainer";
import CText from "./CText";
import CBMText from "./CBMText";
import CButton from "./CButton";
import ButtonPay from "../game/components/common/ButtonPay";

export default class CFactory {
    static getNewComponent( props: any ) : any {
        if ( !props ) {
            return null;
        }

        const type: string = props[constants.KEY_TYPE];
        if ( !type ) {
            return null;
        }

        switch ( type ) {
            case constants.COMPONENT_SPRITE:
                return new CSprite( props );
            case constants.COMPONENT_SLICE_9:
                return new CSlice9( props );
            case constants.COMPONENT_CONTAINER:
                return new CContainer( props );
            case constants.COMPONENT_GRAPHICS:
                return new CGraphics( props );
            case constants.COMPONENT_TEXT:
                return new CText( props );
            case constants.COMPONENT_BM_TEXT:
                return new CBMText( props );
            case constants.COMPONENT_BUTTON:
                return new CButton( props );
            case constants.COMPONENT_BUTTON_PAY:
                return new ButtonPay( props );
        }

        return null;
    }
}