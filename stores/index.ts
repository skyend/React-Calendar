import {
    applySnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree'
import {decreaseMonth, decreaseWeek, increaseMonth, increaseWeek} from "../supports/dateCalculator";

let store: IStore = null as any

const Store = types
    .model({
        lastUpdate: types.Date,
        year: types.number,
        month: types.number,
        week: types.number,
        type: types.string,
        startHour: types.number,
        endHour: types.number,
    })
    .actions(self => {

        const showMonthly = () => {
            self.lastUpdate = new Date();

            self.type = 'monthly';
        }

        const showWeekly = () => {
            self.lastUpdate = new Date();

            self.type = 'weekly';
        }

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

        const nextWeek = () => {
            self.lastUpdate = new Date();

            let {month, year, week} = increaseWeek({
                month: self.month,
                year: self.year,
                week: self.week,
            })

            self.month = month;
            self.year = year;
            self.week = week;
        }

        const prevWeek = () => {
            self.lastUpdate = new Date();

            let {month, year, week} = decreaseWeek({
                month: self.month,
                year: self.year,
                week: self.week,
            })

            self.month = month;
            self.year = year;
            self.week = week;
        }

        return { prevMonth, prevYear, nextMonth, nextYear, showMonthly, showWeekly, nextWeek, prevWeek }
    })

export type IStore = Instance<typeof Store>
export type IStoreSnapshotIn = SnapshotIn<typeof Store>
export type IStoreSnapshotOut = SnapshotOut<typeof Store>

export const initializeStore = (isServer, snapshot = null) => {
    let date = new Date();

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();


    if (isServer) {
        store = Store.create({ year, month, lastUpdate: Date.now(), type:'monthly', week:0, startHour : 10, endHour: 20})
    }
    if ((store as any) === null) {
        store = Store.create({ year, month, lastUpdate: Date.now(), type:'monthly', week:0,startHour : 10, endHour: 20 })
    }
    if (snapshot) {
        applySnapshot(store, snapshot)
    }
    return store
}