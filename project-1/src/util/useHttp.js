import { use, useCallback, useEffect } from "react";
import { useState } from "react";


async function sendHttpRequest(url,config) {
    const response = await fetch(url,config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }

    return data;
}

export default function useHttp( url, config, initialData ) {
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function clearData() {
        setData(initialData);
    }
    
    const sendRequest = useCallback(async function sendRequest(data) {
        setIsLoading(true);
        try{
            const resData = await sendHttpRequest( url , {...config, body: data } );
            setData(resData);
        }catch(err) {
            setError(err.message || 'Something went wrong!');
        }
        setIsLoading(false);
    }
    ,[ url, config ]);
    
    useEffect(() => {
       if (config && (config.method === 'GET' || !config.method) ) {
           sendRequest();
       }
    }, [sendRequest, config]);

return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData
  }
};