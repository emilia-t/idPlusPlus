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
                  //general_script.GS_data.hotKeyDown=[];
                  //general_script.GS_data.hotKeyUp=[];
                }else {
                  //不论是否成功清空缓存
                  //general_script.GS_data.hotKeyDown=[];
                  //general_script.GS_data.hotKeyUp=[];
                }
              }
              //不论是否成功清空缓存
              general_script.GS_data.hotKeyDown=[];
              general_script.GS_data.hotKeyUp=[];
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
  },
  //是否启用指针投影功能
  openPointerProjection:false,
  Projection:{
    moved:false,
    color:'#ff0000',
    flash:500,//自动绘制指针的间隔单位毫秒
    pointer:[],//单点的指针，使用鼠标单机创建
    pointRap:[]//自动的连续的点
  },
  syncSketchpad:{
    chromeSize:{x:null,y:null},//浏览器视窗大小
    clientPos:{x:null,y:null},//接收端用的起点xy
    pos:{x:null,y:null},//本端用的xy
    color:'#ff0000',//画笔颜色
    moved:false,//本端是否在绘制
    palette:['#ff0000','#ffd05b','#c6ff5b','#5bffaa','#5bcbff','#5b6bff','#fa5bff','#ff5b89'],//默认的几种颜色
    snapshot:[]//存储快照的
  }
}
//id++内置功能
const IdPlusPlus=Object.freeze({
  //拷贝id
  clickCopyId:()=>{
    let temp = document.getElementsByClassName("info-panels");
    //console.log(temp);
    if (temp.length != 0) {
      temp[0].addEventListener("DOMSubtreeModified", () => {
      let tag = document.getElementsByClassName("history-heading");
      if (tag.length != 0) {
          if (tag[0].innerText !== "" && tag[0].innerText !== "已选择 0 个"&& tag[0].innerText !== "0 selected") {
              if (IdPlusPlusConfig.last != tag[0].innerText) {
                  navigator.clipboard.writeText(tag[0].innerText);
                  IdPlusPlusConfig.last = tag[0].innerText;
              }
          }
      }
    });
  }
  },
  //初始化设置
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
        IdPlusPlus.option5On();
      }else {
        IdPlusPlus.option5Off();
      }
    })
  },
  //命令接收器
  instruction:(request)=>{
    Object.keys(request).forEach(function (key){
      //syncSketchpadStart syncSketchpadMoved syncSketchpadEnd  setSyncSketchpadColor syncSketchpadUndo syncSketchpadClear syncSketchpadControlHide syncSketchpadPeek syncSketchpadPeekDone
      switch (key){
        case "syncSketchpadPeekDone":{
          IdPlusPlus.syncSketchpadPeekDone();
          break;
        }
        case "syncSketchpadPeekUp":{
          IdPlusPlus.syncSketchpadPeekUp();
          break;
        }
        case "syncSketchpadControlHide":{//隐藏控制面板
          IdPlusPlus.syncSketchpadControlHide();
          break;
        }
        case "syncSketchpadClear":{//清空画板
          IdPlusPlus.syncSketchpadClear();
          break;
        }
        case "syncSketchpadUndo":{//撤回画板
          IdPlusPlus.syncSketchpadUndo();
          break;
        }
        case "setSyncSketchpadColor":{//设置画板颜色
          let col=request.setSyncSketchpadColor.newValue;
          IdPlusPlus.clientSetSyncSketchpadColor(col);
          break;
        }
        case "syncSketchpadStart":{//开始同步画板,发送此指令需要同时发送鼠标位置{x:?,y:?}
          let position=request.syncSketchpadStart.newValue;
          IdPlusPlus.clientSyncSketchpadStart(position);
          break;
        }
        case "syncSketchpadMoved":{//同步画板中,发送此指令需要同时发送鼠标位置{x:?,y:?}
          let position=request.syncSketchpadMoved.newValue;
          IdPlusPlus.clientSyncSketchpadMoved(position);
          break;
        }
        case "syncSketchpadEnd":{//结束同步画板
          IdPlusPlus.clientSyncSketchpadEnd();
          break;
        }
        case "setPointerColor":{//同步点的颜色
          let col=request.setPointerColor.newValue;
          IdPlusPlus.setNextPointerColor(col);//设置点颜色属性
          break;
        }
        case "hideProjectionControl":{//隐藏幕布控制面板
          IdPlusPlus.hideProjectionControl();
          break;
        }
        case "delProjectionPoints":{//删除所有的点
          IdPlusPlus.delProjectionPoints();
          break;
        }
        case "removePointer":{//删除最新的一个点
          IdPlusPlus.removePointer();
          break;
        }
        case "point":{
          let Pointer=request.point.newValue;//一个xy对象
          //创建点
          IdPlusPlus.addNewPointer(Pointer);
          break;
        }
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
        case "option5":{
          if(request.option5.newValue===true){
            IdPlusPlus.option5On();
          }else {
            IdPlusPlus.option5Off();
          }
          break;
        }
        default:{
          break;
        }
      }
    })
  },
  //开关
  option0On:()=>{
    //console.log("op0-on")
  },
  //开关
  option0Off:()=>{
    //console.log("op0-off")
  },
  //开关
  option1On:()=>{
    //console.log("op1-on")
  },
  //开关
  option1Off:()=>{
    //console.log("op1-off")
  },
  //开关
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
  //开关
  option2Off:()=>{
    try {
      let Element=document.querySelector(".IdPlusPlusHistoryBox");
      //history-heading
      Element.style.display="none";
    }catch (e){
    }
  },
  //开关
  option3On:()=>{
    //console.log("op3-on");
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
  //开关
  option3Off:()=>{
    //console.log("op3-off");
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
  //开关
  option4On:()=>{
    //console.log("op4-on");
    IdPlusPlus.openMask();
  },
  //开关
  option4Off:()=>{
    //console.log("op4-off");
    IdPlusPlus.closeMask();
  },
  //开关
  option5On:()=>{
    IdPlusPlus.displaySyncSketchpad();
  },
  //开关
  option5Off:()=>{
    IdPlusPlus.hideSyncSketchpad();
  },
  //发送一条带有数据的指令
  sendDataInstruct:(name,price)=>{
    switch (name){
      case 'setSyncSketchpadColor':{
        chrome.storage.sync.set({'setSyncSketchpadColor':price},function (){})
        break;
      }
      case 'setPointerColor':{
        chrome.storage.sync.set({'setPointerColor':price},function (){})
        break;
      }
      //syncSketchpadStart syncSketchpadMoved syncSketchpadEnd
      case 'syncSketchpadStart':{
        chrome.storage.local.set({'syncSketchpadStart':price},function (){})
        break;
      }
      case 'syncSketchpadMoved':{
        chrome.storage.local.set({'syncSketchpadMoved':price},function (){})
        break;
      }
    }
  },
  //发送一条执行指令-立刻执行一个函数
  sendInstruct:(name)=>{
    //发送
    switch (name){
      case 'syncSketchpadPeekDone':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'syncSketchpadPeekDone':ran},function (){})
        break;
      }
      case 'syncSketchpadPeekUp':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'syncSketchpadPeekUp':ran},function (){})
        break;
      }
      case 'syncSketchpadControlHide':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'syncSketchpadControlHide':ran},function (){})
        break;
      }
      case 'syncSketchpadClear':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'syncSketchpadClear':ran},function (){})
        break;
      }
      case 'syncSketchpadUndo':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'syncSketchpadUndo':ran},function (){})
        break;
      }
      case 'syncSketchpadEnd':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'syncSketchpadEnd':ran},function (){})
        break;
      }
      case 'removePointer':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'removePointer':ran},function (){})
        break;
      }
      case 'delProjectionPoints':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'delProjectionPoints':ran},function (){})
        break;
      }
      case 'hideProjectionControl':{
        let ran=Math.floor(Math.random()*100000000);
        chrome.storage.sync.set({'hideProjectionControl':ran},function (){})
        break;
      }
    }

  },
  //发送一条开/关指令-在0和1之间转换
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
  //同步历史记录
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
  //同步历史记录
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
  //添加左侧关闭按钮
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
  //监听历史面板
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
  },
  //添加一个新的指针投影背景
  addNewProjection:()=>{
    let Projection=document.createElement('DIV');
    Projection.className='IdPlusPlusProjection';
    document.body.appendChild(Projection);
  },
  //开启或关闭添加映射点
  openProjection:()=>{
    IdPlusPlusConfig.openPointerProjection=!IdPlusPlusConfig.openPointerProjection;
  },
  //显示或隐藏投影幕布
  hideProjectionCurtain:()=>{
    let IdPlusPlusProjection=document.querySelector('.IdPlusPlusProjection');
    let Tp=parseInt(IdPlusPlusProjection.getAttribute('type'));
    console.log(Tp);
    if(isNaN(Tp)){
      IdPlusPlusProjection.setAttribute('type','1');
      IdPlusPlusProjection.style.display='none';
    }else {
      if(Tp%2==0){
        Tp++;
        IdPlusPlusProjection.setAttribute('type',Tp+'');
        IdPlusPlusProjection.style.display='none';
      }else {
        Tp++;
        IdPlusPlusProjection.setAttribute('type',Tp+'');
        IdPlusPlusProjection.style.display='block';
      }
    }
  },
  //设置点颜色
  setNextPointerColor:(color)=>{
    IdPlusPlusConfig.Projection.color=color;
  },
  //为在鼠标click后添加一个点
  listenClickAddPoint:()=>{
    document.body.addEventListener('click',(e)=>{
      if(IdPlusPlusConfig.openPointerProjection){
        let pos={x:e.x,y:e.y};
        //添加点
        IdPlusPlusConfig.Projection.pointer.push(pos);
        //在页面中添加点
        IdPlusPlus.addNewPointer(pos);
        //广播数据
        chrome.storage.sync.set({"point":pos},function (){});
      }
    })
  },
  //删除最近的一个点
  removePointer:()=>{
    let IdPlusPlusProjection=document.querySelector('.IdPlusPlusProjection');
    IdPlusPlusProjection.removeChild(IdPlusPlusProjection.lastChild);
  },
  //在幕布上添加一个点
  addNewPointer:(position)=>{
    //第一次使用时添加控制面板
    let dom=document.querySelector('.IdPlusPlusProjectionControl')
    if(dom==undefined){
      IdPlusPlus.addProjectionControl();
    }else {
      if(dom.classList.contains('IdPlusPlusProjectionControlHide')){
        dom.classList.remove('IdPlusPlusProjectionControlHide');
      }
    }
    //在添加点的时候检测本身是否已经含有同样的点,如果有就不再添加
    //添加一个点
    if(IdPlusPlusConfig.Projection.pointer.includes(position)==false){
      let IdPlusPlusProjection=document.querySelector('.IdPlusPlusProjection');
      let Point=document.createElement('DIV');
      Point.className='IdPlusPlusProjectionPoint';
      Point.style.background=IdPlusPlusConfig.Projection.color;
      Point.style.left=(position.x-2)+'px';
      Point.style.top=(position.y-2)+'px';
      IdPlusPlusProjection.appendChild(Point);
    }
  },
  //将幕布上的点全部清空
  delProjectionPoints:()=>{
    let IdPlusPlusProjection=document.querySelector('.IdPlusPlusProjection');
    IdPlusPlusProjection.innerHTML='';
  },
  //隐藏控制面板到顶部
  hideProjectionControl:()=>{
    let IdPlusPlusProjection=document.querySelector('.IdPlusPlusProjectionControl');
    IdPlusPlusProjection.classList.add('IdPlusPlusProjectionControlHide');
  },
  //在幕布上悬浮一个控制面板
  addProjectionControl:()=>{
    //创建总外框
    let newDiv=document.createElement('DIV');
    newDiv.className='IdPlusPlusProjectionControl';
    let color=IdPlusPlus.createProjectionControlColor();
    let btn2=IdPlusPlus.createProjectionControlBtn('撤回',2);
    let btn3=IdPlusPlus.createProjectionControlBtn('清空',3);
    let btn4=IdPlusPlus.createProjectionControlBtn('隐藏我',4);
    newDiv.appendChild(color);
    newDiv.appendChild(btn2);
    newDiv.appendChild(btn3);
    newDiv.appendChild(btn4);
    document.body.appendChild(newDiv);
  },
  //创建一个色块，显示当前配置颜色和可选颜色
  createProjectionControlColor:()=>{
    //设置点击效果函数
    function eventColor(e){
      //1清除所有点击后的效果
      let num=e.target.parentElement.children.length;
      for (let i=0;i<num;i++){
        e.target.parentElement.children[i].classList.remove('IdPlusPlusProjectionControlColorBtnA');
      }
      //2.单独加上效果
      e.target.classList.add('IdPlusPlusProjectionControlColorBtnA');
    }
    //外壳
    let Div=document.createElement('DIV');
    Div.className='IdPlusPlusProjectionControlColor';
    //内在
    let btn1=document.createElement('DIV');
    btn1.className='IdPlusPlusProjectionControlColorBtn';
    btn1.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#ff0000');});
    let btn2=document.createElement('DIV');
    btn2.className='IdPlusPlusProjectionControlColorBtn';
    btn2.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#ffd05b');
    });
    let btn3=document.createElement('DIV');
    btn3.className='IdPlusPlusProjectionControlColorBtn';
    btn3.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#c6ff5b');
    });
    let btn4=document.createElement('DIV');
    btn4.className='IdPlusPlusProjectionControlColorBtn';
    btn4.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#5bffaa');
    });
    let btn5=document.createElement('DIV');
    btn5.className='IdPlusPlusProjectionControlColorBtn';
    btn5.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#5bcbff');
    });
    let btn6=document.createElement('DIV');
    btn6.className='IdPlusPlusProjectionControlColorBtn';
    btn6.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#5b6bff');
    });
    let btn7=document.createElement('DIV');
    btn7.className='IdPlusPlusProjectionControlColorBtn';
    btn7.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#fa5bff');
    });
    let btn8=document.createElement('DIV');
    btn8.className='IdPlusPlusProjectionControlColorBtn';
    btn8.addEventListener('click',function (e){
      eventColor(e);
      IdPlusPlus.sendDataInstruct('setPointerColor','#ff5b89');
    });
    Div.appendChild(btn1);
    Div.appendChild(btn2);
    Div.appendChild(btn3);
    Div.appendChild(btn4);
    Div.appendChild(btn5);
    Div.appendChild(btn6);
    Div.appendChild(btn7);
    Div.appendChild(btn8);
    return Div;
  },
  //创建按钮,需要传递按钮名字及按钮序号，返回按钮元素
  createProjectionControlBtn:(text,num)=>{
    let btn=document.createElement('DIV');
    btn.className='IdPlusPlusProjectionControlBtn';
    btn.innerText=text;
    btn.addEventListener('click',()=>{
      if(btn.classList.contains('IdPlusPlusProjectionAnimation002')){
        btn.classList.add('IdPlusPlusProjectionAnimation001');
        btn.classList.remove('IdPlusPlusProjectionAnimation002');
      }else {
        btn.classList.add('IdPlusPlusProjectionAnimation002');
        btn.classList.remove('IdPlusPlusProjectionAnimation001');
      }
    })
    //添加相应的功能
    switch (num){
      case 1:{//调色板
        break;
      }
      case 2:{//撤回
        btn.addEventListener('click',()=>{IdPlusPlus.sendInstruct('removePointer');});
        break;
      }
      case 3:{//清空
        btn.addEventListener('click',()=>{IdPlusPlus.sendInstruct('delProjectionPoints');});
        break;
      }
      case 4:{//隐藏我
        btn.addEventListener('click',()=>{IdPlusPlus.sendInstruct('hideProjectionControl');});
        break;
      }
    }
    return btn;
  },
  //创建同步画板的操作box
  createSyncSketchpadControl:()=>{
    let newDiv=document.createElement('DIV');
    newDiv.className='IdPlusPlusSyncSketchpadControl';
    //1添加颜色按钮
    for(let i=0;i<IdPlusPlusConfig.syncSketchpad.palette.length;i++){
      let cbt=IdPlusPlus.createSyncSketchpadControlColorBtn(IdPlusPlusConfig.syncSketchpad.palette[i]);
      newDiv.appendChild(cbt);
    }
    //2撤回按钮
    let newBt=document.createElement('DIV');
    newBt.className='IdPlusPlusSyncSketchpadBtn';
    newBt.innerText="撤回"
    newBt.addEventListener('click',function (){
      IdPlusPlus.sendInstruct('syncSketchpadUndo');
    });
    newDiv.appendChild(newBt);
    //3清空按钮
    let newBd=document.createElement('DIV');
    newBd.className='IdPlusPlusSyncSketchpadBtn';
    newBd.innerText="清空"
    newBd.addEventListener('click',function (){
      IdPlusPlus.sendInstruct('syncSketchpadClear');
    });
    newDiv.appendChild(newBd);
    //4隐藏我按钮
    let newBk=document.createElement('DIV');
    newBk.className='IdPlusPlusSyncSketchpadBtn';
    newBk.innerText="克己"
    newBk.addEventListener('click',function (){
      IdPlusPlus.sendInstruct('syncSketchpadControlHide');
    });
    newDiv.appendChild(newBk);
    //5穿透按钮
    let newBq=document.createElement('DIV');
    newBq.className='IdPlusPlusSyncSketchpadBtn';
    newBq.innerText="穿透"
    newBq.addEventListener('click',function (){
      IdPlusPlus.sendInstruct('syncSketchpadPeekUp');
    });
    newDiv.appendChild(newBq);
    //5反穿透按钮
    let newBl=document.createElement('DIV');
    newBl.className='IdPlusPlusSyncSketchpadBtn';
    newBl.innerText="覆盖"
    newBl.addEventListener('click',function (){
      IdPlusPlus.sendInstruct('syncSketchpadPeekDone');
    });
    newDiv.appendChild(newBl);
    //
    newDiv.addEventListener('click',function (){
      //检查控制面板是否打开了
      try{
        let padControl=document.querySelector('.IdPlusPlusSyncSketchpadControl');
        padControl.style.display='flex';
        padControl.style.left='calc(100% - 78px)';
      }catch (e) {

      }
    })
    //5完成
    document.body.appendChild(newDiv);
  },
  createSyncSketchpadControlColorBtn:(color)=>{
    let newDiv=document.createElement('DIV');
    newDiv.className="IdPlusPlusSyncSketchpadControlColorBtn";
    newDiv.style.background=color;
    //设置事件
    newDiv.addEventListener('click',()=>{IdPlusPlus.setSyncSketchpadColor(color);});
    return newDiv;
  },
  //画板撤回操作
  syncSketchpadUndo:()=>{
    if(IdPlusPlusConfig.syncSketchpad.snapshot.length<=0){
      general_script.alert_tips("无可再退，尝试清空吧");
      return false;
    }
    let ctx=document.querySelector('.IdPlusPlusSyncSketchpad').firstChild;
    let ctxData=ctx.getContext("2d");
    ctxData.clearRect(0,0,ctx.width,ctx.height);
    ctxData.putImageData(IdPlusPlusConfig.syncSketchpad.snapshot.pop(),0,0)
  },
  //穿透，peek后面的id
  syncSketchpadPeekUp:()=>{
    try{
      let pad=document.querySelector('.IdPlusPlusSyncSketchpad');
      pad.setAttribute('style','pointer-events:none');
      pad.firstChild.setAttribute('style','pointer-events:none');
    }catch (e){

    }
  },
  //不穿透
  syncSketchpadPeekDone:()=>{
    try {
      let pad=document.querySelector('.IdPlusPlusSyncSketchpad');
      pad.setAttribute('style','pointer-events:auto');
      pad.firstChild.setAttribute('style','pointer-events:auto');
    }catch (e) {

    }
  },
  //隐藏控制面板操作
  syncSketchpadControlHide:()=>{
    let control=document.querySelector('.IdPlusPlusSyncSketchpadControl');
    control.style.left='99.5%';
  },
  //画板清空操作
  syncSketchpadClear:()=>{
    let ctx=document.querySelector('.IdPlusPlusSyncSketchpad').firstChild;
    ctx.width=ctx.width;
  },
  //设置画笔颜色
  setSyncSketchpadColor:(color)=>{
    IdPlusPlusConfig.syncSketchpad.color=color;
    //同步设置
    IdPlusPlus.sendDataInstruct('setSyncSketchpadColor',color);
  },
  clientSetSyncSketchpadColor:(color)=>{
    IdPlusPlusConfig.syncSketchpad.color=color;
  },
  //获取用户当前视窗大小
  getChromeSize:()=>{
    IdPlusPlusConfig.syncSketchpad.chromeSize.x=window.innerWidth;
    IdPlusPlusConfig.syncSketchpad.chromeSize.y=window.innerHeight;
  },
  //客户端同步生成画板内数据,在客户端接收到开始绘制的指令后进行此项操作,这里判断是否是发送端可以通过moved属性判断，moved为true说明鼠标操作的是当前页面
  clientSyncSketchpadStart:(position)=>{
    if(IdPlusPlusConfig.syncSketchpad.moved===false){
      //保存之前的快照
      let ctx=document.querySelector('.IdPlusPlusSyncSketchpad').firstChild;
      let ctxData=ctx.getContext("2d");
      //保存快照
      IdPlusPlusConfig.syncSketchpad.snapshot.push(ctxData.getImageData(0,0,parseInt(ctx.width),parseInt(ctx.height)));
      //检查控制面板是否打开了
      let padControl=document.querySelector('.IdPlusPlusSyncSketchpadControl');
      if(padControl==null || padControl==undefined){
        IdPlusPlus.createSyncSketchpadControl();
        padControl=document.querySelector('.IdPlusPlusSyncSketchpadControl');
      }
      padControl.style.display='flex';
      padControl.style.left='calc(100% - 78px)';
      //1获取pos
      let pos={x:position.x,y:position.y};
      //2储存pos到client
      IdPlusPlusConfig.syncSketchpad.clientPos.x=pos.x;
      IdPlusPlusConfig.syncSketchpad.clientPos.y=pos.y;
      //清空并载入最近的快照
      if(IdPlusPlusConfig.syncSketchpad.snapshot.length>=1){
        ctx.width=ctx.width;
        ctxData.putImageData(IdPlusPlusConfig.syncSketchpad.snapshot[IdPlusPlusConfig.syncSketchpad.snapshot.length-1],0,0)
      }
    }
  },
  clientSyncSketchpadMoved:(position)=>{
    if(IdPlusPlusConfig.syncSketchpad.clientPos.x===null){return;}
      if(IdPlusPlusConfig.syncSketchpad.moved===false){
        //1获取canvas
        let pos={x:position.x,y:position.y};
        let ctx=document.querySelector('.IdPlusPlusSyncSketchpad').firstChild;
        let ctxData=ctx.getContext("2d");
        //路径颜色
        ctxData.strokeStyle = IdPlusPlusConfig.syncSketchpad.color;
        //路径线宽
        ctxData.lineWidth = 1;
        //长度
        ctxData.setLineDash([1]);
        //定义开始坐标
        ctxData.moveTo(IdPlusPlusConfig.syncSketchpad.clientPos.x,IdPlusPlusConfig.syncSketchpad.clientPos.y);
        //定义开始坐标
        ctxData.lineTo(IdPlusPlusConfig.syncSketchpad.clientPos.x,IdPlusPlusConfig.syncSketchpad.clientPos.y);
        //定义结束坐标
        ctxData.lineTo(pos.x,pos.y)
        //连接
        ctxData.closePath();
        //替换开始坐标
        IdPlusPlusConfig.syncSketchpad.clientPos.x=pos.x;
        IdPlusPlusConfig.syncSketchpad.clientPos.y=pos.y;
        //绘制线条(必填)
        ctxData.stroke();
      }
  },
  clientSyncSketchpadEnd:()=>{
    if(IdPlusPlusConfig.syncSketchpad.moved===false){
      //清除数据
      IdPlusPlusConfig.syncSketchpad.clientPos.x=null;
      IdPlusPlusConfig.syncSketchpad.clientPos.y=null;
    }
  },
  //生成画板-画板自带监听
  createSketchpad:()=>{
    if(IdPlusPlusConfig.syncSketchpad.chromeSize.x==null || IdPlusPlusConfig.syncSketchpad.chromeSize.y==null){
      IdPlusPlus.getChromeSize();
    }
    let canvas=document.createElement('CANVAS');
    canvas.setAttribute('width',IdPlusPlusConfig.syncSketchpad.chromeSize.x);
    canvas.setAttribute('height',IdPlusPlusConfig.syncSketchpad.chromeSize.y);
    ////syncSketchpadStart syncSketchpadMoved syncSketchpadEnd
    //添加鼠标监听
    canvas.addEventListener('mousedown',function (e){
      //1启用绘制
      IdPlusPlusConfig.syncSketchpad.moved=true;
      IdPlusPlusConfig.syncSketchpad.pos.x=e.x;
      IdPlusPlusConfig.syncSketchpad.pos.y=e.y;
      let ctx=e.target;
      let ctxData=ctx.getContext("2d")
      //检查控制面板是否打开了
      let padControl=document.querySelector('.IdPlusPlusSyncSketchpadControl');
      if(padControl==null || padControl==undefined){
        IdPlusPlus.createSyncSketchpadControl();
        padControl=document.querySelector('.IdPlusPlusSyncSketchpadControl');
      }
      padControl.style.display='flex';
      padControl.style.left='calc(100% - 78px)';
      //保存快照
      IdPlusPlusConfig.syncSketchpad.snapshot.push(ctxData.getImageData(0,0,parseInt(ctx.width),parseInt(ctx.height)));
      if(IdPlusPlusConfig.syncSketchpad.snapshot.length>=1){
        //清空并载入最近的快照
        ctx.width=ctx.width;
        ctxData.putImageData(IdPlusPlusConfig.syncSketchpad.snapshot[IdPlusPlusConfig.syncSketchpad.snapshot.length-1],0,0)
      }
      //同步数据
      let pos={x:e.x,y:e.y};
      IdPlusPlus.sendDataInstruct('syncSketchpadStart',pos);
    })
    canvas.addEventListener('mousemove',function (e){
      if(IdPlusPlusConfig.syncSketchpad.moved){
        if(IdPlusPlusConfig.syncSketchpad.pos.x!==null){
          let pos={x:e.x,y:e.y};
          let ctx=e.target;
          let ctxData=ctx.getContext("2d");
          //路径颜色
          ctxData.strokeStyle = IdPlusPlusConfig.syncSketchpad.color;
          //路径线宽
          ctxData.lineWidth = 1
          //虚线路径
          ctxData.setLineDash([1])
          //定义开始坐标
          ctxData.moveTo(IdPlusPlusConfig.syncSketchpad.pos.x,IdPlusPlusConfig.syncSketchpad.pos.y);
          //定义开始坐标
          ctxData.lineTo(IdPlusPlusConfig.syncSketchpad.pos.x,IdPlusPlusConfig.syncSketchpad.pos.y);
          //定义结束坐标（当前坐标）
          ctxData.lineTo(pos.x,pos.y)
          //连接
          ctxData.closePath();
          //替换开始坐标
          IdPlusPlusConfig.syncSketchpad.pos.x=pos.x;
          IdPlusPlusConfig.syncSketchpad.pos.y=pos.y;
          //绘制线条(必填)
          ctxData.stroke();
          //同步数据
          IdPlusPlus.sendDataInstruct('syncSketchpadMoved',pos);
        }
      }
    })
    //重绘：ctx.clearRect(x,y,x2,y2)
    //使用快照，将每次操作保存在本页面的栈中，需要复原时推出上一个快照
    canvas.addEventListener('mouseup',function (e){
      IdPlusPlusConfig.syncSketchpad.moved=false;
      IdPlusPlusConfig.syncSketchpad.pos.x=null;
      IdPlusPlusConfig.syncSketchpad.pos.y=null;
      //let ctx=e.target;
      //let ctxData=ctx.getContext("2d")
      //保存快照-因为当IdPlusPlusConfig.syncSketchpad.moved=false之后去同步数据时,本身也会受到影响，此时会多出一个快照
      //客户端的一方不主动保存快照
      //IdPlusPlusConfig.syncSketchpad.snapshot.push(ctxData.getImageData(0,0,parseInt(ctx.width),parseInt(ctx.height)));
      //同步数据
      IdPlusPlus.sendInstruct('syncSketchpadEnd');
    })
    return canvas;
  },
  //创建同步画板
  createSyncSketchpad:()=>{
    let can=IdPlusPlus.createSketchpad();
    let Div=document.createElement('DIV');
    Div.className='IdPlusPlusSyncSketchpad';
    Div.appendChild(can)
    document.body.appendChild(Div);
  },
  //显示同步画板
  displaySyncSketchpad:()=>{
    let pad=document.querySelector('.IdPlusPlusSyncSketchpad');
    if(pad==null || pad==undefined){
      //如果不存在则创建一个
      IdPlusPlus.createSyncSketchpad();
      //选择
      pad=document.querySelector('.IdPlusPlusSyncSketchpad');
    }
    pad.style.display='block';
    let con=document.querySelector('.IdPlusPlusSyncSketchpadControl');
    if(con==null || con==undefined){
      IdPlusPlus.createSyncSketchpadControl();
      con=document.querySelector('.IdPlusPlusSyncSketchpadControl');
    }
    con.style.display='flex';
  },
  //隐藏同步画板
  hideSyncSketchpad:()=>{
    let pad=document.querySelector('.IdPlusPlusSyncSketchpad');
    if(pad==null || pad==undefined){
      //如果不存在则创建一个
      IdPlusPlus.createSyncSketchpad();
      //选择
      pad=document.querySelector('.IdPlusPlusSyncSketchpad');
    }
    pad.style.display='none';
    let con=document.querySelector('.IdPlusPlusSyncSketchpadControl');
    if(con==null || con==undefined){
      //如果不存在则创建一个
      IdPlusPlus.createSyncSketchpadControl();
      //选择
      con=document.querySelector('.IdPlusPlusSyncSketchpadControl');
    }
    con.style.display='none';
  }
})
//应用层：
//在加载结束后的0.1秒之后开启初始设定
setTimeout(function(){IdPlusPlus.startSetting();},100);
//在加载结束后的0.15秒之后开启指针投影
setTimeout(function(){IdPlusPlus.addNewProjection();IdPlusPlus.listenClickAddPoint();},150);
//在加载结束后的0.2秒之后开启自动拷贝功能
setTimeout(function(){IdPlusPlus.clickCopyId();},200);
//实时监听popup传递指令
chrome.storage.onChanged.addListener(function (changes,storage){IdPlusPlus.instruction(changes);});
//快捷键绑定-开启遮罩蒙版
general_script.hotKeyHandler('ctrl','q',function(){IdPlusPlus.sendCommit(4);});
//快捷键绑定-创建单点指针映射
general_script.hotKeyHandler('ctrl','x',function(){IdPlusPlus.openProjection();});
//快捷键绑定-开启或隐藏幕布
general_script.hotKeyHandler('shift','x',function(){IdPlusPlus.hideProjectionCurtain();});
//开启热键功能
general_script.keyboardListen();
