import React from 'react';
import classnames from 'classnames';
import {inject, observer} from "mobx-react";
import SchedulerAsync from "./Scheduler/async";
import ModalStore from "../stores/modalStore";
import {IStore} from "../stores";
import {getId} from "../supports/schedule";
import {hour24to12} from "../supports/time";

interface IScheduleProps {
    name: string;
    year:string;
    month:string;
    hour:string;
    day:string;
    type:string; // label, block
    ghost:boolean;
    modal?: ModalStore;
    store? : IStore;
    updateSchedules: () => void;
}


@inject('store','modal')
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
            updateSchedules: this.props.updateSchedules,
        });
    }

    dragStart = (e) => {
        const { year, month, day, hour } = this.props;

        const id = getId({
            year,
            month,
            day ,
            hour
        });

        this.props.store.startDrag({
            id,
            year,
            month,
            day,
            hour,
            name : this.props.name,
        })
    }

    dragEnd = (e) => {
        this.props.store.endDrag();
    }

    renderLabel(){
        const convertedHour = hour24to12(this.props.hour);

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
                    
                    .icon {
                        width:20px;
                    }
                `}</style>
               <div className='icon'>⃝</div>   {convertedHour.am ? "오전":"오후"}  {convertedHour.hour }시 / {this.props.name }
            </div>
        )
    }

    renderBlock(){
        const convertedHour = hour24to12(this.props.hour);
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
               <div>  {convertedHour.am ? "오전":"오후"}  {convertedHour.hour }시 </div>
            </div>
        )
    }


    render(){
        return (
            <div
                className={classnames('schedule', this.props.ghost && 'ghost')}
                onClick={this.click}
                onDragStart={this.dragStart}
                onDragEnd={this.dragEnd}
                draggable>
                <style jsx>{`
                    .schedule{
                        width:100%;
                    }
                    
                    .schedule.ghost {
                        opacity:0.6;
                    }
                `}</style>
                {
                    this.props.type === 'label' ? this.renderLabel() : this.renderBlock()
                }

            </div>
        )
    }
}
