var Event =(function(){
    var clientList = {},
    add,
    trigger,
    remove;

   //订阅事件
    add = function(key,fn){
        clientList[key] = clientList[key] || [];
        clientList[key].push(fn);
    };

    //移除已经订阅事件
    remove = function(key,fn){
        var fns = clientList[key];
        if(!fns) return false;
        
        if(!fn){
            delete clientList[key];
            return;
        }

        for(var i =0,len = fns.length;i<len;i++){
            if(fns[i] === fn){
                fns.splice(i,1);
                break;
            }
        }
    };
    //触发订阅事件
    trigger = function(){
        var key = Array.prototype.shift.call(arguments),
        fns = clientList[key];

        if(fns && fns.length){
            for(var i =0,len = fns.length;i<len;i++){
                fns[i].apply(this,arguments);
            }
        }
    }

    return {
        add:add,
        remove:remove,
        trigger:trigger
    };
})();