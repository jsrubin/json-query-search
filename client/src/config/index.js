export const conf = {
  serverUrl: 'http://localhost:3001/search',
  exampleQueries: `
*                                                - all data
title id                                         - all data with only title, id properties
id                                               - collection of only id values
title=%AA%                                       - partial match on AA
title=%A.{0,1}A%                                 - partial match on AA or A/A in title
title=%A.{0,1}A% userId=1                        - partial match title and userId
title=%A.{0,1}A% userId=1 title id
setupDay=1 userId=1 createdDate>1-MAY-21
`
};
