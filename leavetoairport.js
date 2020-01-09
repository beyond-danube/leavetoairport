function checkHoursInput() {
    if (this.value > 23 || this.value < 0) {
        this.value = 0;
    }
}

function checkMinutesInput() {
    if (this.value > 59 || this.value < 0) {
        this.value = 0;
    }
}

function checkLengthInput() {
    if (this.value.length === 1) {
        this.value = '0' + this.value
    }

    if (this.value.length > 2 || !this.value) {
        this.value = '00';
    }
}

function getTimeValue(departH, departM, packingH, packingM, travelH, travelM, arrivebeforeH, arrivebeforeM) {
    let timeData = {
    depart: parseInt(departH) * 60 + parseInt(departM),
    packing: parseInt(packingH) * 60 + parseInt(packingM),
    travel: parseInt(travelH) * 60 + parseInt(travelM),
    arrivebefore: parseInt(arrivebeforeH) *60 + parseInt(arrivebeforeM)
  };

  return timeData;
}

function getTimeDiff(start, end) {
    let diff = end - start
    
    if (diff < 0) {
        diff = 1440 + diff;
    }

    if (!(diff % 10 == 0)) {
        diff = 10 * Math.floor(diff/10);
    }

    let hh = Math.floor(diff/60);
    let mm = diff - hh*60;

    if (mm === 0 || mm.toString().length === 1) {
        mm = '0' + mm;
    }

    if (hh === 0 || hh.toString().length === 1) {
        hh = '0' + hh;
    } 

    return hh + ':' + mm;
}

function formatToUserTime(time) {
    let hh = Math.floor(time/60);
    let mm = time - hh*60;

    if (mm === 0 || mm.toString().length === 1) {
        mm = '0' + mm;
    }

    if (hh === 0 || hh.toString().length === 1) {
        hh = '0' + hh;
    }

    return hh + ':' + mm;    
}

function getUserTime(timedata) {
    let userTime = {
        depart: formatToUserTime(timedata.depart),
        arrive: getTimeDiff(timedata.arrivebefore, timedata.depart),
        leave: getTimeDiff(timedata.arrivebefore + timedata.travel, timedata.depart),
        packing: getTimeDiff(timedata.arrivebefore + timedata.travel + timedata.packing, timedata.depart)
    }
    
    return userTime;
}

function getFirstCanvas() {
    let canvasCollection = document.getElementsByTagName("canvas");
    let canvas = canvasCollection[0];
    return canvas;
}

function getContextFormFirstCanvas() {
    let canvas = getFirstCanvas();
    let ctx = canvas.getContext("2d");
    return ctx;
}

function timeSpanDrawer(start, length, width, color, scale) {     
    let ctx = getContextFormFirstCanvas();
    ctx.fillStyle = color;
    ctx.fillRect(0,start*scale,width,length*scale);
}

function lineDrawer(x1, x2, position, color, scale) {
    let ctx = getContextFormFirstCanvas();
    ctx.beginPath();
    ctx.moveTo(x1, position*scale + 2);
    ctx.lineTo(x2, position*scale + 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = scale;
    ctx.stroke();
}

function textDrawer(x, y, text, color, font) {
    let ctx = getContextFormFirstCanvas();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y*4);
}

function clearCanvas() {
    let canvas = getFirstCanvas();
    let ctx = getContextFormFirstCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvasToFit(timedata, scale, topmargin) {
    let canvas = getFirstCanvas();
    canvas.height = (timedata.packing + timedata.travel + timedata.arrivebefore + topmargin) * scale;
}

function getDrawingData(timedata, topmargin) {
    let drawingData = {
        packingStart: topmargin,
        packingEnd: topmargin + timedata.packing,
        traveStart: topmargin + timedata.packing,
        travelEnd: topmargin + timedata.packin + timedata.travel,
        arriveToAirport: topmargin + timedata.packin + timedata.travel,
        takeOff: topmargin + timedata.packing + timedata.travel + timedata.arrivebefore
    };
    
    return drawingData;
}

function addValidationEventListeners() {
    let hours = document.getElementsByClassName("hours");
    let minutes = document.getElementsByClassName("minutes");

    for (let i = 0 ; i < hours.length; i++) {
        hours[i].addEventListener('blur' , checkHoursInput); 
        hours[i].addEventListener('blur' , checkLengthInput); 
        minutes[i].addEventListener('blur', checkMinutesInput);
        minutes[i].addEventListener('blur', checkLengthInput);
    }
}

function unHideElement(elementId) {
    let element = document.getElementById(elementId);
    element.removeAttribute("hidden");
}

function scrollToElemet(elementId) {
    let element = document.getElementById(elementId);
    element.scrollIntoView({behavior: "smooth"});
}

function drawScheduler(width, scale, l1, l2) {
    let timedata = getTimeValue(document.getElementById("departH").value, document.getElementById("departM").value, document.getElementById("packingH").value, document.getElementById("packingM").value, document.getElementById("travelH").value, document.getElementById("travelM").value, document.getElementById("arrivebeforeH").value, document.getElementById("arrivebeforeM").value);
    let userTime = getUserTime(timedata);

    clearCanvas();

    let topmargin = 50;

    resizeCanvasToFit(timedata, scale, topmargin)

    timeSpanDrawer(topmargin, timedata.packing, width, "#2D9CDB", scale);
    timeSpanDrawer(topmargin + timedata.packing, timedata.travel, width, "#BB6BD9", scale);
    timeSpanDrawer(topmargin + timedata.packing + timedata.travel, timedata.arrivebefore, width, "#24AE60", scale);

    lineDrawer(width, l1, topmargin, "#2D9CDB", scale);
    lineDrawer(width, l1, topmargin + timedata.packing, "#BB6BD9", scale);
    lineDrawer(width, l1, topmargin + timedata.packing + timedata.travel, "#24AE60", scale);
    lineDrawer(width, l1, topmargin + timedata.packing + timedata.travel + timedata.arrivebefore - 1, "#24AE60", scale);

    textDrawer(l1 ,topmargin, userTime.packing, "#2D9CDB", "500 4em Roboto");
    textDrawer(l1, topmargin + timedata.packing, userTime.leave, "#BB6BD9",);
    textDrawer(l1, topmargin + timedata.packing + timedata.travel, userTime.arrive, "#24AE60");
    textDrawer(l1, topmargin + timedata.packing + timedata.travel + timedata.arrivebefore - 1, userTime.depart );

    textDrawer(l2 ,topmargin, "Start packing", "#2D9CDB", "300 4em Roboto");
    textDrawer(l2, topmargin + timedata.packing, "Leave to airport", "#BB6BD9",);
    textDrawer(l2, topmargin + timedata.packing + timedata.travel, "Arrive to airport", "#24AE60");
    textDrawer(l2, topmargin + timedata.packing + timedata.travel + timedata.arrivebefore - 1, "Take off" );
}