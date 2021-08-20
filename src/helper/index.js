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
const operators = ['>=', '<=', '!=', '=', '>', '<'];
const func = ['avg', 'count', 'groupBy'];
const dateFields = ['createdDate', 'startDate', 'endDate']; // TODO replace with date() func

const average = nums => {
  return Math.ceil(nums.reduce((a, b) => a + b) / nums.length);
};

const isBoolean = val => {
  try {
    JSON.parse(val);
    return true;
  } catch (e) {
    return false;
  }
};

const toBoolean = val => {
  try {
    return JSON.parse(val);
  } catch (e) {
    return false;
  }
};

const getFilteredExpressions = (query, match) => {
  return query.filter(d => match.find(opr => d.includes(opr)));
};

const callFilter = props => {
  const { data = [], queryExpressions, dataKeys, dateFields } = props;

  // check if we find any expressions by presence of operator
  const filterExpressions = getFilteredExpressions(queryExpressions, operators);

  // loop through each expression
  const comparitorCollection = filterExpressions.reduce((acc, expression) => {
    // split by operator
    let operator = operators.find(opr => expression.includes(opr));
    if (!operator) {
      return acc;
    }

    // split expression into array of [property] [operator] [value]
    const regSplitBy = RegExp(`(?=${operator})|(?<=${operator})`, 'g');
    const elems = expression.split(regSplitBy);

    // if property exists in data, then filter
    if (elems.length === 3 && dataKeys.includes(elems[0])) {
      // build filter expression
      const property = elems[0];
      operator = elems[1] === '=' ? '==' : elems[1];
      const val = elems[2];

      if (val.includes('%')) {
        const regVal = RegExp(val.replace(/%/g, ''), 'g');
        const notOperator = operator.includes('!') ? "!'" : '';
        acc.push(`${notOperator}${regVal}.test(d['${property}'])`);
      } else if (dateFields.includes(property)) {
        // TODO replace with date() func
        const dateValue = new Date(val).getTime();
        acc.push(
          `new Date(d['${property}']).getTime() ${operator} ${dateValue}`
        );
        // eslint-disable-next-line
      } else if (val == 'null') {
        acc.push(`d['${property}'] ${operator} null`);
      } else if (isBoolean(val)) {
        acc.push(`d['${property}'] ${operator} ${toBoolean(val)}`);
      } else {
        acc.push(`d['${property}'] ${operator} '${val}'`);
      }
    }
    return acc;
  }, []);

  console.log('comparitor: ', comparitorCollection);
  if (comparitorCollection && comparitorCollection.length > 0) {
    // eslint-disable-next-line
    return data.filter(d => eval(comparitorCollection.join(' && ')));
  }

  return data;
};

const callFunction = props => {
  const { data = [], queryExpressions } = props;
  // check if function, for keyword
  const functionExpression = getFilteredExpressions(queryExpressions, func);

  return functionExpression.reduce(
    (acc, f) => {
      const key = f.match(/(?<=\().+?(?=\))/g); // get key in fuction brackets

      const actionType = f.split('(')[0];
      if (actionType === 'avg') {
        const vals = data.map(el => el[key[0]]);
        // average values
        const av = average(vals);
        acc = [{ ['avg-' + key]: av }];
      } else if (actionType === 'groupBy') {
        const grouped = data.reduce((acc, d) => {
          if (isBoolean(d[key]) || d[key]) {
            if (acc[d[key]]) {
              acc[d[key]].push(d);
            } else {
              acc[d[key]] = [d];
            }
          }
          return acc;
        }, {});

        // function sortObjectByKeys(obj) {
        //   return Object.keys(obj)
        //     .sort(
        //       (a, b) =>
        //         new Date('01-' + a).getTime() - new Date('01-' + b).getTime()
        //     ) // eslint-disable-next-line
        //     .reduce((r, k) => ((r[k] = obj[k]), r), {});
        // }
        // newData = [sortObjectByKeys(r)];
        acc = [grouped];
      }
      return acc;
    },
    [...data]
  );
};

const onSearch = ({ data, query }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const dataKeys = Object.keys(data[0]);

  // enforce spacing
  let queryEnforce = query.replace(/ = /g, '=').replace(/\s+/g, ' ');

  // split by spacing, break out query stmts
  const queryExpressions = queryEnforce.split(' ');

  // reduce, alter, map
  let mapKey = [];
  let filtered = data;

  // if first char is * then skip filter, return all results
  if (query && query.slice(0, 1) !== '*') {
    filtered = callFilter({
      data,
      queryExpressions,
      operators,
      dataKeys,
      dateFields
    });
  }

  queryExpressions.forEach(expression => {
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

  if (mapKey && mapKey.length > 0 && filtered && Array.isArray(filtered)) {
    filtered = filtered.map(dataObj => {
      return Object.keys(dataObj)
        .filter(i => mapKey.includes(i))
        .reduce((acc, key) => {
          acc[key] = dataObj[key];
          return acc;
        }, {});
    });
  }

  filtered = callFunction({
    data: filtered,
    queryExpressions,
    operators,
    dataKeys,
    dateFields
  });

  console.log('filtered: ', filtered);
  return filtered && filtered.length > 0 ? filtered : [];
};

// const onSearch = ({ data, query }) => {
//   const dataKeys = Object.keys(data[0]);
//   const operators = ['>=', '<=', '!=', '=', '>', '<'];
//   const calculation = ['avg'];
//   const dateFields = ['createdDate', 'startDate', 'endDate'];

//   // enforce spacing
//   let queryEnforce = query.replace(/ = /g, '=').replace(/\s+/g, ' ');

//   // split by spacing, break out query stmts
//   const queryExpressions = queryEnforce.split(' ');

//   // alter and reduce
//   let filterExpression = '';
//   let mapKey = [];
//   let filtered = data;

//   if (query.slice(0, 1) !== '*') {
//     const filterExpressions = queryExpressions.filter(d =>
//       operators.find(opr => d.includes(opr))
//     );

//     // loop through each query expression
//     filterExpressions.forEach((expression, i) => {
//       let elems = expression.split(/(?=[=<>!]|<=|>=)|(?<=[=<>!])/g);
//       // split by operator
//       const operatorMatch = operators.find(opr => expression.includes(opr));
//       if (operatorMatch) {
//         const rege = RegExp(`(?=${operatorMatch})|(?<=${operatorMatch})`, 'g');
//         elems = expression.split(rege);
//       }

//       const key = elems[0];

//       // if key exists in data, then filter
//       if (dataKeys.includes(key)) {
//         // build filter expression
//         if (elems.length === 3 && operatorMatch) {
//           const opr = elems[1] === '=' ? '==' : elems[1];
//           const val = elems[2];

//           if (val.includes('%')) {
//             const regVal = RegExp(val.replace(/%/g, ''), 'g');
//             filterExpression = `${filterExpression}${regVal}.test(d['${key}'])`;
//             if (i < filterExpressions.length - 1) {
//               filterExpression = `${filterExpression} && `;
//             }
//           } else {
//             if (dateFields.includes(key)) {
//               const dateValue = new Date(val).getTime();
//               filterExpression = `${filterExpression}new Date(d['${key}']).getTime() ${opr} ${dateValue}`;
//             } else if (val == 'null') {
//               filterExpression = `${filterExpression}d['${key}'] ${opr} null`;
//             } else if (isBoolean(val)) {
//               filterExpression = `${filterExpression}d['${key}'] ${opr} ${toBoolean(
//                 val
//               )}`;
//             } else {
//               filterExpression = `${filterExpression}d['${key}'] ${opr} '${val}'`;
//             }
//             if (i < filterExpressions.length - 1) {
//               filterExpression = `${filterExpression} && `;
//             }
//           }
//         }
//       }
//     });

//     console.log('comparitor: ', filterExpression);
//     if (filterExpression) {
//       filtered = data.filter((d, i) => {
//         if (eval(filterExpression)) {
//           return true;
//         }
//         return false;
//       });
//     }
//   }

//   queryExpressions.forEach((expression, i) => {
//     let elems = expression.split(/(?=[=<>!]|<=|>=)|(?<=[=<>!])/g);
//     // split by operator
//     const operatorMatch = operators.find(opr => expression.includes(opr));
//     if (operatorMatch) {
//       const rege = RegExp(`(?=${operatorMatch})|(?<=${operatorMatch})`, 'g');
//       elems = expression.split(rege);
//     }

//     const key = elems[0];

//     // if key exists in data, then filter
//     if (dataKeys.includes(key) && elems.length === 1) {
//       mapKey.push(key);
//     }
//   });

//   console.log('mapKey: ', mapKey);

//   if (mapKey && mapKey.length > 0) {
//     filtered = filtered.map(dataObj => {
//       return Object.keys(dataObj)
//         .filter(i => mapKey.includes(i))
//         .reduce((acc, key) => {
//           acc[key] = dataObj[key];
//           return acc;
//         }, {});
//     });
//   }
//   console.log('filtered: ', filtered);
//   return filtered;
// };

export { onSearch };
