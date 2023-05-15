function Camelize(str) {
  return str.replace(/(?:^\w|[A-Z-ÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toUpperCase() :  word.toLowerCase();
  })
}

export default Camelize;