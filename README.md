# react-native-read-more

```
import ReadMore from '@gpbagga/react-native-read-more'

const SAMPLESTR =
  "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system"




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
    <ReadMore
      TextComponent={TextComponent}
      numLinesForReadMore={3}
      ReadMoreComponent={() => <Text>...read more</Text>}
      ReadLessComponent={() => <Text>...read less</Text>}
    />
  )
}

export default App
```

> Make sure that style of Parent View of ReadMore component does NOT include flexDirection:'row' and flexWrap:'wrap'.
> Keep TextComponent in useCallback to not render the ReadMore component again when text inside it remains same.
