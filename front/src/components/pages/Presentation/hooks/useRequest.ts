import { useCallback, useEffect, useState } from "react";


export const useRequest = () => {

    const [data, setData] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [statusText, setStatusText] = useState<string>()
    const [requestData, setRequestData] = useState<any>()

    const fetching = async () => {
        // console.log('requestData', requestData)
        if(requestData){
            const response = await fetch(
                requestData.url,
                {
                    method: requestData.method,
                    body: JSON.stringify(requestData.body),
                    headers: requestData.headers
                }
            )

            if(response.ok){
                const data = await response.json()
                // console.log('data', data)
                setData(data)
                setIsLoading(true)
                setStatusText(response.statusText)
            } else {
                setData('error')
                setIsLoading(true)
                setStatusText(response.statusText)
            }
        }

    }

    useEffect(() => {
        fetching().then()
    }, [requestData])

    return { data, isLoading, statusText, setRequestData }
}