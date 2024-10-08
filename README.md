# react-native-read-more

* This ReadMore Component initially mounts and unmounts the full text 2 times and the target line (truncated line) upto 12-14 times to perform layout calculations to get desired result. These text views, used for calculations, are rendered with opacity zero and position "absolute", while the visible text remains in front.
* When you rerender the parent component with unchanged props for the ReadMore component, the full text renders once more (with zero opacity and position "absolute") to verify any changes in the TextComponent unless the TextComponent is memoized.
* Note that the text component undergoes several mounts and unmounts initially in the background for calculations. Nonetheless, I've experienced no performance issues. Please proceed with caution.

```
import ReadMore from '@gpbagga/react-native-read-more'

const App = () => {
  return (
    <ReadMore
      TextComponent={
        <Text
        style={{
          margin: 30,
          fontSize: 16,
          fontFamily: 'sans-serif-condensed'
        }}>
          <Text
          style={{
            fontWeight: 'bold'
          }}
          >{SAMPLE_STRING.substring(0, 30)}</Text>
          {SAMPLE_STRING.substring(30, 100)}
          <Text
            style={{ fontSize: 20, fontWeight: 'bold' }} >{SAMPLE_STRING.substring(100, 110)}</Text>
          <Text style={{ fontSize: 30 }} >{SAMPLE_STRING.substring(110)}</Text>
        </Text>
      }
      numLinesForReadMore={3}
      ReadMoreComponent={<Text>...read more</Text>}
      ReadLessComponent={<Text>...read less</Text>}
      isAnimated={true}         // by default, it is true
      animationDuration={400}  // in milliseconds. By default, it is 300
    />
  )
}

export default App
```

* Make sure that style of Parent View of ReadMore component does NOT include flexDirection:'row' and flexWrap:'wrap'.
* You can make TextComponent as complex as you want (as you can see in above example) or as simple as you want (```<Text>abcdef</Text>```)
