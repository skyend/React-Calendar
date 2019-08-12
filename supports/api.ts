import axios from 'axios';


export default function instance(){
    const isServer = typeof window === 'undefined';


    if( isServer ){
        return axios.create({
            baseURL : `http://localhost:${process.env.PORT || 3000}/`
        })
    }

    return axios;
}