import React from 'react';
import {inject, observer} from "mobx-react";
import {computed, observe} from "mobx";
import classnames from 'classnames';
import {IStore} from "../stores";
import {
    buildCalendarDaysMap,
    decreaseMonth,
    getMonthDays,
    increaseMonth,
    IYearMonth,
    WEEK_DAYS
} from "../supports/dateCalculator";
import ModalStore from "../stores/modalStore";
import Scheduler from "./Scheduler";
import ScheduleBlock from "./ScheduleBlock";
import MonthlyCell from "./MonthlyCell";


interface IOwnProps {
    store? : IStore;
    modal? : ModalStore;
    updateSchedules?: () => void;
}


@inject("store", "modal")
@observer
export default class Monthly extends React.Component<IOwnProps> {
    constructor(props){
        super(props);
    }

    @computed
    get currentYear(){
        return this.props.store.year;
    }

    @computed
    get currentMonth(){
        return this.props.store.month;
    }

    clickDay = (date:IYearMonth, day:number) => {
        const current = new Date();


        this.props.modal.open(Scheduler, {
            updateSchedules: this.props.updateSchedules,
            start : {
                ...date,
                day,
                hour:current.getHours(),
                minute: 0,
            },

            end : {
                ...date,
                day,
                hour:current.getHours()+1,
                minute: 0,
            }
        });
    }


    render(){
        return (
            <div className='monthly'>
                <MonthlyTable
                    month={this.currentMonth}
                    year={this.currentYear}
                    onClickColumn={ this.clickDay }
                    schedules={this.props.store.schedules}
                    updateSchedules={this.props.updateSchedules}/>
            </div>
        )
    }
}

interface IMonthlyTableProps {
    month: number;
    year: number;
    onClickColumn: (date: IYearMonth, day:number) => void;
    columnHeight?: number;
    fontSize?: number;
    selected?: IYearMonth;
    schedules?: Array<any>;
    updateSchedules?: () => void;
}


@observer
export class MonthlyTable extends React.Component<IMonthlyTableProps> {
    static defaultProps = {
        columnHeight: 100,
        fontSize:18,
    }

    constructor(props){
        super(props)
    }

    @computed
    get scheduleMap() {
        if( !this.props.schedules ) return [];
        const map = {};
        let schedule;
        let dateId;
        for(let i =0; i < this.props.schedules.length; i++ ){
            schedule = this.props.schedules[i];
            dateId = `${schedule.year}-${schedule.month}-${schedule.day}`;

            if( !map[dateId] ){
                map[dateId] = [];
            }
            map[dateId].push(schedule);

        }
        return map;
    }

    @computed
    get monthBeginDayOfWeek(): number {
        // find out day of Week of the first day of Month
        const date = new Date(`${this.props.year}/${this.props.month+1}/1`);

        return date.getUTCDay();
    }

    @computed
    get currentMonthCriterion() : IYearMonth {
        const date = {
            month: this.props.month,
            year : this.props.year,
        };

        return date;
    }

    @computed
    get lastMonthCriterion() : IYearMonth {
        const date = decreaseMonth({
            month: this.props.month,
            year : this.props.year,
        });

        return date;
    }



    @computed
    get nextMonthCriterion() : IYearMonth {
        const date = increaseMonth({
            month: this.props.month,
            year : this.props.year,
        });

        return date;
    }

    @computed
    get lastMonthDays() : number {
        return getMonthDays(this.lastMonthCriterion);
    }

    @computed
    get monthDays() : number {
        return getMonthDays({
            month: this.props.month,
            year: this.props.year,
        })
    }

    @computed
    get totalScreenDays() : number {
        return this.monthDays + this.monthBeginDayOfWeek;
    }

    @computed
    get daysMap(){
        return buildCalendarDaysMap(this.totalScreenDays, this.monthBeginDayOfWeek, this.monthDays, this.lastMonthDays);
    }

    renderDay(row,col, day){
        let monthSign = null;
        let selected = false;
        let dayOfLastMonth = false;
        let dayOfNextMonth = false;
        if( day === 0 ){
            if( row === 0 ){
                monthSign = this.props.month + 1;
            } else {
                monthSign = this.nextMonthCriterion.month + 1;
            }
        }

        let criterion = this.currentMonthCriterion;
        if( row === 0 && day > 7 ){
            dayOfLastMonth = true;
            criterion = this.lastMonthCriterion;
        }

        if( row > 3 && day < 7 ){
            dayOfNextMonth = true;
            criterion = this.nextMonthCriterion;
        }

        if( this.props.selected ){
            const selectedDate = this.props.selected;

            if( selectedDate.month === criterion.month && selectedDate.year === criterion.year && selectedDate.day === day ){
                selected = true;
            }
        }


        let schedules = this.scheduleMap[`${criterion.year}-${criterion.month}-${day}`] || [];


        return (
            <MonthlyCell
                updateSchedules={this.props.updateSchedules}
                key={day}
                day={day}
                dayOfLastMonth={dayOfLastMonth}
                dayOfNextMonth={dayOfNextMonth}
                weekOfDay={col}
                selected={selected}
                criterion={criterion}
                fontSize={this.props.fontSize}
                columnHeight={this.props.columnHeight}
                monthSign={monthSign}
                schedules={schedules}
                week={row}
                onClickColumn={this.props.onClickColumn}/>
        )
    }

    renderRows(){
        return this.daysMap.map(( columns, row ) => (
            <tr key={row}>
                {
                    columns.map((day, col) => this.renderDay(row,col,day))
                }
            </tr>
        ))
    }


    render(){


        return (
            <div className='grid'>
                <style>
                    {`
                        .grid {
                            
                        }
                        
                        table {
                            width:100%; 
                            font-size:24px;
                            border-top:1px solid #d4d4d4;
                        }
                        
                        tr {
                            min-height:100px;
                            border-bottom:1px solid #d4d4d4;
                        }
                        
                        tr:last-child {
                            border:0;
                        } 
                    `}
                </style>
                <table>

                    <tbody>
                    {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}
