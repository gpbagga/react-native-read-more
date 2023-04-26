# react-native-read-more
```
const SAMPLESTR =
  "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system"
const TextComponent = (props) => (
  <Text
    {...props}
    style={{
      margin: 30,
      fontSize: 16,
      fontFamily: 'sans-serif-condensed'
    }}>
    <Text
      style={{
        fontWeight: 'bold'
      }} >{SAMPLESTR.substring(0, 30)}</Text>
    {SAMPLESTR.substring(30, 100)}
    <Text
      style={{ fontSize: 20, fontWeight: 'bold' }} >{SAMPLESTR.substring(100, 110)}</Text>
    <Text
      style={{ fontSize: 30 }} >{SAMPLESTR.substring(110)}</Text>
  </Text>
)


const README = () => {
  return (
    <ReadMoreText
      TextComponent={TextComponent}
      numLinesForReadMore={3}
      ReadMoreComponent={() => <Text>...read more</Text>}
      ReadLessComponent={() => <Text>...read less</Text>}
    />
  )
}

export default README
```