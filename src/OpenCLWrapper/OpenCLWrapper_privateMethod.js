const cl = require('node-opencl');

module.exports = class OpenCLWrapper_privateMethod{
    constructor(debugMode = false){
        this.cl = cl;

        this._platformList = null;
        this._deviceList = null;
        this._device = null;
        this._context =null;
        this._commandQueue = null;

        this._programList = [];
        this._kernelList = [];

        this._debugMode = debugMode;
    }

    _platform_init(){
        this._platformList = this.cl.getPlatformIDs();

        if(this._debugMode){
            for(var i=0;i<this._platformList.length;i++){
                console.info("Platform "+i+": "+this.cl.getPlatformInfo(this._platformList[i],this.cl.PLATFORM_NAME));
            }
        }
    }

    _deviceList_init(mode = this.cl.DEVICE_TYPE_ALL){
        this._deviceList = this.cl.getDeviceIDs(this._platformList[0], this.cl.DEVICE_TYPE_ALL);

        if(this._debugMode){
             for(var i=0;i< this._deviceList.length;i++){
                console.info("  Devices "+i+": "+this.cl.getDeviceInfo(this._deviceList[i],this.cl.DEVICE_NAME));
             }  
        }
    }

    _context_init(devices = this._deviceList){
        this._context = this.cl.createContext(
            [this.cl.CONTEXT_PLATFORM, this._platformList[0]],
            devices
        );
        this._device = this.cl.getContextInfo(this._context, cl.CONTEXT_DEVICES)[0];
    }

    _commandQueue_init(){
        if (this.cl.createCommandQueueWithProperties !== undefined) {
            this._commandQueue = this.cl.createCommandQueueWithProperties(this._context, this._device, []); // OpenCL 2
        } else {
            this._commandQueue = this.cl.createCommandQueue(this._context, this._device, null); // OpenCL 1.x
        }
    }

    _addProgram(sourceCode,kernelName){
        this._programList.push(this.cl.createProgramWithSource(this._context, sourceCode));
        this.cl.buildProgram(this._programList[this._programList.length-1]);
        this._addKernel(this._programList[this._programList.length-1],kernelName);
    }

    _addKernel(program,kernelName){
        try {
            this._kernelList.push(this.cl.createKernel(program, kernelName));
        }
        catch(err) {
            debug.error(this.cl.getProgramBuildInfo(program, this._device, this.cl.PROGRAM_BUILD_LOG));
            process.exit(-1);
        }
    }
};