# react-native-read-more

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
      animationDuration={1000}  // in milliseconds. By default, it is 500
    />
  )
}

export default App
```

* Make sure that style of Parent View of ReadMore component does NOT include flexDirection:'row' and flexWrap:'wrap'.
* You can make TextComponent as complex as you want (as you can see in above example) or as simple as you want (```<Text>abcdef</Text>```)
