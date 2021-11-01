//Vector swizzling can be done in two ways: either a dynamic function, or an instance of the Proxy class.
//Scroll to the bottom for a large comment containing this code with no comments.

//First with a function:

const FunctionVector = function(x, y, z) {
    var v = { //if (x | y | z) ?= null then (x | y | z) = 0^[1].
        x: x || 0,
        y: y || 0,
        z: z || 0
    };
    
    v.s/*s for swizzle*/ = function(ss/*(s)wizzle(s)tring*/) {
        var dims/*^[2]*/ = ['x', 'y', 'z']//The "dims" variable sets the default keys to be paired with.
        var vec = {}; //The "vec" object you see here is a template in which we put the swizzled values into.
        
        for (var V in ss) {
            let char = ss[V]; //"char" represents a single character in the string.
          
            vec[dims[V]] = v[char] //The lowercase v represents the main vector object in the parent function's scope^[3].
        }
      
        return FunctionVector(vec.x, vec.y, vec.z);
    };
  
    return v;
}

//Next with a proxy:

const ProxyVector = function(x, y, z) {
    var v = new Proxy({ //Construct a new proxy.
        //This is the target object.
        x: x || 0,
        y: y || 0,
        z: z || 0
    }, {
        //This is the handler.

        get: function(self/*the target object*/, key/*the index in the form of a string*/) { //The "get" function controls how to get certain value(s).
            //As you will notice I'll be doing the same thing as the above, with the exception of avoiding a call stack overflow:

            if (key.length == '1') {
                return self[key];
            }

            var dims = ['x', 'y', 'z'];
            var vec = {};

            for (V in key) {//Since the key is a string, it will have a length attribute to iterate through.
                let char = key[V];

                vec[dims[V]] = v[char];
            }

            return ProxyVector(vec.x, vec.y, vec.z); 
        }
    })
    
    return v;
};

//Results (FunctionVector):

var vF = FunctionVector(1, 2, 3);
var vFs = vF.s('zyx');

console.log(`${vF.x} ${vF.y} ${vF.z} --> ${vFs.x} ${vFs.y} ${vFs.z}`)//--> "1 2 3 --> 3 2 1"

//Results (ProxyVector):

var vP = ProxyVector(4, 5, 6);
var vPs = vP.zyx;//^[4]

console.log(`${vP.x} ${vP.y} ${vP.z} --> ${vPs.x} ${vPs.y} ${vPs.z}`)//--> "4 5 6 --> 6 5 4"

/*Footnotes
[1] Any combinations of null with values, null will convert to 0.
[2] Variable "dims" does not necessarily need to be an array. It can be a string as well.
[3] The parental function scope is the environment in which variable v (lowercase) exists as a value.
[4] Notice the difference between the structure of the swizzle (.s('zyx') compared to .zyx).
*/

/* Raw Code:

const FunctionVector = function(x, y, z) {
    var v = {
        x: x || 0,
        y: y || 0,
        z: z || 0
    };
    
    v.s = function(ss) {
        var dims = ['x', 'y', 'z'];
        var vec = {};
        
        for (var V in ss) {
            let char = ss[V];
          
            vec[dims[V]] = v[char];
        }
      
        return FunctionVector(vec.x, vec.y, vec.z);
    };
  
    return v;
}

const ProxyVector = function(x, y, z) {
    var v = new Proxy({
        x: x || 0,
        y: y || 0,
        z: z || 0
    }, {
        get: function(self, key) {
            var dims = ['x', 'y', 'z'];
            var vec = {};
            
            if (key.length == '1') {
                return self[key];
            }

            for (V in key) {
                let char = key[V];

                vec[dims[V]] = v[char];
            }

            return ProxyVector(vec.x, vec.y, vec.z); 
        }
    })
    
    return v;
};

var vF = FunctionVector(1, 2, 3);
var vFs = vF.s('zyx');

console.log(`${vF.x} ${vF.y} ${vF.z} --> ${vFs.x} ${vFs.y} ${vFs.z}`)

var vP = ProxyVector(4, 5, 6);
var vPs = vP.zyx;

console.log(`${vP.x} ${vP.y} ${vP.z} --> ${vPs.x} ${vPs.y} ${vPs.z}`)
*/