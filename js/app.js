
const loader=document.getElementById("loading");
const mainContainer=document.getElementById("box");
const help=document.getElementById("help");
const helpPopup=document.getElementById("help-popup");
const resources=document.getElementById("resource");
const resourcesPopup=document.getElementById("resource-popup");
const popUp= document.querySelector(".pop-up");
const close= document.querySelectorAll(".close-icon");
const choices= document.querySelectorAll(".ques span");
const answerField= document.querySelectorAll(".ans-options .answer");
const replay= document.getElementById("replay");
const autoSolve= document.getElementById("showAns");
let answer, answerIndex;
let wrongOptions=[];
let correctOptions=[];
let Options=[];

window.addEventListener("load",()=>{
// remove loading image when page fully load
    loader.style.opacity=0;
    loader.style. zIndex=0;
   resize();
});

let boxHeight =mainContainer.offsetHeight;
let boxWidth = mainContainer.offsetWidth;
// scale my content on resizing
function resize(){
    let windowHeight=window.innerHeight;
    let windowWidth=window.innerWidth;
    let scale=Math.min(windowHeight/boxHeight,windowWidth/boxWidth);
    let left=Math.abs((windowWidth-(boxWidth*scale))/2);
    mainContainer.style=`transform:scale(${scale}); 
    -webkit-transform: scale(${scale});
    -o-transform: scale(${scale});
    -moz-transform: scale(${scale});
    -ms-transform: scale(${scale});
    left:${left}px;
    top:0;`;
}
window.addEventListener("resize",resize);


    // //////////////////////////////// start of pop up section ///////////////////
// show pop up help and image
 help.addEventListener("click",showPopup);
 resources.addEventListener("click",showPopup);
function showPopup(){
    popUp.classList.remove("d-none");
    const id=this.getAttribute("id");
    if(id=="help"){
        helpPopup.classList.remove("d-none");
        helpPopup.classList.add("d-flex");

    }else if(id=="resource"){
        resourcesPopup.classList.remove("d-none");
    }
}
// close pop up 
close.forEach(ele => {
    ele.addEventListener("click",(e)=>{
        popUp.classList.add("d-none");
        const id=e.target.parentElement.getAttribute("id");
        if(id=="help-popup"){
            helpPopup.classList.add("d-none");
            helpPopup.classList.remove("d-flex");
    
        }else if(id=="resource-popup"){
            resourcesPopup.classList.add("d-none");
        }    
    
    });
});
    // //////////////////////////////// end of pop up section ///////////////////


// ///////////////////////start of question functions /////////////////////////////

// loop on each choice
choices.forEach((choice)=>{
    choice.addEventListener("click",chooseAns);
    // get answer type (correct || wrong)
    let answerData=choice.getAttribute("answer-data");
    // separate wrong and correct answers
    if(answerData=="wrong"){
        wrongOptions.push(choice);
    }else if (answerData=="correct"){
        correctOptions.push(choice);
    }
    // array carry all type of answers
    Options.push(answerData);
});

// set counter for answers field
let full=correctOptions.length;

// choose the answer 
function chooseAns(){
    // remove selected class from sibilings
    const selected=document.querySelectorAll(".ques .selected");
    if(selected){
        selected.forEach((select)=>{
            select.classList.remove("selected")
        });
    }
    // add selected class for chossen answer
    this.classList.add("selected");
    // get the index of choosen answer
    choices.forEach((ele,i)=>{
        if(this==ele){return answerIndex=i;}
    });
    // get  answer type (correct || wrong) of selected choice
    answer=this.getAttribute("answer-data");   
}

answerField.forEach((field)=>{
    field.addEventListener("click",checkAnswer);
});

// check if the answer is coreect
function checkAnswer(){
    let correct=false;
     if(answer=="correct") correct=true;
    if(correct) correctAnswer(this);
    else {wrongAnswer(this)};
}

// for right answer show it in answer field and hide from choices
function correctAnswer(field){
    field.removeEventListener("click",checkAnswer);
    field.innerHTML=`
    ${document.querySelector(".selected").innerHTML} 
    <img src="images/tikMark-small.png" class="mark" alt="true mark image">
    ` ;
    audio.src="sounds/correct.mp3";
    audio.play();
    field.style="cursor:default;"
    choices[answerIndex].style="visibility:hidden;";
    choices[answerIndex].classList.remove("selected");
    full--;
    checkWin();
}
// for wrong answers blink it in answer field
function wrongAnswer(field){
    field.innerHTML=`
    ${document.querySelector(".selected").innerHTML}
    <img  src="images/crossMark-small.png" class="mark" alt="cross mark">
    ` ;
    audio.src="sounds/incorrect.mp3";
    audio.play();
    field.style="opacity:0;";
    let delWrongAns=setInterval(()=>{
        field.innerHTML="";
       field.style="opacity:1;";
       clearInterval(delWrongAns);
    },500);
}

// check if the student complete all spaces
function checkWin(){
    if(full==0){
        wrongOptions.forEach((ele)=>{
            ele.classList.add("disabled");
            ele.removeEventListener("click",chooseAns);
            ele.style.cursor="default";
        });
        autoSolve.classList.add("disabled");
        autoSolve.style.cursor="default";
        autoSolve.removeEventListener("click",showAnswer);
    }
}

// replay again 
replay.addEventListener("click",playAgain);
function playAgain(){
    full=correctOptions.length;
    correctOptions.forEach((ele)=>{
        ele.style="visibility:visable;";
    });

    wrongOptions.forEach((ele)=>{
        ele.classList.remove("disabled");
        ele.addEventListener("click",chooseAns);
        ele.style.cursor="pointer";
    });
    if(document.querySelector(".selected")){
        document.querySelector(".selected").classList.remove("selected");
    }
    answerField.forEach((field)=>{
        field.addEventListener("click",checkAnswer);
        field.innerHTML="";
        field.style="opacity:1; cursor:pointer;";
    });
    autoSolve.classList.remove("disabled");
    autoSolve.style.cursor="pointer";
    autoSolve.addEventListener("click",showAnswer);
}

// show all answers 
autoSolve.addEventListener("click",showAnswer)
function showAnswer(){
    full=0;
    checkWin();
    correctOptions.forEach((ele)=>{
        ele.style="visibility:hidden;";
    });
    if(document.querySelector(".selected")){
        document.querySelector(".selected").classList.remove("selected");
    }
    answerField.forEach((field,i)=>{
        field.removeEventListener("click",checkAnswer);
        field.innerHTML=`
        ${correctOptions[i].innerHTML}
        <img src="images/tikMark-small.png" class="mark" alt="true mark image">
        `;
        field.style="opacity:1; cursor:default;";
    });

}

// //////////////////////////////////end of question functions//////////////////////
