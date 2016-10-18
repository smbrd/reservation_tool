import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header";


class Layout extends React.Component {
    render(){
        return (
            <div>
                <Header />
            </div>
            );
    }
}

ReactDOM.render(<Layout />, document.getElementById('app'))
