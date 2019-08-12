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
import {hour24to12} from "../supports/time";
import Scheduler from "./Scheduler";
import ModalStore from "../stores/modalStore";
import ScheduleBlock from "./ScheduleBlock";
import WeeklyCell from "./WeeklyCell";


interface IOwnProps {
    store? : IStore;
    modal? : ModalStore;
    updateSchedules: () => void;
}


@inject("store", "modal")
@observer
export default class Weekly extends React.Component<IOwnProps> {
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

    @computed
    get currentWeek(){
        return this.props.store.week;
    }

    @computed
    get startHour(){
        return this.props.store.startHour;
    }

    @computed
    get endHour(){
        return this.props.store.endHour;
    }


    clickDay = (date:IYearMonth, day:number, hour: number) => {

        this.props.modal.open(Scheduler, {
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
        return (
            <div className='monthly'>
                <WeeklyTable
                    updateSchedules={this.props.updateSchedules}
                    schedules={this.props.store.schedules}
                    onClickColumn={this.clickDay}
                    startHour={this.startHour}
                    endHour={this.endHour}
                    year={this.currentYear}
                    month={this.currentMonth}
                    week={this.currentWeek}/>
            </div>
        )
    }
}


interface IWeeklyTableProps {
    month: number;
    year: number;
    week: number;
    startHour: number;
    endHour: number;
    onClickColumn: (date: IYearMonth, day:number, h:number) => void;
    schedules?: Array<any>;
    updateSchedules: () => void;
}


@observer
class WeeklyTable extends React.Component<IWeeklyTableProps> {
    constructor(props){
        super(props)
    }

    @computed
    get hourRange(){

        let maxHour = 22;
        let minHour = 10;


        let schedule;
        for(let i = 0; i < 7; i++ ){
            let day = this.daysMap[this.props.week][i];


            let criterion = this.currentMonthCriterion;
            if( this.props.week === 0 && day > 7 ){
                criterion = this.lastMonthCriterion;
            }

            if( this.props.week > 3 && day < 7 ){
                criterion = this.nextMonthCriterion;
            }


            let schedules = this.scheduleMap[`${criterion.year}-${criterion.month}-${day}`] || [];


            for(let j = 0; j < schedules.length; j++ ){
                schedule = schedules[j];

                maxHour = Math.max(schedule.hour, maxHour);

                minHour = Math.min(schedule.hour, minHour);
            }
        }

        return [minHour, maxHour];
    }


    @computed
    get scheduleMap() {
        let map = {};
        for(let i =0; i < this.props.schedules.length; i++ ){
            let schedule = this.props.schedules[i];
            let dateId = `${schedule.year}-${schedule.month}-${schedule.day}`;

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



    renderColumns(h){
        let columns = [];

        for(let i = 0; i < 7; i++ ){
            let day = this.daysMap[this.props.week][i];


            let criterion = this.currentMonthCriterion;
            if( this.props.week === 0 && day > 7 ){
                criterion = this.lastMonthCriterion;
            }

            if( this.props.week > 3 && day < 7 ){
                criterion = this.nextMonthCriterion;
            }


            let schedules = this.scheduleMap[`${criterion.year}-${criterion.month}-${day}`] || [];



            columns.push(
                <WeeklyCell
                    key={day}
                    day={day}
                    weekOfDay={i}
                    criterion={criterion}
                    schedules={schedules}
                    week={this.props.week}
                    hour={h}
                    updateSchedules={this.props.updateSchedules}/>
            )
        }

        return columns;
    }

    renderRows(){
        let rows = [];
        let [minHour, maxHour] = this.hourRange;

        let convertdHour ;
        for(let i = minHour; i <= maxHour; i++ ){
            convertdHour = hour24to12(i);



            rows.push(
                <tr key={i}>
                    <td className='time'>
                        {convertdHour.am ? "오전":"오후"} { convertdHour.hour } 시
                    </td>
                    { this.renderColumns(i) }
                </tr>
            )
        }

        return rows;
    }

    renderHead(){
        let days = this.daysMap[this.props.week]




        return (
            <thead>
                <tr className="border">
                    <th/>
                    {
                        WEEK_DAYS.map((name,i) => {
                            let monthSign = null;
                            if( days[i] === 0 ){
                                if( this.props.week === 0 ){
                                    monthSign = this.props.month + 1;
                                } else {
                                    monthSign = this.nextMonthCriterion.month + 1;
                                }
                            }

                            return (
                                <th className='weekday' key={name}>
                                    {name}
                                    <div className={classnames('day', 'weekOfDay'+i)}>
                                        {monthSign !== null && monthSign + " 월"} {days[i] + 1}
                                    </div>
                                </th>
                            )
                        })
                    }
                </tr>
            </thead>
        )
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
                        
                        thead tr.border {
                            border-bottom:1px solid #d4d4d4; 
                        }
                        
                        
                        td, th {
                            border-right:1px solid #d4d4d4;
                        }
                        
                        td:last-child , th:last-child {
                            border:0;
                        }
                        
                        td {
                            width: ${100 / 8}%;
                            vertical-align:top;
                        }
                        
                        td .month-sign {
                            display:inline-block;
                        }
                        
                        th .day {
                            padding:10px;
                            font-size:18px;
                        }
                        
                        td.hour { 
                            transition:background-color .3s;
                        }
                        
                        td.hour:hover {
                            background-color:#aee1ff;
                            cursor:pointer;
                        }
                        
                        .column-wrapper {
                            min-height:50px;
                        }
                        
                        .last-month-day {
                            background-color:#eaeaea;
                            color:#777;
                        }
                        
                        .next-month-day {
                            background-color: #f3f9ff;
                            color: #246fb9;
                        }
                        
                        .weekday {
                            padding:10px;
                            text-align:left;
                        }
                        
                        .time {
                            padding:10px;
                            font-size:18px;
                        }
                    `}
                </style>

                <table>
                    { this.renderHead() }

                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}
