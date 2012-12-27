function FacesController($scope) {
  
  var c=document.getElementById("faceCanvas");
  var ctx=c.getContext("2d");
  var CanvasWidth = 400;
  var CanvasHeight = 400;
  var headHeight = CanvasHeight / 100 * 65; //percentage go canvase used for head
  var headCenterY =  headHeight/2 + (CanvasHeight-headHeight) / 2;

  // Set canvas dimensions
  c.width = CanvasWidth;
  c.height = CanvasHeight;




  // Variables
  // Most values are a percentage based on the Head's total height

  // Line Width
  var faceOutlineWidth = headHeight / 40;
  var noseLineWidth = headHeight / 65;
  var mouthLineWidth = headHeight / 40;
  var eyeBrowLineWidth = headHeight / 40;


  // min and max values in percent of total head height
  var headWidthRange = [65,95];

  // Eyes
  var eyePositionRange = [30,50];
  var eyeDistaneRange = [25,36];
  var eyeSizeRange = [1,4];

  // Eyebrows
  var eyeBrowsangleRange = [-10,10]; // Smiley or Frowney?
  var eyeBrowsWidthRange = [10,25];
  var eyeBrowsGapRange = [1,25];
  var eyeBrowsStrengthRange = [0.5,2];
  var eyeBrowsOffsetRange = [-3,-15]; // Above Eye, relative to eyebrow length

  // Nose
  var nosePositionRange = [53,70];
  var noseWidthRange = [3,20];

  // Mouth
  var mouthPositionRange = [73,90];
  var mouthWidthRange = [8,30];
  var mouthLowerWidthRange = [0.2,0.6]; // relative to the mouth width
  var mouthAngleRange = [-5,5];

  //Background
  var backgroundColors = [
    '#490A3D',
    '#BD1550',
    '#E97F02',
    '#F8CA00',
    '#8A9B0F',
    '#547980',
    '#9E8C89',
    '#BD657B',
    '#027ABB',
    '#EC9439',
    '#7F1416'
  ]














  $scope.fillCanvas = function() {

    var color = backgroundColors[Math.floor(Math.random()*backgroundColors.length)];
    // set background colour
    ctx.fillStyle=color;

    // fill entire canvas
    ctx.fillRect(0,0,CanvasWidth,CanvasHeight);

  }


  $scope.convertCanvasToImage = function() {
    return c.toDataURL("image/png");
  }

  


  $scope.drawHead = function(wideness,topColor,bottomColor) {

    // calculating face wideness based on wideness paramter and preset headWidthRange
    var headWidth = $scope.rangeValue(true, headWidthRange, wideness);

    // Create gradient top to bottom
    var grd=ctx.createLinearGradient(0,0,0,500);
    grd.addColorStop(0,topColor);
    grd.addColorStop(1,bottomColor);


    //draw a circle
    ctx.beginPath();

    for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
      xPos = CanvasWidth/2 - (headWidth/2 * Math.cos(i)) * Math.cos(0 * Math.PI);
      yPos = headCenterY + (headHeight/2 * Math.sin(i)) * Math.cos(0 * Math.PI);

      if (i == 0) {
          ctx.moveTo(xPos, yPos);
      } else {
          ctx.lineTo(xPos, yPos);
      }
    }

    //ctx.arc(CanvasWidth/2, CanvasHeight/2, 200, 0, Math.PI*2, true); 
    ctx.closePath();

    // Fill with gradient
    ctx.fillStyle=grd;
    ctx.fill();


    // Draw the outline
    ctx.lineWidth=faceOutlineWidth;
    ctx.strokeStyle='black';
    ctx.stroke();



    //draw a circle
    ctx.beginPath();

    for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
      xPos = CanvasWidth/2*0.98 - ((headWidth*0.94)/2 * Math.cos(i)) * Math.cos(0 * Math.PI);
      yPos = headCenterY*0.98 + ((headHeight*0.94)/2 * Math.sin(i)) * Math.cos(0 * Math.PI);

      if (i == 0) {
          ctx.moveTo(xPos, yPos);
      } else {
          ctx.lineTo(xPos, yPos);
      }
    }

    //ctx.arc(CanvasWidth/2, CanvasHeight/2, 200, 0, Math.PI*2, true); 
    ctx.closePath();

    // Fill with gradient
    ctx.fillStyle='rgba(255,255,255,0.2)';
    ctx.fill();






  }



  $scope.drawEyeBrows = function(eyePosition, gap, offSet, width, strength, angle) {

    //calculating values for drawing
    var eyeBrowOffset = $scope.rangeValue(true, eyeBrowsOffsetRange, offSet);
    var eyeBrowWidth = $scope.rangeValue(true, eyeBrowsWidthRange, width);
    var eyeBrowGap = $scope.rangeValue(true, eyeBrowsGapRange, gap);
    var eyeBrowStrength = $scope.rangeValue(false, eyeBrowsStrengthRange, strength);
    var eyeBrowAngle = $scope.rangeValue(false, eyeBrowsangleRange, angle);
    var eyeBrowPosition = eyePosition + eyeBrowOffset;

    ctx.beginPath();
    ctx.moveTo(CanvasWidth/2-eyeBrowWidth-eyeBrowGap/2, eyeBrowPosition-eyeBrowWidth/100*eyeBrowAngle);
    ctx.lineTo(CanvasWidth/2-eyeBrowGap/2, eyeBrowPosition);
    ctx.moveTo(CanvasWidth/2+eyeBrowWidth+eyeBrowGap/2, eyeBrowPosition-eyeBrowWidth/100*eyeBrowAngle);
    ctx.lineTo(CanvasWidth/2+eyeBrowGap/2, eyeBrowPosition);
    ctx.closePath();

    // Draw the outline
    ctx.lineWidth=eyeBrowLineWidth*eyeBrowStrength;
    ctx.strokeStyle='black';
    ctx.stroke();
    
  } 


  $scope.rangeValue = function(base, range, percentage) {

    // returns a value from a range between min and max based on a percentage
    if (base == true) {
      return headHeight / 100 * ((range[1]-range[0]) / 100 * percentage + range[0]);
    } else {
      return (range[1]-range[0]) / 100 * percentage + range[0];
    }

  }






  $scope.drawEyes = function(position, distance, size) {

    //calculating values for drawing
    var eyeSize = $scope.rangeValue(true, eyeSizeRange, size);
    var eyeDistance = $scope.rangeValue(true, eyeDistaneRange, distance);
    var eyePosition = $scope.rangeValue(true, eyePositionRange, position) + (CanvasHeight - headHeight) / 2;




    //draw a circle
    ctx.beginPath();


    ctx.arc(CanvasWidth/2-eyeDistance/2, eyePosition, eyeSize, 0, Math.PI*2, true); 
    ctx.arc(CanvasWidth/2+eyeDistance/2, eyePosition, eyeSize, 0, Math.PI*2, true); 
    ctx.closePath();

    // Fill
    ctx.fillStyle='black';
    ctx.fill();


    $scope.drawEyeBrows(eyePosition,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100);

  }




  $scope.drawNose = function(position, width) {


    //calculating values for drawing
    var noseWidth = $scope.rangeValue(true, noseWidthRange, width);
    var nosePosition = $scope.rangeValue(true, nosePositionRange, position) + (CanvasHeight - headHeight) / 2;




    //draw a circle
    ctx.beginPath();


    ctx.moveTo(CanvasWidth/2-noseWidth/2, nosePosition);
    ctx.lineTo(CanvasWidth/2+noseWidth/2, nosePosition);
    ctx.closePath();

    // Draw the outline
    ctx.strokeStyle='rgba(0,0,0,0.5)';
    ctx.lineWidth=noseLineWidth;
    ctx.stroke();
  }  



  $scope.drawMouth = function(position, width, lowerWidth, angle) {


    //calculating values for drawing
    var mouthAngle = $scope.rangeValue(false, mouthAngleRange, angle);
    var mouthWidth = $scope.rangeValue(true, mouthWidthRange, width);
    var mouthPosition = $scope.rangeValue(true, mouthPositionRange, position) + (CanvasHeight - headHeight) / 2;
    var mouthLowerWidth = $scope.rangeValue(false, mouthLowerWidthRange, lowerWidth);





    //draw a circle
    ctx.beginPath();
    ctx.moveTo(CanvasWidth/2-mouthWidth/2, mouthPosition-mouthWidth/100*mouthAngle);
    ctx.lineTo(CanvasWidth/2+mouthWidth/2, mouthPosition);
    ctx.closePath();

    // Draw the outline
    ctx.lineWidth=mouthLineWidth;
    ctx.strokeStyle='red';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(CanvasWidth/2-(mouthWidth/2 * mouthLowerWidth), mouthPosition+mouthLineWidth*2-mouthLowerWidth/100*mouthAngle);
    ctx.lineTo(CanvasWidth/2+(mouthWidth/2 * mouthLowerWidth), mouthPosition+mouthLineWidth*2);
    ctx.closePath();

    // Draw the outline
    ctx.lineWidth=mouthLineWidth;
    ctx.strokeStyle='rgba(0,0,0,0.2)';
    ctx.stroke();

    
  }  


  $scope.createNewFace = function() {

    $scope.fillCanvas();

    $scope.drawHead(Math.random()*100,'#FFEEDD','#FFDDBB');

    $scope.drawEyes(Math.random()*100,Math.random()*100,Math.random()*100);

    $scope.drawNose(Math.random()*100,Math.random()*100);

    $scope.drawMouth(Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100);

  }





  //Collection
  $scope.faces = [];

  for (var i = 0; i < 30; i++ ) {

    $scope.createNewFace();
    $scope.faces[i] = $scope.convertCanvasToImage();
    
  }


}