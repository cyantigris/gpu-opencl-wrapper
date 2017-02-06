const fs = require('fs'), 
    CLWrapper = require('../src/OpenCLWrapper/OpenCLWrapper'),
    _inputData_init = require('./_inputData_init'),
    _printResults = require('./_printResults');

const clWrapper = new CLWrapper(true),
    cl = clWrapper.cl,
    BUFFER_SIZE=10;

let sourceCode = fs.readFileSync('./sourceCode.opencl','utf-8');

let buffer_init =function(){
    let size = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT, // size in bytes
        aBuffer = cl.createBuffer(clWrapper._context, cl.MEM_READ_ONLY, size),
        bBuffer = cl.createBuffer(clWrapper._context, cl.MEM_READ_ONLY, size),
        cBuffer = cl.createBuffer(clWrapper._context, cl.MEM_WRITE_ONLY, size);
    return [aBuffer,bBuffer,cBuffer];
};

let init = function(){
    let kernel = clWrapper.init(sourceCode,'vadd'),     //kernel init
        inputData = _inputData_init(BUFFER_SIZE),       //init input data
        bufferList = buffer_init();                     //create GPU buffer object

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

    // run openCL
    cl.enqueueNDRangeKernel(
        clWrapper._commandQueue, 
        kernel, 
        1,
        null,
        [BUFFER_SIZE],
        null
    );

    // get results and block while getting them
    cl.enqueueReadBuffer (clWrapper._commandQueue, bufferList[2], true, 0, inputData[2].length*Uint32Array.BYTES_PER_ELEMENT, inputData[2]);
    
    _printResults(inputData,BUFFER_SIZE);
    clWrapper.releaseAll();
};

init();