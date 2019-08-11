import React from 'react';
import zeroPadding from "../../supports/padding";
import DatePicker from "../DatePicker/async";


interface IDate {
    year: number;
    month: number;
    day: number;
    hour:number;
    minute: number;
}

interface IMyOwnProps {
    start: IDate;
    end: IDate;
    close? : () => void;
}

export default class Scheduler extends React.Component<IMyOwnProps> {
    state: {
        start: IDate;
        end:IDate;
        openedDatePicker: boolean
    };

    constructor(props){
        super(props)

        this.state = {
            start: props.start,
            end: props.end,
            openedDatePicker: false,
        }
    }

    selectDate = () => {

    }

    openDatePicker(target){
        this.setState({ openedDatePicker: true });
        console.log('pick')
    }

    renderDate(date: IDate, target){
        let isAM = true;
        if( date.hour > 11 ){
            isAM = false;
        }


        let hour = (date.hour  + 1) % 12;
        let min = date.minute ;

        return (
            <div className='date'>
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
                `}</style>

                <div className='controller' onClick={ () => this.openDatePicker(target) }>
                    <span className='right-space'><span className='num'>{ date.year }</span>년</span>
                    <span className='right-space'><span className='num'>{ zeroPadding(2, date.month + 1) }</span>월</span>
                    <span className='right-space'><span className='num'>{ zeroPadding(2, date.day + 1) }</span>일</span>
                </div>

                <div className='controller'>
                    <span> {isAM ? "오전":"오후"} <span className='num'>{ zeroPadding(2,hour) } : { zeroPadding(2, min) }</span></span>
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
                    }
                    
                    .divide {
                        width:30px;
                        text-align:center;
                        display:inline-block;
                    }
                `}</style>

                <div>
                    <input placeholder="일정 제목"/>
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
                    <button> 삭제 </button>
                    <button> 저장 </button>
                </div>


                { this.state.openedDatePicker && (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <DatePicker onCancel={() => this.setState({openedDatePicker:false})} onSelect={this.selectDate}/>
                    </React.Suspense>
                )}
            </div>
        )
    }
}