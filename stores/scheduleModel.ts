import {types} from "mobx-state-tree";

export const ScheduleModel  = types
    .model({
        id: types.maybeNull(types.string),
        year: types.number,
        month: types.number,
        day: types.number,
        hour: types.maybeNull(types.number),
        name: types.maybeNull(types.string),
    });
