import React from "react";
import axios from "axios";

function Status(props) {
    const [available, setAvailable] = React.useState(null);

    axios.get('/api/avaiability')
        .then(res => {
            setAvailable(res.data.avaiability.isAvailable);
        })
        .catch(err => {
            console.error(err);
        });

    if (available) {
        return (
            <div className="status available">
                <h3>{props.name + " is currently available"}</h3>
            </div>
        );
    } else if(!available && available !== null){
        return (
            <div className="status unavailable">
                <h3>{"Meeting in progress, please do not disturb"}</h3>
            </div>
        );
    }else{
        return(<div>Loading...</div>);
    }
}

export default Status;