import { useEffect } from "react";
import { refresh } from "./actions/refresh";

export function useRefreshAiContext() {
    useEffect(() => {
        refresh().then();
    }, []);
}