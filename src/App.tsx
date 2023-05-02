import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import ReadMoreMain from "./helpers/ReadMoreMain";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    // useEffect's effect will run after usePrevious function returns ref.current
    ref.current = value;
  });
  return ref.current;
}

const App = (props) => {
  const [mountMain, setMountMain] = useState(true);
  const { TextComponent, numLinesForReadMore } = props;
  const prevTextComponent = usePrevious(TextComponent);
  const orgTextComp = useRef(null);
  const textViewWidthRef = useRef(null);
  const linesRef = useRef(null);
  const [mainStyle, setMainStyle] = useState(null);
  // const [needForReadMore, setneedForReadMore] = useState(null);
  const needForReadMoreRef = useRef(null);
  useEffect(() => {
    if (!!prevTextComponent && prevTextComponent !== TextComponent) {
      setMountMain(false);
      orgTextComp.current = null;
      textViewWidthRef.current = null;
      linesRef.current = null;
      needForReadMoreRef.current = null;
      setMainStyle(null);
      setTimeout(() => {
        setMountMain(true);
      });
    }
  }, [prevTextComponent, TextComponent]);

  if (mountMain) {
    return (
      <View
        style={{
          ...(mainStyle ?? {}), // for margin and related styles because margin doesn't work in nested text components
        }}
      >
        {mainStyle && needForReadMoreRef.current === null ? (
          <Text
            style={{ position: "relative", opacity: 0 }}
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
              } else needForReadMoreRef.current = true;
              if (textViewWidthRef.current) {
                setMainStyle((old) => ({ ...old }));
              }
            }}
            numberOfLines={
              needForReadMoreRef.current ? numLinesForReadMore : undefined
            }
          >
            <TextComponent />
          </Text>
        ) : null}
        {(!mainStyle || needForReadMoreRef.current === false) && (
          <View
            onLayout={(e) => {
              if (orgTextComp.current) return;
              let temp =
                e._dispatchInstances?.child ?? e._dispatchInstances?.alternate;
              temp = temp?.child ?? temp?.alternate;
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
            <TextComponent />
          </View>
        )}
        {needForReadMoreRef.current && (
          <ReadMoreMain
            {...props}
            mainStyle={mainStyle}
            orgTextComp={orgTextComp.current}
            textViewWidth={textViewWidthRef.current}
            lines={linesRef.current}
          />
        )}
      </View>
    );
  }
  return null;
};

export default React.memo(App, (a, b) => a.TextComponent === b.TextComponent);
