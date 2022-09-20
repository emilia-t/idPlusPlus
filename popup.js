var con=document.getElementById("con");
var buttonBox=document.querySelectorAll(".buttonBox");
var persistButtonBox=document.querySelectorAll(".persistButtonBox");
var buttonType1=document.querySelectorAll(".buttonType1");
var IdPlusPlusMotto=document.getElementById("IdPlusPlusMotto");
var stageTemp=null;
var IdPlusPlusMottoArr=['海内存知己，天涯若比邻','长亭外，古道边，芳草碧连天','高山仰行，景行行止','一条大河波浪宽，风吹稻花香两岸','他们都老了吧，他们在哪里呀，我们就这样，各自奔天涯','为世界上所有的美好而战','行到水穷处，坐看云起时','皑如山上雪，皎若云间月','黑白谁能用如玄，千回生死体方圆','天街小雨润如酥，草色遥看近却无','雄关漫道真如铁，而今迈步从头越','千里莺啼绿映红，水村山郭酒旗风', '我们总将会相遇，但不是今天，也不是明天','她踏上了旅途','临摹秀色千里冉，遥望星空万古光','妹说就是零卡！','在这里，死亡便是最大的恩赐','脸...脸都不要了','发生甚么事了！发生甚么事了！','三点几了，饮茶先啦','断了的弦在弹一遍'];
const Set=Object.freeze({
  //标题切换
  mottoChange:()=>{
    function randomNum(minNum,maxNum){
      switch(arguments.length){
        case 1:
          return parseInt(Math.random()*minNum+1,10);
          break;
        case 2:
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
          break;
        default:
          return 0;
          break;
      }
    }
    IdPlusPlusMotto.innerText=IdPlusPlusMottoArr[randomNum(0,IdPlusPlusMottoArr.length-1)];
  },
  //初始化按钮
  startSetting:()=>{
    chrome.storage.sync.get(['option0','option1','option2','option3','option4','option5'],function (result){
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
        if(result.option5==true){
          buttonBox[5].style.background="#3590ff";
          buttonBox[5].style.justifyContent="right";
        }else {
          buttonBox[5].style.background="#cbccce";
          buttonBox[5].style.justifyContent="left";
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
      case 5:{
        chrome.storage.sync.set({"option5":price},function (){});
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
  //switch按钮事件
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
    con.innerText='咔哒';
  },
  //长按钮事件
  buttonType1Event:(element,button)=>{
    //暂时只有button0
    // chrome.storage.sync.get("button"+button,function(result){
    //   function setOn(){
    //     chrome.storage.sync.set({"button":"on"},function (){})
    //   }
    //   function setOff(){
    //     chrome.storage.sync.set({"button":"off"},function (){})
    //   }
    //   if(result.button0===undefined){
    //     setOn()
    //     //con.innerText="0";
    //   }else {
    //     if(Object.keys(result).length===0){
    //       setOn()
    //       //con.innerText="1";
    //     }else{
    //       if(result.button0==="on"){
    //         setOff()
    //         //con.innerText="2";
    //       }else{
    //         setOn()
    //         //con.innerText="3";
    //       }
    //     }
    //   }
    // })
    con.innerText='已禁用此项功能(-_-)';
  },
  //不可东按钮事件
  persistButtonBoxEvent:(element)=>{
    //1.添加动效
    let num=element.getAttribute('num');
    if(num==undefined || num==null){
      element.setAttribute('num',1);
      num=1;
      element.className='persistButtonBoxA';
      con.innerText='无法更改此项(-_-)';
    }else {
      if(num%2===1){
        element.className='persistButtonBox';
        num++;
        element.setAttribute('num',num);
        con.innerText='无法更改此项(_-_)';
      }else {
        element.className='persistButtonBoxA';
        num++;
        element.setAttribute('num',num);
        con.innerText='无法更改此项(-_-)';
      }

    }
  }
})
Set.startSetting();
Set.mottoChange();
//设置switch按钮功能
for (let i=0;i<buttonBox.length;i++){
  buttonBox[i].onclick=function (){
    Set.buttonClickEvent(buttonBox[i],i)
  }
}
//设置长按钮功能
for (let i=0;i<buttonType1.length;i++){
  buttonType1[i].onclick=function (){
    Set.buttonType1Event(buttonType1[i],i)
  }
}
//设置不可修改按钮功能
for (let i=0;i<persistButtonBox.length;i++){
  persistButtonBox[i].onclick=function (){
    Set.persistButtonBoxEvent(persistButtonBox[i])
  }
}
