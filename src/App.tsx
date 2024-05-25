import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import ReadMoreMain from "./helpers/ReadMoreMain";

type Props = {
  TextComponent: React.ReactElement | React.ComponentType<any>;
  numLinesForReadMore: number;
  ReadMoreComponent: React.ReactElement | React.ComponentType<any>;
  ReadLessComponent: React.ReactElement | React.ComponentType<any>;
  isAnimated?: boolean;
  animationDuration?: number;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    // useEffect's effect will run after usePrevious function returns ref.current
    ref.current = value;
  });
  return ref.current;
}

const App = (props: Props) => {
  const [mountMain, setMountMain] = useState(true);
  const { TextComponent, numLinesForReadMore } = props;
  const prevTextComponent = usePrevious(TextComponent);
  const orgTextComp = useRef(null);
  const textViewWidthRef = useRef(null);
  const linesRef = useRef(null);
  const [mainStyle, setMainStyle] = useState(null);
  const [isFinalTextReady, setIsFinalTextReady] = useState(false)
  const needForReadMoreRef = useRef(null);
  const shortHeight = useRef(0)
  const fullHeight = useRef(0)

  useEffect(() => {
    if (!!prevTextComponent && prevTextComponent !== TextComponent) {
      setMountMain(false);
      orgTextComp.current = null;
      textViewWidthRef.current = null;
      linesRef.current = null;
      needForReadMoreRef.current = null;
      setMainStyle(null);
      setIsFinalTextReady(false)
      setTimeout(() => {
        setMountMain(true);
      });
    }
  }, [prevTextComponent, TextComponent]);

  return (
    <View
      style={{ overflow: 'hidden' }}
    >
      {!isFinalTextReady ? (
        <View
          style={{
            ...(mainStyle ?? {}), // for margin and related styles because margin doesn't work in nested text components
          }}
          onLayout={(e) => {
            if(e.nativeEvent.layout.height){
              shortHeight.current = e.nativeEvent.layout.height
            }
          }}
        >
          <Text
            numberOfLines={numLinesForReadMore}
          >
            {TextComponent}
          </Text>
        </View>
      ) : null}
      {mountMain ? (
        <View
          onLayout={(e) => {
            if(!needForReadMoreRef.current && e.nativeEvent.layout.height){
              fullHeight.current = e.nativeEvent.layout.height
            }
          }}
          style={{
            ...(mainStyle ?? {}), // for margin and related styles because margin doesn't work in nested text components

            ...(!isFinalTextReady ? {
              position:'absolute',
              opacity: 0,
              left: 0,
              right: 0,
              // width: '100%',  // do not use this
              top: 0
            } : {})
          }}
        >
          {mainStyle && needForReadMoreRef.current === null ? (
            // this text component is to know that do we need read_more text or not
            <Text
              style={{ position: "relative", opacity: 0, flexGrow: 1, flexShrink: 1 }}
              onLayout={(e) => {
                if (textViewWidthRef.current) return;
                textViewWidthRef.current = e.nativeEvent.layout.width;
                if (linesRef.current) setMainStyle((old) => ({ ...old }));
              }}
              onTextLayout={(e) => {
                if (linesRef.current) return;
                linesRef.current = [...e.nativeEvent.lines];
                if (linesRef.current.length <= numLinesForReadMore) {
                  needForReadMoreRef.current = false;
                  setIsFinalTextReady(true)
                } else needForReadMoreRef.current = true;
                if (textViewWidthRef.current) {
                  setMainStyle((old) => ({ ...old }));
                }
              }}
            >
              {TextComponent}
            </Text>
          ) : null}
          {(!mainStyle || needForReadMoreRef.current === false) && (
            // this view is to know about the text in Text component and its style
            <View
              onLayout={(e) => {
                if (orgTextComp.current) return;
                let temp =
                  e._dispatchInstances?.child ?? e._dispatchInstances?.alternate;
                if (!temp?.memoizedProps?.children) {
                  temp = temp?.child ?? temp?.alternate;
                }
                orgTextComp.current = { ...temp };
                setMainStyle({
                  ...(orgTextComp.current?.memoizedProps?.style ?? {}),
                });
                // }
              }}
              style={{
                width: "100%",
                opacity: needForReadMoreRef.current ? 0 : 1,
              }}
            >
              {/* /* for Margin or padding assignment to parent View */}
              {TextComponent}
            </View>
          )}
          {needForReadMoreRef.current && (
            <ReadMoreMain
              {...props}
              mainStyle={mainStyle}
              orgTextComp={orgTextComp.current}
              textViewWidth={textViewWidthRef.current}
              lines={linesRef.current}
              setIsFinalTextReady={setIsFinalTextReady}
              shortHeight={shortHeight}
              fullHeight={fullHeight}
            />
          )}
        </View>
      ) : null}
    </View>
  )
};

const ReadMore =  React.memo(App, (a, b) => a.TextComponent === b.TextComponent);
export default ReadMore