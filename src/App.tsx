import React, { useState } from "react";
import { View } from "react-native";
import ReadMoreMain from "./helpers/ReadMoreMain";
const App = (props) => {
  const [height, setheight] = useState(undefined);
  const { TextComponent, numLinesForReadMore } = props;
  return (
    <View style={{ width: "100%", minHeight: height }}>
      <View
        onLayout={(e) => {
          setheight(e.nativeEvent.layout.height);
        }}
        style={{
          position: "absolute",
          opacity: 0,
        }}
      >
        {/* {textComponent({numberOfLines: numLinesForReadMore})} */}
        <TextComponent numberOfLines={numLinesForReadMore} />
      </View>
      <ReadMoreMain {...props} />
    </View>
  );
};

export default App;
