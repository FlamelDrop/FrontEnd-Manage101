const objFromArray = (arr: any, key = 'id') =>
  arr.reduce((accumulator: any, current: any) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});

export default objFromArray;
