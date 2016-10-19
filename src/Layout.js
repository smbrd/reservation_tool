import React from "react";
import Table from "./Table.js";
import Legend from "./Legend";

var canvas = {
    textAlign: 'center',
    height: '100%',
};


export default class Layout extends React.Component {
    render(){
        return (
            <div style={canvas}>
                <Table />
                <Legend />
            </div>
            );
    }
}