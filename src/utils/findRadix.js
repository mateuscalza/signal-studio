export default function findRadix(length) {
  let radix = 2
  while (length >= radix) {
    radix = radix * 2
  }
  return radix / 2
}
