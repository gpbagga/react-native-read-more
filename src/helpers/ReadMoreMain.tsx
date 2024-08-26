import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutAnimation,
  Animated,
  Text,
  Platform,
  UIManager,
} from "react-native";
import getTSX from "./getTSX";
import useTextWidth from "./useTextWidth";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ReadMoreMain = React.memo(
  ({
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
    animationDuration = 300,
  }) => {
    // const countRenderRef = useRef(1)
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
    const [readMoreWidth, setReadMoreWidth] = useState(-1);
    const ReadMoreWidthCalculatorComp = useTextWidth(
      ReadMoreCompMemoized,
      (e) => {
        if (e.nativeEvent.layout.width > 0) {
          setReadMoreWidth(e.nativeEvent.layout.width + 0.5); // in some devices read more gets wrapped to next line so just added safety measure
        }
      }
    );

    const heightAnimated = useRef(new Animated.Value(shortHeight)).current;

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
    useEffect(() => {
      if (readMoreWidth > -1 && cutIndex === -1 && readMoreWidthLeft === -1) {
        onReceivedAllNeeds();
      }
    }, [readMoreWidth]);

    const onReadMoreLessPress = () => {
      // console.log('fullHeight, shortHeight', fullHeight, shortHeight)
      if (isAnimated) {
        if (isReadMore) {
          LayoutAnimation.configureNext({
            duration: animationDuration,
            create: { type: "easeInEaseOut", property: "opacity" },
            update: { type: "easeInEaseOut", property: "opacity" },
            delete: { type: "easeInEaseOut", property: "opacity" },
          });
          setIsReadMore(false);
          Animated.timing(heightAnimated, {
            toValue: fullHeight + 50, // 50 is added because read less can get wrapped to next line but fullHeight does not include read less text
            duration: 0,
            useNativeDriver: false,
          }).start();
        } else {
          // if (Platform.OS === "android") {  // because in android, Simple animation using Animated is not smoother and useNativeDriver = true does not work with height
            LayoutAnimation.configureNext({
              duration: animationDuration,
              create: { type: "easeInEaseOut", property: "opacity" },
              update: { type: "easeInEaseOut", property: "opacity" },
              delete: { type: "easeInEaseOut", property: "opacity" },
            });
            setIsReadMore(true);
            Animated.timing(heightAnimated, {
              toValue: shortHeight,
              duration: 0,
              useNativeDriver: false,
            }).start();
          // } else {
          //   Animated.timing(heightAnimated, {
          //     toValue: shortHeight,
          //     duration: animationDuration,
          //     useNativeDriver: false,
          //   }).start(() => {
          //     setIsReadMore(true);
          //   });
          // }
        }
        // const anim = Animated.timing(heightAnimated, {
        //   toValue: isReadMore ? fullHeight + 50 : shortHeight, // 50 is added because read less can get wrapped to next line but fullHeight does not include read less text
        //   duration: animationDuration,
        //   useNativeDriver: false,
        // });
        // if (isReadMore) {
        //   setIsReadMore(false);
        //   anim.start();
        // } else {
        //   anim.start(() => {
        //     setIsReadMore(true);
        //   });
        // }
      } else {
        setIsReadMore((old) => !old);
      }
    };

    useEffect(() => {
      if (cutIndex > -1) {
        setIsFinalTextReady(true);
      }
    }, [cutIndex]);

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

    const TempWidthCalculatorComp = useTextWidth(TempComponent, (e) => {
      const localWidth = e.nativeEvent.layout.width;
      // console.log("onTextLayout of last line", localWidth);
      const widthLeft = readMoreWidthLeft - localWidth;
      if (widthLeft <= 0) {
        setCutIndex(widthLeft < 0 ? i - 1 : i);
      } else {
        setI((old) => {
          if (old == -1) return targetLineText.length - 1;
          return old - 1;
        });
      }
    });

    if (!orgTextComp || !lines || !textViewWidth || !mainStyle) {
      return null;
    }

    if (readMoreWidth < 0) {
      // console.log('rendering read more text')
      // countRenderRef.current += 1
      return ReadMoreWidthCalculatorComp; // to calculate read more text width
    }

    if (cutIndex > -1) {
      // console.log('rendering 3 lines text component',cutIndex)
      // countRenderRef.current += 1
      return (
        <Animated.Text
          style={{
            position: "relative",
            ...(isAnimated ? { maxHeight: heightAnimated } : {}),
          }}
        >
          {isReadMore
            ? compBeforeTargetLine.current
            : fullTextComponent.current}

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

    // console.log('rendering last line text')
    return TempWidthCalculatorComp;
  },
  () => true
);

export default ReadMoreMain;
