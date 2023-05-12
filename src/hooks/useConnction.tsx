import React, { useCallback, useEffect } from "react";
import { usePlayerSelection } from "foxglove-studio/packages/studio-base/src/context/PlayerSelectionContext";

import { SELECTED_SOURVE_ID, FOXGLOVE_WS_URL} from "@/data/foxglove";

export const useConnction = () => {

    const { selectSource } = usePlayerSelection();
    const selectedSourceId = SELECTED_SOURVE_ID;
    const fieldValuesself ={ url: FOXGLOVE_WS_URL };

    const onOpen = useCallback(() => {
        if (!selectedSourceId) {
            return;
        };

        selectSource(selectedSourceId, { type: "connection", params: fieldValuesself });
    }, [selectedSourceId, fieldValuesself, selectSource]);

    return { onOpen };
}