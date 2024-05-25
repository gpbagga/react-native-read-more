import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Text } from "react-native";
import getTSX from "./getTSX";
import useTextWidth from "./useTextWidth";

const ReadMoreMain = ({
  orgTextComp,
  textViewWidth,
  numLinesForReadMore,
  lines,
  mainStyle,
  ReadMoreComponent,
  ReadLessComponent,
  setIsFinalTextReady,
  shortHeight,
  fullHeight,
  isAnimated = true,
  animationDuration = 500
}) => {
  const [i, setI] = useState(-1); // i for iteration of target line words
  const [readMoreWidthLeft, setReadMoreWidthLeft] = useState(-1); // readMore Width which is left after subtracting blank space in target line
  const targetLineText = lines[numLinesForReadMore - 1].text; // read more's line text
  const [cutIndex, setCutIndex] = useState(-1); // index where we want to cut the target line from and attach read more text
  const targetLineWidth = lines[numLinesForReadMore - 1].width; // initial target line width
  const compBeforeTargetLine = useRef(); // component formed before target line
  const [isReadMore, setIsReadMore] = useState(true); // boolean to show if lines are cut to show readmore text
  const fullTextComponent = useRef(); // full text component made by the layout coming from onTextLayout
  const readMoreLineStylesRef = useRef([]); // styles of each character of target line
  const ReadMoreCompMemoized = useMemo(() => ReadMoreComponent, []);
  const readMoreWidth = useTextWidth(ReadMoreCompMemoized, true);

  const heightAnimated = useRef(
    new Animated.Value(shortHeight.current)
  ).current;

  const onReceivedAllNeeds = () => {
    if (textViewWidth && orgTextComp && lines) {
      let obj = getTSX(numLinesForReadMore, orgTextComp.memoizedProps, lines);
      // console.log('obj', obj)
      fullTextComponent.current = obj.comp;
      readMoreLineStylesRef.current = obj.readMoreLineStyles;
      compBeforeTargetLine.current = obj.compBeforeTargetLine;
      const leftAreaWidthInEnd = textViewWidth - targetLineWidth;
      if (readMoreWidth - leftAreaWidthInEnd <= 0) {
        setCutIndex(targetLineText.length - 1);
        setReadMoreWidthLeft("_");
        return;
      }
      setReadMoreWidthLeft(readMoreWidth - leftAreaWidthInEnd);
    }
  };

  const onReadMoreLessPress = () => {
    if (isAnimated) {
      const anim = Animated.timing(heightAnimated, {
        toValue: isReadMore ? fullHeight.current + 50 : shortHeight.current, // 50 is added because read less can get wrapped to next line but fullHeight does not include read less text
        duration: animationDuration,
        useNativeDriver: false,
      });
      if (isReadMore) {
        setIsReadMore(false);
        anim.start();
      } else {
        anim.start(() => {
          setIsReadMore(true);
        });
      }
    } else {
      setIsReadMore((old) => !old);
    }
  };
  const TempComponent = useMemo(() => {
    return (
      <Text>
        {i === -1
          ? ""
          : readMoreLineStylesRef.current.slice(i).map((style, index) => (
              <Text key={index} style={style}>
                {targetLineText[i + index]}
              </Text>
            ))}
      </Text>
    );
  }, [i]);

  useEffect(() => {
    if (cutIndex > -1) {
      setIsFinalTextReady(true);
    }
  }, [cutIndex]);

  const width = useTextWidth(TempComponent);

  if (!orgTextComp || !lines || !textViewWidth || !mainStyle) {
    return null;
  }

  if (isNaN(readMoreWidth)) return readMoreWidth; // to calculate read more text width
  if (cutIndex === -1 && readMoreWidthLeft === -1) {
    onReceivedAllNeeds();
    return null;
  }

  if (cutIndex > -1) {
    return (
      <Animated.Text
        style={{
          position: "relative",
          ...(isAnimated ? { maxHeight: heightAnimated } : {}),
        }}
      >
        {isReadMore ? compBeforeTargetLine.current : fullTextComponent.current}

        {isReadMore && cutIndex > -1
          ? readMoreLineStylesRef.current
              .slice(0, cutIndex + 1)
              .map((style, index) => {
                if (targetLineText[index] === "\n") return;
                return (
                  <Text key={index} style={style}>
                    {targetLineText[index]}
                  </Text>
                );
              })
          : null}

        <Text suppressHighlighting onPress={onReadMoreLessPress}>
          {isReadMore ? ReadMoreComponent : ReadLessComponent}
        </Text>
      </Animated.Text>
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
      if (old == -1) return targetLineText.length - 1;
      return old - 1;
    });
  }
  return null;
};

export default ReadMoreMain;
