import React from 'react';
import ReactJson from 'react-json-view';

const Results = ({ results }) => {
  if (!results || results.length === 0) {
    return <div></div>;
  }

  return (
    <div
      style={{
        borderRadius: '8px',
        color: '#fff',
        backgroundColor: 'white',
        fontSize: '.8rem',
        textAlign: 'left',
        padding: '8px',
        margin: '30px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <div>TOTAL: {results.length}</div>
      <ReactJson src={results} collapsed={true} />
    </div>
  );
};

export default Results;
