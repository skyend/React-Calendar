import React from 'react';
import {MonthlyTable} from "../Monthly";
import {decreaseMonth, increaseMonth, IYearMonth} from "../../supports/dateCalculator";


interface IMyOwnProps {
    year?: number;
    month?: number;
    onCancel: () => void;
    onSelect: (date, day) => void;
}

export default class DatePicker extends React.Component<IMyOwnProps> {
    state : {
        year: number;
        month: number;
        selected?: IYearMonth;
        selectedDay? : number;
    }

    constructor(props){
        super(props);

        let date = new Date();
        this.state = {
            year : this.props.year || date.getFullYear(),
            month: this.props.month || date.getUTCMonth()
        }
    }

    select = () => {
        if( this.state.selectedDay ){

            this.props.onSelect(this.state.selected, this.state.selectedDay)
        } else {
            alert('Couldn\'t select null. select a day');
        }
    }

    nextMonth = () => {
        let nextDate = increaseMonth({
            year : this.state.year,
            month: this.state.month,
        })

        this.setState(nextDate);
    }

    prevMonth = () => {
        let nextDate = decreaseMonth({
            year : this.state.year,
            month: this.state.month,
        })

        this.setState(nextDate);
    }

    onSelect = (date, day) => {
        this.setState({
            selected : date,
            selectedDay: day,
        })
    }

    render(){

        return (
            <div className='date-picker'>
                <style jsx>
                    {`
                         .date {
                            display: inline-block; 
                            padding:10px;
                           
                        }
                        
                        .year-box {
                           
                            display: inline-block;
                        }
                        
                        .month-box {
                             
                            display: inline-block;
                        }
                        
                        
                        
                        .date-wrapper {
                           position:absolute;
                           background-color:#fff;
                           width:300px;
                           padding:10px;
                           border: 1px solid #4e4e4e;
                        }
                        
                        button {
                            background-color:transparent;
                            border:0;
                            color:#333;
                            cursor:pointer;
                        }
                    `}
                </style>

                <div className={'date-wrapper'}>
                    <div>
                        <div className='date'>
                            <button onClick={this.prevMonth}>&lt;</button>

                            <div className='year-box'>
                                {this.state.year}
                                년
                            </div>

                            <div className='month-box'>
                                {this.state.month + 1}
                                월
                            </div>


                            <button onClick={this.nextMonth}>&gt;</button>
                        </div>
                    </div>

                    <MonthlyTable
                        month={this.state.month}
                        year={this.state.year}
                        onClickColumn={ this.onSelect }
                        columnHeight={40}
                        fontSize={12}
                        selected={{...this.state.selected, day : this.state.selectedDay}}/>


                    <button onClick={this.props.onCancel}> Cancel </button>
                    <button onClick={() => this.select()}> OK </button>
                </div>
            </div>
        )
    }
}