import React, { useState, useEffect } from 'react';
import Search from './common/SearchBar';
import Results from './common/ResultsArea';
import HelpInfo from './common/HelpArea';
import UrlBar from './common/UrlBar';
import './App.css';

function App() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [data, setData] = useState({
    timestamp: new Date().getTime(),
    data: []
  });
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          console.log(data);
          setData({ timestamp: new Date().getTime(), data });
        }
      });
  }, [url]);

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            position: 'fixed',
            width: '100%',
            top: '20px'
          }}
        >
          search
          <UrlBar setUrl={setUrl} defaultUrl={url} />
          <HelpInfo data={data.data} />
          <Search
            data={data.data}
            dataTimestamp={data.timestamp}
            setResults={setResults}
          />
          <Results results={results} />
        </div>
      </header>
    </div>
  );
}

export default App;
