const fs = require('fs'), 
    CLWrapper = require('../src/OpenCLWrapper/OpenCLWrapper'),
    _inputData_init = require('./_inputData_init'),
    _printResults = require('./_printResults');

const clWrapper = new CLWrapper(true),
    cl = clWrapper.cl;

const BUFFER_SIZE=10;

let sourceCode = fs.readFileSync('./sourceCode.opencl','utf-8');

let buffer_init =function(){
    let size = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT; // size in bytes
    // Create buffer for A and B and copy host contents
    let aBuffer = cl.createBuffer(clWrapper._context, cl.MEM_READ_ONLY, size),
        bBuffer = cl.createBuffer(clWrapper._context, cl.MEM_READ_ONLY, size);

    // Create buffer for C to read results
    let cBuffer = cl.createBuffer(clWrapper._context, cl.MEM_WRITE_ONLY, size);
    return [aBuffer,bBuffer,cBuffer];
};

let init = function(){
    let kernel = clWrapper.init(sourceCode,'vadd'),
        inputData = _inputData_init(BUFFER_SIZE),
        bufferList = buffer_init(), //create GPU buffer object
        C = new Uint32Array(BUFFER_SIZE);

    //allocate GPU memeryBuffer
    for(let i=0;i< inputData.length;i++)
    {
        cl.enqueueWriteBuffer (clWrapper._commandQueue, bufferList[i], true, 0, inputData[i].length*Uint32Array.BYTES_PER_ELEMENT, inputData[i]);
    }

    //set C kernel arguments
    clWrapper.setKernelArg(
        kernel,
        [
            {type:'uint*',data:bufferList[0]},
            {type:'uint*',data:bufferList[1]},
            {type:'uint*',data:bufferList[2]},
            {type:'uint',data:BUFFER_SIZE}
        ]
    );

    // run cl program
    cl.enqueueNDRangeKernel(
        clWrapper._commandQueue, 
        kernel, 
        1,
        null,
        [BUFFER_SIZE],
        null
    );

    // get results and block while getting them
    cl.enqueueReadBuffer (clWrapper._commandQueue, bufferList[2], true, 0, C.length*Uint32Array.BYTES_PER_ELEMENT, C);

    // print results
    _printResults(inputData[0],inputData[1],C,BUFFER_SIZE);

    clWrapper.releaseAll();
};

init();



