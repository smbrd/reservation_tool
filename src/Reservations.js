import React from 'react';
import RcTable from 'rc-table';
import Cookies from 'z-cookies';
import _ from 'lodash';
import 'rc-table/assets/index.css';
import 'rc-table/assets/animation.css';
import '../styles.css';


function getCurrentUser(){
    var name = Cookies.get('name');

    if ( !name )
        name = window.prompt('Name, please', '');
    if ( name )
        Cookies.set('name', name);

    return name;
}

function today(){
    return new Date().toDateString();
}

function expires(){
    var expiration = new Date();
    expiration.setHours(18);
    expiration.setMinutes(0);
    expiration.setSeconds(0);
    return expiration;
}

function todayStart(){
    var start = new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    return start;
}

function todayEnd(){
    var end = new Date();
    end.setHours(24);
    end.setMinutes(0);
    end.setSeconds(0);
    return end;
}

function sendReservationChange(carrier, user){
    fetch('/change_reservation', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            carrier: carrier,
            user: user,
            date: new Date()
        })
    });
}

function reserve(carrier, user){
    console.log('Reserve carrier ' + carrier + ' for user ' + user);
    sendReservationChange(carrier, user);
}

function releaseReservation(carrier){
    console.log('Release reservation for carrier ' + carrier);
    sendReservationChange(carrier, '');
}

const onRowClick = (record, index, event) => {
    var currentUser = getCurrentUser();

    if( !currentUser )
        return;
    
    if(record.user){
        if(record.user == currentUser){
            releaseReservation(record.carrier);
        }
        else{
            if(confirm('Are you sure you want to overwrite the reservation?')){
                reserve(record.carrier, currentUser);
            }
        }
    }
    else{
        reserve(record.carrier, currentUser);
    }
};

const columns = [
  { title: 'Carrier', dataIndex: 'carrier', key: 'carrier', className: 'reservations' },
  { title: 'Reserved by', dataIndex: 'user', key: 'user', className: 'reservations'},
];

var table_style = {
  display: 'inline-block',
  cursor: 'pointer',
};

function filterCurrentReservation(reservation){
    if( reservation.date != ''){
        if( Date.parse(reservation.date) < Date.parse(todayStart()) ){
            reservation.user = '';
        }

        console.log();

        if( Date.parse(reservation.date) < Date.parse(expires()) && Date.parse(expires()) < Date.parse(new Date())){
            reservation.user = '';
        }
    }
    return reservation;
}


export default class Reservations extends React.Component{
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    fetch(){
        fetch('data/reservations.json').then((response) => response.json()).then((responseJson) => {
            var sortedReservations = _.sortBy(responseJson.data, ['carrier']);
            var currentReservations = _.map(sortedReservations, filterCurrentReservation);
            this.setState({data: currentReservations});
        })
        .catch((error) => {
            console.error(error);
        })
    }

    componentDidMount() {
        this.fetch();
        setInterval(this.fetch.bind(this), 1000);
    }

    render(){
        return(
            <RcTable style={table_style} columns={columns} data={this.state.data} onRowClick={onRowClick} />
        )
    }
};

