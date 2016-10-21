import React from "react";
import Reservations from "./Reservations.js";
import Legend from "./Legend";

var canvas = {
    textAlign: 'center',
    height: '100%',
};


export default class Layout extends React.Component {
    render(){
        return (
            <div style={canvas}>
                <Reservations />
                <Legend />
            </div>
            );
    }
}