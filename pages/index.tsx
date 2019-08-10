import React from 'react';
import ControlView from '../components/ControlView';
import CalendarView from '../components/CalendarView';

export default () => <div className='calendar'>
    <style jsx>
        {`
            .calendar {
                width:60%; 
                margin:auto;
                margin-top:100px;
                border:1px solid #333;
            }
        `}
    </style>
    <ControlView/>
    <CalendarView/>
</div>