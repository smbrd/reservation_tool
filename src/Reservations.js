import React from "react";
import RcTable from "rc-table";
import Cookies from "z-cookies";
import _ from "lodash";
import 'rc-table/assets/index.css';
import 'rc-table/assets/animation.css';


function getCurrentUser(){
    var name = Cookies.get("name");

    if ( !name )
        name = window.prompt("Name, please", "");
    if ( name )
        Cookies.set("name", name);

    return name;
}

function today(){
    return new Date().toDateString();
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
            date: today()
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
            if(confirm("Are you sure you want to overwrite the reservation?")){
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

function checkIfCurrentReservation(reservation){
    if( reservation.date != today() )
        reservation.user = "";
    return reservation;
}

export default class Reservations extends React.Component{
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    fetch(){
        fetch("data/reservations.json").then((response) => response.json()).then((responseJson) => {
            var sortedReservations = _.sortBy(responseJson.data, ["carrier"]);
            var currentReservations = _.map(sortedReservations, checkIfCurrentReservation);
            this.setState({data: currentReservations});
        })
        .catch((error) => {
            console.error(error);
        })
    }

    componentDidMount() {
        setInterval(this.fetch.bind(this), 1000);
    }

    render(){
        return(
            <RcTable style={table_style} columns={columns} data={this.state.data} onRowClick={onRowClick} />
        )
    }
};

