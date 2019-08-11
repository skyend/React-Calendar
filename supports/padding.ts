export default function zeroPadding( digits, num ){

    let str = num.toString();
    let numLeng = str.length;
    let needPadding = digits - numLeng;
    for(let i =0; i < needPadding; i++ ){
        str = "0" + str;
    }

    return str;
}