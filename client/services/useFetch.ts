import { useCallback, useEffect, useRef, useState } from 'react';

type Params = {
  // Polling interval
  interval: number;
  // Flag tells whether to initiate API call on component mount
  enabled?: boolean;
  // Function tells whether to retry or not.
  shouldRetry: (retriesCount: number, error: any) => boolean;
  // Post body object to send API
  body: any;
  api: () => Promise<any>;
};

const useFetch = <TData>({
  body,
  enabled,
  interval,
  shouldRetry,
  api,
}: Params) => {
  // Stores the current timer id.
  const timerRef = useRef<number>();
  // Stores the post body. This helps to compare between the current and previous body.
  const previousBodyRef = useRef<any>();
  // No of attempts tried so far
  const retriesCountRef = useRef(0);

  const [loading, setLoading] = useState(enabled);
  const APIErrorRef = useRef<any>(null);
  const [data, setData] = useState<TData>();

  // Function fetches API and sets the results in state if its success.
  // If the call failed then it calls shouldRetry function to check
  // whether to retry or not. If the function returns true the retry
  // is scheduled with a given retry interval.
  const fetchAPI = useCallback(async () => {
    // console.log('pending');

    setLoading(true);
    try {
      const response = await api();
      setData(response);
      setLoading(false);
      // console.log('success', response);
    } catch (error: unknown) {
      // console.log('fail', error);
      APIErrorRef.current = error;
      if (!shouldRetry(retriesCountRef.current, APIErrorRef.current)) {
        setLoading(false);
        return;
      }
      retriesCountRef.current += 1;

      // Calls the same function again after the given retry interval.
      timerRef.current = window.setTimeout(() => {
        fetchAPI();
      }, interval);
    }
  }, [interval, shouldRetry, api]);

  // This effect gets called when the body or enabled param changes.
  useEffect(() => {
    // console.log('skip API?', !enabled, previousBodyRef.current === body);
    if (!enabled || previousBodyRef.current === body) {
      return;
    }

    // Clearing the pending timers so that current polling will be  stopped.
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Resetting the variables
    retriesCountRef.current = 0;
    APIErrorRef.current = null;

    setData(undefined);
    setLoading(undefined);
    // Initiating API call
    fetchAPI();

    // Caching the previous body to compare
    previousBodyRef.current = body;
  }, [body, enabled, fetchAPI]);

  // Clears the current timer when the component unmounts,
  // which will stop polling.
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  return { data, error: APIErrorRef.current, loading };
};

export default useFetch;
