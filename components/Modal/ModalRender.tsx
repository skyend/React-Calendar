import React from 'react';
import {inject, observer} from "mobx-react";
import ModalStore from "../../stores/modalStore";


interface IMyOwnProps {
    modal? : ModalStore,
}

@inject('modal')
@observer
export default class ModalRender extends React.Component<IMyOwnProps> {
    constructor(props){
        super(props);
    }

    renderModal(Component, props, i){
        console.log(Component, props)
        return (
            <div className='wrap' key={i}>

                <style jsx>{`
                    .wrap {
                        position:fixed;
                        left:0;
                        top:0;
                        width:100%;
                        height:100%;
                        background-color:rgba(0,0,0,.3);
                    }
                    
                    .wrapper {  
                        position:relative;
                        width:100%;
                        height:100%;
                        left: 0;
                        right:0;
                        text-align:center;
                        overflow:scroll;
                    }
                    
                    .wrapper:before {
                        width:0;
                        content:" ";
                        height:100%;
                        display:inline-block;
                        vertical-align:middle;
                    } 
                    
                    .modal {  
                        background-color: white;  
                        padding: 10px;  
                        text-align: center;
                        display:inline-block;
                        vertical-align:middle;
                        border-radius:10px;
                        box-shadow:0 0 100px 0 rgba(0,0,0,0.3);
                    }
                `}</style>
                <div className='wrapper'>
                    <div className='modal'>
                        <Component {...props} close={this.props.modal.close}/>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return (
            <div className='modal-renderer'>
                <style>{`
                    .modal-renderer {
                        position:fixed;
                        left:0;
                        top:0;
                    }
                `}</style>
                {
                    this.props.modal.modalStack.map((modal, i) => this.renderModal(modal.component, modal.props, i))
                }
            </div>
        )
    }
}