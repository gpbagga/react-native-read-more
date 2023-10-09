# react-native-read-more

```
import ReactNativeReadMore from '@gpbagga/react-native-read-more'

const App = () => {
  const TextComponent = useCallback(() => (
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
      >{SAMPLESTR.substring(0, 30)}</Text>
      {SAMPLESTR.substring(30, 100)}
      <Text
        style={{ fontSize: 20, fontWeight: 'bold' }} >{SAMPLESTR.substring(100, 110)}</Text>
      <Text style={{ fontSize: 30 }} >{SAMPLESTR.substring(110)}</Text>
    </Text>
  ), [])

  return (
    <ReactNativeReadMore
      TextComponent={TextComponent}
      numLinesForReadMore={3}
      ReadMoreComponent={<Text>...read more</Text>}
      ReadLessComponent={<Text>...read less</Text>}
    />
  )
}

export default App
```

* Make sure that style of Parent View of ReactNativeReadMore component does NOT include flexDirection:'row' and flexWrap:'wrap'.
* Keep TextComponent inside useCallback to not render the ReactNativeReadMore component again on rerender of the App when text inside it remains same.
