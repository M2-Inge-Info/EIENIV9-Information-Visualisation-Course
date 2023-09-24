import logo from './logo.svg';
import './App.css';
import { fetchArtists } from './logic/fetchArtists';
import { useEffect, useState } from 'react';
import Main from './pages/Main';

function App() {

  const [artists, setArtists] = useState([]);
  const [count, setCount] = useState(0);

  const fetchAllArtists = async (offset = 0, limit = 500) => {
    const newArtists = await fetchArtists(offset, limit);
    if (newArtists && newArtists.length > 0) {
      setArtists(prevArtists => [...prevArtists, ...newArtists]);
      setCount(prevCount => prevCount + newArtists.length);
      fetchAllArtists(offset + limit, limit);
    }
  };

  useEffect(() => {
    fetchAllArtists();
  }, []);

  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
