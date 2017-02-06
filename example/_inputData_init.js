module.exports = function(BUFFER_SIZE){
    let A=new Uint32Array(BUFFER_SIZE),
        B=new Uint32Array(BUFFER_SIZE);

    for (var i = 0; i < BUFFER_SIZE; i++) {
        A[i] = i;
        B[i] = i * 2;
    }

    return [A,B];
}