import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
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
  const orgTextComp = useRef()
  const textViewWidthRef = useRef()
  const linesRef = useRef()
  const [mainStyle, setMainStyle] = useState(null)
  const [needForReadMore, setneedForReadMore] = useState(null)
  useEffect(()=> {
    if(!!prevTextComponent && prevTextComponent !== TextComponent ){
      setMountMain(false)
      setheight(undefined)
      setTimeout(() => {
        setMountMain(true) 
      });
    }
  }, [prevTextComponent, TextComponent])
  
  if(mountMain){

    return (
      <View style={{ minHeight: height, backgroundColor: '#93f542'}}>
        <View
          onLayout={(e) => {
            // if(mainStyle){
            //   setheight(e.nativeEvent.layout.height);
            // }else{
              let temp = e._dispatchInstances?.child ?? e._dispatchInstances?.alternate;
              temp = temp?.child ?? temp?.alternate
              orgTextComp.current = temp
              setMainStyle(orgTextComp.current?.memoizedProps?.style ?? {})
            // }
          }}
          style={{
            ...(mainStyle??{}),
            opacity: needForReadMore === null || needForReadMore ? 0: 1,
            position: "absolute",
            backgroundColor: '#b3202f',
          }}
        >
          {!mainStyle ? (
            <TextComponent/>   /* for Margin or padding assignment to parent View */
          ):(
            <Text 
            style = {{backgroundColor:'orange'}}
            onLayout = {(e)=> {if(textViewWidthRef.current) return; textViewWidthRef.current = e.nativeEvent.layout.width; setMainStyle(old=> ({...old}))}}
            onTextLayout={(e)=> {
              if(linesRef.current) return
              linesRef.current = e.nativeEvent.lines; 
              if(linesRef.current.length <= numLinesForReadMore){
                setneedForReadMore(false)
              }else
                setneedForReadMore(true)
            }}
            numberOfLines = {needForReadMore? numLinesForReadMore: undefined}>
              <TextComponent/>
            </Text>
          )} 
        </View>
        {needForReadMore && 
        
          <ReadMoreMain
          {...props}
          mainStyle = {mainStyle} 
          orgTextComp = {orgTextComp.current}
          textViewWidth = {textViewWidthRef.current}
          lines = {linesRef.current}
          />
        }
        
      </View>
    );
  }
  return null
};

export default React.memo(App, (a,b)=> a.TextComponent === b.TextComponent);
