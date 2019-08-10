import React from 'react';
import {inject, observer} from "mobx-react";
import {computed, observe} from "mobx";
import {IStore} from "../stores";

interface IOwnProps {
    store? : IStore
}



@inject("store")
@observer
export default class TimeMachine extends React.Component<IOwnProps> {
    constructor(props){
        super(props);
    }

    @computed
    get CurrentYear(){
        return this.props.store.month;
    }

    renderDate(){
        return (
            <div className='date'>
                <style jsx>
                    {`
                        .date {
                            display: inline-block; 
                            padding:0 10px;
                           
                        }
                        
                        .year-box {
                            width:200px;
                            display: inline-block;
                        }
                        
                        .month-box {
                            width:200px;
                            display: inline-block;
                        }
                    `}
                </style>

                <div className='year-box'>
                    {this.props.store.year}
                    년
                </div>

                <div className='month-box'>
                    {this.props.store.month + 1}
                    월
                </div>
            </div>
        )
    }

    render(){
        return (
            <div className='time-machine'>
                <style>
                    {`
                        .time-machine {
                            color:#333;
                            width:100%;
                            height:100px;
                            text-align:center;
                            background: linear-gradient(#e66465, #9198e5);
                            font-size:48px;
                            padding-top:30px;
                 
                            background: rgb(255,255,255); /* Old browsers */
                            background: -moz-linear-gradient(top,  rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%); /* FF3.6-15 */
                            background: -webkit-linear-gradient(top,  rgba(255,255,255,1) 0%,rgba(241,241,241,1) 50%,rgba(225,225,225,1) 51%,rgba(246,246,246,1) 100%); /* Chrome10-25,Safari5.1-6 */
                            background: linear-gradient(to bottom,  rgba(255,255,255,1) 0%,rgba(241,241,241,1) 50%,rgba(225,225,225,1) 51%,rgba(246,246,246,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */  
                            
                            font-weight:400;
                        }
                        
                        
                        button {
                            background: transparent;
                            border:0;
                            font-size:inherit;
                            color:inherit;
                        }
                        
                        .monthly {
                            font-size: 24px;
                            padding: 5px 20px;
                            background-color: #fff;
                            border-radius: 10px 0px 0 10px;
                            border: 1px solid #b9b9b9;
                        }
                        
                        .weekly {
                            font-size: 24px;
                            padding: 5px 20px;
                            background-color: #fff;
                            border-radius: 0px 10px 10px 0px;
                            border: 1px solid #b9b9b9;
                        }
                        
                        .type-switch {
                            display:inline-block;
                        }
                    `}
                </style>
                <button onClick={() => this.props.store.prevMonth()}>&lt;</button>

                {
                    this.renderDate()
                }

                <button onClick={() => this.props.store.nextMonth()}>&gt;</button>


                <div className='type-switch'>
                    <button className='monthly'>
                        Monthly
                    </button>

                    <button className='weekly'>
                        Weekly
                    </button>
                </div>
            </div>
        )
    }
}