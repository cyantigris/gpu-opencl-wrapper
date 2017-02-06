# A Wrapper for openCL , makes openCL more easy with JS
<li>This wrapper is base on 'node-opencl' package</li><li>Its a high level wrapper for openCL API</li>

## openCL pipe-line without this wrapper ( 13 steps )
 1.select platform<br>
 2.get devices<br>
 3.create openCL context<br>
 4.get context device<br>
 5.create program<br>
 6.build program<br>
 7.create kernel program<br>
 8. create command queue<br>
 9. create buffer data<br>
 10.enqueue buffer data<br>
 11.set kernel arguments<br>
 12.enqueueKernel ( run openCL !!)<br>
 13.readResult (optional)<br>

## use openCL with wrapper ( 7 steps )
1.create wrapper instance<br>
2.init wrapper with kernel source code<br>
3.create buffer data<br>
4.enqueue buffer data<br>
5.set kernel arguments<br>
6.enqueueKernel ( run openCL !!)<br>
7.readResult (optional)<br>
