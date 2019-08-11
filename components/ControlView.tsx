import React from 'react';
import TimeMachine, {IOwnProps as TMProps} from "./TimeMachine";

export default class ControlView extends React.Component<TMProps> {
    render(){
        return (
            <div>
                <TimeMachine {...this.props}/>
            </div>
        )
    }
}