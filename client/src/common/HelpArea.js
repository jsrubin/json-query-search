import React from 'react';
import { conf } from '../config';

const HelpInfo = () => {
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
        defaultValue={conf.exampleQueries}
        style={{
          width: '755px',
          height: '160px',
          fontSize: '.8rem',
          borderRadius: '8px',
          color: '#000',
          backgroundColor: 'lightgrey',
          padding: '8px'
        }}
      />
    </div>
  );
};

export default HelpInfo;
