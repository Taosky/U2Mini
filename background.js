//检查订阅更新
function checkNew(update=false) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=&type_list=8`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // 未登录
            if (xhr.responseText.indexOf(`"data":{}`)!==-1){
                chrome.browserAction.setBadgeText({text:'X'});
                return
            }
            //更新数
            let update_num = 0;
            let newInfo = JSON.parse(xhr.responseText);
            localStorage['latest_dynamic_id']=newInfo.data.cards[0].desc.dynamic_id;
            if (!localStorage['dynamic_id'] || update===true){
                localStorage['dynamic_id']=newInfo.data.cards[0].desc.dynamic_id;
            }
            else {
                newInfo.data.cards.forEach(function (card) {
                    if (card.desc.dynamic_id >localStorage['dynamic_id']){
                        update_num+=1
                    }
                })
            }
            //角标
            if (update_num >= 10) {
                chrome.browserAction.setBadgeText({text: "10+"});
            } else if (update_num < 10 && update_num > 0)
                chrome.browserAction.setBadgeText({text: String(update_num)});
            else{
                chrome.browserAction.setBadgeText({text:''});
            }
        }
    };
    xhr.send();
}


function start() {
    // 监听订阅页面以便修改UA
    chrome.webRequest.onBeforeSendHeaders.addListener(function(e){
        for (let header of e.requestHeaders) {
            if (header.name.toLowerCase() === "user-agent") {
              header.value = "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/12.0 Mobile/15A372 Safari/604.1";
            }
          }
          return {requestHeaders: e.requestHeaders};
    }, {urls: ["https://m.youtube.com/feed/subscriptions"]},
    ["blocking", "requestHeaders"]);

    chrome.webRequest.onHeadersReceived.addListener((e) => {
        let headers = e.responseHeaders;
        for (let i=headers.length-1; i>=0; --i) {
            let header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ "*://www.youtube.com/*","*://m.youtube.com/*" ],
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
    );


    //监听popup打开
    // chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    //     if(message.popupOpen) {
    //         checkNew(true);
    //     }
    // });
    //定时检查订阅
    //setInterval(checkNew, 60000);
}


//开始运行
start();

