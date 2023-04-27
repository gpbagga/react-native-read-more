import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Platform } from "react-native";
import useTextWidth from "./useTextWidth";
import getTSX from "./getTSX";

const ReadMoreMain = ({
  TextComponent,
  numLinesForReadMore,
  ReadMoreComponent,
  ReadLessComponent,
  height
}) => {
  const textViewWidth = useRef();
  const [i, setI] = useState(-1); // i for iteration of target line words
  const [readMoreWidthLeft, setReadMoreWidthLeft] = useState(-1); // readMore Width which is left after subtracting blank space in target line
  const targetLineText = useRef(""); // read more's line text
  const [cutIndex, setCutIndex] = useState(-1); // index where we want to cut the target line from and attach read more text
  const lineWidthRef = useRef(-1); // initial target line width
  const compBeforeTargetLine = useRef(); // component formed before target line
  const [isReadMore, setIsReadMore] = useState(true); // boolean to show if lines are cut to show readmore text
  const fullTextComponent = useRef(); // full text component made by the layout coming from onTextLayout
  const readMoreLineStylesRef = useRef([]); // styles of each character of target line
  const mainStyleRef = useRef({});
  const orgTextComp = useRef();
  const linesRef = useRef();
  const [isReadMoreLessShow, setisReadMoreLessShow] = useState(true);
  const readMoreWidth = useTextWidth(ReadMoreComponent);

  const onReceivedAllNeeds = () => {

    if (textViewWidth.current && orgTextComp.current && linesRef.current) {
      if (linesRef.current.length <= numLinesForReadMore) {
        setisReadMoreLessShow(false);
        return;
      }
      let obj = getTSX(
        numLinesForReadMore,
        orgTextComp.current.memoizedProps,
        linesRef.current
      );
      fullTextComponent.current = obj.comp;
      readMoreLineStylesRef.current = obj.readMoreLineStyles;
      compBeforeTargetLine.current = obj.compBeforeTargetLine;

      lineWidthRef.current = linesRef.current[numLinesForReadMore - 1].width;
      targetLineText.current = linesRef.current[numLinesForReadMore - 1].text;
      const leftAreaWidthInEnd = textViewWidth.current - lineWidthRef.current;
      if (readMoreWidth - leftAreaWidthInEnd <= 0) {
        setCutIndex(targetLineText.current.trimEnd().length - 1);
        return;
      }
      setReadMoreWidthLeft(readMoreWidth - leftAreaWidthInEnd);
    }
  };

  const onLayout = (e) => {
    e.persist();

    textViewWidth.current = e.nativeEvent.layout.width;
    onReceivedAllNeeds();
  };

  const onTextLayout = (e) => {
    // not getting child in e._dispatchInstances
    linesRef.current = e.nativeEvent.lines;
    onReceivedAllNeeds();
  };

  const onViewLayout = (e) => {
    // to get e._dispatchInstances
    textViewWidth.current = e.nativeEvent.layout.width;
     
    let temp = e._dispatchInstances?.child ?? e._dispatchInstances?.alternate;
    
      temp = temp?.child ?? temp?.alternate
      if(temp?.child ?? temp?.alternate)
        orgTextComp.current = temp?.child ?? temp?.alternate
      else
        orgTextComp.current = temp
    
    mainStyleRef.current = orgTextComp.current?.memoizedProps?.style ?? {};
    onReceivedAllNeeds();
  };

  const onReadMoreLessPress = () => {
    setIsReadMore((old) => !old);
  };
  const TempComponent = useCallback(() => {
    return (
      <Text>
        {i === -1
          ? ""
          : readMoreLineStylesRef.current
              .slice(i)
              .map((style, index) => (
                <Text style={style}>{targetLineText.current[i + index]}</Text>
              ))}
      </Text>
    );
  }, [i]);
  const width = useTextWidth(TempComponent);

  if(!height){
    return null
  }

  if (isNaN(readMoreWidth)) return readMoreWidth; // to calculate read more text width

  if (!targetLineText.current || !isReadMoreLessShow || cutIndex > -1) {
    if (!targetLineText.current || !isReadMoreLessShow) {
      return (
        <View style={{ 
          flexDirection:'row',flex: 1, flexWrap: 'wrap',
          opacity: isReadMoreLessShow ? 0: 1, height:height}} onLayout={onViewLayout}>
          <TextComponent
            onTextLayout={onTextLayout}
            // onLayout={onLayout}
          />
        </View>
      );
    }
    //else cutIndex > -1
    return (
      <Text
        style={{ ...mainStyleRef.current }} // for margin and related styles because margin doesn't work in nested text components
      >
        {isReadMore ? compBeforeTargetLine.current : fullTextComponent.current}

        {isReadMore && cutIndex > -1
          ? readMoreLineStylesRef.current
              .slice(0, cutIndex + 1)
              .map((style, index) => {
                return (
                  <Text style={style}>{targetLineText.current[index]}</Text>
                );
              })
          : null}

        <Text onPress={onReadMoreLessPress}>
          {isReadMore ? <ReadMoreComponent /> : <ReadLessComponent />}
        </Text>
      </Text>
    );
  }
  if (isNaN(width)) {
    return width;
  }

  const widthLeft = readMoreWidthLeft - width;
  if (widthLeft <= 0) {
    setCutIndex(widthLeft < 0 ? i - 1 : i);
  } else {
    setI((old) => {
      if (old == -1) return targetLineText.current.length - 1;
      return old - 1;
    });
  }
  return null;
};

export default ReadMoreMain;
