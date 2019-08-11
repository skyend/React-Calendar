import {
    applySnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree'
import {decreaseMonth, increaseMonth} from "../supports/dateCalculator";

let store: IStore = null as any

const Store = types
    .model({
        lastUpdate: types.Date,
        year: types.number,
        month: types.number,
    })
    .actions(self => {

        const prevMonth = () => {
            self.lastUpdate = new Date();

            let {month, year} = decreaseMonth({
                month: self.month,
                year: self.year,
            })

            self.month = month;
            self.year = year;
        }

        const prevYear = () => {
            self.lastUpdate = new Date();
            self.year--;
        }

        const nextMonth = () => {
            self.lastUpdate = new Date();

            let {month, year} = increaseMonth({
                month: self.month,
                year: self.year,
            })

            self.month = month;
            self.year = year;
        }

        const nextYear = () => {
            self.lastUpdate = new Date();
            self.year++;
        }

        return { prevMonth, prevYear, nextMonth, nextYear }
    })

export type IStore = Instance<typeof Store>
export type IStoreSnapshotIn = SnapshotIn<typeof Store>
export type IStoreSnapshotOut = SnapshotOut<typeof Store>

export const initializeStore = (isServer, snapshot = null) => {
    let date = new Date();

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();


    if (isServer) {
        store = Store.create({ year, month, lastUpdate: Date.now()})
    }
    if ((store as any) === null) {
        store = Store.create({ year, month, lastUpdate: Date.now()})
    }
    if (snapshot) {
        applySnapshot(store, snapshot)
    }
    return store
}