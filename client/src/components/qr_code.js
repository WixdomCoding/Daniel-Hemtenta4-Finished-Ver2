import React from "react";
import qrCode from '../qr_code.png';

function QrCode(props) {
    return (
        <div className="qrcode-div">
            <a href="/book" title="Go to booking page">
                <img src={qrCode} alt="QR Code" className="qrImg" />
            </a>
            <h3>Scan the QR Code to go to the booking site</h3>
        </div>
    );
}

export default QrCode;