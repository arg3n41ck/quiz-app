import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = "https://opentdb.com";

const useAxios = ({ url }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (() => {
      axios
        .get(url)
        .then(({ data }) => setResponse(data))
        .catch(setError)
        .finally(() => setLoading(false));
    })();
  }, [url]);

  return { response, error, loading };
};

export default useAxios;
