//模拟按钮状态
var stageTemp=null;
//通用脚本
var general_script={
//General_script version:1.1
//常用变量：
  ServerNetworkAddress:location.origin,
//缓存：
  GS_data:{
    openHotKey:true,//是否启用快捷键
    hotKey:{twoKey:[],//双键[int,int,]
      threeKey:[]},//三键,暂未启用[int,int,int]
    hotKeyDown:[],//按下的键位cache
    hotKeyUp:[]//松开的键位cache
  },
//函数运行日志
  GS_log:{
    'alert_tips':{'work_num':0,'error_num':0,'error_log':null,default_config:{positionX:0,positionY:62,height:32,border:5,zh_font_width:24,en_font_width:9,font_size:16,life_time:50000}},
    'addNewStyle':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
    'copy_p':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
    'setMenuRAnimation':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
    'hotKeyHandler':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
    'keyboardListen':{'work_num':0,'error_num':0,'error_log':null,default_config:null},
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
      let styles=['#tips_box{min-width:60px;width:auto;height:auto;position:fixed;top:'+config.positionY+'px;left:'+config.positionX+';border-bottom-right-radius:'+config.border+'px;border-top-right-radius:'+config.border+'px;z-index:999}','.tips{width:calc(var(--words_number) * '+config.zh_font_width+'px + var(--en_words_number) * '+config.en_font_width+'px);height:'+config.height+'px;background:rgba(255,255,255,0.9);float:none;border-top-right-radius:'+config.border+'px;border-bottom-right-radius:'+config.border+'px;padding:0 16px 0 8px;font-size:'+this.GS_log.alert_tips.default_config.font_size +'px;line-height:'+config.height+'px;box-shadow:2px 2px 10px rgba(35,35,35,0.32);text-shadow:2px 2px 10px rgba(75,75,75,0.29);margin:10px 0}'];
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
//热键绑定器
//参数详解：tag->['ctrl','shift','alt']，value1->[a~z],func->a function,value2是冗余用的
  hotKeyHandler(tag,value1,func,value2){
    try {
      ///添加快捷键配置
      //主键
      let MainKey=undefined;
      switch (tag){
        case 'shift':{MainKey=16;break;}
        case 'ctrl':{MainKey=17;break;}
        case 'alt':{MainKey=18;break;}
        default:{break;}
      }
      //副键1
      let otherKey1=undefined;
      switch (value1){
        case 'a':{otherKey1=65;break;}
        case 'b':{otherKey1=66;break;}
        case 'c':{otherKey1=67;break;}
        case 'd':{otherKey1=68;break;}
        case 'e':{otherKey1=69;break;}
        case 'f':{otherKey1=70;break;}
        case 'g':{otherKey1=71;break;}
        case 'h':{otherKey1=72;break;}
        case 'i':{otherKey1=73;break;}
        case 'j':{otherKey1=74;break;}
        case 'k':{otherKey1=75;break;}
        case 'l':{otherKey1=76;break;}
        case 'm':{otherKey1=77;break;}
        case 'n':{otherKey1=78;break;}
        case 'o':{otherKey1=79;break;}
        case 'p':{otherKey1=80;break;}
        case 'q':{otherKey1=81;break;}
        case 'r':{otherKey1=82;break;}
        case 's':{otherKey1=83;break;}
        case 't':{otherKey1=84;break;}
        case 'u':{otherKey1=85;break;}
        case 'v':{otherKey1=86;break;}
        case 'w':{otherKey1=87;break;}
        case 'x':{otherKey1=88;break;}
        case 'y':{otherKey1=89;break;}
        case 'z':{otherKey1=90;break;}
        default:{break;}
      }
      //添加配置
      general_script.GS_data.hotKey.twoKey.push([MainKey,otherKey1,func]);
      this.GS_log.hotKeyHandler.work_num++;
    }catch (e) {
      this.GS_log.hotKeyHandler.error_num++;
      this.GS_log.hotKeyHandler.error_log=e;
    }
  },
  //快捷键监听
  keyboardListen() {
    try{
    ///按下时候开始计算，直到最后一个按键松开为止清空缓存,这里如果不开启热键功能openHotKey则无法收集按下的键
    document.onkeydown = function (e) {
      if(general_script.GS_data.openHotKey===true){general_script.GS_data.hotKeyDown.push(e.keyCode);}
    };
    ///触发开启监听
    document.onkeyup = function (e) {
      //查看缓存下有几个按键被按下
      let downKeyNum = general_script.GS_data.hotKeyDown.length;
      switch (downKeyNum) {
        case 1: {//一个：不处理
          break;
        }
        case 2: {//两个：
          let clock = general_script.GS_data.hotKeyDown.includes(e.keyCode);
          if (clock) {//松开的是其中的一个，记录当前松开的key，并判断up数组内是否足够两个
            general_script.GS_data.hotKeyUp.push(e.keyCode);
            if (general_script.GS_data.hotKeyUp.length === 2) {//如果足够两个，开始搜索匹配的快捷键配置
              for (let i = 0; i < general_script.GS_data.hotKey.twoKey.length; i++) {
                let clock1 = general_script.GS_data.hotKey.twoKey[i].includes(general_script.GS_data.hotKeyUp[0])
                let clock2 = general_script.GS_data.hotKey.twoKey[i].includes(general_script.GS_data.hotKeyUp[1])
                if (clock1 === true && clock2 === true) {
                  //立刻执行函数
                  //console.log("热键正确触发");
                  (function () {
                    general_script.GS_data.hotKey.twoKey[i][2]()
                  }())
                  //不论是否成功清空缓存
                  general_script.GS_data.hotKeyDown=[];
                  general_script.GS_data.hotKeyUp=[];
                }else {
                  //不论是否成功清空缓存
                  general_script.GS_data.hotKeyDown=[];
                  general_script.GS_data.hotKeyUp=[];
                }
              }
            }
          }
          break;
        }
        case 3: {//三个：暂不处理
          //不论是否成功清空缓存
          general_script.GS_data.hotKeyDown=[];
          general_script.GS_data.hotKeyUp=[];
          break;
        }
        default:{//超出预料外的按键做清除操作
          //不论是否成功清空缓存
          general_script.GS_data.hotKeyDown=[];
          general_script.GS_data.hotKeyUp=[];
        }
      }
    };
      this.GS_log.keyboardListen.work_num++;
    }catch (e) {
      this.GS_log.keyboardListen.error_num++;
      this.GS_log.keyboardListen.error_log=e;
    }
  }
}

//id++插件配置，包含缓存
var IdPlusPlusConfig={
  historyPersistenceWatch:null,
  historyWatch:null,
  historyLocalhost:[],
  historyLocalhostAll:[],
  //自动拷贝功能专用
  last:null,
  //是否启用拖动蒙版内的图像
  openMaskImgDrag:true,
  mask:{
    moved:false,
    elementStartPoint:{x:null,y:null},
    mouseStartPoint:{x:null,y:null},
  }
}
//id++内置功能
const IdPlusPlus=Object.freeze({
  clickCopyId:()=>{
    let temp = document.getElementsByClassName("info-panels");
    //console.log(temp);
    if (temp.length != 0) {
      temp[0].addEventListener("DOMSubtreeModified", () => {
      let tag = document.getElementsByClassName("history-heading");
      if (tag.length != 0) {
          if (tag[0].innerText !== "" && tag[0].innerText !== "已选择0个"&& tag[0].innerText !== "0 selected") {
              if (IdPlusPlusConfig.last != tag[0].innerText) {
                  navigator.clipboard.writeText(tag[0].innerText);
                  IdPlusPlusConfig.last = tag[0].innerText;
              }
          }
      }
    });
  }
  },
  startSetting:()=>{
    chrome.storage.sync.get('history',function (result){

    })
    chrome.storage.sync.get(['option0','option1','option2','option3','option4'],function (result){
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
      if(result.option4==true){
        IdPlusPlus.option4On();
      }else {
        IdPlusPlus.option4Off();
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
        case "option4":{
          if(request.option4.newValue===true){
            IdPlusPlus.option4On();
          }else {
            IdPlusPlus.option4Off();
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

    }
  },
  option4On:()=>{
    console.log("op4-on");
    IdPlusPlus.openMask();
  },
  option4Off:()=>{
    console.log("op4-off");
    IdPlusPlus.closeMask();
  },
  //发送一条开/关指令
  sendCommit:(option)=>{
    //1获取当前缓存option状态
    chrome.storage.sync.get("option"+option,function (result){
      if(Object.keys(result).length===0){
        //初始状态
        stageTemp=false;
      }else {
        Object.keys(result).forEach(function (key){
          //获取历史状态
          if(result[key]!==undefined){
            stageTemp=result[key];
          }else {
            stageTemp=false;
          }
        })
      }
      //取反
      IdPlusPlus.optionReverse(option);
      stageTemp=null;
    })
  },
  //为某一option取反
  optionReverse:(option)=>{
    //2取反
    let newOptionStage=!stageTemp;
    //3设置新的值
    IdPlusPlus.setOptionStage(option,newOptionStage);
  },
  //设置某一个选项的值
  setOptionStage:(option,price)=>{
    switch (option){
      case 0:{
        chrome.storage.sync.set({"option0":price},function (){});
        break;
      }
      case 1:{
        chrome.storage.sync.set({"option1":price},function (){});
        break;
      }
      case 2:{
        chrome.storage.sync.set({"option2":price},function (){});
        break;
      }
      case 3:{
        chrome.storage.sync.set({"option3":price},function (){});
        break;
      }
      case 4:{
        chrome.storage.sync.set({"option4":price},function (){});
        break;
      }
      default:{
        break;
      }
    }
  },
  //关闭所有蒙版
  closeMask:()=>{
    //1.获取蒙版
    let Mask=document.getElementsByClassName('IdPlusPlusMaskBox');
    for (let i=0;i<Mask.length;i++){
      Mask[i].style.display='none';
    }
    //2.获取蒙版控制面板
    let MaskControl=document.getElementsByClassName('IdPlusPlusMaskControl');
    for (let i=0;i<MaskControl.length;i++){
      MaskControl[i].style.display='none';
    }
  },
  //打开蒙版
  openMask:()=>{
    //1.获取蒙版和蒙版控制面板
    let Mask=document.getElementsByClassName('IdPlusPlusMaskBox');
    let MaskControl=document.getElementsByClassName('IdPlusPlusMaskControl');
    //1.1获取不到蒙版则创建一个蒙版
    if(Mask===undefined || Mask.length===0){
      IdPlusPlus.addNewMask();
      Mask=document.getElementsByClassName('IdPlusPlusMaskBox');
      MaskControl=document.getElementsByClassName('IdPlusPlusMaskControl');
    }
    for (let i=0;i<Mask.length;i++){
      Mask[i].style.display='block';
    }
    for (let i=0;i<MaskControl.length;i++){
      MaskControl[i].style.display='flex';
    }
  },
  //添加新的蒙版
  addNewMask:()=>{
    //1.蒙版html
    let MaskHtml=document.createElement('DIV');
    MaskHtml.className='IdPlusPlusMaskBox';
    MaskHtml.setAttribute('contenteditable','true');
    //设置禁止选择

    MaskHtml.innerText='';
    //添加控制器
    let MaskControl=document.createElement('DIV');
    MaskControl.className='IdPlusPlusMaskControl';
    MaskControl.innerHTML='<div style="font-size: 18px;color: #ff7c95;display: flex;justify-content:space-around;flex-direction: column"><div>粘贴您的图片</div><div>试试拖动图像</div><div>别忘了快捷键</div></div>';
    MaskControl.setAttribute('contenteditable','false');
    //监听蒙版内的新增内容
    MaskHtml.addEventListener('DOMSubtreeModified', (e)=>{
      console.log(e);
      //1.1如果内容是text则删除此内容
      if(e.target.nodeName==='#text'){
        e.target.parentElement.removeChild(e.target);
      }else{//为插入的图像内容添加自由转换功能
        //注意此处是为最近加入的1个元素添加
        IdPlusPlus.addImageConversion(e.target.childNodes[e.target.childNodes.length-1]);
      }
    })
    document.body.appendChild(MaskControl);
    document.body.appendChild(MaskHtml);
  },
  //为某一个图像元素添加自由转换功能
  addImageConversion:(ele)=>{
    if(ele.nodeName!=='IMG'){//排除不是IMG的元素
      return false
    }else {
      //0.对此图像添加默认CSS
      ele.className='IdPlusPlusMaskImg';
      //1.对此图像添加鼠标左键按下->鼠标移动->鼠标左键松开的图像移动事件
      //当鼠标在此图像上按下时，记录此时鼠标的初始位置(x,y)
      //当鼠标移动时记录此时的(xy)并根据初始位置计算所需要移动距离
      //采用目标达成法：
      //定义一个初始位置及
      //然后在移动过程中不断靠近鼠标的位置，当达到之后结束移动
      ele.addEventListener('mousedown',(e)=>{
        IdPlusPlusConfig.mask.moved=true;
        IdPlusPlusConfig.mask.mouseStartPoint.x=e.x;
        IdPlusPlusConfig.mask.mouseStartPoint.y=e.y;
        IdPlusPlusConfig.mask.elementStartPoint.x=e.target.offsetLeft;
        IdPlusPlusConfig.mask.elementStartPoint.y=e.target.offsetTop;
      });
      //当鼠标按键松开时清除缓存
      ele.addEventListener('mousemove',(e)=>{
        if(IdPlusPlusConfig.mask.moved===true){
          //获取鼠标当前位置
          let nowMousePoint={x:e.x,y:e.y};
          //计算元素应在的位置
          let eleHasPoint={x:(IdPlusPlusConfig.mask.elementStartPoint.x)+(nowMousePoint.x-IdPlusPlusConfig.mask.mouseStartPoint.x),y:(IdPlusPlusConfig.mask.elementStartPoint.y)+(nowMousePoint.y-IdPlusPlusConfig.mask.mouseStartPoint.y)};
          //设置元素
          e.target.style.left=eleHasPoint.x+'px';
          e.target.style.top=eleHasPoint.y+'px';
        }
      });
      //在鼠标松开时清理缓存,并停止移动
      ele.addEventListener('mouseup',(e)=>{
        IdPlusPlusConfig.mask.moved=false;
        IdPlusPlusConfig.mask.elementStartPoint.x=null;
        IdPlusPlusConfig.mask.elementStartPoint.y=null;
        IdPlusPlusConfig.mask.mouseStartPoint.x=null;
        IdPlusPlusConfig.mask.mouseStartPoint.y=null;
      })
    }
  },
  //获取历史id
  getHistory:()=>{
    chrome.storage.sync.get("history",function (result){
      IdPlusPlusConfig.historyLocalhost=result.history;
    })
    chrome.storage.sync.get("historyAll",function (result){
      IdPlusPlusConfig.historyLocalhostAll=result.historyAll;
    })
  },
  updateHistory:()=>{
    //history obj
    //{history:["w22323","n9983"]}
    //{historyAll:["w87333","w93787"]}
    //0.set obj
    let HistorObj={
      history:[],
      historyAll:[]
    }
    HistorObj.history=IdPlusPlusConfig.historyLocalhost;
    HistorObj.historyAll=IdPlusPlusConfig.historyLocalhostAll;
    //1.get local history

    chrome.storage.sync.set({"history":HistorObj.history},function (result){
      general_script.alert_tips("updata done");

    })
    chrome.storage.sync.set({"historyAll":HistorObj.historyAll},function (result){
      general_script.alert_tips("updata done");

    })
  },
  upDateHistory:()=>{
    try{
      let box=document.querySelector('.IdPlusPlusPersistenceId');
      if(box!==undefined){
        //console.log(IdPlusPlusConfig)
        if(IdPlusPlusConfig.historyLocalhost===null || IdPlusPlusConfig.historyLocalhost===undefined || IdPlusPlusConfig.historyLocalhost.length===0){
          box.innerText='等待选择';
          return false;
        }
        box.innerText=IdPlusPlusConfig.historyLocalhostAll[IdPlusPlusConfig.historyLocalhostAll.length-1];
      }
    }catch (e){

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
          if(Text.search(/-/)!==-1){
            return false;
          }
          for (let i=0;i<IdPlusPlusConfig.historyLocalhost.length;i++){
            if(IdPlusPlusConfig.historyLocalhost[i]==Text){
              lock=false;
            }
          }
          if(lock===true){
            IdPlusPlusConfig.historyLocalhost.push(Text);
            let box=document.querySelector('.IdPlusPlusHistoryBox');
            //add to box innertext
            box.innerText=IdPlusPlusConfig.historyLocalhost.toString();
            //scrolltop
            box.scrolltop=0;
          }
          IdPlusPlusConfig.historyLocalhostAll.push(Text);
        }catch (e) {

        }
      })
      newObServer.observe(info_panels,config)
    }
  }
})
//应用层：
//在加载结束后的0.1秒之后开启初始设定
setTimeout(
  function (){
    IdPlusPlus.startSetting();
  },
100)
//加载结束后的0.2秒之后开启自动拷贝功能
setTimeout(
  function(){
    IdPlusPlus.clickCopyId();
  },
200
)
//实时监听popup传递指令
chrome.storage.onChanged.addListener(function (changes,storage){IdPlusPlus.instruction(changes)})
//快捷键绑定
general_script.hotKeyHandler('ctrl','q',function () {
  IdPlusPlus.sendCommit(4)
});
//开启热键功能
general_script.keyboardListen();

