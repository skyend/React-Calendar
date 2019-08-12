import React from 'react';
import classnames from 'classnames';
import axios from 'axios';
import zeroPadding from "../../supports/padding";
import DatePicker from "../DatePicker/async";
import TimePicker from "../TimePicker/async";
import {hour24to12} from "../../supports/time";
import {inject, observer} from "mobx-react";
import {IStore} from "../../stores";
import instance from "../../supports/api";
import {getId} from "../../supports/schedule";

interface IItem {
    id: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    name: string;
}

interface ITime {
    hour: number;
    minute: number;
}

interface IDate {
    year: number;
    month: number;
    day: number;
    hour:number;
    minute: number;
}

interface IMyOwnProps {
    store?: IStore;
    start: IDate;
    end: IDate;
    title?:string;
    close? : () => void;
    updateSchedules: () => void;
}

@inject('store')
@observer
export default class Scheduler extends React.Component<IMyOwnProps> {
    state: {
        start: IDate;
        end:IDate;
        datePickerTarget: string;
        timePickerTarget: string;
        title: string;
    };

    constructor(props){
        super(props)

        this.state = {
            start: props.start,
            end: props.end,
            datePickerTarget: '',
            timePickerTarget: '',
            title:this.props.title || '',
        }
    }

    update = async () => {
        await this.props.updateSchedules();
        await this.props.close();
    }

    delete = async () => {
        if( !this.state.title ){
            alert('Input the schedule title');
            return;
        }

        const id = getId({
            year : this.state.start.year,
            month: this.state.start.month,
            day : this.state.start.day,
            hour: this.state.start.hour,
        });


        await axios.delete('/api/schedule/' + id);
        await this.update();
    }

    save = async () => {
        if( !this.state.title ){
            alert('Input the schedule title');
            return;
        }


        const id = getId({
            year : this.state.start.year,
            month: this.state.start.month,
            day : this.state.start.day,
            hour: this.state.start.hour,
        });

        try{

            const duplicateCheckRes = await axios.get(`/api/schedule/${id}/read`);
            if( duplicateCheckRes.data.code === 'success' && duplicateCheckRes.data.item ){
                return alert('중복일정은 등록할 수 없습니다');
            }
        } catch (e){

            const originId = getId({
                year : this.props.start.year,
                month: this.props.start.month,
                day : this.props.start.day,
                hour: this.props.start.hour,
            });

            // not found duplicate. So pass

            // delete old schedule
            await axios.delete(`/api/schedule/${originId}`);
        }

        const item : IItem  = {
            id,
            year: this.state.start.year,
            month : this.state.start.month,
            day: this.state.start.day,
            hour: this.state.start.hour,
            name : this.state.title,
        };


        await instance().post('/api/schedule/save', item);
        await this.update();
    }

    inputTitle = (e) => {
        this.setState({
            title : e.nativeEvent.target.value,
        })
    }

    selectDate = (date, day) => {
        this.setState({
            [this.state.datePickerTarget] : {
                ...(this.state[this.state.datePickerTarget]),
                year: date.year,
                month: date.month,
                day: day,
            },

            'end' : {
                ...(this.state[this.state.datePickerTarget]),
                year: date.year,
                month: date.month,
                day: day,
            },

            datePickerTarget:'',
        });
    }

    selectTime = (time : ITime) => {
        this.setState({
            [this.state.timePickerTarget] : {
                ...(this.state[this.state.timePickerTarget]),
                hour: time.hour,
            },

            'end' : {
                ...(this.state[this.state.timePickerTarget]),
                hour: time.hour + 1,
            },

            timePickerTarget:'',
        });
    }

    openDatePicker(target){
        if( target === 'start' ){
            this.setState({ datePickerTarget: target });
        }
    }

    openTimePicker(target){
        if( target === 'start' ){
            this.setState({ timePickerTarget: target });
        }
    }

    renderDate(date: IDate, target){


        let hour = date.hour;
        let convertedHour = hour24to12(hour);

        let min = date.minute ;

        return (
            <div className={classnames('date', this.state.datePickerTarget === target && 'modifying-date',  this.state.timePickerTarget === target && 'modifying-time')}>
                <style jsx>{`
                    .date {
                        display:inline-block;
                        background-color: #ecf6ff;
                    }
                    
                 
                    .num {
                        font-weight:bold;
                    }
                    
                    .right-space {
                        padding-right:5px;
                    }
                    
                    .controller {
                        display:inline-block;
                        cursor:pointer;
                    }
                    
                    .date.modifying-date  .controller.date{
                        border: 1px solid #35b4ff;
                        border-radius: 5px;
                        padding: 5px;
                    }
                    
                     .date.modifying-time  .controller.time{
                        border: 1px solid #35b4ff;
                        border-radius: 5px;
                        padding: 5px;
                    }
                    
                `}</style>

                <div className='controller date' onClick={ () => this.openDatePicker(target) }>
                    <span className='right-space'><span className='num'>{ date.year }</span>년</span>
                    <span className='right-space'><span className='num'>{ zeroPadding(2, date.month + 1) }</span>월</span>
                    <span className='right-space'><span className='num'>{ zeroPadding(2, date.day + 1) }</span>일</span>
                </div>

                <div className='controller time' onClick={ () => this.openTimePicker(target) }>
                    <span> {convertedHour.am ? "오전":"오후"} <span className='num'>{ zeroPadding(2,convertedHour.hour) } : { zeroPadding(2, min) }</span></span>
                </div>
            </div>
        )
    }

    render(){
        return (
            <div className='scheduler'>
                <style jsx>{`
                    .scheduler {  
                        padding:20px;
                    }
                    
                    input {
                        padding: 10px 20px;
                        width: 100%;
                        display: block;
                        box-sizing: border-box;
                        border-radius: 10px;
                        font-size: 16px;
                        border: 1px solid #72abff;
                        background-color: #ecf6ff;
                        outline:none;
                    }
                    
                    .dates {
                        font-size:20px;
                        padding:30px 10px;
                    }
                    
                    .btns {
                        text-align:right; 
                    }
                    
                    button {
                        padding: 5px 20px;
                        box-sizing: border-box;
                        border-radius: 10px;
                        font-size: 16px;
                        color: #fff;
                        border: 0;
                        background-color: #44a6ff;
                        outline: none;
                        margin-left: 10px;
                        cursor:pointer;
                    }
                    
                    .divide {
                        width:30px;
                        text-align:center;
                        display:inline-block;
                    }
                    
                    .time-picker-area {
                        margin-left: 324px;
                    }
                `}</style>

                <div>
                    <input placeholder="일정 제목" value={this.state.title} onChange={(e) => this.inputTitle(e)}/>
                </div>

                <div className='dates'>
                    {
                        this.renderDate(this.state.start, 'start')
                    }
                    <div className='divide'>-</div>
                    {
                        this.renderDate(this.state.end, 'end')
                    }
                </div>

                <div className='btns'>
                    <button onClick={() => this.props.close() }> 취소 </button>
                    <button onClick={() => this.delete() }> 삭제 </button>
                    <button onClick={() => this.save() }> 저장 </button>
                </div>


                { this.state.datePickerTarget && (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <DatePicker onCancel={() => this.setState({datePickerTarget:''})} onSelect={this.selectDate}/>
                    </React.Suspense>
                )}

                { this.state.timePickerTarget && (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <div className='time-picker-area'>
                            <TimePicker onCancel={() => this.setState({timePickerTarget:''})} onSelect={this.selectTime}/>
                        </div>
                    </React.Suspense>
                )}
            </div>
        )
    }
}
