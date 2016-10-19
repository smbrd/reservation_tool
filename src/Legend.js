import React from "react";

var style = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    textAlign: 'left',
}

export default class Legend extends React.Component{
    render(){
        return(
            <div style={style}>
                Reserve: click not reserved
                <br />
                Release: click reserved
            </div>
        )
    }
}