import React from 'react';
import classnames from 'classnames';

import {IYearMonth, WEEK_DAYS} from "../supports/dateCalculator";
import ScheduleBlock from "./ScheduleBlock";
import {inject, observer} from "mobx-react";
import {IStore} from "../stores";
import instance from "../supports/api";
import {getId} from "../supports/schedule";
interface IMyOwnProps {
    day: number;
    dayOfLastMonth: boolean;
    dayOfNextMonth: boolean;
    weekOfDay: number;
    selected:boolean;
    criterion: IYearMonth;
    fontSize: number;
    columnHeight:number;
    monthSign: number;
    schedules: Array<any>;
    week: number;
    onClickColumn: (date: IYearMonth, day:number) => void;
    store?: IStore;
    updateSchedules: () => void;
}

@inject('store')
@observer
export default class MonthlyCell extends React.Component<IMyOwnProps> {
    onDragOver = (e) => {
        e.preventDefault(); // for allow drop action

        const { year, month } = this.props.criterion;
        const { day } = this.props;

        this.props.store.hoverCell({
            year,
            month,
            day,
        })
    }

    drop = async (e) => {

        const { year, month } = this.props.criterion;
        const { day } = this.props;

        // check Duplicated
        const birthId = getId({
            year,
            month,
            day,
            hour: this.props.store.dragSchedule.hour
        });

        try{
            const dpCkRes = await instance().get(`/api/schedule/${birthId}`);

            if( dpCkRes.data && dpCkRes.data.code === 'success' ){
                this.props.store.endDrag();
                return alert('already exists schedule');
            }
        } catch (e) {
            await instance().delete(`/api/schedule/${this.props.store.dragSchedule.id}`);

            await instance().post('/api/schedule/save', {
                year,
                month,
                day,
                hour: this.props.store.dragSchedule.hour,
                name: this.props.store.dragSchedule.name,
                id: birthId,
            });

            await this.props.store.endDrag();



            this.props.updateSchedules();
        }

    }


    render(){
        let schedules = this.props.schedules;
        const hoveringCell = this.props.store.hoveringCell;



        if( hoveringCell && this.props.store.dragSchedule ){

            // Current Cell Info
            const { year, month } = this.props.criterion;
            const { day } = this.props;



            if( hoveringCell.year === year && hoveringCell.month === month && hoveringCell.day === day ){

                // Dragging Schedule Info
                const hour = this.props.store.dragSchedule.hour;
                const name = this.props.store.dragSchedule.name;

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

        schedules.sort((a,b) => {
            if( a.hour > b.hour ){
                return 1;
            } else {
                return -1;
            }
        });

        return (
            <td
                onDragOver={this.onDragOver}
                onDrop={this.drop}
                key={this.props.day}
                className={classnames('day', this.props.dayOfLastMonth && 'last-month-day', this.props.dayOfNextMonth && 'next-month-day', 'weekOfDay'+this.props.weekOfDay, this.props.selected && 'selected')}
                onClick={() => this.props.onClickColumn(this.props.criterion, this.props.day) }>
                <style jsx>
                    {`
                        td {
                            border-right:1px solid #d4d4d4;
                            transition:background-color .3s;
                        }
                        
                        td:hover {
                            background-color:#aee1ff;
                            cursor:pointer;
                        }
                        
                        
                       
                        td:last-child {
                            border:0;
                        }
                        
                        td {
                            width: ${100 / 7}%;
                        }
                        
                        td .month-sign {
                            display:inline-block;
                        }
                        
                        td .day {
                            padding:10px;
                            font-size:${this.props.fontSize}px;
                        }
                        
                        .column-wrapper {
                            min-height:${this.props.columnHeight}px;
                        }
                        
                        .last-month-day {
                            background-color:#eaeaea;
                            color:#777;
                        }
                        
                         .next-month-day {
                            background-color: #f3f9ff;
                            color: #246fb9;
                        }
                        
                        td.selected {
                             
                            background-color: #318dec;
                            color: #fff;
                            font-weight: bold;
                        }
                    `}
                </style>


                <div className='column-wrapper'>
                    {
                        this.props.week === 0 && (
                            <div>
                                { WEEK_DAYS[this.props.weekOfDay] }
                            </div>
                        )
                    }
                    <div className='day'>
                        { this.props.monthSign && (
                            <div className='month-sign'>
                                {this.props.monthSign} 월
                            </div>
                        )}

                        {this.props.day + 1} { this.props.day === 0 && '일' }
                    </div>
                </div>

                {schedules.map((sc, i) => <ScheduleBlock {...sc} type='label' key={i} updateSchedules={this.props.updateSchedules}/>)}
            </td>
        )
    }
}