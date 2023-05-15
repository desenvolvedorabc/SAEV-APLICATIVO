import React, { useRef, useState } from "react";
import IdleTimer from "react-idle-timer";
let countdownInterval;
let timeout;
const SessionTimeout = ({ logOut }) => {
    const handleLogout = async () => {
        try {
            logOut();
        } catch (err) {
            console.error(err);
        }
    };
    const onIdle = () => {
        handleLogout();
    };
    return (
        <>
            <IdleTimer
                onIdle={onIdle}
                debounce={250}
                timeout={3600000}
            />
        </>
    );
}
export default SessionTimeout;