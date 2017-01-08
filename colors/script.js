var picker  = document.getElementById("picker");
var hue  = document.getElementById("hue");
var alpha  = document.getElementById("alpha");
var picker_ctx = picker_ctx.getContext('2d');
var hue = hue.getContext('2d');
var alpha = alpha.getContext('2d');

var currentAlpha = 255;
var currentMacroColor = {r: 255, g: 0, b: 0};
var currentMicroColor = {r: 255, g: 0, b: 0, a: currentAlpha};

var macroPalette = {width: 50, height: canvas.height};
var alphaPalette = {width: (canvas.width - macroPalette.width), height: 25};
var microPalette = {width: (canvas.width - macroPalette.width), height: canvas.height - alphaPalette.height};

var macroGradientOrder = generateMacroPaletteColors();

var x_micro = 0;
var y_micro = 0;
var x_macro = 0;
var y_macro = 0;
var x_alpha = 0;
var y_alpha = 0;

initializePalettes();

function initializePalettes() {
	x_micro = microPalette.width - 10;
	y_micro = 10;
	x_macro = canvas.width - macroPalette.width;
	y_macro = 2;
	x_alpha = alphaPalette.width - 3;
	y_alpha = canvas.height - alphaPalette.height;

	pixel = ctx.getImageData(microPalette.width - 10,10,1,1);
	data = pixel.data;
	rgba = {r:data[0], g:data[1], b:data[2]};
	currentMicroColor.r = rgba.r;
	currentMicroColor.g = rgba.g;
	currentMicroColor.b = rgba.b;
	currentMicroColor.a = 1;

	drawPalettes();

	draw_shapes();
}

function drawPalettes() {
	drawMacroPalette();
	drawMicroPalette();
	drawAlphaPalette();
}

function draw_shapes() {
	drawMicroPalette();
	drawAlphaPalette();
	drawMacroPalette();

	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.fillRect(canvas.width - macroPalette.width, y_macro, macroPalette.width, 3);
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.fillRect(x_alpha, canvas.height - alphaPalette.height, 3, alphaPalette.height);
	ctx.closePath();
	
	var radius = 5;
	ctx.beginPath();
	ctx.arc(x_micro, y_micro, radius - 1, 0, 2 * Math.PI, false);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#000000';
	ctx.stroke();
	ctx.arc(x_micro, y_micro, radius, 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#ffffff';
	ctx.stroke();
	ctx.closePath();

	document.getElementById('content').style.backgroundColor = "rgb(" + currentMicroColor.r + ", " + currentMicroColor.g + ", " + currentMicroColor.b + ")";
	document.getElementById('content').style.opacity = (currentAlpha/255);
}

function generateMicroPaletteColors() {
	/*
		micro gradient: 
		255,255,255		decreases (value-macroValue)/255		-> macro color choice
		...					
		decreases value/255		-> each value decreases at different rates (value/255)
		...	
		0,0,0      		decreases (value-macroValue)/255		-> 0,0,0

	*/
	var gradientOrder = [];
	var leftValue = {r: 255, g: 255, b: 255};
	var rightValue = {r: currentMacroColor.r, g: currentMacroColor.g, b: currentMacroColor.b};
	var rightDifference = {r: rightValue.r/microPalette.height, g: rightValue.g/microPalette.height, b: rightValue.b/microPalette.height};
	var difference = {r: 0, g: 0, b: 0};

	for(var i = 0; i<microPalette.height; i++) {
		difference.r = (leftValue.r - rightValue.r)/microPalette.width;
		difference.g = (leftValue.g - rightValue.g)/microPalette.width;
		difference.b = (leftValue.b - rightValue.b)/microPalette.width;
		for(var j = 0; j<microPalette.width; j++) {
			gradientOrder.push([(leftValue.r - j*difference.r), (leftValue.g - j*difference.g), (leftValue.b - j*difference.b)]);
		}
		leftValue.r--;
		leftValue.b--;
		leftValue.g--;
		rightValue.r -= rightDifference.r;
		rightValue.g -= rightDifference.g;
		rightValue.b -= rightDifference.b;
	}

	return gradientOrder;
}

function drawMicroPalette() {
	var microPaletteImageData = ctx.createImageData(microPalette.width, microPalette.height);
	var data = microPaletteImageData.data;

	var microGradientOrder = generateMicroPaletteColors();

	var gradientCount = 0;
	var widthCount = 0;
	for(var i = 0; i<microPaletteImageData.data.length; i+=4) {
		//each row on the palette is the same color
		//data[i] through data[i+3] are for one pixel
		data[i]     = microGradientOrder[gradientCount][0]; // red
  		data[i + 1] = microGradientOrder[gradientCount][1]; // green
  		data[i + 2] = microGradientOrder[gradientCount][2]; // blue
  		data[i + 3] = currentAlpha;
	  	
	  	gradientCount++;
	}
	//console.log(data[data.length - 4]);
	ctx.putImageData(microPaletteImageData, 0, 0);
}

function drawAlphaPalette() {
	var alphaPaletteImageData = ctx.createImageData(alphaPalette.width, alphaPalette.height);
	var data = alphaPaletteImageData.data;

	var colCount = 0;
	var alphaStep = 0;
	for(var i = 0; i<alphaPaletteImageData.data.length; i+=4) {
		if((i/4)%alphaPalette.width === 0) {
	  		alphaStep = 1;
	  		colCount = 0;
	  	} else {
	  		alphaStep = colCount*(alphaPalette.width/255);
	  	}

		//data[i] through data[i+3] are for one pixel
		data[i]     = currentMacroColor.r; // red
  		data[i + 1] = currentMacroColor.g; // green
  		data[i + 2] = currentMacroColor.b; // blue
  		data[i + 3] = alphaStep;
	  	
	  	colCount++;
	  	if((i/4)%alphaPalette.width === 0) {
	  		alphaStep = 1;
	  		colCount = 0;
	  	} else {
	  		alphaStep = colCount*(alphaPalette.width/255);
	  	}
	}

	ctx.putImageData(alphaPaletteImageData, 0, microPalette.height);

	pixel = ctx.getImageData(x_micro,y_micro,1,1);
	data = pixel.data;
	currentMicroColor.r = data[0];
	currentMicroColor.g = data[1];
	currentMicroColor.b = data[2];
}

function generateMacroPaletteColors() {
	/* 
		gradient: 
		255, 0, 0 //red
		...
		255, 0 , 255 //purple
		...
		0, 0, 255 //blue
		...
		0, 255, 255 //cyan
		...
		0, 255, 0 //green
		...
		255, 255, 0 //yellow
		...
		255, 0, 0 //red
	*/

	var gradientOrder = [];
	var rvalue = 255; 
	var bvalue = 0;
	var gvalue = 0;
	var colorGap = (6*255)/macroPalette.height;
	for(var i = 0; i<255; i+=colorGap) {
		gradientOrder.push([rvalue, gvalue, bvalue]);
		bvalue+=colorGap;
	}

	for(var i = 0; i<252; i+=colorGap) {
		rvalue -= colorGap;
		gradientOrder.push([rvalue, gvalue, bvalue]);
	}

	for(var i = 0; i<255; i+=colorGap) {
		gvalue += colorGap;
		gradientOrder.push([rvalue, gvalue, bvalue]);
	}

	for(var i = 0; i<255; i+=colorGap) {
		bvalue -= colorGap;
		gradientOrder.push([rvalue, gvalue, bvalue]);
	}

	for(var i = 0; i<252; i+=colorGap) {
		rvalue += colorGap;
		gradientOrder.push([rvalue, gvalue, bvalue]);
	}

	for(var i = 0; i<252; i+=colorGap) {
		gvalue -= colorGap;
		gradientOrder.push([rvalue, gvalue, bvalue]);
	}

	return gradientOrder;
}

function drawMacroPalette() {
	var macroPaletteImageData = ctx.createImageData(macroPalette.width, macroPalette.height);
	var data = macroPaletteImageData.data;

	var gradientCount = 0;
	var widthCount = 0;
	for(var i = 0; i<macroPaletteImageData.data.length; i+=4*macroPalette.width) {
		//each row on the palette is the same color
		for(var j = 0; j<macroPalette.width*4; j+=4) {
			//data[i] through data[i+3] are for one pixel
			data[i + j]     = macroGradientOrder[gradientCount][0]; // red
	  		data[i + j + 1] = macroGradientOrder[gradientCount][1]; // green
	  		data[i + j + 2] = macroGradientOrder[gradientCount][2]; // blue
	  		data[i + j + 3] = 255;
	  	}
	  	gradientCount++;
	  	widthCount++;
	}
	ctx.putImageData(macroPaletteImageData, microPalette.width, 0);

	var pixel = ctx.getImageData(x_macro,y_macro,1,1);
	var data = pixel.data;
	currentMacroColor.r = data[0];
	currentMacroColor.g = data[1];
	currentMacroColor.b = data[2];
}


canvas.addEventListener('mousedown', function(evt) {
    // Track mouse movement on the canvas if the mouse button is down
    canvas.addEventListener('mousemove', changeData);
});

// On mouseup, clear the interval and unbind the mousemove event,
// it should only happen if the button is down
canvas.addEventListener('mouseup', function(e) {
	canvas.removeEventListener('mousemove', changeData);
});

function changeData(evt) {
	var x = evt.layerX;//mousePos.x;
	var y = evt.layerY;//mousePos.y;
	drawPalettes();
	if(x > canvas.width - macroPalette.width) {
		//click was choosing a macro color
		x_macro = x;
		y_macro = y;
		drawMacroPalette();
	} else if(x < microPalette.width && y < microPalette.height) {
		//then the click was choosing a micro color
		//need to draw dot under mouse pointer
		//need to change chosen color to color under bar
		x_micro = x;
		y_micro = y;
		drawMicroPalette();
	} else {
		//click was choosing alpha value
		//need to draw verticle bar under mouse pointer
		//need to change current alpha value to opacity under bar
		drawAlphaPalette();
		x_alpha = x;
		y_alpha = y;
		pixel = ctx.getImageData(x_alpha,y_alpha,1,1);
		data = pixel.data;
		currentAlpha = data[3];
		drawMicroPalette();
	}

	draw_shapes();
}




