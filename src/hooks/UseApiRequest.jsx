// src/hooks/useApiRequest.js
import { useState } from "react";
import axios from "axios";

const useApiRequest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async ({ method = "get", url, payload = {} }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method,
        url,
        ...(method.toLowerCase() === "get"
          ? { params: payload }
          : { data: payload }),
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, request };
};

export default useApiRequest;
