var util = (function(){
    return {
        // 设置和取得cookie信息封装
        setCookie: function(name,value,iDay){
            var oDate = new Date();
            oDate.setDate(oDate.getDate()+iDay);
            document.cookie = name+"="+value+";expires="+oDate;
        },

        getCookie: function(name){
            var arr = document.cookie.split("; "),
                length = arr.length,
                i;
            for(i=0;i<length;i++){
                var arr2 = arr[i].split("=");
                if (arr2[0]== name) {
                    return arr2[1];
                }
            }
            return "";
        },

        // 移除cookie信息
        removeCookie: function(name){
            setCookie(name,1,-1);
        },

        // ajax get方法的封装
        get: function(url,options,callback){
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if((xhr.status >=200 && xhr.status <300) || xhr.status ==304){
                        var data = JSON.parse(xhr.responseText);
                        if(typeof callback == 'function'){
                            callback(data);
                            console.log("ok");
                        }
                    }else{
                        alert("请求错误："+xhr.status+" "+xhr.statusText);
                    }
                }
            }
            xhr.open("GET",url+"?"+util.serialize(options),true);
            xhr.send(null);
        },
         

        serialize: function(data){
            if(!data) return '';
            var pairs = [];
            for(var name in data){
                if(!data.hasOwnProperty(name)) continue;
                if(typeof data[name] === 'function') continue;
                var value = data[name].toString();
                name = encodeURIComponent(name);
                value = encodeURIComponent(value);
                pairs.push(name + '=' + value);
            }
            return pairs.join('&');
        },

        // 暴露num号节点，隐藏组内其他节点
        displayOne: function(num,eleList,displayStyle){
            for(var i=0;i<eleList.length;i++){
                eleList[i].style.display = "none";
            };
            eleList[num].style.display = displayStyle;
        },

        // 激活当前节点，其余节点处于非激活状态
        activeOne: function(actEle,actStr,ele,str){
            for(var i=0;i<ele.length;i++){
                ele[i].className = str;
            }
            actEle.className = actEle.className + actStr;
        },

                
        // 判断某个字符串在另一个字符串的位置
        Index: function(str1,str2){
           var s = str1.indexOf(str2);
           return(s);
        },


        // 获取激活节点值
        getActivePage: function(eleList,activeStr){
            for(var i=0;i<eleList.length;i++){
                var str = eleList[i].className;
                var result = util.Index(str,activeStr)
                if(result >= 0){
                    return eleList[i].innerHTML;
                }
            };
        },

        // 移除所有相关子节点
        removeAll: function(ele,eleParent){
            if(ele.length&&ele.length!=0){
                for(var i=0;i<ele.length;i++){
                    eleParent.removeChild(ele[i]);
                }                        
            } 
        },

        // 生成节点
        createNode: function(ele,innerHTML,className){
            var newNode = document.createElement(ele);
            newNode.innerHTML = innerHTML;
            newNode.className = className;
            return newNode;
        },

        // 设置时间格式
        getTime: function (time) {
            time = Math.ceil(time);
            var min = parseInt(time/60);
            min = min < 10 ? '0' + min:min;
            var snd = time%60;
            snd = snd < 10 ? '0' + snd:snd;
            return min + ':' + snd;
        }
    }
})()
