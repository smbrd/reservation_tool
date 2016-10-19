import React from "react";

var style={
    position: 'absolute',
    bottom: '0',
    left: '0',
}
export default class Legend extends React.Component{
    render(){
        return(
            <div style={style}>
                <p>Reserve: single click</p>
                <p>Release: double click</p>
            </div>
        )
    }
}