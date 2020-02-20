import { getDocCount } from './indexUtils.js'

// TODO: put in some defaults
export function TFIDF (ops) {
  return getDocCount(ops.fii).then(docCount => {
    const calculateScore = (x, _, resultSet) => {
      const idf = Math.log((docCount + 1) / resultSet.length)
      x._score = +x._match.reduce(
        (acc, cur) => acc + idf * +cur.split('#')[1], 0
      ).toFixed(2) // TODO: make precision an option
      return x
    }    
    return ops
      .resultSet
      .map(calculateScore)
    // sort by score descending
      .sort((a, b) => b._score - a._score)
    // limit to n hits
      .slice(ops.offset, ops.limit)
  })
}

// TODO: put in some defaults
export function numericField (ops) {
  const calculateScore = (x) => {
    x._score = +x._match.filter(
      item => item.startsWith(ops.fieldName)
    )[0].split(':')[1]
    return x
  }
  return ops
    .resultSet
    .map(calculateScore)
  // sort by score descending
    .sort(ops.sort)
  // limit to n hits
    .slice(ops.offset, ops.limit)
}
