console.log("hello")
const tools = document.querySelectorAll(".tool")
const canvas = document.querySelector("#canvasid")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tool = canvas.getContext("2d")
let eventlisteneradded = false;
let pendown = false;
let eventlisteneraddedsticky = false;
let currenttool = "";
let stick = [];
let order = [];
let pos = [];
let redo = [];
let ro = -1;
let rs = -1;

for (let i = 0; i < tools.length; i++) {
    tools[i].addEventListener("click", function () {
        const toolid = tools[i].id;
        console.log(order)
        if (toolid == "pencil") {
            currenttool = "pencil"
            console.log("pencil");
            tool.strokeStyle = "blue";
            tool.lineWidth = 1; // Replace with your original line width
            redo.length = 0;//so that whenever we click penscil the last stored in redo is deleted;
            console.log(tool.strokeStyle)
            if (!eventlisteneradded)
                draw();

        }
        else if (toolid == "eraser") {
            currenttool = "eraser"
            console.log("eraser");
            tool.lineWidth = 1
            // This makes it act as an eraser
            if (!eventlisteneradded)
                draw();
        }
        if (toolid == "sticky") {
            currenttool = "sticky"
            // let sticker = Document.a
            console.log("sticky");
            stickydiv();
        }
        else if (toolid == "upload") {
            currenttool = "upload"
            console.log("upload");
            upload();
        }
        else if (toolid == "download") {
            currenttool = "download"
            console.log("download");
            download();
        }
        else if (toolid == "undo") {
            currenttool = "undo"
            console.log("undo");
            undo();
        }
        else if (toolid == "redo") {
            currenttool = "redo"
            console.log("redo");
            redoo();
        }
    })
}

function gety() {
    return navbar.getBoundingClientRect().height;
}

function redoo() {
    if (ro >= 0) {
        if (order[0] === "sticky") {
            let l = stick.length - 1;
            stick.push(stick.shift());
            order.push(order.shift());
            ro--;
            rs--;
            if (stick[l].type === "min")
                stick[l].content.style.display = (stick[l].content.style.display === "block") ? "none" : "block";
            else if (stick[l].type === "del")
                stick[l].ref.remove();
            else if (stick[l].type === "create")
                document.body.appendChild(stick[l].ref);
            else {
                l = stick.length - 1;
                stick[l].ref.style.top = stick[l].y + "px";
                stick[l].ref.style.left = stick[l].x + "px";
            }
        }
        else {
            if (redo.length == 0)
                return;
            order.push(order.shift());
            ro--;
            let l = redo.length - 1;
            tool.beginPath();
            tool.moveTo(redo[l][0][0], redo[l][0][1])
            for (let i = 1; i < redo[l].length; i++) {
                tool.globalCompositeOperation = redo[l][0];
                tool.lineTo(redo[l][i][0], redo[l][i][1]);
            }
            tool.stroke();
            tool.closePath();

            pos.push(redo.pop());
        }
    }
}

function undo() {
    console.log(order)
    if (order[order.length - 1] === "sticky") {
        console.log("entered undo sticky")
        stick.unshift(stick.pop());
        order.unshift(order.pop());
        ro++;
        rs++;
        if (stick[0].type === "min")
            stick[0].content.style.display = (stick[0].content.style.display === "block") ? "none" : "block";
        else if (stick[0].type === "del")
            document.body.appendChild(stick[0].ref);
        else if (stick[0].type === "create")
            stick[0].ref.remove();
        else {
            l = stick.length - 1;
            console.log(l + "    " + stick[l])
            if (stick[l].type=== "create") {
                stick[0].ref.style.top = 40+"%";
                stick[0].ref.style.left = 45+"%";
            }
            else {
                console.log("aya in undo")

                let { top, left } = stick[l].ref.getBoundingClientRect()

                stick[l].ref.style.top = stick[l].y + "px";
                stick[l].ref.style.left = stick[l].x + "px";
            }
        }
    }
    else {
        console.log("entered undo draw")
        order.unshift(order.pop());
        ro++;
        if (pos.length == 0) {
            return;
        }
        tool.clearRect(0, 0, canvas.width, canvas.height);
        tool.lineWidth = 2; // Replace with your original line width
        redo.push(pos.pop());
        let l = pos.length - 1;
        for (let j = 0; j <= l; j++) {
            tool.globalCompositeOperation = pos[j][0];
            tool.beginPath();
            tool.moveTo(pos[j][1][0], pos[j][1][1])
            for (let i = 1; i < pos[j].length - 1; i++) {
                tool.lineTo(pos[j][i][0], pos[j][i][1]);
            }
            tool.stroke();
            tool.closePath();
        }
    }
}

function draw() {
    canvas.addEventListener("mousedown", function (e) {
        if (currenttool == "eraser")
            tool.globalCompositeOperation = 'destination-out';
        let y = e.clientY - gety();
        tool.beginPath();
        tool.moveTo(e.clientX, y)
        console.log("mousedown")
        pendown = true;
        pos.push([])
        pos[pos.length - 1].push(tool.globalCompositeOperation, [e.clientX, e.clientY - gety()]);
    })
    canvas.addEventListener("mousemove", function (e) {
        if (pendown) {
            if (currenttool == "pencil" || currenttool == "eraser") {
                tool.lineTo(e.clientX, e.clientY - gety())
                tool.stroke();
                pos[pos.length - 1].push(tool.globalCompositeOperation, [e.clientX, e.clientY - gety()]);
            }
        }
    })
    canvas.addEventListener("mouseup", function () {
        if(pendown)
        {
            console.log("mouseup")
            order[order.length] = "draw";
            tool.closePath();
        }
        pendown = false;
        tool.globalCompositeOperation = 'source-over';
        console.log(pos.length);
    })
    eventlisteneradded = true;
}

function stickydiv() {
    let textArea = document.createElement("textarea");
    let sticky = outerbox(textArea);
    sticky.appendChild(textArea)
}

function upload() {
    let input = document.querySelector("input");
    input.click()
    input.addEventListener("change", function () {
        let data = input.files[0];
        let image = document.createElement("img");
        image.src = URL.createObjectURL(data);
        image.setAttribute("class", "image");
        let sticky = outerbox(image);
        sticky.appendChild(image)
    })
}

function outerbox(text_or_img) {
    let sticky = document.createElement("div");
    let top = document.createElement("div");
    let min = document.createElement("div");
    let del = document.createElement("div");

    sticky.setAttribute("class", "sticky");
    top.setAttribute("class", "top");
    min.innerText = "-";
    del.innerText = "x";

    sticky.appendChild(top);
    top.appendChild(min)
    top.appendChild(del)
    document.body.appendChild(sticky)
    stick.push(
        {
            ref: sticky,
            type: "create",
        })
    console.log(stick)
    order[order.length] = "sticky";

    let ismin = false;
    del.addEventListener("click", function () {
        stick.push(
         {
                ref: sticky,
                type: "del",
         })
        sticky.remove();
        order[order.length] = "sticky";
    })
    min.addEventListener("click", function () {
        if (ismin == true)
            text_or_img.style.display = "block";
        else
            text_or_img.style.display = "none";
        ismin = !ismin;
        stick.push(
        {
            ref: sticky,
            type: "min",
            content:text_or_img
        })
        order[order.length] = "sticky";
    })

    let initialX;
    let initialY;
    let move = false;
    top.addEventListener("click", function (e) {
        console.log("aya")
        initialX = e.clientX
        initialY = e.clientY
        let fx,fy;
        top.addEventListener("mousedown", function () {
            move = true;
        })
        top.addEventListener("mousemove", function (e) {
            if (move) {
                console.log("mousemove")
                let finalX = e.clientX;
                let finalY = e.clientY;
                let dx = finalX - initialX;
                let dy = finalY - initialY;
                let { top, left } = sticky.getBoundingClientRect()
                sticky.style.top = top + dy + "px";
                sticky.style.left = left + dx + "px";
                initialX = finalX;
                initialY = finalY;
                fy=top+dy;
                fx=left+dx;
            }
        })
        top.addEventListener("mouseup", function () {
            if (move) {
                console.log("mouseup")
                stick.push(
                    {
                        ref: sticky,
                        type: "position",
                        y: fy,
                        x: fx
                    })
                console.log(stick);
                order[order.length] = "sticky";
            }
            move = false;
            eventlisteneraddedsticky = true;
        })
    })

    return sticky;
}

function download() {
    console.log("download clicked")
    html2canvas(document.body).then((canvas) => {
        let a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "your_art_with_stickies.png";
        a.click();
        a.remove();
    });
}
