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


interface IOwnProps {
    store? : IStore
}


@inject("store")
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

    render(){
        return (
            <div className='monthly'>
                <WeeklyTable
                    startHour={this.startHour}
                    endHour={this.endHour}
                    year={this.currentYear}
                    month={this.currentMonth}
                    week={this.currentWeek}></WeeklyTable>
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
}


@observer
class WeeklyTable extends React.Component<IWeeklyTableProps> {
    constructor(props){
        super(props)
    }

    @computed
    get monthBeginDayOfWeek(): number {
        // find out day of Week of the first day of Month
        const date = new Date(`${this.props.year}/${this.props.month+1}/1`);

        return date.getUTCDay();
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

    renderColumns(){
        let columns = [];

        for(let i = 0; i < 7; i++ ){
            columns.push(
                <td key={i}>

                    <div className='column-wrapper'>

                    </div>
                </td>
            )
        }

        return columns;
    }

    renderRows(){
        let rows = [];

        let isAM = true;
        for(let i = this.props.startHour; i < this.props.endHour; i++ ){

            if( i > 12 ){
                isAM = false;
            }


            rows.push(
                <tr key={i}>
                    <td className='time'>
                        {isAM ? "오전":"오후"} { (i) % 12 + 1} 시
                    </td>
                    { this.renderColumns() }
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