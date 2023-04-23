import React, {useCallback, useState, useRef} from 'react';
import {View, Text} from 'react-native';
const useTextWidth = (textComponent) => {
  const [_, rerender] = useState({});
  const prevRef = useRef(null);
  const textWidthRef = useRef(-1);

  const onTextLayout = useCallback(e => {
    textWidthRef.current = e.nativeEvent.lines[0].width;
    // console.log(textWidthRef.current)
    rerender({});
  }, []);
  if(prevRef.current != textComponent){
    textWidthRef.current = -1;
    prevRef.current = textComponent;
  }

  if (textWidthRef.current == -1) {
    return (
      <Text
      onTextLayout = {onTextLayout}
      >
        {textComponent}
      </Text>
    );
  }

  return Number(textWidthRef.current);
};

export default useTextWidth;
