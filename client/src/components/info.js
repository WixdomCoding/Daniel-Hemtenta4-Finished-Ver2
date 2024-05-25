import React from "react";

function Info(props) {
    return (
        <div className="personInfo">
            <div className="personInfo-image">
                <a href="/admin" title="Go to admin page">
                    <img src={props.img} className="personInfo-logo" alt="logo" />
                </a>
            </div>
            <div className="personInfo-text">
                <p>{props.name}</p>
                <p>{props.role}</p>
                <p>{"Num: " + props.number}</p>
                <p>{"Mail: " + props.mail}</p>
            </div>
        </div>
    );
}

export default Info;
