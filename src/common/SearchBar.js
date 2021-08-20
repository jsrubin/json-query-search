import React, { useEffect, useState } from 'react';
import Icon from './SearchIcon';
import { onSearch } from '../helper';

const onClickSearch = async ({ data, query, setResults }) => {
  const results = await onSearch({ data, query });
  setResults(results);
};

const Search = ({ data, setResults, dataTimestamp }) => {
  const [query, onChange] = useState('');

  const onType = e => {
    onChange(e.target.value);
  };

  const handleKeypress = e => {
    //it triggers by pressing the enter key
    if (e.charCode === 13) {
      e.preventDefault(); // Enter default will reload page
      e.stopPropagation();
      onClickSearch({ data, query, setResults });
    }
  };

  useEffect(
    () => {
      if (data && Array.isArray(data) && data.length > 0) {
        onClickSearch({ data, query, setResults });
      }
    }, // eslint-disable-next-line
    [dataTimestamp]
  );

  return (
    <form>
      <div style={{ display: 'inline-flex' }}>
        <input
          type="text"
          name="name"
          placeholder="filter query"
          value={query}
          onChange={onType}
          onKeyPress={handleKeypress}
          autoComplete="off"
          style={{
            width: '48.5vw',
            height: '40px',
            borderRadius: '8px 0 0 8px',
            border: 'none',
            paddingLeft: '8px',
            marginTop: '2px'
          }}
        />
        <div
          style={{
            height: '42px',
            width: '32px',
            borderRadius: '0 8px 8px 0',
            color: '#fff',
            backgroundColor: '#00cc00',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2px'
          }}
          onClick={e => {
            e.preventDefault(); // Enter default will reload page
            e.stopPropagation();
            onClickSearch({ data, query, setResults });
          }}
        >
          <Icon />
        </div>
      </div>
    </form>
  );
};

export default Search;
