import {types} from "mobx-state-tree";

export const ScheduleModel  = types
    .model({
        id: types.string,
        year: types.number,
        month: types.number,
        day: types.number,
        hour: types.number,
        name: types.string,
    });
