export function capitailize(str: string) {
  let rst = "";
  for (let i = 0; i < str.length; i++) {
    if (i === 0) {
      rst += str[i].toUpperCase();
    } else {
      rst += str[i];
    }
  }
  return rst;
}
