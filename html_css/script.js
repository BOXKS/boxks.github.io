var URL = window.location.href; //获取主域名
// var PATH = window.location.pathname;    //获取文件夹
var PID = window.location.search;   //获取问号之后的部分
var href = URL.substr(0,URL.lastIndexOf("/"));  //截取项目的目录
var LID = PID.substr(1);    //截取问号
var edition = "0_0_1";  //设置版本号（对应文件夹）
// var list = $.getJSON("list.json");

jQuery(document).ready(function($) {    
    //当页面框架载入完成后运行打括号内的代码

    // 输出菜单，对应 json 存放在 list.js 中，页面已经引用！
    if (list[0]) {  
        //如果载入的内容并非空白运行下面代码
        for (i = 0; i < list.length; i++) { 
            //设置始起的值是 0，每循环一次加1，当循环次数等于 list 中数组数量相同时候停止循环（因为 i 第一次为0，所以 i 最大值等于数组的数量减去1）
            $('#list>#list-box>ol').append('<li><a id="'+list[i].LoadID+'" data-lid="'+i+'" href="'+href+'?'+list[i].LoadID+'">'+list[i].title+'</a></li>');    //循环输出 li 菜单
        };
    };

    function LoadData(LoadPage) {   
        //载入页面内容的函数
        $.ajax({
            url: edition+"/"+LoadPage+".html",  //设置载入文件路径
            cache: false,
            beforeSend: function(){
                //发送 Ajax 之前运行
                $("#loadingbar").width(0);
                $("#loadingbar").addClass('op1');
                $('#loadingbar').removeClass('warn');
            },
            success: function(page){
                //接受返回数据成功之后运行
                $("#loadingbar").animate({
                    width: '100%'
                }, "2000");
                setTimeout("$('#loadingbar').removeClass('op1')",1300);
                $("#Main>.centerbox").html(page);
            },
            error: function(){
                //载入内容失败时候运行
                $("#loadingbar").width('100%');
                $("#loadingbar").addClass('warn');
                setTimeout("$('#loadingbar').removeClass('op1')",1300);
                $('title').html('Error - 制作一个简单的网页');
                $("#Main>.centerbox").html('<div class="warn center"><div class="e-mark"></div><br />網絡連接失敗,無法載入內容！</div>');
            }
        });
        LID = LoadPage;   //更新固定值
        $("html,body").animate({scrollTop: $("#Main").offset().top}, 500);  //跳转到内容顶部

        $('#list-box>ol>li>a').removeClass('current-cat');  // 清除目录的状态
        $('#'+LID).addClass('current-cat'); //给当前目录中的当前条目添加状态

        for (i = 0; i < list.length; i++) {
            if (list[i].LoadID===LoadPage) {
                $('title').html(list[i].title+' - 制作一个简单的网页'); // 遍历 json 设置对应标题
                break;  //终止循环
            };
        };
    }
    function HomePage () {
        $("#Main>.centerbox").load(edition+"/foreword.html");
        LID = "foreword";   //设置默认页面状态
        $('#list-box>ol>li>a').removeClass('current-cat');
        $('#'+LID).addClass('current-cat');
    }

    // 判断 url 载入内容
    if (PID) {
    	LoadData(LID);
    } else{
        HomePage ();
    };

    // 菜单操作
    $('#list').on("click", "#list-button", function() { 
        // #list 中的 #list-button 点击
        $("#list").toggleClass('right0');   //点击收缩菜单
    });
    $('#list-box>ol').on("click", "a", function(){  
        //使用 on 是可以让 jQuery 后来载入的内容也可以支持点击动作
    	var href = $(this).attr("href");   //获取a标签 URL
    	var PageID = href.substring(href.lastIndexOf("?"));    // 获取 URL 问号之后的字符
    	var LoadID = PageID.substr(1); //截取前面的问号
        var listID = $(this).data('lid');
    	title = list[listID].title;  //获取上面 json 对应的标题
    	if (PageID) {  
            //如果 PageID 存在运行下面的内容
            if (LoadID!=LID) {  
                //判断点击连接是否当前页面，不是的话就载入内容
        		LoadData(LoadID); //载入页面内容
        		window.history.pushState(null, title, "?"+LoadID);	//修改 url
            };
            return false; //阻止a标签跳转
    	};
	}); 

	// 浏览器前进后退按钮
	window.addEventListener('popstate', function(e){   
        //当点击浏览器前进后退按钮时候
		if (history.pushState){
            var PID = window.location.search; //重新获取对应的值
            LID = PID.substr(1);    //设置当前页面的值
            if (PID) {
                LoadData(LID);
            } else{
                HomePage ();
            };
		}
	}, false);				
});