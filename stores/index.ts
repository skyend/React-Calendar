import React from 'react';
import {
    applySnapshot,
    Instance,
    SnapshotIn,
    SnapshotOut,
    types,
} from 'mobx-state-tree'
import {decreaseMonth, decreaseWeek, increaseMonth, increaseWeek} from "../supports/dateCalculator";
import {ScheduleModel} from "./scheduleModel";

let store: IStore = null as any;

const Store = types
    .model({
        lastUpdate: types.Date,
        year: types.number,
        month: types.number,
        week: types.number,
        type: types.string,
        startHour: types.number,
        endHour: types.number,

        schedules: types.array(ScheduleModel),
        dragSchedule : types.maybeNull(ScheduleModel ),
        hoveringCell : types.maybeNull(ScheduleModel),
    })
    .actions(self => {

        const startDrag = (schedule) => {
            self.dragSchedule = schedule;
        }

        const hoverCell = (schedule) => {
            self.hoveringCell = schedule;
        }

        const endDrag = () => {
            // self.dragSchedule = null;
            self.hoveringCell = null;
        }

        const updateSchedules = (schedules) => {
            self.lastUpdate = new Date();

            self.schedules = schedules;
        }

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

        return { prevMonth, prevYear, nextMonth, nextYear, showMonthly, showWeekly, nextWeek, prevWeek, updateSchedules, startDrag, hoverCell, endDrag }
    })

export type IStore = Instance<typeof Store>
export type IStoreSnapshotIn = SnapshotIn<typeof Store>
export type IStoreSnapshotOut = SnapshotOut<typeof Store>

export const initializeStore = (isServer, snapshot = null) => {
    let date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth();

    if (isServer) {
        store = Store.create({ year, month, lastUpdate: Date.now(), type:'monthly', week:0, startHour : 8, endHour: 22, dragSchedule: null, hoveringCell:null})
    }
    if ((store as any) === null) {
        store = Store.create({ year, month, lastUpdate: Date.now(), type:'monthly', week:0,startHour : 8, endHour: 22,dragSchedule: null, hoveringCell:null})
    }
    if (snapshot) {
        applySnapshot(store, snapshot)
    }
    return store
}
