import {func} from "prop-types";

export interface IYearMonth {
    month: number;
    year: number;
    week?:number;
    day?: number;
}

const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const WEEK_DAYS = '일월화수목금토'.split('');

export function increaseMonth(date: IYearMonth) {
    let month = date.month;
    let year = date.year;

    month = month + 1;
    if (month > 11) {
        year++;
        month = 0;
    }

    return {
        month,
        year,
    }
}

export function decreaseMonth(date: IYearMonth) {
    let month = date.month;
    let year = date.year;

    month = month -1;
    if (month < 0) {
        year--;
        month = 11;
    }

    return {
        month,
        year,
    }
}

export function increaseWeek(date: IYearMonth) {
    const totalWeeks = getTotalWeeks(date);
    let year = date.year;
    let month = date.month;
    let week = date.week;

    week = week + 1;

    if( week >= totalWeeks ){
        week = 0;
        let newDate = increaseMonth(date);

        year = newDate.year;
        month = newDate.month;
    }


    return {
        year,
        month,
        week,
    }
}

export function decreaseWeek(date: IYearMonth) {
    let year = date.year;
    let month = date.month;
    let week = date.week;

    week = week - 1;

    if( week < 0 ){

        let prevMonth = decreaseMonth(date);
        let totalWeeks = getTotalWeeks(prevMonth);

        week = totalWeeks -1;
        year = prevMonth.year;
        month = prevMonth.month;
    }


    return {
        year,
        month,
        week,
    }
}

export function getTotalWeeks(date:IYearMonth){
    const monthStartDay = monthBeginDayOfWeek(date);
    const totalDays = monthStartDay + getMonthDays(date);
    console.log(Math.ceil(totalDays/7))
    return Math.ceil(totalDays/7);
}

export function getMonthDays(date:IYearMonth){

    if( date.month === 1 ){ // February
        // calculate Leap Month
        if( date.year % 4 === 0  ){
            if( date.year % 100 !== 0 && date.year % 400 === 0 ){
                return 29;
            }
        }

        return 28;
    }

    return daysOfMonths[date.month];
}

export function buildCalendarDaysMap(totalScreenDays, monthBeginDayOfWeek, monthDays, lastMonthDays){
    let rows = Math.ceil(totalScreenDays / 7);
    let startDay = lastMonthDays - monthBeginDayOfWeek;
    let arrayMap = [];

    let cursor ;
    for(let i = 0; i < rows; i++ ){
        arrayMap.push([]);
        for(let j = 0; j < 7; j++ ){
            cursor = i * 7 + j;

            if( cursor < monthBeginDayOfWeek ){
                arrayMap[i].push( startDay + cursor );
            } else if ( cursor < monthBeginDayOfWeek + monthDays  ){
                arrayMap[i].push( cursor - monthBeginDayOfWeek );
            } else {
                arrayMap[i].push( cursor - (monthBeginDayOfWeek + monthDays) );
            }
        }
    }

    return arrayMap;
}


export function monthBeginDayOfWeek(date:IYearMonth) {
    // find out day of Week of the first day of Month
    const nativeDate = new Date(`${date.year}/${date.month+1}/1`);

    return nativeDate.getDay();
}