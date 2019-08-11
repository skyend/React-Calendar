import {action, observable} from "mobx";


export default class ModalStore {
    @observable.shallow
    modalStack = [];


    @action.bound
    open(component, props){
        console.log('aa')
        this.modalStack.push({
            component,
            props,
        })
    }

    @action.bound
    close(){
        this.modalStack.pop();
    }
}