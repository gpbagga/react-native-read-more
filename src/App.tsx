import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import ReadMoreMain from "./helpers/ReadMoreMain";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {              // useEffect's effect will run after usePrevious function returns ref.current
    ref.current = value;
  });
  return ref.current;
}

const App = (props) => {
  const [mountMain, setMountMain] = useState(true)
  const [height, setheight] = useState(undefined);
  const { TextComponent, numLinesForReadMore } = props;
  const prevTextComponent = usePrevious(TextComponent)
  useEffect(()=> {
    if(!!prevTextComponent && prevTextComponent !== TextComponent ){
      setMountMain(false)
      setTimeout(() => {
        setMountMain(true) 
      });
    }
  }, [prevTextComponent, TextComponent])
  
  if(mountMain){

    return (
      <View style={{width: '100%', minHeight: height}}>
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
        {mountMain &&
          <ReadMoreMain {...props} height={height} />
        }
      </View>
    );
  }
  return null
};

export default React.memo(App, (a,b)=> a.TextComponent === b.TextComponent);
