import React from 'react';
import ControlView from '../components/ControlView';
import CalendarView from '../components/CalendarView';
import '../assets/style/calendar.less';
import instance from "../supports/api";
import {inject} from "mobx-react";
import ModalStore from "../stores/modalStore";

const Render = () => <div >
    <style jsx>
        {`
            .writer {
                text-align:center;
                padding:10px;
                color:#165eff;
            }
            .calendar {
                min-width:1024px;
                width:70%;
                margin:auto;
                margin-top:100px;
                border:1px solid #333;
                box-shadow: 50px 50px 0px 0px #6b94debf;
            }
        `}
    </style>
    <div className='writer'>
       Author : 한승훈 - theskyend0@gmail.com
    </div>
    <div className='calendar'>
        <ControlView/>
        <CalendarView/>
    </div>
</div>

interface IMyOwnProps {
    modal? : ModalStore
}
@inject('modal')
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
