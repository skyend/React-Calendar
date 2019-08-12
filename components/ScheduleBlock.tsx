import React from 'react';

interface IScheduleProps {
    name: string;
    year:string;
    month:string;
    hour:string;
    day:string;
    type:string; // label, block
}

export default class ScheduleBlock extends React.Component<IScheduleProps> {
    constructor(props){
        super(props);
    }

    renderLabel(){
        return (
            <div className='label'>
                <style jsx>{`
                    .label {
                        font-size: 14px;
                        color: #fff;
                        font-weight: 600;
                        background-color: #2ac0fd;
                        padding: 5px;
                        margin-bottom: 2px;
                    }
                `}</style>
                ⃝ {this.props.hour }시 / {this.props.name }
            </div>
        )
    }

    renderBlock(){

    }


    render(){
        return (
            <div className='schedule'>
                <style jsx>{`
                    width:100%;
                `}</style>
                {
                    this.props.type === 'label' ? this.renderLabel() : this.renderBlock()
                }

            </div>
        )
    }
}
