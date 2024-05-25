import React from "react";
import { Text } from "react-native";
import onStringEncountered from "./onStringEncountered";

// accumulator means how much length of full text component has we covered so far
const getTSX = (
  numLinesForReadMore,
  props,
  lines,
  accumulator = 0,
  styles = {},
  readMoreLineStyles = []
) => {
  const tempArr = [];
  const arrB4TargetLine = [];
  const stylesTemp =
    !Array.isArray(props?.style) && !Array.isArray(styles)
      ? { ...styles, ...props?.style }
      : [
          ...(Array.isArray(styles) ? styles : [styles]),
          ...(Array.isArray(props?.style) ? props?.style : [props?.style]),
        ];

  if (Array.isArray(props?.children)) {
    for (let i = 0; i < props?.children.length; i++) {
      let item = props?.children[i];

      if (typeof item === "string" || item instanceof String) {
        ({ accumulator } = onStringEncountered({
          lines,
          accumulator,
          tempArr,
          item,
          styles: stylesTemp,
          numLinesForReadMore,
          readMoreLineStyles,
          arrB4TargetLine,
        }));
      } else {
        // it is text component
        const jsx = getTSX(
          numLinesForReadMore,
          item?.props,
          lines,
          accumulator,
          stylesTemp,
          readMoreLineStyles
        );
        tempArr.push(jsx?.comp);
        accumulator = jsx?.accumulator;
        arrB4TargetLine.push(jsx?.compBeforeTargetLine);
      }
    }
  } else {
    // it is a string
    let item = props?.children;
    if (typeof item === "string" || item instanceof String) {
      ({ accumulator } = onStringEncountered({
        lines,
        accumulator,
        tempArr,
        item,
        styles: stylesTemp,
        numLinesForReadMore,
        readMoreLineStyles,
        arrB4TargetLine,
      }));
    }
  }
  return {
    comp: (
      <Text style={props?.style}>
        {tempArr.map((item, index) => {
          return <Text key={index}>{item}</Text>;
        })}
      </Text>
    ),
    compBeforeTargetLine: (
      <Text style={props?.style}>
        {arrB4TargetLine.map((item, index) => {
          return <Text key={index}>{item}</Text>;
        })}
      </Text>
    ),
    accumulator,
    readMoreLineStyles,
  };
};

export default getTSX;
