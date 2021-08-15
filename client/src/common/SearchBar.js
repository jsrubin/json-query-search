import React, { useState } from 'react';
import Icon from './SearchIcon';
import { onSearch } from '../helper';

const onClickSearch = async ({ data, query, setResults }) => {
  const results = await onSearch({ data, query });

  console.log('\n\n done results', results);

  setResults(results);
};

const Search = ({ data, setResults }) => {
  const [query, onChange] = useState('');

  const onType = e => {
    onChange(e.target.value);
  };

  return (
    <form>
      <div style={{ display: 'inline-flex' }}>
        <input
          type="text"
          name="name"
          value={query}
          onChange={onType}
          autoComplete="off"
          style={{
            width: '70vw',
            height: '30px',
            borderRadius: '8px 0 0 8px',
            border: 'none',
            paddingLeft: '8px'
          }}
        />
        <div
          style={{
            height: '32px',
            width: '32px',
            borderRadius: '0 8px 8px 0',
            color: '#fff',
            backgroundColor: '#00cc00',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => onClickSearch({ data, query, setResults })}
        >
          <Icon />
        </div>
      </div>
    </form>
  );
};

export default Search;
