import React from 'react';
import TimeMachine from "./TimeMachine";
import Monthly from "./Monthly";
import {inject, observer} from "mobx-react";
import Weekly from "./Weekly";
import {IStore} from "../stores";
import instance from "../supports/api";


interface IMyOwnProps {
    store?: IStore;

}


@inject('store')
@observer
export default class CalendarView extends React.Component<IMyOwnProps> {

    updateSchedules = async () => {
        // update
        let allRes = await instance().get('/api/schedule/all');
        await this.props.store.updateSchedules(allRes.data.items);
    }

    render(){

        let target = null;

        if( this.props.store.type === 'monthly' ){
            target = <Monthly updateSchedules={this.updateSchedules}/>
        } else {
            target = <Weekly updateSchedules={this.updateSchedules}/>
        }


        return (
            <div>
                {target}
            </div>
        )
    }
}