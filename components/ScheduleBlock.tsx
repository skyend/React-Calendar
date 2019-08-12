import React from 'react';
import {inject, observer} from "mobx-react";
import SchedulerAsync from "./Scheduler/async";
import ModalStore from "../stores/modalStore";

interface IScheduleProps {
    name: string;
    year:string;
    month:string;
    hour:string;
    day:string;
    type:string; // label, block
    modal?: ModalStore;
}


@inject('modal')
@observer
export default class ScheduleBlock extends React.Component<IScheduleProps> {
    constructor(props){
        super(props);
    }

    click = (e) => {
        e.stopPropagation();
        const { year, month, day, hour } = this.props;

        this.props.modal.open(SchedulerAsync, {
            start : {
                year,
                month,
                day,
                hour,
                minute: 0,
            },

            end : {
                year,
                month,
                day,
                hour : hour +1,
                minute: 0,
            },

            title: this.props.name,
        });
    }

    renderLabel(){
        return (
            <div className='label'>
                <style jsx>{`
                    .label {
                        font-size: 14px;
                        color: #fff;
                        font-weight: 600;
                        background-color: #2ac0fd;
                        padding: 5px;
                        margin-bottom: 2px;
                    }
                `}</style>
                ⃝ {this.props.hour }시 / {this.props.name }
            </div>
        )
    }

    renderBlock(){
        return (
            <div className='label'>
                <style jsx>{`
                    .label {
                        font-size: 14px;
                        color: #fff;
                        font-weight: 600;
                        background-color: #2ac0fd;
                        padding: 5px; 
                        min-height: 40px;
                    }
                `}</style>
               {this.props.name }
               <div>{this.props.hour }시 </div>
            </div>
        )
    }


    render(){
        return (
            <div className='schedule' onClick={this.click} >
                <style jsx>{`
                    width:100%;
                `}</style>
                {
                    this.props.type === 'label' ? this.renderLabel() : this.renderBlock()
                }

            </div>
        )
    }
}
