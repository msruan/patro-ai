import { useEffect } from "react";
import { refresh } from "./actions/refresh";
import { toast } from "sonner";

export function useRefreshAiContext() {
    useEffect(() => {
        async function fetchContext() {
            try {
                await refresh();
            }
            catch (err) {
                toast.error('Não foi possível recuperar o contexto adicional de ADS!', { richColors: true })
            }
        }

        fetchContext();
    }, [])
}