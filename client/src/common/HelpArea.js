import React from 'react';
import { conf } from '../config';

const HelpInfo = props => {
  const { data } = props;
  const singleData = Array.isArray(data) && data.length > 0 ? data[0] : {};
  const stringProp = Object.keys(singleData).find(
    key => typeof singleData[key] === 'string'
  );
  const intProp = Object.keys(singleData).find(
    key => typeof singleData[key] === 'number'
  );
  const exampleText = conf.exampleQueries
    .replace(/\[prop1\]/g, stringProp)
    .replace(/\[prop2\]/g, intProp);
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <textarea
        value={exampleText}
        onChange={() => exampleText}
        style={{
          width: '50vw',
          height: '160px',
          fontSize: '.8rem',
          borderRadius: '0 0 8px 8px',
          color: '#000',
          backgroundColor: 'lightgrey',
          padding: '8px'
        }}
      />
    </div>
  );
};

export default HelpInfo;
