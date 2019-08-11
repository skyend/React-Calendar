import React from 'react';
import TimeMachine from "./TimeMachine";
import Monthly from "./Monthly";


export default class CalendarView extends React.Component {
    render(){
        return (
            <div>
                <Monthly></Monthly>
            </div>
        )
    }
}