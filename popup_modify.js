function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}
console.log('You2POP:Run Script');
addStyleString('#header-bar { display:none;padding-top:0!important}');
addStyleString('ytm-app { padding-top:0!important;padding-bottom:0!important}');
addStyleString('ytm-pivot-bar-renderer { display:none}');
addStyleString('body, #app { height:580px!important;width:400px;}');

function modifyLinks(){
    let aTags = document.getElementsByTagName('a')
    for (let i=aTags.length-1; i>=0; --i) {
        aTags[i].setAttribute('target','_blank');
    }
}

setInterval(modifyLinks,1000);