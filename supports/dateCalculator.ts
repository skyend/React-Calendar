export interface IYearMonth {
    month: number;
    year: number;
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