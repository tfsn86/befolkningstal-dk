import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [befolkningstal, setBefolkningstal] = useState({});

  const fetchData = async () => {
    setLoading(true);

    const body = { table: 'BEF5', format: 'JSONSTAT' };

    try {
      const response = await fetch('https://api.statbank.dk/v1/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      const befolktningstalData = (await data.dataset.value[0]) / 1000000;

      setBefolkningstal(befolktningstalData);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <h1>loading...</h1>;
  }

  return (
    <>
      <h1>Danmarks befolkningstal: {befolkningstal.toFixed(3)} mio.</h1>
    </>
  );
}

export default App;
