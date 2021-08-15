/*
  *   - all data
  setupDay=1 configKey=TEST createdDate>1-MAY-21    - data filtered by each ANDED stmt
  setupDay    - mapped data attrs
  avg(setupDay)   - single value of avg from mapped data attr 
  avg(setupDay, groupBy=month)    - collection of mo-yy, avg from mapped mo-yy data attr
  avg(setupDay, configKey=TEST groupBy=month)
  name=%AA%   - partial match
  name=%A.{0,1}A%   - partial match on AA or A/A in name
  name=%A.{0,1}A% configKey=TEST  - partial match name and match tenant
*/

// TODO
// avg function
const onSearch = ({ data, query }) => {
  const dataKeys = Object.keys(data[0]);
  const operators = ['>=', '<=', '!=', '=', '>', '<'];
  const calculation = ['avg'];
  const dateFields = ['createdDate', 'startDate', 'endDate'];

  // enforce spacing
  let queryEnforce = query.replace(/ = /g, '=').replace(/\s+/g, ' ');

  // split by spacing, break out query stmts
  const queryExpressions = queryEnforce.split(' ');

  // alter and reduce
  let filterExpression = '';
  let mapKey = [];
  let filtered = data;

  if (query.slice(0, 1) !== '*') {
    const filterExpressions = queryExpressions.filter(d =>
      operators.find(opr => d.includes(opr))
    );

    // loop through each query expression
    filterExpressions.forEach((expression, i) => {
      let elems = expression.split(/(?=[=<>!]|<=|>=)|(?<=[=<>!])/g);
      // split by operator
      const operatorMatch = operators.find(opr => expression.includes(opr));
      if (operatorMatch) {
        const rege = RegExp(`(?=${operatorMatch})|(?<=${operatorMatch})`, 'g');
        elems = expression.split(rege);
      }

      const key = elems[0];

      // if key exists in data, then filter
      if (dataKeys.includes(key)) {
        // build filter expression
        if (elems.length === 3 && operatorMatch) {
          const opr = elems[1] === '=' ? '==' : elems[1];
          const val = elems[2];

          if (val.includes('%')) {
            const regVal = RegExp(val.replace(/%/g, ''), 'g');
            filterExpression = `${filterExpression}${regVal}.test(d['${key}'])`;
            if (i < filterExpressions.length - 1) {
              filterExpression = `${filterExpression} && `;
            }
          } else {
            if (dateFields.includes(key)) {
              const dateValue = new Date(val).getTime();
              filterExpression = `${filterExpression}new Date(d['${key}']).getTime() ${opr} ${dateValue}`;
            } else if (val == 'null') {
              filterExpression = `${filterExpression}d['${key}'] ${opr} null`;
            } else {
              filterExpression = `${filterExpression}d['${key}'] ${opr} '${val}'`;
            }
            if (i < filterExpressions.length - 1) {
              filterExpression = `${filterExpression} && `;
            }
          }
        }
      }
    });

    console.log('comparitor: ', filterExpression);
    if (filterExpression) {
      filtered = data.filter((d, i) => {
        if (eval(filterExpression)) {
          return true;
        }
        return false;
      });
    }
  }

  queryExpressions.forEach((expression, i) => {
    let elems = expression.split(/(?=[=<>!]|<=|>=)|(?<=[=<>!])/g);
    // split by operator
    const operatorMatch = operators.find(opr => expression.includes(opr));
    if (operatorMatch) {
      const rege = RegExp(`(?=${operatorMatch})|(?<=${operatorMatch})`, 'g');
      elems = expression.split(rege);
    }

    const key = elems[0];

    // if key exists in data, then filter
    if (dataKeys.includes(key) && elems.length === 1) {
      mapKey.push(key);
    }
  });

  console.log('mapKey: ', mapKey);

  if (mapKey && mapKey.length > 0) {
    filtered = filtered.map(dataObj => {
      return Object.keys(dataObj)
        .filter(i => mapKey.includes(i))
        .reduce((acc, key) => {
          acc[key] = dataObj[key];
          return acc;
        }, {});
    });
  }
  console.log('filtered: ', filtered);
  return filtered;
};

export { onSearch };
