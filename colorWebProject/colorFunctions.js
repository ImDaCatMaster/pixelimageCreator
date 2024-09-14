const grid = document.getElementById("grid");

var id = 1;
var selected = document.getElementById(id);

var colCount;
var rowCount;

var colPosition;
var rowPosition;

var highlight = true;
var outline = true;

var radioButtons = document.querySelectorAll('input[type="radio"]');

const c1 = document.getElementById("c1");
const c2 = document.getElementById("c2");
const c3 = document.getElementById("c3");

for (let i = 0; i < grid.childElementCount; i++){
    var child = grid.children[i];
    child.style.backgroundColor = "blue";
}

set();

function set(){
    colCount = Math.round(grid.clientWidth / 50);
    rowCount = Math.round(grid.clientHeight / 50);
    colPosition = 1;
    rowPosition = 1;
    select();
}

function select(){
    selected.style.opacity = 1;
    selected.style.border = "none";
    id = Math.round(id);
    selected = document.getElementById(id);
    if (highlight){selected.style.opacity = 0.75};
    if (outline){selected.style.border = "2px solid black"};
} 

window.onkeydown = function(event){
    if(event.key == "ArrowLeft"){ //left
        colPos(-1);
    }else if(event.key == "ArrowUp"){ //up
        rowPos(1);
    }else if(event.key == "ArrowRight"){ //right
        colPos(1);
    }else if(event.key == "ArrowDown"){ //down
        rowPos(-1);
    }else if (event.key == "Enter"){

        var bg1 = getComputedStyle(c1).backgroundColor;
        var bg2 = getComputedStyle(c2).backgroundColor;
        var bg3 = getComputedStyle(c3).backgroundColor;

        switch(getComputedStyle(selected).backgroundColor){
            case bg1:
                selected.style.backgroundColor = bg2;
                break;
            case bg2:
                selected.style.backgroundColor = bg3;
                break;
            case bg3:
                selected.style.backgroundColor = bg1;
                break;
        }
    }
};

function colPos(dir) {
    //const colPosition = id % colCount;

    if (colCount == 1){
        return;
    }else if (colPosition != 1 && colPosition != colCount){ //middle columns
        id += dir;
        colPosition += dir;
    }else{
        if(colPosition==colCount){
            if (dir > 0){
                id -= colCount - 1;
                colPosition = 1;
            }else{
                id += dir;
                colPosition -= 1;
            }
        }else if(colPosition==1){
            if (dir < 0){
                id += colCount - 1;
                colPosition = colCount; 
            }else{
                id += dir;
                colPosition += 1;
            } 
        }
    }

    select();
} 

function rowPos(dir){
    //const rowPosition = Math.ceil(id / rowCount);

    if (rowCount == 1){
        return;
    }else if (rowPosition != 1 && rowPosition != rowCount){ //middle rows
        id -= dir * colCount;
        rowPosition -= dir;
    }else{
        if(rowPosition==rowCount){
            if (dir < 0){
                id -= colCount * (rowCount - 1);
                rowPosition = 1;
            }else{
                id -= colCount;
                rowPosition -= 1;
            }
        }else if(rowPosition==1){
            if (dir > 0){
                id += colCount * (rowCount - 1);
                rowPosition = rowCount;
            }else{
                id += colCount;
                rowPosition += 1;
            }
        }
    }

    select();
}

function downloadImage()
{
    if(document.getElementById("fileName").value.length > 0){
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = grid.offsetWidth;
        canvas.height = grid.offsetHeight;

        drawElement(ctx);

        const link = document.createElement('a');
        link.download = document.getElementById("fileName").value;
        link.href = canvas.toDataURL();
        link.click();
    }else{
        document.getElementById("required").style.display = "block";
    }
}

function drawElement(ctx) {
    const boxes = Array.from(grid.querySelectorAll('.square'));

    boxes.forEach(box => {
        const rect = box.getBoundingClientRect();
        const x = rect.left - grid.getBoundingClientRect().left;
        const y = rect.top - grid.getBoundingClientRect().top;
        const width = box.offsetWidth;
        const height = box.offsetHeight;
        const color = window.getComputedStyle(box).backgroundColor;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    });
}

document.getElementById("width").addEventListener("change", function(){
    const val = document.getElementById("width").value;
    grid.style.gridTemplateColumns = 'repeat(' + val + ', 50px)';
    const addCol = val - colCount;

    id = 1;
    set();

    arrangePage();

    //adds an extra column from 5 to 6

    console.log(val);
    console.log(grid.clientWidth);
    console.log(grid.clientWidth / 50);
    console.log(colCount);

    if (addCol > 0){
        for (let i = grid.children.length; i < val * document.getElementById("height").value; i++){
            let clone = document.getElementById("1").cloneNode( true );

            //sets the id
            clone.setAttribute( 'id', i + 1);
    
            clone.style.opacity = 1;
            clone.style.border = "none";
    
            //add as child to grid
            grid.appendChild( clone );
        }
    }else{
        for (let i = 0; i < -addCol * rowCount; i++){
            grid.removeChild(grid.lastChild);
        }
    }
});

document.getElementById("height").addEventListener("change", function(){
    const val = document.getElementById("height").value;
    grid.style.gridTemplateRows = 'repeat(' + val + ', 50px)';
    const addRow = val - rowCount;

    id = 1;
    set();

    arrangePage();

    if (addRow > 0){
        for (let i = 0; i < addRow * colCount; i++){
            let clone = document.getElementById("1").cloneNode( true );

            //sets the id
            clone.setAttribute( 'id', grid.children.length + 1 );
    
            clone.style.opacity = 1;
            clone.style.border = "none";
    
            //add as child to grid
            grid.appendChild( clone );
        }
    }else{
        for (let i = 0; i < -addRow * colCount; i++){
            grid.removeChild(grid.lastChild);
        }
    }
});

document.querySelectorAll('input[name=\'selecting\']').forEach((radio) => {
    radio.addEventListener('click', (event) => {
      if (event.target.checked) {
        switch (event.target.value) {
        case 'both':
            [highlight, outline] = [true, true];
            select();
            break;
        case 'highlight':
            [highlight, outline] = [true, false];
            select();
            break;
        case 'outline':
            [highlight, outline] = [false, true];
            select();
            break;
        case 'none':
            [highlight, outline] = [false, false];
            select();
            break;
        default:
            console.log('Unknown option selected');
        }
      }
    });
});
    
radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown'
            || event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
        }
    });
});

document.getElementById("fileName").addEventListener("input", function(){
    if(document.getElementById("fileName").value.length == 20){
        document.getElementById("maxLength").style.display = "block";
    }else{
        document.getElementById("maxLength").style.display = "none";
    }

    if(document.getElementById("fileName").value.length > 0){
        document.getElementById("required").style.display = "none";
    }
});

function arrangePage(){
    const gridEdge = grid.getBoundingClientRect().left;
    const settingsEdge = document.getElementById("select").getBoundingClientRect().right;

    grid.style.marginLeft = "0px";

    if(gridEdge < settingsEdge + 10){
        if(grid.clientWidth == 150){
            grid.style.marginLeft = "50px";
        }else{
            document.getElementById("settings").style.top = grid.clientHeight + 20 + "px";
        }
    }else{
        document.getElementById("settings").style.top = "10px";
    }
}

window.addEventListener('resize', arrangePage);
arrangePage();

//color stuff

const colorPicker = document.getElementById("colorBubble");
colorPicker.style.visibility = "hidden";

function animate(){
    var divs=document.querySelectorAll(".event"),x=divs.length;
    while(x--)
        divs[x].classList.toggle("shift");
}
animate();

const colors = document.getElementsByClassName("color");
const indicator = document.getElementById("indicator");
const rgb = document.getElementsByClassName("rgb");

var colour;

Array.from(colors).forEach(function(color, index){
    color.addEventListener('click', function(event){
        if(colorPicker.style.visibility == "hidden"){
            colorPicker.style.visibility = "visible";
            animate();
        }

        colour = color;
        //indicator.style.left = colorPicker.clientWidth / (index + 1) + "px";
        indicator.style.left = 30 + 40 * index * 2 + 15 * index + "px";

        Array.from(rgb).forEach(function(val, index2){
            val.value = getColorComponent(getComputedStyle(color)['background-color'], index2);
        });
    });
});

Array.from(rgb).forEach(function(val){
    val.addEventListener("change", function(){
        colour.style.backgroundColor = "rgb(" +rgb[0].value+ ", " +rgb[1].value+ ", " +rgb[2].value+ ")"
    });
});

function exit(){
    colorPicker.style.visibility = "hidden";
    animate();
}

function getColorComponent(rgbString, index) {
    // Validate the index
    if (index < 0 || index > 2) {
        throw new Error("Index must be 0 (red), 1 (green), or 2 (blue)");
    }

    // Match the RGB values using a regular expression
    const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
        return parseInt(match[index + 1], 10); // Index 0 -> match[1], Index 1 -> match[2], Index 2 -> match[3]
    }
    throw new Error("Invalid RGB string format");
}