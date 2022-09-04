var con=document.getElementById("con");
var buttonBox=document.querySelectorAll(".buttonBox");
var buttonType1=document.querySelectorAll(".buttonType1");
var stageTemp=null;
const Set=Object.freeze({
  //初始化按钮
  startSetting:()=>{
    chrome.storage.sync.get(['option0','option1','option2','option3','option4'],function (result){
      if (result!=null){
        if(result.option0==true){
          buttonBox[0].style.background="#3590ff";
          buttonBox[0].style.justifyContent="right";
        }else {
          buttonBox[0].style.background="#cbccce";
          buttonBox[0].style.justifyContent="left";
        }
        if(result.option1==true){
          buttonBox[1].style.background="#3590ff";
          buttonBox[1].style.justifyContent="right";
        }else {
          buttonBox[1].style.background="#cbccce";
          buttonBox[1].style.justifyContent="left";
        }
        if(result.option2==true){
          buttonBox[2].style.background="#3590ff";
          buttonBox[2].style.justifyContent="right";
        }else {
          buttonBox[2].style.background="#cbccce";
          buttonBox[2].style.justifyContent="left";
        }
        if(result.option3==true){
          buttonBox[3].style.background="#3590ff";
          buttonBox[3].style.justifyContent="right";
        }else {
          buttonBox[3].style.background="#cbccce";
          buttonBox[3].style.justifyContent="left";
        }
        if(result.option4==true){
          buttonBox[4].style.background="#3590ff";
          buttonBox[4].style.justifyContent="right";
        }else {
          buttonBox[4].style.background="#cbccce";
          buttonBox[4].style.justifyContent="left";
        }
      }
    })
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
  //获取某一个选项的值
  getOptionStage:(option)=>{
    chrome.storage.sync.get("option"+option,function (result){
      if(Object.keys(result).length===0){
        stageTemp=false;
      }else {
        Object.keys(result).forEach(function (key){
          if(result[key]!==undefined){
            stageTemp=result[key];
          }else {
            stageTemp=false;
          }
        })
      }
    })
    return true;
  },
  //为某一option取反
  optionReverse:(option)=>{
    //2取反
    let newOptionStage=!stageTemp;
    //3设置新的值
    Set.setOptionStage(option,newOptionStage);
  },
  //按钮事件
  buttonClickEvent:(element,option)=>{
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
      Set.optionReverse(option);
      //设置动效
      if(!stageTemp){
          element.style.background="#3590ff";
          element.style.justifyContent="right";
        }else {
          element.style.background="#cbccce";
          element.style.justifyContent="left";
        }
      stageTemp=null;
    })
  },
  buttonType1Event:(element,button)=>{
    //暂时只有button0
    chrome.storage.sync.get("button"+button,function(result){
      function setOn(){
        chrome.storage.sync.set({"button":"on"},function (){})
      }
      function setOff(){
        chrome.storage.sync.set({"button":"off"},function (){})
      }
      if(result.button0===undefined){
        setOn()
        con.innerText="0";
      }else {
        if(Object.keys(result).length===0){
          setOn()
          con.innerText="1";
        }else{
          if(result.button0==="on"){
            setOff()
            con.innerText="2";
          }else{
            setOn()
            con.innerText="3";
          }
        }
      }
    })
  }
})
Set.startSetting();
for (let i=0;i<buttonBox.length;i++){
  buttonBox[i].onclick=function (){
    Set.buttonClickEvent(buttonBox[i],i)
  }
}
for (let i=0;i<buttonType1.length;i++){
  buttonType1[i].onclick=function (){
    Set.buttonType1Event(buttonType1[i],i)
  }
}
