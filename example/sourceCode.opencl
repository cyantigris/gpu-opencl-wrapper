__kernel void vadd(__global int *a, __global int *b, __global int *c, uint iNumElements){                                                                          
    size_t i =  get_global_id(0);                                          
    if(i >= iNumElements) return;                                          
    c[i] = a[i] + b[i];                                                    
}                         