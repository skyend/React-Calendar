import { action, observable } from 'mobx'
import { useStaticRendering } from 'mobx-react'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

export class Store {
    @observable lastUpdate = null;
    @observable year = 0
    @observable month = 0

    constructor(){
        let date = new Date();

        this.year = date.getUTCFullYear();
        this.month = date.getUTCMonth();
    }

    hydrate(serializedStore) {
        this.lastUpdate =
            serializedStore.lastUpdate != null
                ? serializedStore.lastUpdate
                : Date.now()
        this.year = serializedStore.year
        this.month = serializedStore.month
    }

    @action nextMonth = () => {
        this.lastUpdate = Date.now()
        this.month++;
        if( this.month > 12 ){
            this.year++;
            this.month = 1;
        }
    }
}

export async function fetchInitialStoreState() {
    return {}
}