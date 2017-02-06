module.exports = function(data,BUFFER_SIZE){
   // Print input vectors and result vector
  var output = "\nA = ";
  for (var i = 0; i < BUFFER_SIZE; i++) {
    output += data[0][i] + ", ";
  }
  output += "\nB = ";
  for (var i = 0; i < BUFFER_SIZE; i++) {
    output += data[1][i] + ", ";
  }
  output += "\nC = ";
  for (var i = 0; i < BUFFER_SIZE; i++) {
    output += data[2][i] + ", ";
  }
  console.info(output);
}