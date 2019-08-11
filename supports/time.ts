export function hour24to12(hour24){
    let convertedHour;
    let am = false;

    convertedHour = hour24 % 12;

    if( convertedHour === 0 ){
        convertedHour = 12;
    }

    if( hour24 <= 12 ){
        am = true;
    }

    return {
        am,
        hour : convertedHour,
    }
}