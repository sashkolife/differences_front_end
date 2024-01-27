import CContainer from "../../components/CContainer";
import {ContainerModel} from "../../models/PropertiesModels";
import gsap from "gsap";
import EventBus from "../../utils/EventBus";
import * as events from "../../constants/events";

export class SceneBase extends CContainer {
    constructor(props: ContainerModel) {
        super(props);
    }

    show(): void {
        this.alpha = 0;
        gsap.to(this, {duration: 0.1, alpha: 1, onComplete: () => EventBus.publish(events.EVENT_ON_SCENE_SHOW, this)});
    }

    hide(remove: boolean = true): void {
        gsap.to(this, {duration: 0.5, alpha: 0, onComplete: () => {
            EventBus.publish(events.EVENT_ON_SCENE_HIDE, this);
            if (remove) {
                this.removeFromParent();
                this.destroy( {children:true}  );
            }
        }})
    }
}