import { useEffect, useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [befolkningstal, setBefolkningstal] = useState([]);

  const fetchData = async () => {
    setLoading(true);

    const body = {
      table: 'BEF5',
      format: 'JSONSTAT',
      variables: [
        {
          code: 'Tid',
          values: ['2017', '2018', '2019', '2020', '2021', '2022'],
        },
      ],
    };

    try {
      const response = await fetch('https://api.statbank.dk/v1/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      const timeArray = Object.keys(data.dataset.dimension.Tid.category.label);
      const valueArray = Object.values(data.dataset.value);

      let newArray = timeArray.map((year, i) => ({
        year,
        value: valueArray[i],
      }));

      setBefolkningstal(newArray);

      // const befolkningstalData = (await data.dataset.value[5]) / 1000000;

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='container'>
        <h1>Loading...</h1>;
      </div>
    );
  }

  return (
    <>
      <div className='container'>
        <h1>Udvikling i Danmarks befolkningstal</h1>
        <br />
        {befolkningstal.map((tal, i) => {
          return (
            <div className='data' key={i}>
              {tal.year}: {(tal.value / 1000000).toFixed(3)} mio.
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
