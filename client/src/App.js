import React, { useState, useEffect } from 'react';
import Search from './common/SearchBar';
import Results from './common/ResultsArea';
import HelpInfo from './common/HelpArea';
import { conf } from './config';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(conf.serverUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.search) {
          console.log(data.search);
          setData(data.search);
        }
      });
  }, []);

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
          <HelpInfo />
          <Search data={data} setResults={setResults} />
          <Results results={results} />
        </div>
      </header>
    </div>
  );
}

export default App;
