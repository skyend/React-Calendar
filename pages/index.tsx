import React from 'react';
import ControlView from '../components/ControlView';
import CalendarView from '../components/CalendarView';
import '../assets/style/calendar.less';
import instance from "../supports/api";

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

        try{

            let res = await  instance().get(`/api/schedule/all`);

            if( res.data.code === 'success' ){

                await store.updateSchedules(res.data.items);
            }
        }catch (e) {
            console.log(e);
        }

    }

    render(){
        return <Render></Render>;
    }
}
