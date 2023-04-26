const onStringEncountered = ({ lines, lineIndex, accumulator, item, tempArr, styles, numLinesForReadMore, readMoreLineStyles, readTextArr }) => {
  let tempLength = lines.slice(0, lineIndex + 1).reduce((acc, itm) => acc + itm.text.length, 0)
  while (accumulator + item.length > tempLength) {
    if (lineIndex == numLinesForReadMore - 1) {
      new Array(tempLength - accumulator).fill('').forEach(() => readMoreLineStyles.push(styles))
    }
    if (lineIndex < numLinesForReadMore - 1) {
      readTextArr.push(item.substring(0, tempLength - accumulator) + '\n')
    }
    tempArr.push(item.substring(0, tempLength - accumulator) + '\n')
    item = tempLength - accumulator ? item.substring(tempLength - accumulator) : ''
    accumulator = tempLength
    lineIndex += 1
    if (lineIndex <= lines.length - 1)
      tempLength = tempLength + lines[lineIndex].text.length
  }
  tempArr.push(item)
  if (lineIndex == numLinesForReadMore - 1) {
    new Array(item.length).fill('').forEach(() => readMoreLineStyles.push(styles))
  }
  if (lineIndex < numLinesForReadMore - 1) {
    readTextArr.push(item)
  }
  accumulator += item.length

  return ({ lineIndex, accumulator })    // no need to send array as copy of array is passed but in that copy elements are placed at same address as in original one(Javascript is always pass by value not pass by reference)
}

export default onStringEncountered

