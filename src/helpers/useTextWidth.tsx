import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
const useTextWidth = (TextComponent, isReadMore = false) => {
  const [_, rerender] = useState({});
  const prevRef = useRef(null);
  const textWidthRef = useRef(-1);

  const onTextLayout = useCallback((e) => {
    textWidthRef.current = e.nativeEvent.layout.width;
    if (e.nativeEvent.layout.width > 0) {
      textWidthRef.current += isReadMore ? 0.5 : 0; // in some devices read more gets wrapped to next line so just added safety measure
    }
    rerender({});
  }, []);
  if (prevRef.current != TextComponent) {
    textWidthRef.current = -1;
    prevRef.current = TextComponent;
  }

  if (textWidthRef.current == -1) {
    return (
      <View
        style={{
          opacity: 0,
          position: "absolute",
          top: 0,
          left: 0,
          alignItems: "flex-start",
        }}
        onLayout={onTextLayout}
      >
        {TextComponent}
        {/* <TextComponent /> */}
      </View>
    );
  }
  return Number(textWidthRef.current);
};

export default useTextWidth;
