import { Text } from 'react-native'
import onStringEncountered from './onStringEncountered'

// accumulator means how much length of full text component has we covered so far
const getTSX = (numLinesForReadMore,props,lines, accumulator = 0, lineIndex = 0, styles = {}, readMoreLineStyles = [])=> {
  const tempArr = []
  const readTextArr = []
  if(Array.isArray(props.children)){
    for(let i = 0; i< props.children.length; i++){
      let item = props.children[i]

      if (typeof item === 'string' || item instanceof String){
        
        ({accumulator, lineIndex} = onStringEncountered({lines, accumulator,lineIndex, tempArr, item, styles: {...styles, ...props.style}, numLinesForReadMore, readMoreLineStyles, readTextArr}));
        
      }else{
        // it is text component
        const jsx = getTSX(numLinesForReadMore,item.props, lines, accumulator, lineIndex, {...styles, ...props.style}, readMoreLineStyles)
        tempArr.push(jsx.comp)
        accumulator = jsx.accumulator
        lineIndex = jsx.lineIndex
        readTextArr.push(jsx.compBeforeTargetLine)
      }
    }
  }else{
    // it is a string
    let item = props.children;
    ({accumulator, lineIndex} = onStringEncountered({lines, accumulator,lineIndex, tempArr, item, styles: {...styles, ...props.style}, numLinesForReadMore, readMoreLineStyles, readTextArr}));
  }
  return ({
    comp: (
      <Text style={props.style}>
        {tempArr.map(item => {
          return item;
        })}
      </Text>
    ),
    compBeforeTargetLine:(
      <Text style={props.style}>
        {readTextArr.map(item => {
          return item;
        })}
      </Text>
    ),
    accumulator,
    lineIndex,
    readMoreLineStyles,
  });
}

export default getTSX