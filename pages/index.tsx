import React from 'react';
import ControlView from '../components/ControlView';
import CalendarView from '../components/CalendarView';
import '../assets/style/calendar.less'

export default () => <div className='calendar'>
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