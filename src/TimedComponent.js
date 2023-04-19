import React, { useState, useEffect } from "react";

const TimedComponent = ({element: Element, timeout: Timeout}) => {

    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
        setInterval(() => {
            setShowComponent(!showComponent);
            }, Timeout);
        }, []);

    return (showComponent && Element);
};

export default TimedComponent;