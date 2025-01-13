console.log("hello")
const tools=document.querySelectorAll(".tool")
const canvas=document.querySelector("#canvasid")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tool=canvas.getContext("2d")
let eventlisteneradded=false;
let pendown=false;
let eventlisteneraddedsticky=false;
let currenttool="";
let pos=[];
let redo=[];

for(let i=0;i<tools.length;i++)
{
    tools[i].addEventListener("click",function() {
        const toolid = tools[i].id;
        if(toolid == "pencil")
        {
            currenttool="pencil"
            console.log("pencil");
            tool.strokeStyle = "blue";
            tool.lineWidth = 1; // Replace with your original line width
            redo.length=0;//so that whenever we click penscil the last stored in redo is deleted;
            console.log(tool.strokeStyle)
            if(!eventlisteneradded)
             draw();

        }
        else if(toolid == "eraser")
        {
            currenttool="eraser"
            console.log("eraser");
            tool.lineWidth = 1
             // This makes it act as an eraser
            if(!eventlisteneradded)
                draw();
        }
        //else
           // tool.globalCompositeOperation = 'source-over';
        if(toolid == "sticky")
        {
            currenttool="sticky"
            let sticker=Document.a
            console.log("sticky");
            stickydiv();
        }
        else if(toolid == "upload")
        {
            currenttool="upload"
            console.log("upload");
            upload();
        }
        else if(toolid == "download")
        {
            currenttool="download"
            console.log("download");
            download();
        }
        else if(toolid == "undo")
        {
            currenttool="undo"
            console.log("undo");
            undo();
        }
        else if(toolid == "redo")
        {
            currenttool="redo"
            console.log("redo");
            redoo();
        }
    })
}

function gety()
{
    return navbar.getBoundingClientRect().height;
}
function redoo(){
    if(redo.length==0)
        return;
    
    let l=redo.length-1;

    tool.beginPath();
    tool.moveTo(redo[l][0][0],redo[l][0][1])
    for(let i=1;i<redo[l].length;i++)
    {
        tool.globalCompositeOperation=redo[l][0];
        tool.lineTo(redo[l][i][0],redo[l][i][1]);
    }
    tool.stroke();
    tool.closePath();
   
    pos.push(redo.pop());
}
function undo(){
    if(pos.length==0)
    {
        return;
    }
    tool.clearRect(0, 0, canvas.width, canvas.height);
    // console.log(tool.strokeStyle)
    tool.lineWidth = 2; // Replace with your original line width
    // console.log(pos.length)
    redo.push(pos.pop());
    let l=pos.length-1;

   
    for(let j=0;j<=l;j++)
    {
        // console.log(pos[j][0]+" "+j);
        tool.globalCompositeOperation=pos[j][0];
        tool.beginPath();
        tool.moveTo(pos[j][1][0],pos[j][1][1])
        for(let i=1;i<pos[j].length-1;i++)
        {
            tool.lineTo(pos[j][i][0],pos[j][i][1]);
        }
        tool.stroke();
        tool.closePath();
    }   
    //pos.pop();

}
function draw()
{
    canvas.addEventListener("mousedown",function(e){
        if(currenttool=="eraser")
            tool.globalCompositeOperation = 'destination-out';
        let y=e.clientY-gety();
        tool.beginPath();
        tool.moveTo(e.clientX,y)
        console.log("mousedown")
        pendown=true;
        pos.push([])
        pos[pos.length-1].push(tool.globalCompositeOperation,[e.clientX,e.clientY-gety()]);
    })
    canvas.addEventListener("mousemove",function(e){
        if(pendown)
        {
            if(currenttool=="pencil" || currenttool=="eraser")
            {
                tool.lineTo(e.clientX,e.clientY-gety())
                
                tool.stroke();
                pos[pos.length-1].push(tool.globalCompositeOperation,[e.clientX,e.clientY-gety()]);
            }
        }
        //console.log("moving")
    })
    canvas.addEventListener("mouseup",function(){
        console.log("mouseup")
        tool.closePath();
        pendown=false;
        tool.globalCompositeOperation = 'source-over';
        console.log(pos.length);
    })
    eventlisteneradded=true;
}
function stickydiv()
{
    let textArea = document.createElement("textarea");
    let sticky=outerbox(textArea);
    sticky.appendChild(textArea)
}
function outerbox(text_or_img)
{
    let sticky=document.createElement("div") ;
    let top=document.createElement("div") ;
    let min=document.createElement("div") ;
    let del=document.createElement("div") ;
    // let text=document.querySelector("textarea")

    sticky.setAttribute("class","sticky");
    top.setAttribute("class","top");
    // del.setAttribute("class","delete")
    // min.setAttribute("class","minimum");
    min.innerText="-";
    del.innerText="x";

    sticky.appendChild(top);
    top.appendChild(min)
    top.appendChild(del)
    //sticky.appendChild(text)
    document.body.appendChild(sticky)
    // if(currenttool=="sticky")
    // {
    //     text=document.createElement("textarea");
    //     sticky.appendChild(text)
    // }
    // else
    //     text=document.querySelector(".image") ;

    let ismin=false;
    del.addEventListener("click",function(){
        sticky.remove();
    })
    min.addEventListener("click",function(){
        if(ismin==true)
            text_or_img.style.display="block";
        else
            text_or_img.style.display="none";
        ismin=!ismin;
    })
    
    let initialX;
    let initialY;
    let move=false;
    top.addEventListener("click",function(e){
        console.log("aya")
        initialX = e.clientX
        initialY = e.clientY
        top.addEventListener("mousedown",function(){
            move=true;
        })
        top.addEventListener("mousemove",function(e){
            if(move)
            {
                console.log("mousemove")
                let finalX = e.clientX;
                let finalY = e.clientY;
                //console.log("mousemove", finalX, finalY);
                //  distance
                let dx = finalX - initialX;
                let dy = finalY - initialY;
                //  move sticky
                //original top left
                let { top, left } = sticky.getBoundingClientRect()
                // stickyPad.style.top=10+"px";
                sticky.style.top = top + dy + "px";
                sticky.style.left = left + dx + "px";
                initialX = finalX;
                initialY = finalY;
            }
         })
         top.addEventListener("mouseup",function(){
            console.log("mouseup")
            move=false;
            eventlisteneraddedsticky=true;
         })
    })
    
    return sticky;
}

function upload(){
    let input=document.querySelector("input");
    input.click()
    input.addEventListener("change",function(){
        let data=input.files[0];
        let image=document.createElement("img");
        image.src=URL.createObjectURL(data);
        image.setAttribute("class","image");
        //console.log(document.querySelector(".image") !== null)
        let sticky=outerbox(image);
        sticky.appendChild(image)
    })
}

function download()
{
    console.log("download clicked")
    let a=document.createElement("a");
    let url=canvas.toDataURL("image/png")
    a.download="your_art.png";
    a.href=url;
    a.click();
    a.remove();
}