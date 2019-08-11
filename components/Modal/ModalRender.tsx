import React from 'react';
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class ModalRender extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>

            </div>
        )
    }
}