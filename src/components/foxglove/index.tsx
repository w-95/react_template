import React from "react";

import { useConnction } from "@/hooks/useConnction";

const FoxGlove = () => {

    const { onOpen } = useConnction();
    // const onOpen = () => {}

    return (
        <div onClick={onOpen}>123</div>
    )
};

export default FoxGlove;