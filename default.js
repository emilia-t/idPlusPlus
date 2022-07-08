var general_script={
//General_script version:1.1
//常用变量：
  ServerNetworkAddress:location.origin,
//函数运行日志
  GS_log:{
    'alert_tips':{'work_num':0,'error_num':0,'error_log':null,default_config:{positionX:0,positionY:62,height:32,border:5,zh_font_width:16,en_font_width:9,font_size:16,life_time:5000}},
    'addNewStyle':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
    'copy_p':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
    'setMenuRAnimation':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
  },
//常用函数：
//消息弹窗，无需任何CSS,HTML
//参数详解：text->要发送的文本信息，字符串；样式配置，对象数据类型，参数详解：{positionX:(int),positionY:(int),height:(int),border:(int),zh_font_width:(int),en_font_width:(int),font-size:(int)}
  alert_tips(text,conf,life_time){
    try{
      let tips_box=undefined;
      if(document.querySelector('#tips_box')){
        tips_box=document.querySelector('#tips_box');
      }else {
        let new_div=document.createElement('div');
        new_div.id='tips_box';
        document.body.appendChild(new_div);
        tips_box=document.querySelector('#tips_box');
      }
      let new_div=document.createElement('div');
      let key_leng=text.length;
      new_div.className='tips';
      let ptt=/[0-9a-zA-Z_]/g;
      let en_word_leng=0;
      if(text.match(ptt)!==null){
        en_word_leng=text.match(ptt).length;
      }
      if(conf!==undefined){this.GS_log.alert_tips.work_num=0;console.log('alert conf undefined ');}else {console.log('alert conf is default');}
      let config={positionX:null,positionY:null,height:null,border:null,zh_font_width:16,en_font_width:9,font_size:16,life_time:5000};
      config=conf || this.GS_log.alert_tips.default_config;
      let time=life_time || this.GS_log.alert_tips.default_config.life_time;
      let styles=['#tips_box{width:auto;height:auto;position:fixed;top:'+config.positionY+'px;left:'+config.positionX+';border-bottom-right-radius:'+config.border+'px;border-top-right-radius:'+config.border+'px;z-index:999}','.tips{width:calc(var(--words_number) * '+config.zh_font_width+'px + var(--en_words_number) * '+config.en_font_width+'px);height:'+config.height+'px;background:rgba(255,255,255,0.9);float:none;border-top-right-radius:'+config.border+'px;border-bottom-right-radius:'+config.border+'px;padding:0 16px 0 8px;font-size:'+this.GS_log.alert_tips.default_config.font_size +'px;line-height:'+config.height+'px;box-shadow:2px 2px 10px rgba(35,35,35,0.32);text-shadow:2px 2px 10px rgba(75,75,75,0.29);margin:10px 0}'];
      this.addNewStyle(styles,'alert_tips');
      new_div.setAttribute('style','--words_number:'+(key_leng - en_word_leng) +';--en_words_number:'+en_word_leng);
      new_div.innerText=text;
      tips_box.appendChild(new_div);
      setTimeout(()=>tips_box.removeChild(new_div),time);
      this.GS_log.alert_tips.work_num++;
    }catch (e){
      this.GS_log.alert_tips.error_num++;
      this.GS_log.alert_tips.error_log=e;
    }
  },
//CSS样式添加器
//参数详解：style_array->要添加的样式，数组，必要；caller->调用CSS样式添加器的函数，必要
  addNewStyle(style_array,caller) {
    try{
      if(this.GS_log[caller].work_num>0){return false}
      let styleElement=document.getElementById('styles_js');
      if (!styleElement) {
        styleElement=document.createElement('style');
        styleElement.type='text/css';
        styleElement.id='styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
      }
      for(let i=0;i<style_array.length;i++){
        styleElement.appendChild(document.createTextNode(style_array[i]));
      }
      this.GS_log.addNewStyle.work_num++;
    }catch (e) {
      this.GS_log.addNewStyle.error_num++;
      this.GS_log.addNewStyle.error_log=e;
    }
  },
  /*拷贝信息*/
//参数详解：el->需要拷贝的dom元素节点
  copy_p(el) {
    try{
      let command=undefined;
      if(document.querySelector('#command')){
        command=document.querySelector('#command');
        if(command.tagName!=='INPUT'){
          let log='拷贝失败，ID[command]被其他元素占用';
          this.alert_tips(log);
          this.GS_log.copy_p.error_num++;
          this.GS_log.copy_p.error_log=log;
          return false;
        }
      }else {
        let new_element=document.createElement('input');
        new_element.id='command';
        document.body.appendChild(new_element);
        command=document.querySelector('#command');
      }
      command.type='text';
      command.style='opacity:0;width:1px;height:1px;outline:none;border:none;margin:0;padding:0;position:fixed;top:0;left:0;';
      command.value=el.innerText;
      command.select();
      document.execCommand('copy');
      this.alert_tips('复制成功');
      this.GS_log.copy_p.work_num++
    }catch (e) {
      this.GS_log.copy_p.error_num++;
      this.GS_log.copy_p.error_log=e;
    }
  },
}
var IdPlusPlusConfig={
  historyPersistenceWatch:null,
  historyWatch:null,
  historyLocalhost:[]
}
const IdPlusPlus=Object.freeze({
  startSetting:()=>{
    chrome.storage.sync.get('history',function (result){

    })
    chrome.storage.sync.get(['option0','option1','option2','option3'],function (result){
      if(result.option0==true){
        IdPlusPlus.option0On();
      }else {
        IdPlusPlus.option0Off();
      }
      if(result.option1==true){
        IdPlusPlus.option1On();
      }else {
        IdPlusPlus.option1Off();
      }
      if(result.option2==true){
        IdPlusPlus.option2On();
      }else {
        IdPlusPlus.option2Off();
      }
      if(result.option3==true){
        IdPlusPlus.option3On();
      }else {
        IdPlusPlus.option3Off();
      }
    })
  },
  instruction:(request)=>{
    Object.keys(request).forEach(function (key){
      switch (key){
        case "option0":{
          if(request.option0.newValue===true){
            IdPlusPlus.option0On();
          }else {
            IdPlusPlus.option0Off();
          }
          break;
        }
        case "option1":{
          if(request.option1.newValue===true){
            IdPlusPlus.option1On();
          }else {
            IdPlusPlus.option1Off();
          }
          break;
        }
        case "option2":{
          if(request.option2.newValue===true){
            IdPlusPlus.option2On();
          }else {
            IdPlusPlus.option2Off();
          }
          break;
        }
        case "option3":{
          if(request.option3.newValue===true){
            IdPlusPlus.option3On();
          }else {
            IdPlusPlus.option3Off();
          }
          break;
        }
        default:{
          break;
        }
      }
    })
  },
  option0On:()=>{
    console.log("op0-on")
  },
  option0Off:()=>{
    console.log("op0-off")
  },
  option1On:()=>{
    console.log("op1-on")
  },
  option1Off:()=>{
    console.log("op1-off")
  },
  option2On:()=>{
    let box=document.querySelector('.IdPlusPlusHistoryBox');
    if(box===undefined || box===null){
      let newDiv=document.createElement("DIV");
      newDiv.className="IdPlusPlusHistoryBox";
      document.body.appendChild(newDiv);
    }
    box=document.querySelector('.IdPlusPlusHistoryBox');
    //history-heading
    box.style.display='flex';
    IdPlusPlus.watchHistory();
  },
  option2Off:()=>{
    try {
      let Element=document.querySelector(".IdPlusPlusHistoryBox");
      //history-heading
      Element.style.display="none";
    }catch (e){
      console.log(e)
    }
  },
  option3On:()=>{
    console.log("op3-on");
    try {
      let box=document.querySelector('.IdPlusPlusPersistenceId');
      if (box===undefined || box===null){
        let newBox=document.createElement('DIV');
        newBox.className='IdPlusPlusPersistenceId';
        newBox.addEventListener('click',function (e){
          let ele=e.target;
          general_script.copy_p(ele,'text');
        })
        document.body.appendChild(newBox);
      }
      box=document.querySelector('.IdPlusPlusPersistenceId');
      box.addEventListener('click',function (e){
        let ele=e.target;
        general_script.copy_p(ele,'text')
      })
      box.style.display='flex';
      if(IdPlusPlusConfig.historyPersistenceWatch==null){
        IdPlusPlusConfig.historyPersistenceWatch=setInterval(function (){
          IdPlusPlus.upDateHistory();
        },10)
      }
    }catch (e){
      console.log(e)
    }
  },
  option3Off:()=>{
    console.log("op3-off");
    try {
      let box=document.querySelector('.IdPlusPlusPersistenceId');
      if (box===undefined || box===null){
        return false;
      }
      box.style.display='none';
      if(IdPlusPlusConfig.historyPersistenceWatch==null){
        return false;
      }
      clearInterval(IdPlusPlusConfig.historyPersistenceWatch);
      IdPlusPlusConfig.historyPersistenceWatch=null;
    }catch (e){
      console.log(e)
    }
  },
  upDateHistory:()=>{
    let box=document.querySelector('.IdPlusPlusPersistenceId');
    if(box!==undefined){
      if(IdPlusPlusConfig.historyLocalhost.length===0){
        box.innerText='等待选择';
        return false;
      }
      box.innerText=IdPlusPlusConfig.historyLocalhost[IdPlusPlusConfig.historyLocalhost.length-1];
    }
  },
  addHideLeftPanelButton:()=>{
    let sidebar=document.getElementById("sidebar");
    let sideBarChild=sidebar.children[0].children[0];
    //更改样式
    sideBarChild.children[0].setAttribute("style","padding:2px;")
    sideBarChild.setAttribute("style","display:flex;flex-direction:column;justify-content:center;align-items:center;")
    let newDiv=document.createElement("DIV");
    newDiv.id="IdPlusPlusButton1";
    newDiv.style.width="48px";
    newDiv.style.height="24px";
    newDiv.style.background="#dfdfdf";
    newDiv.innerText="关闭";
    newDiv.style.fontSize="15px";
    newDiv.style.display="flex";
    newDiv.style.justifyContent="center";
    newDiv.style.alignItems="center";
    newDiv.style.borderRadius="6px";
    sideBarChild.appendChild(newDiv);
  },
  watchHistoryOld:()=>{
    if (IdPlusPlusConfig.historyWatch===null){
      try {
        setInterval(function (){
          try {
            let historyHeading=document.querySelector('.history-heading');
            if(historyHeading===undefined){
              return  false;
            }
            let Text=historyHeading.innerText;
            if(Text.search(/已选择/)!==-1){
              return false;
            }
            let lock=true;
            for (let i=0;i<IdPlusPlusConfig.historyLocalhost.length;i++){
              if(IdPlusPlusConfig.historyLocalhost[i]==Text){
                lock=false;
              }
            }
            if(lock===true){
              console.log(IdPlusPlusConfig.historyLocalhost);
              IdPlusPlusConfig.historyLocalhost.push(Text);
              let box=document.querySelector('.IdPlusPlusHistoryBox');
              box.innerText=IdPlusPlusConfig.historyLocalhost.toString();
            }
          }catch (e){

          }

          },10)
      }catch (e) {
        console.log(e)
      }
    }
  },
  watchHistory:()=>{
    if (IdPlusPlusConfig.historyWatch===null){
      let config={characterData:true,childList:true,subtree:true};
      let info_panels=document.querySelector('.info-panels');
      if(info_panels===undefined){
        return  false;
      }
      let newObServer=new MutationObserver((mutations) => {
        try {
          let lock=true;
          let Text=mutations[0].target.firstElementChild.innerText
          if(Text.search(/已选择/)!==-1){
            return false;
          }
          if(Text.search(/编辑者/)!==-1){
            return false;
          }
          for (let i=0;i<IdPlusPlusConfig.historyLocalhost.length;i++){
            if(IdPlusPlusConfig.historyLocalhost[i]==Text){
              lock=false;
            }
          }
          if(lock===true){
            console.log(IdPlusPlusConfig.historyLocalhost);
            IdPlusPlusConfig.historyLocalhost.push(Text);
            let box=document.querySelector('.IdPlusPlusHistoryBox');
            //add to box innertext
            box.innerText=IdPlusPlusConfig.historyLocalhost.toString();
            //scrolltop
            box.scrollTop=99999;
            console.log(box.scrolltop)
          }
        }catch (e) {

        }
      })
      newObServer.observe(info_panels,config)
      console.log("111");
      console.log(info_panels);
    }
  }
})
setTimeout(
  function (){
    IdPlusPlus.addHideLeftPanelButton();
    IdPlusPlus.startSetting();
  },
100)
chrome.storage.onChanged.addListener(function (changes,storage){IdPlusPlus.instruction(changes)})
