function isEqual(value, other, seen = new Set()) {
  if (value === other) {
    return true;
  }

  if (
    value == null ||
    other == null ||
    typeof value !== "object" ||
    typeof other !== "object"
  ) {
    // console.log(2);
    return false;
  }

  if (
    Object.prototype.toString.call(value) !==
    Object.prototype.toString.call(other)
  ) {
    // console.log(3);
    return false;
  }

  // Handle circular references
  if (seen.has(value) || seen.has(other)) {
    // console.log(4);
    return false;
  }
  seen.add(value);
  seen.add(other);

  if (value instanceof Date && other instanceof Date) {
    // console.log(5);
    return value.getTime() === other.getTime();
  }

  if (value instanceof RegExp && other instanceof RegExp) {
    return value.toString() === other.toString();
  }

  if (value instanceof Map && other instanceof Map) {
    if (value.size !== other.size) {
      // console.log(6);
      return false;
    }
    for (let [key, val] of value) {
      if (!other.has(key) || !isEqual(val, other.get(key), seen)) {
        // console.log(7);
        return false;
      }
    }
    return true;
  }

  if (value instanceof Set && other instanceof Set) {
    if (value.size !== other.size) {
      // console.log(8);
      return false;
    }
    for (let item of value) {
      if (!other.has(item)) {
        // console.log(9);
        return false;
      }
    }
    return true;
  }

  const keysValue = Object.keys(value);
  const keysOther = Object.keys(other);

  if (keysValue.length !== keysOther.length) {
    // console.log(10);
    return false;
  }

  for (let key of keysValue) {
    if (!keysOther.includes(key) || !isEqual(value[key], other[key], seen)) {
      // console.log(11);
      return false;
    }
  }

  seen.delete(value);
  seen.delete(other);

  return true;
}

export default isEqual;
