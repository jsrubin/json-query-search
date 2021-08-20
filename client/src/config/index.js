export const conf = {
  exampleQueries: `[filters] [properties] [function]

[prop1] [prop2]                                  - all data with only [prop1], [prop2] properties
[prop1]=%et%                                    - partial match [prop1] on AA
[prop1]=%s.{1,2}t% [prop2]<5                     - partial match [prop1] and [prop2]
[prop1]=%s.{1,2}t% [prop2]=1 [prop1]
avg([prop2])
[prop1]=%s.{1,2}t% [prop1] [prop2] groupBy([prop2])
`
};
