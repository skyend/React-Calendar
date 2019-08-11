import React from 'react';
import zeroPadding from "../../supports/padding";
import {hour24to12} from "../../supports/time";


interface IMyOwnProps {
    hour?: number;
    onCancel: () => void;
    onSelect: (time) => void;
}

export default class TimePicker extends React.Component<IMyOwnProps> {
    state : {
        hour : number,
        am? : boolean,
    }

    constructor(props){
        super(props)

        this.state = {
            hour: props.hour || 0,
        }
    }

    renderMinutes(){
        let hours = [];

        for(let i = 0; i < 60; i++ ){
            hours.push(
                <li>
                    {zeroPadding(2,i+1)}
                </li>
            )
        }

        return hours;
    }

    select = () => {
        this.props.onSelect({
            hour: this.state.hour,
            minute: 0,
        })
    }

    renderHours(){
        let hours = [];
        let convertedHour;
        for(let i = 1; i < 24; i++ ){
            convertedHour = hour24to12(i);

            hours.push(
                <li key={i} className={this.state.hour === i ? 'selected':''} onClick={() => this.setState({hour: i})}>
                    {convertedHour.am ? "오전":"오후"} {zeroPadding(2,convertedHour.hour)}
                </li>
            )
        }

        return hours;
    }

    render(){
        return (
            <div className='time-picker'>
                <style>{`
                
                        
                    .time-picker {
                       position:absolute;
                       background-color:#fff;
                        
                       padding:10px;
                       border: 1px solid #4e4e4e; 
                       text-align:left;
                    }
                    .time-picker ul {
                       height:300px;
                       overflow:auto;
                       display:inline-block;
                    }
                    
                    .time-picker li {
                        padding:5px;
                        min-width:60px;
                        text-align:center;
                        cursor:pointer;
                    }
                    
         
                    
                    .time-picker li:nth-child(odd) {
                        background-color:#ecf6ff;
                    }
                    .time-picker li:nth-child(even) { 
                    }
                    .time-picker li:hover {
                        background-color:#6bb9ff;
                        color:#fff;
                    }
                               
                    .time-picker li.selected {
                        background-color:#2e9cff;
                        color:#fff;
                    }
                    
                    button.btn {  
                     
                        padding: 5px 20px;
                        box-sizing: border-box;
                        border-radius: 10px;
                        font-size: 16px;
                        color: #fff;
                        border: 0;
                        background-color: #44a6ff;
                        outline: none;
                        margin-left: 10px;
                        cursor: pointer;
                    }
                `}</style>

                <div>
                    <ul>
                        { this.renderHours() }
                    </ul>
                    {/*<ul>*/}
                    {/*    { this.renderMinutes() }*/}
                    {/*</ul>*/}
                    {/*<ul>*/}
                    {/*    <li onClick={() => this.setTime(this.state.hour, 'am')}>AM</li>*/}
                    {/*    <li onClick={() => this.setTime(this.state.hour, 'pm')}>PM</li>*/}

                    {/*</ul>*/}
                    <button className='btn' onClick={this.select}> OK </button>
                    <button className='btn' onClick={this.props.onCancel}> Cancel </button>
                </div>
            </div>
        )
    }
}