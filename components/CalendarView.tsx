import React from 'react';
import TimeMachine from "./TimeMachine";
import Monthly from "./Monthly";
import {inject, observer} from "mobx-react";
import Weekly from "./Weekly";
import {IStore} from "../stores";


interface IMyOwnProps {
    store?: IStore;
}


@inject('store')
@observer
export default class CalendarView extends React.Component<IMyOwnProps> {



    render(){

        let target = null;

        if( this.props.store.type === 'monthly' ){
            target = <Monthly></Monthly>
        } else {
            target = <Weekly></Weekly>
        }


        return (
            <div>
                {target}
            </div>
        )
    }
}