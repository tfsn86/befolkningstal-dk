import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from 'recharts';

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
          values: [
            '1990',
            '1991',
            '1992',
            '1993',
            '1994',
            '1995',
            '1996',
            '1997',
            '1998',
            '1999',
            '2001',
            '2002',
            '2003',
            '2004',
            '2005',
            '2006',
            '2007',
            '2008',
            '2009',
            '2010',
            '2011',
            '2012',
            '2013',
            '2014',
            '2015',
            '2016',
            '2017',
            '2018',
            '2019',
            '2020',
            '2021',
            '2022',
            '2023'
          ],
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
      const valueArrayToFixed = valueArray.map((item) => {
        return (item / 1000000).toFixed(3);
      });

      let newArray = timeArray.map((year, i) => ({
        År: year,
        Antal: valueArrayToFixed[i],
      }));

      setBefolkningstal(newArray);

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
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div className='container'>
        <h1>Udvikling i Danmarks befolkningstal pr. 1. januar 1990-2022</h1>
        <br />
        <br />
        <br />
        <ResponsiveContainer width='100%' height={400}>
          <LineChart
            width={840}
            height={400}
            data={befolkningstal}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type='monotone' dataKey='Antal' stroke='#211773' />
            <CartesianGrid stroke='#ccc' vertical={false} opacity={0.8} />
            <XAxis dataKey='År' />
            <YAxis
              type='number'
              domain={[5, 6]}
              axisLine={false}
              tickLine={false}
              tickCount={6}
              tickFormatter={(number) => `${number.toFixed(1)}`}
            >
              <Label
                angle={-90}
                value='Antal (mio.)'
                position='insideLeft'
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Tooltip content={<CustomToolTip />} />
          </LineChart>
        </ResponsiveContainer>
        <br />
        <p>
          Kilde: Danmarks Statistik -{' '}
          <a
            href='https://statistikbanken.dk/bef5'
            target='_blank'
            rel='noreferrer'
          >
            https://statistikbanken.dk/bef5
          </a>
        </p>
      </div>
    </>
  );
}

function CustomToolTip({ active, payload, label }) {
  if (active) {
    return (
      <div className='tooltip'>
        <h4>{label}</h4>
        <p>{payload[0].value} mio.</p>
      </div>
    );
  }
  return null;
}

export default App;
