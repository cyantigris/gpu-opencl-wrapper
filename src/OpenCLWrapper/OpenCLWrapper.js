const OpenCLWrapper_privateMethod = require('./OpenCLWrapper_privateMethod');

module.exports = class OpenCLWrapper extends OpenCLWrapper_privateMethod{
    constructor(debugMode = false){
        super(debugMode);
    }

    init(sourceCode,kernelName){
        this._platform_init();
        this._deviceList_init();
        this._context_init();

        this._addProgram(sourceCode,kernelName);
        this._commandQueue_init();

        return this._kernelList[this._kernelList.length-1];
    }

    setKernelArg(kernel,dataList){
        let count = 0;
        for(let i of dataList){
            this.cl.setKernelArg(kernel, count, i.type,  i.data);
            count +=1;
        }
    }

    releaseAll(){
        this.cl.releaseAll()
    }
};