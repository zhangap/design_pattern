var Event = (function(){
    var Event,
    _default = "default";

    Event = function(){
        var _listen,
            _trigger,
            _remove,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            each = function(ary,fn){
                var ret;
                for(var i =0, l = ary.length;i<l;i++){
                    var n = ary[i];
                    ret = fn.call(n,i,n);
                }
                return ret;
            };

            //订阅事件
            _listen = function(key,fn,cache){
                if(!cache[key]){
                    cache[key] = [];
                }
                cache[key].push(fn);
            };
            //移除事件
            _remove = function(key,cache,fn){
                if(cache[key]){
                    if(fn){
                        for(var i = cache[key].length; i>=0;i--){
                            if(cache[key] === fn){
                                cache[key].splice(i,1);
                            }
                        }
                    }else{
                        delete cache[key];
                    }
                }
            };
            //发布事件
            _trigger = function(){
                var cache = _shift.call(arguments),
                    key = _shift.call(arguments),
                    args = arguments,
                    _self = this,
                    stack = cache[key];
                //有可能发布了事件，但是没有订阅事件，就没办法执行(同名事件可以订阅多次)
                if(!stack || !stack.length){
                    return;
                }
                return each(stack,function(){
                    return this.apply(_self,args);
                });
            };

            //创建命名空间
            _create = function(namespace){
                var namespace = namespace || _default;
                var cache = {},
                offlineStack = [], //离线事件
                ret = {
                    listen:function(key,fn,last){
                        _listen(key,fn,cache);

                        if(offlineStack === null){
                            return;
                        }
                        //执行离线堆栈中的最后一个事件
                        if(last === "last"){
                            offlineStack.length && offlineStack.pop()();
                        }else{
                            //如果离线事件有，则直接执行一遍
                            each(offlineStack,function(){
                                this();
                            });
                        }
                        offlineStack = null;
                    },

                    one:function(key,fn,last){
                        _remove(key,cache);
                        this.listen(key,fn,last);
                    },
                    remove:function(key,fn){
                        _remove(key,cache,fn);
                    },
                    trigger:function(){
                        var fn,
                            args,
                            _self = this;
                        
                        _unshift.call(arguments,cache);
                        args = arguments;

                        fn = function(){
                            return _trigger.apply(_self,args);
                        };

                        if(offlineStack){
                            return offlineStack.push(fn);
                        }
                        return fn();
                    }
                };
                return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace]: namespaceCache[namespace]= ret) : ret; 
            };

            return {
                create:_create,
                one:function(key,fn,last){
                    var event = this.create();
                    event.one(key,fn,last);
                },
                remove:function(key,fn){
                    var event = this.create();
                    event.remove(key,fn);
                },
                listen:function(key,fn,last){
                    var event = this.create();
                    event.listen(key,fn,last);
                },
                trigger:function(){
                    var event = this.create();
                    event.trigger.apply(this,arguments);
                }
            };
    }();
    return Event;
})();