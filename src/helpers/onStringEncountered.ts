const onStringEncountered = ({
  lines,
  accumulator,
  item,
  tempArr,
  styles,
  numLinesForReadMore,
  readMoreLineStyles,
  arrB4TargetLine,
}) => {
  let lineIndex = -1,
    temp = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineItem = lines[i];
    if (accumulator <= temp + lineItem.text.length) {
      // uptoLineIndexLength += lineItem.text.length
      lineIndex = i;
      break;
    } else {
      temp += lineItem.text.length;
    }
  }

  let currLineAcc = accumulator - temp;
  while (item) {
    if (item.length + currLineAcc > lines[lineIndex].text.length) {
      let strToPush = item.substring(
        0,
        lines[lineIndex].text.length - currLineAcc
      );
      strToPush =
        strToPush[strToPush.length - 1] === "\n"
          ? strToPush.substring(0, strToPush.length - 1)
          : strToPush;
      tempArr.push(strToPush + "\n");
      if (lineIndex < numLinesForReadMore - 1) {
        arrB4TargetLine.push(strToPush + "\n");
      }
      if (lineIndex === numLinesForReadMore - 1) {
        new Array(lines[lineIndex].text.length - currLineAcc)
          .fill("")
          .forEach(() => readMoreLineStyles.push(styles));
      }
      accumulator += lines[lineIndex].text.length - currLineAcc;
      item = item.substring(lines[lineIndex].text.length - currLineAcc);
      currLineAcc = 0;
      lineIndex += 1;
    } else {
      tempArr.push(item);
      if (lineIndex < numLinesForReadMore - 1) {
        arrB4TargetLine.push(item);
      }
      if (lineIndex === numLinesForReadMore - 1) {
        new Array(item.length)
          .fill("")
          .forEach(() => readMoreLineStyles.push(styles));
      }
      accumulator += item.length;
      item = item.substring(item.length);
      if (accumulator === lines[lineIndex].text.length) {
        tempArr.push("\n");
        if (lineIndex < numLinesForReadMore - 1) {
          arrB4TargetLine.push("\n");
        }
      }
    }
  }
  return { accumulator };

  // let tempLength = lines.slice(0, lineIndex + 1).reduce((acc, itm) => acc + itm.text.length, 0)
  // while (accumulator + item.length > tempLength) {
  //   if (lineIndex == numLinesForReadMore - 1) {
  //     new Array(tempLength - accumulator).fill('').forEach(() => readMoreLineStyles.push(styles))
  //   }
  //   if (lineIndex < numLinesForReadMore - 1) {
  //     readTextArr.push(item.substring(0, tempLength - accumulator) + '\n')
  //   }
  //   tempArr.push(item.substring(0, tempLength - accumulator) + '\n')
  //   item = tempLength - accumulator ? item.substring(tempLength - accumulator) : ''
  //   accumulator = tempLength
  //   lineIndex += 1
  //   if (lineIndex <= lines.length - 1)
  //     tempLength = tempLength + lines[lineIndex].text.length
  // }
  // tempArr.push(item)
  // if (lineIndex == numLinesForReadMore - 1) {
  //   new Array(item.length).fill('').forEach(() => readMoreLineStyles.push(styles))
  // }
  // if (lineIndex < numLinesForReadMore - 1) {
  //   readTextArr.push(item)
  // }
  // accumulator += item.length

  // return ({ lineIndex, accumulator })    // no need to send array as copy of array is passed but in that copy elements are placed at same address as in original one(Javascript is always pass by value not pass by reference)
};

export default onStringEncountered;
