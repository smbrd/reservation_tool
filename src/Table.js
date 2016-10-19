import React from "react";
import RcTable from "rc-table";
require('rc-table/assets/index.css');
require('rc-table/assets/animation.css');


function getCurrentUser(){
    return "Mateusz M.";
}

function sendReservationChange(carrier, user){

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
    
    if(record.reserved_by){
        if(record.reserved_by == currentUser){
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
  
    /*
    if (event.shiftKey) {
        console.log('Shift + mouse click triggered.');
    }
    */
};


const data = [
  { carrier: 'AA', reserved_by: 'Mateusz M.'},
  { carrier: 'AB', reserved_by: 'smbrd'},
  { carrier: '11'},
];

const columns = [
  { title: 'Carrier', dataIndex: 'carrier', key: 'carrier', className: 'center' },
  { title: 'Reserved by', dataIndex: 'reserved_by', key: 'reserved_by', className: 'center'},
];

var table_style = {
  display: 'inline-block',
  align: 'center',
  cursor: 'pointer',
};


export default class Table extends React.Component{
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        fetch("data/reservations.json").then((response) => response.json()).then((responseJson) => {
            this.setState({data: responseJson.data});
        })
        .catch((error) => {
            console.error(error);
        })
    }

    render(){
        return(
            <RcTable style={table_style} columns={columns} data={this.state.data} onRowClick={onRowClick} />
        )
    }
};

