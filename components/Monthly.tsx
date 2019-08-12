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


interface IOwnProps {
    store? : IStore
    modal? : ModalStore
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
        let current = new Date();


        this.props.modal.open(Scheduler, {
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
                <MonthlyTable month={this.currentMonth} year={this.currentYear} onClickColumn={ this.clickDay } schedules={this.props.store.schedules}/>
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
        schedules.sort((a,b) => {
            if( a.hour > b.hour ){
                return 1;
            } else {
                return -1;
            }
        });


        return (
            <td
                key={day}
                className={classnames('day', dayOfLastMonth && 'last-month-day', dayOfNextMonth && 'next-month-day', 'weekOfDay'+col, selected && 'selected')}
                onClick={() => this.props.onClickColumn(criterion, day) }>
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
                        row === 0 && (
                            <div>
                                { WEEK_DAYS[col] }
                            </div>
                        )
                    }
                    <div className='day'>
                        { monthSign && (
                            <div className='month-sign'>
                                {monthSign} 월
                            </div>
                        )}

                        {day + 1} { day === 0 && '일' }
                    </div>
                </div>

                {schedules.map((sc, i) => <ScheduleBlock {...sc} type='label' key={i}/>)}
            </td>
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
