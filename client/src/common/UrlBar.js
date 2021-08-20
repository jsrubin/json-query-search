import React, { useState } from 'react';

const isUrl = string => {
  try {
    return Boolean(new URL(string));
  } catch (e) {
    return false;
  }
};

const UrlBar = ({ setUrl, defaultUrl }) => {
  const [url, onChange] = useState(defaultUrl);

  const onType = e => {
    onChange(e.target.value);
  };

  const handleKeypress = e => {
    //it triggers by pressing the enter key
    if (e.charCode === 13) {
      e.preventDefault(); // Enter default will reload page
      e.stopPropagation();
      if (isUrl(url)) {
        setUrl(url);
      }
    }
  };

  return (
    <form>
      <div style={{ display: 'inline-flex' }}>
        <input
          type="text"
          name="name"
          placeholder="URL"
          value={url}
          onChange={onType}
          onKeyPress={handleKeypress}
          autoComplete="off"
          style={{
            width: '50.5vw',
            height: '40px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            paddingLeft: '8px',
            backgroundColor: 'grey',
            fontColor: '#fff',
            fontSize: '1.1rem',
            margin: '2px'
          }}
        />
        {/* <div
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
          onClick={e => {
            e.preventDefault(); // Enter default will reload page
            e.stopPropagation();
            if (isUrl(url)) {
              setUrl(url);
            }
          }}
        >
          LOAD
        </div> */}
      </div>
    </form>
  );
};

export default UrlBar;
