// 头部通知条
(function popClose(){
    var pop = document.querySelector('#pop'),
        popclose = pop.querySelector('.pop-close');
            
    // 读取cookie
    var res=util.getCookie("name");

    // 判断是否点击过关闭按钮
    if( res != "pop"){
        popclose.onclick = function(){
            pop.style.display="none";
            util.setCookie("name","pop",3000);
        }
    }else{
        pop.style.display="none";
    }
})();


// 轮播图
(function slide(){
	var slide = document.querySelector("#slide"),
	    banner = slide.querySelector(".slide-banner"),
	    indic = slide.querySelector(".slide-ind"),
	    indicli = indic.getElementsByTagName("li"),
	    index = 0,
	    i,
	    length = indicli.length,
	    timer = null,
        bannerAll = banner.querySelectorAll("img"); 

	//每隔5秒切换一次图片和指示
	timer = setInterval(autoPlay(),5000);

	// 当鼠标划过整个容器时停止自动播放
	slide.onmouseover = function(){
		clearInterval(timer);
	}

	// 当鼠标离开整个容器时重新自动播放
	slide.onmouseout = function(){
		timer = setInterval(autoPlay,5000);
	}

	// 当点击到相应的点时，跳到相应的图片
	for(i=0;i<length;i++){
		indicli[i].id = i;
		indicli[i].onmouseover = function(){
			clearInterval(timer);			
			index = this.id;
            changeImage(index);
		}
	}

    // 自动切换图片和指示点
    function autoPlay(){       
        if (index>=length) {
           index = 0;
        }
        changeImage(index);
        index++;
    }

    function changeImage(curIndex){
        for(i=0;i<length;i++){
            indicli[i].className = "";
        }        
        indicli[curIndex].className = "slide-ind-on";
        banner.style.top = -460*curIndex+"px";
        setOpacity(curIndex);
    }

    function setOpacity(curIndex){
        var timer;
        clearInterval(timer);
        bannerAll[curIndex].style.opacity = 0;
        var deg = 0;
        timer = setInterval(function(){
                if(deg<100){
                    deg += 20;
                    bannerAll[curIndex].style.opacity = deg / 100;
                }else{
                    clearInterval(timer);
                }         
            },100)
        }
})();


// 登录弹窗
(function login(){
	var nav = document.querySelector("#nav"),
        follow = nav.querySelector("#follow"),
        followBg = nav.querySelector("#nav-bg"),
        login = document.querySelector("#login"),
        close = login.querySelector(".login-close"),   		
        name = login.elements['userName'],
	    password = login.elements['password'],
	    alert = login.querySelector(".login-alert"),
	    loginSuc = util.getCookie("login"),
	    followSuc = util.getCookie("follow");
    
    // 判断有无登录cookie
    if(!loginSuc){
	    // follow按钮被点击时
	    follow.onclick = function(){
            // 显示登录框
    	    revealLogin();

            // 点击关闭按钮和弹出框以外的区域，关闭登录弹窗       
            close.onclick = mask.onclick = removeLogin;

	        // 输入框输入文字时设置
            inputText();

	        // 点击提交按钮时
	        login.onsubmit = loginNow;
		}
    }else{   	
    	// 判断有无like cookie
		if(!followSuc){
			//点击后直接关注
            follow.onclick = loginNow;
		}else{
			// 有登录和like的cookie,自动关注
			loginNow();
			//点击时变成unlike
			follow.onclick = unlike; 
		};
	};

    // 移除登录和mask函数
    function removeLogin(){
    	login.style.display ="none";
    	mask.style.display ="none";
    };

    function revealLogin(){
    	login.style.display ="block";
    	mask.style.display ="block";
    };
    
    // 输入文字时，文本框设置
    function inputText(){
    	var inputText = login.querySelectorAll("input");
    	var length = inputText.length;
    	for(var i=0;i<length;i++){
    		inputText[i].onfocus = function(){
    			this.placeholder ="";
    			alert.style.display="none"; 
    		}
    	}

    	inputText[0].onblur = function(){
    			if(this.value==""){
    				inputText[0].placeholder="账号";
    			}
    	    };
    	inputText[1].onblur = function(){
    			if(this.value==""){
    				inputText[1].placeholder="密码";
    			}
    	    }; 
    };
    
    //提交按钮时，get函数的回调函数
    function loginRes(data){
	   if (data==1) {
		   	// 设置登录cookie
		    util.setCookie("login","loginSuc",12);
		   	//移除登录框和遮罩
		    removeLogin();
		   	// 设置关注
		   	util.get('http://study.163.com/webDev/attention.htm','',	likeRes)
	   }
	   else{   
	   	   alert.style.display="block";
	   }
	}

	// 关注时，get函数的回调函数
	function likeRes(data){
		if(data && data==1){
			// 设置关注成功cookie
			util.setCookie("follow","followSuc",12);
			console.log(util.getCookie("follow"));

			// 设置页面的样式
			follow.className = "nav-liked";
			followBg.className = "nav-liked-bg";
			var cancel = document.createElement("span");
			cancel.className = "nav-liked-can";
			cancel.innerHTML = "取消";
			follow.appendChild(cancel);	
		}
		else{
			alert("关注失败，请刷新页面重新关注！")
		}
	}

	// 登录和关注函数
	function loginNow(){
		//取得事件对象 
		event = EventUtil.getEvent(event); 
		//阻止默认事件 
		EventUtil.preventDefault(event);

		// 调用get函数
		var loginUrl = "http://study.163.com/webDev/login.htm";
	    options = {userName:md5(name.value),password:md5(password.value)};

        util.get(loginUrl,options,loginRes);
    };

	// 取消like函数
	function unlike(){
		follow.className = "nav-unliked";
		followBg.className = "nav-unliked-bg";
		follow.removeChild(cancel);
		util.removeCookie("follow");
	}
})();


// 主内容区页面
(function classes(){
	var classes = document.querySelector(".classes"),
	    mainClass = classes.querySelector(".c-main"),
	    tabTit = classes.querySelectorAll(".m-tit"),
	    courseGroup = mainClass.querySelectorAll(".m-course"),
	    page = mainClass.querySelector(".page"),
	    pageNumGroup = page.querySelectorAll(".page-num-g"),
		pagePre = page.querySelector(".page-icon-1"),
        pageNext = page.querySelector(".page-icon-2"),
        url = "http://study.163.com/webDev/couresByCategory.htm",
        content = window.getComputedStyle(document.body, ":after").getPropertyValue("content"),
        pSize=getSize();

        // 获取每页产品个数  onresize怎么写？
        function getSize(){
            if (content === "宽屏") {
                pSize = 20;
            } else{
                pSize = 15;
            }
            return pSize;
        }
        
	// 默认获取第一页课程内容和页码
	getClasses(1,courseGroup[0],1);
	getPages(1,pageNumGroup[0],1,courseGroup[0]);
 
    // 执行课程title的点击事件
    clickTab(tabTit);


    // tab点击绑定事件
    function clickTab(ele){
        for(var i=0;i<ele.length;i++){ 
        	(function(_i){
    	        ele[_i].onclick = function(){
    	            // 显示当前页面课程
    	        	util.displayOne(_i,courseGroup,"block");
    	        	// 显示当前页面
    	        	util.displayOne(_i,pageNumGroup,"inline-block");
    	        	// 激活当前页面title
    	        	util.activeOne(ele[_i]," m-tit-act",ele,"m-tit");
    	        	// 获取页面内容
    	        	getClasses(_i+1,courseGroup[_i],1)
    	        	//生成page
    	        	getPages(_i+1,pageNumGroup[_i],1,courseGroup[_i])
    		    };
        	})(i);  
        }; 
    }  
    

    // 获取课程内容函数
	function getClasses(num,courseList,pageNow){
		var option = {pageNo:pageNow,psize:pSize,type:num*10};
		util.get(url,option,	function(data){        
            createClass(data,courseList);
		});
	}; 

    // 获取页码内容函数
	function getPages(num,pageList,pageNow,courseList){
		var option = {pageNo:pageNow,psize:pSize,type:num*10};
		util.get(url,option,	function(data){        
            createPage(data,pageList,courseList,num);
		});
	}; 

    //生成课程内容函数
    function createClass(data,courseList){
    	// 生成list;
    	var li = data.list,
    	    length = li.length;
    	courseList.innerHTML = "";
    	//获取当页的内容 
    	for(var i =0;i<length;i++)
    		{   
    			var courseLi = document.createElement("li");
    			courseLi.className = "m-pro fl";

    			if(li[i].price == 0){
    				li[i].price = "免费";
    			}else{
    				li[i].price ="￥"+li[i].price;
    			};

                courseLi.innerHTML = ['<div class="m-pro-normal"><img src=',
                     li[i].middlePhotoUrl,
                    ' class="m-pro-con-tit-img m-pro-con">',
                    '<div class="m-pro-con-1">',
                    '<p class="m-pro-con-tit m-pro-con">',li[i].name,'</p>',
                    '<p class="m-pro-aut m-pro-con">',li[i].provider,'</p>',
                    '<p class="m-pro-num m-pro-con">',li[i].learnerCount,'</p>',
                    '<p class="m-pro-pri m-pro-con">',li[i].price,'</p></div></div>',
                    '<div class="m-pro-hover"><div class="m-hover-top">','<img src=',
                    li[i].middlePhotoUrl ,
                    ' class="fl m-hover-img">','<p class="m-hover-tit">',
                    li[i].name,'</p><p class="m-pro-num m-pro-con m-hover-num">',
                    li[i].learnerCount,'人在学</p><p class="m-hover-aut">发布者：',
                    li[i].provider,'</p><p class="m-hover-cla">分类： ',
                    li[i].categoryName,'</p></div><p class="m-hover-bottom">',
                    li[i].description,'</p></div>'].join('');
                courseList.appendChild(courseLi);
            }  
    };

    // 生成页码内容函数
    function createPage(data,pageList,courseList,num){
    	var length = data.totalPage;
    	pageList.innerHTML = "";
    	for(var i=0;i<length;i++){
    		var newPage = util.createNode("span",i+1,"page-num")
    		pageList.appendChild(newPage);
    	}
    	var pageNum = pageList.querySelectorAll(".page-num");
    	util.activeOne(pageNum[0]," on",pageNum,"page-num");
    	changePage(data,pageList);
    	clickPageNum(data,pageList,courseList,num);
    	clickPageIcon(data,pageList,courseList,num);
    }
   
 
  
    // 页码数字点击绑定事件
    function clickPageNum(data,pageList,courseList,num){
    	// 判断哪个节点包含m-tit-act，并取得所在位置值
    	var pageNum = pageList.querySelectorAll(".page-num");
    	var length = pageNum.length;
    	for(var i=0;i<length;i++){
    		(function(_i){
    			// 群组内部页面的点击，
	    		pageNum[_i].onclick = function(){
	    			var pageNow = _i+1;
	    			// 获取当页课程内容
	                getClasses(num,courseList,pageNow);

	    			// 当前页码的className为on，其余节点的on去掉  			
	                util.activeOne(pageNum[_i]," on",pageNum,"page-num");

	                //根据active的位置，调整页面的显示
	                changePage(data,pageList);
	    		}	
    		})(i)
    	}
        return false;
    }

    // 页码按钮点击绑定事件
    function clickPageIcon(data,pageList,courseList,num){
        var totalPage = data.totalPage; 
        var pageNum = pageList.querySelectorAll(".page-num");    
        pagePre.onclick = function(){
        	var active = util.getActivePage(pageNum,"on");
        	if(active>1){
	            clickIcon(active-2,data,pageList,courseList,num);
        	}
            return false;
        }
        pageNext.onclick = function(){
        	var active = util.getActivePage(pageNum,"on");
        	if(active<totalPage){
	            clickIcon(active,data,pageList,courseList,num);
        	}
            return false;   
        }
    }
     
    // 页码按钮点击函数
    function clickIcon(nextPageNum,data,pageList,courseList,num){
    	var pageNum = pageList.querySelectorAll(".page-num");
        // 改变actived的节点位置
		util.activeOne(pageNum[nextPageNum]," on",pageNum,"page-num");         
        // 改变页面的显示方式
		changePage(data,pageList)
        // 重新获取节点的位置
		active = util.getActivePage(pageNum,"on");
		// 获取当页课程内容
        getClasses(num,courseList,active);
    }

    // 所有页码点击事件对于页码显示的影响
    function changePage(data,pageList){
    	var totalPage = data.totalPage;
    	var pageNum = pageList.querySelectorAll(".page-num");
    	var active = Number(util.getActivePage(pageNum,"on"));

        // 生成省略号
    	var newPage1 = util.createNode("span","...","ellipsis");
    	var ellipsis = pageList.querySelectorAll(".ellipsis");
		// 第一页和最后一页时按钮是不可点击状态
		if(active==1){
			pagePre.style.cursor = "text";
		}else if(active==totalPage){
			pageNext.style.cursor = "text";
		}
		else{
			pagePre.style.cursor = "pointer";
			pageNext.style.cursor = "pointer";
		};

		// 如果总页数小于等于8页，页码全部显示
	    if(totalPage<=8){
	    	for(var i=0;i<totalPage;i++){
	    		pageNum[i].style.display = "inline-block";
	    	};
	    }else if(totalPage>8){
	    	// 如果active的页码+4小于总页数，需要在后面某个位置加上省略号
	        if(active+4<totalPage){
	        	// 如果active小于3,显示8页，其余省略
	        	if(active<=3){
	        		for(var i=0;i<8;i++){
	        			pageNum[i].style.display = "inline-block";
	        		}
	        		for(var i=8;i<totalPage;i++){
	        			pageNum[i].style.display = "none";
	        		}
	        		util.removeAll(ellipsis,pageList);
	        		pageList.insertBefore(newPage1,pageNum[8]);     		
	        	}else if(active>3){
	        		// 如果active大于3，显示active的前后四页，后面多出来的用省略号代替
	        		for(var i=0;i<active+4;i++){
	        			pageNum[i].style.display = "inline-block";
	        		}
	        		for(var i=active+4;i<totalPage;i++){
	        			pageNum[i].style.display = "none";
	        		}
	        		util.removeAll(ellipsis,pageList);
	        		pageList.insertBefore(newPage1,pageNum[active+4]);
	        	}
	        }else if(active+4>=totalPage){
	        	// 如果active后面不足四页，则后面不需要用省略号
                util.removeAll(ellipsis,pageList);
	        	for(var i=0;i<totalPage;i++){
	        		pageNum[i].style.display = "inline-block";
	        	}
	        }
	    		    	
	    	// 如果active的页码大于6
	    	if(active>6){
	    		//第2页到第(active-4)页码不显示 
	    		for(var i=2;i<active-5;i++){
	    			pageNum[i].style.display = "none";
	    		}
	    		var newPage2 = util.createNode("span","...","ellipsis");
	    		pageList.insertBefore(newPage2,pageNum[2]);
	    	}
	    }
    }	
})();

// hot课程区滚动
(function hotCourse(){
    var hotCourse = document.querySelector(".hot-course");
    var url = "http://study.163.com/webDev/hotcouresByCategory.htm"
    var count = 0;
    // 获取课程
    getHotCourse();

    function getHotCourse(){
        util.get(url,"",function(data){
            setHotCourse(data);  
        });
        setInterval(displayHotCourse,5000);
    }

    // 设置显示10门课，并按照一定时间滚动
    function displayHotCourse(){
        var length = 20; 
        for(var j=0;j<length;j++){
            hotCourse.children[j].style.display = "none";
        }
        for(var i=count;i<count+10;i++){
            hotCourse.children[i].style.display = "block";
        }
        if(count<10){
            count++;
        }else{
            count = 0;
        }   
    }

    function setHotCourse(data){
        var length = data.length;
        hotCourse.innerHTML = "";
        for(var i=0;i<length;i++){
            (function(_i){
                var courseLi = document.createElement("li");
                courseLi.className = "clear-fix";
                courseLi.innerHTML =  ['<img src=',data[_i].smallPhotoUrl,
                                      ' alt=',data[_i].name,
                                      ' class="fl a-img"><p class="a-tit-1 m-pro-con-tit">',
                                        data[_i].description,
                                        '</p><p class="a-num m-pro-num m-pro-con">',
                                        data[_i].learnerCount,'</p>'].join("");

                hotCourse.appendChild(courseLi);
            })(i)
        }
    } 
})();


// 视频区
(function clickVideo(){
    var mask = document.querySelector("#mask");
    var videoPart = document.querySelector(".a-video");
    var videoImgS = document.querySelector(".video");    
    var popVideo = document.querySelector(".pop-v");
    var video = popVideo.querySelector(".pop-video-img");
    var playBnt = popVideo.querySelector(".play-bnt");
    var control = popVideo.querySelector(".video-control");
    var playBntS = control.querySelector(".play-s");
    var icon = playBntS.querySelector("i");
    var close = popVideo.querySelector(".pop-v-close");
    var crtTime = popVideo.querySelector(".crt-time");
    var duration = popVideo.querySelector(".duration");
    var fullscreen = popVideo.querySelector(".fullscreen");
    var srcUrl = "http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4";
    var playProgress = popVideo.querySelector(".play-progress");
    var progressBox = popVideo.querySelector(".progress-box");
    var progressBuffer = popVideo.querySelector(".progress-buffer");
    var progress = popVideo.querySelector("#progress");



    // 弹窗高度设置
    var wHeight = document.documentElement.clientHeight;
    var wWidth = document.documentElement.clientWidth;
    popVideo.style.height = wHeight + "px";
    popVideo.style.width = wWidth - 540 + "px";
    
    // 弹窗视频宽度设置
    var videoWidth = wWidth - 600;
    video.style.width = videoWidth + "px";
     

    // 页面视频图片的点击事件
    videoImgS.onclick = function(){
        mask.style.display = "block";
        popVideo.style.display = "block";
        video.setAttribute('src', srcUrl);
    }
    
    video.removeAttribute('controls');

    // close按钮点击事件
    close.onclick = function(ev){
        var oEvent = ev || event;
        oEvent.stopPropagation();      
        oEvent.cancelBubble = true;
        playVideo(video);
        mask.style.display = "none";
        popVideo.style.display = "none";

    }

    // 弹窗视频图片和按钮的点击事件
    playBnt.onclick= video.onclick = playBntS.onclick= function(ev){
        var oEvent = ev || event;
        oEvent.stopPropagation();
        oEvent.cancelBubble = true;
        playVideo(video);
    }
   
    // 视屏播放时，时间和进度条设置
    video.oncanplay = function() {
        duration.innerHTML =  util.getTime(video.duration);

        setInterval(function() {
           crtTime.innerHTML = util.getTime(video.currentTime);
           progressBuffer.style.width = video.buffered.end(0)/video.duration*890 + 'px';
           progressBox.style.width = video.currentTime/video.duration*890 + 'px';
           playProgress.style.left = video.currentTime/video.duration*890 -4 + 'px';
        }, 100);
     };

    progress.onclick = function(event) {
        var e = event || window.event;
        var lengthTime = (e.clientX - getElementLeft(bar))/890*video.duration;
        video.currentTime = lengthTime;
    }


    function playVideo(video){
         if(video.paused || video.ended) {
             if( video.ended) { video.currentTime = 0; }
             video.play();
             playBnt.style.display = "none";
             icon.className = "playing";
         }
         else { 
            video.pause(); 
            playBnt.style.display = "block";
            icon.className = "paused";
        }       
    }
})();





 
