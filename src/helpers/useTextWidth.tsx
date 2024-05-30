import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
const useTextWidth = (TextComponent, onTextLayout) => {
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
};

export default useTextWidth;
