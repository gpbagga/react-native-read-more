import React, {useMemo, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import useTextWidth from './helpers/useTextWidth';
import getTSX from './helpers/getTSX';

const App = ({
  textComponent,
  numLinesForReadMore,
  readMoreComponent,
  readLessComponent
}) => {
  const textViewWidth = useRef(-1);
  const [i, setI] = useState(-1);    // i for iteration of target line words
  const [readMoreWidthLeft, setReadMoreWidthLeft] = useState(-1);    // readMore Width which is left after subtracting blank space in target line
  const targetLineText = useRef('');   // read more's line text
  const [cutIndex, setCutIndex] = useState(-1);  // index where we want to cut the target line from and attach read more text
  const lineWidthRef = useRef(-1);   // initial target line width
  const compBeforeTargetLine = useRef(null)   // component formed before target line
  const [isReadMore, setIsReadMore] = useState(true);  // boolean to show if lines are cut to show readmore text
  const fullTextComponent = useRef(null)   // full text component made by the layout coming from onTextLayout
  const readMoreWidth = useTextWidth(readMoreComponent);
  const readMoreLineStylesRef = useRef([])   // styles of each character of target line
  const onLayout = e => {
    // return
    e.persist();
    if (cutIndex > -1) return;

    textViewWidth.current = e.nativeEvent.layout.width;
    if (lineWidthRef.current > -1) {
      const leftAreaWidthInEnd = textViewWidth.current - lineWidthRef.current;
      setReadMoreWidthLeft(readMoreWidth - leftAreaWidthInEnd);
    }
  };

  const onTextLayout = e => {
    if (cutIndex > -1) return;

    const orgTextComp = e._dispatchInstances?.child?.child
    const lines = e.nativeEvent.lines
    
    // we are adding '\n' character after each line because these lines given by onTextLayout
    // doesn't get acknowledged by react native and lines get printed with different line length than this
    let obj = getTSX(numLinesForReadMore,orgTextComp.memoizedProps,lines)
    fullTextComponent.current = obj.comp
    readMoreLineStylesRef.current = obj.readMoreLineStyles
    compBeforeTargetLine.current= obj.compBeforeTargetLine

    lineWidthRef.current = e.nativeEvent.lines[numLinesForReadMore - 1].width;
    targetLineText.current = e.nativeEvent.lines[numLinesForReadMore - 1].text;

    if (textViewWidth.current > -1) {
      const leftAreaWidthInEnd = textViewWidth.current - lineWidthRef.current;
      setReadMoreWidthLeft(readMoreWidth - leftAreaWidthInEnd);
    }
  };

  const onReadMoreLessPress = () => {
    setIsReadMore(old => !old);
  };
  const tempComponent = useMemo(()=> {
    return(
    <Text>
    {i === -1 ? '':(
      readMoreLineStylesRef.current.slice(i).map((style, index)=> (
        <Text style = {style}>{targetLineText.current[i + index]}</Text>
      ))
    )}
  </Text>
  )}, [i])
  const width = useTextWidth(tempComponent)

  if (isNaN(readMoreWidth)) return readMoreWidth;    // to calculate read more text width
  
  if (!targetLineText.current || cutIndex > -1) {
    return (
      <View style={{margin: 10, flex: 1}}>
        <Text
        // style = {{flex: 1}}
        // textBreakStrategy='simple'
        numberOfLines={isReadMore ? numLinesForReadMore: undefined}
        // ellipsizeMode='clip'
        onTextLayout={onTextLayout}
        onLayout={onLayout}
        >
          
            {(isReadMore? compBeforeTargetLine.current: fullTextComponent.current) ?? textComponent}
            
            {isReadMore && cutIndex > -1 ?(
              readMoreLineStylesRef.current.slice(0, cutIndex+1).map((style, index)=> {
                return(
                  <Text style = {style}>{targetLineText.current[index]}</Text>
                )
              })
            ):null}
            <Text
            onPress={onReadMoreLessPress}
            >
            {isReadMore ? readMoreComponent: readLessComponent}
            </Text>
        </Text>
      </View>
    );
  }
  if (isNaN(width)) return width;
  
  const widthLeft = readMoreWidthLeft - width;
  if (widthLeft <= 0) {
    setCutIndex(widthLeft < 0 ? i - 1 : i);
  } else {
    setI(old => {
      if (old == -1) return targetLineText.current.length - 1;
      return old - 1;
    });
  }
  return null;
};

export default App;
