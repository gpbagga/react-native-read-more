import React, { useCallback, useState, useRef } from "react";
import { View } from "react-native";
const useTextWidth = (TextComponent) => {
  const [_, rerender] = useState({});
  const prevRef = useRef(null);
  const textWidthRef = useRef(-1);

  const onTextLayout = useCallback((e) => {
    // textWidthRef.current = e.nativeEvent.lines[0].width;
    textWidthRef.current = e.nativeEvent.layout.width;
    rerender({});
  }, []);
  if (prevRef.current != TextComponent) {
    textWidthRef.current = -1;
    prevRef.current = TextComponent;
  }

  if (textWidthRef.current == -1) {
    return (
      <View
        style={{ opacity: 0, position: "absolute", top: 0, left: 0, alignItems:'flex-start' }}
        onLayout={onTextLayout}
      >
        <TextComponent />
      </View>
    );
  }
  return Number(textWidthRef.current);
};

export default useTextWidth;
