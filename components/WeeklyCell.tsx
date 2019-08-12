import React from 'react';
import classnames from 'classnames';

import {IYearMonth, WEEK_DAYS} from "../supports/dateCalculator";
import ScheduleBlock from "./ScheduleBlock";
import {inject, observer} from "mobx-react";
import {IStore} from "../stores";
import instance from "../supports/api";
import {getId} from "../supports/schedule";
import Scheduler from "./Scheduler";
import ModalStore from "../stores/modalStore";
interface IMyOwnProps {
    day: number;
    weekOfDay: number;
    criterion: IYearMonth;
    schedules: Array<any>;
    week: number;
    hour:number;
    store?: IStore;
    updateSchedules: () => void;
    modal?: ModalStore;
}

@inject('store', 'modal')
@observer
export default class WeeklyCell extends React.Component<IMyOwnProps> {
    onDragOver = (e) => {
        e.preventDefault(); // for allow drop action

        let { year, month } = this.props.criterion;
        let { day, hour } = this.props;

        this.props.store.hoverCell({
            year,
            month,
            day,
            hour,
        })
    }

    drop = async (e) => {

        let { year, month } = this.props.criterion;
        let { day, hour } = this.props;

        // check Duplicated
        let birthId = getId({
            year,
            month,
            day,
            hour,
        });

        try{
            let dpCkRes = await instance().get(`/api/schedule/${birthId}`);

            if( dpCkRes.data && dpCkRes.data.code === 'success' ){
                this.props.store.endDrag();
                return alert('already exists schedule');
            }
        } catch (e) {
            await instance().delete(`/api/schedule/${this.props.store.dragSchedule.id}`);

            let res = await instance().post('/api/schedule/save', {
                year,
                month,
                day,
                hour: hour,
                name: this.props.store.dragSchedule.name,
                id: birthId,
            });

            await this.props.store.endDrag();



            this.props.updateSchedules();
        }

    }



    clickDay = (date:IYearMonth, day:number, hour: number) => {
        let current = new Date();

        this.props.modal.open(Scheduler, {
            updateSchedules: this.props.updateSchedules,
            start : {
                ...date,
                day,
                hour:hour,
                minute: 0,
            },

            end : {
                ...date,
                day,
                hour:hour+1,
                minute: 0,
            }
        });
    }


    render(){
        let schedules = this.props.schedules;
        let hoveringCell = this.props.store.hoveringCell;



        if( hoveringCell && this.props.store.dragSchedule ){

            // Current Cell Info
            let { year, month } = this.props.criterion;
            let { day, hour } = this.props;



            if(
                hoveringCell.year === year &&
                hoveringCell.month === month &&
                hoveringCell.day === day &&
                hoveringCell.hour === hour ){

                // Dragging Schedule Info
                let name = this.props.store.dragSchedule.name;

                schedules = [
                    ...schedules,
                    {

                        year,
                        month,
                        day,
                        hour,
                        name,
                        ghost: true,
                    }
                ]
            }
        }


        let foundCurrentSchedule = schedules.find((sc) => sc.hour === this.props.hour );

        return (
            <td
                className="hour"
                onDragOver={this.onDragOver}
                onDrop={this.drop}
                onClick={() => this.clickDay(this.props.criterion, this.props.day ,this.props.hour)}>

                <div className='column-wrapper'>
                    { foundCurrentSchedule && (
                        <ScheduleBlock {...foundCurrentSchedule} type={'block'} updateSchedules={this.props.updateSchedules}/>
                    )}
                </div>
            </td>
        )
    }
}