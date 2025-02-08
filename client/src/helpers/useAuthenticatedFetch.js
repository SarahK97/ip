import { useState, useEffect } from 'react';
import axios from 'axios';

//simplifies the process of fetching data from an API while taking care of authentication
const useAuthenticatedFetch = (url, server) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${server}${url}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData().then();
        } else {
            setLoading(false);
        }
    }, [url, server, token]);

    return { data, error, loading };
};

export default useAuthenticatedFetch;
