import React from 'react';
import axios from 'axios';
import ControlView from '../components/ControlView';
import CalendarView from '../components/CalendarView';
import '../assets/style/calendar.less'

const Render = () => <div className='calendar'>
    <style jsx>
        {`
            .calendar {
                min-width:1024px;
                width:70%;
                margin:auto;
                margin-top:100px;
                border:1px solid #333;
            }
        `}
    </style>
    <ControlView/>
    <CalendarView/>
</div>


export default class Index extends React.Component {
    static async getInitialProps(ctx, store){
        let res = await axios.get(`http://localhost:${process.env.PORT}/api/schedule/all`);

        if( res.data.code === 'success' ){

            await store.updateSchedules(res.data.items);
        }
    }

    render(){
        return <Render></Render>;
    }
}
