/**
 * Proxy proxy's function calls to and back from some location, currently only supports browser,
 * or noop
 * @param functions: map of functions to proxy between, note: functions may only have callbacks, no actual args
 * @param func: funtion to proxy between
 * @param browserRunner: browserRunner to proxy to
 * @constructor
 */
//module.exports = function proxy(functions, func, browserRunner) {
//    return function () {
//        var remote = browserRunner.remote;
//        var functionNames = [];
//        var functionMap = [];
//        for (var i = 0; i < functions.length; i++) {
//            var functionName = functions[i].name;
//            functionNames.push(functionName);
//            functionMap[functionName] = functions[i];
//            //console.log(functions[i].name + " ------------ " +functions[i].toString());
//        }
//        //remote.timeoutsAsyncScript(5000);
//        remote.execute(function (functionNames) {
//            console.log("callstack set");
//            k3poInternalSaveCallStack = [];
//            k3poInternalSaveCall = function (name, args) {
//                k3poInternalSaveCallStack.push(name);
//            };
//
//            console.log("one");
//            for (var i = 0; i < functionNames.length; i++) {
//                // Save each function
//                var name = functionNames[i];
//                var evalString = name + "= function () { var args = Array.prototype.slice.call(arguments); k3poInternalSaveCall('" + name + "', args)};";
//                console.log(evalString);
//                eval(evalString);
//            }
//            console.log("init");
//        }, functionNames).then(function () {
//            console.log("Execute async");
//            remote.execute(func).then(function () {
//                remote.execute(function () {
//                    console.log("callstack " + k3poInternalSaveCallStack);
//                    console.log(k3poInternalSaveCallStack.length);
//                    return k3poInternalSaveCallStack.pop().toString();
//                }).then(function (res) {
//                    console.log("called function name is " + res.value);
//                    functionMap[res.value]();
//                });
//            });
//            console.log("waiting until");
//        });
//
//
//        //console.log("called function2 name is " + calledFunctionName.value);
////
//
//    };
//};

module.exports = function proxy(functions, func, browserRunner) {
    return function () {
        //var remote = browserRunner.remote;
        //var functionNames = [];
        //var functionMap = [];
        //for (var i = 0; i < functions.length; i++) {
        //    var functionName = functions[i].name;
        //    functionNames.push(functionName);
        //    functionMap[functionName] = functions[i];
        //    //console.log(functions[i].name + " ------------ " +functions[i].toString());
        //}
        ////remote.timeoutsAsyncScript(5000);
        //remote.execute(function (functionNames) {
        //    console.log("callstack set");
        //    k3poInternalSaveCallStack = [];
        //    k3poInternalSaveCall = function (name, args) {
        //        k3poInternalSaveCallStack.push(name);
        //    };
        //
        //    console.log("one");
        //    for (var i = 0; i < functionNames.length; i++) {
        //        // Save each function
        //        var name = functionNames[i];
        //        var evalString = name + "= function () { var args = Array.prototype.slice.call(arguments); k3poInternalSaveCall('" + name + "', args)};";
        //        console.log(evalString);
        //        eval(evalString);
        //    }
        //    console.log("init");
        //}, functionNames).then(function () {
        //    console.log("Execute async");
        //    remote.execute(func).then(function () {
        //        remote.execute(function () {
        //            console.log("callstack " + k3poInternalSaveCallStack);
        //            console.log(k3poInternalSaveCallStack.length);
        //            return k3poInternalSaveCallStack.pop().toString();
        //        }).then(function (res) {
        //            console.log("called function name is " + res.value);
        //            functionMap[res.value]();
        //        });
        //    });
        //    console.log("waiting until");
        //});


        //console.log("called function2 name is " + calledFunctionName.value);
//

    };
};

