function FacesController($scope) {


  $scope.totalFaces = 0;
  


  // ----------------Init QS SDK -----------------------------------------------
  var qs = false;


  $scope.initQS = function() {
    QS.setup().then(function (initializedQs) {
      qs = initializedQs;
      qs.retrievePlayerInfo().then(function (player) {
        $scope.playerName = player.name;
        $scope.$apply();
      });
      qs.retrievePlayerData().then(function (data) {
        if (data.totalFaces) {
          $scope.totalFaces = data.totalFaces;
        }
        $scope.$apply();
      });
    })
  
  }



  // ---------------- Environment Values and Settings --------------------------
  
  var c = document.createElement("canvas");
  var ctx=c.getContext("2d");
  var CanvasWidth = 600;
  var CanvasHeight = 600;
  var headHeight = CanvasHeight / 100 * 75; //percentage go canvase used for head
  var headCenterY =  headHeight/2 + (CanvasHeight-headHeight) / 2;
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  // Set canvas dimensions
  c.width = CanvasWidth;
  c.height = CanvasHeight;

  //center row of faces vertically on larger screens
  if (windowHeight > 530) {
    $("#facesList").css("margin-top",(windowHeight-530)/2+"px");
  }

  // determine number of faces to show based on window with
  var facesCount = Math.floor(windowWidth / 350);



  // ---------------- Faces Parameters --------------------------
  // Most values are a percentage based on the headHeight

  // Lines Width
  var faceOutlineWidth = headHeight / 25;
  var noseLineWidth = headHeight / 55;
  var mouthLineWidth = headHeight / 30;
  var eyeBrowLineWidth = headHeight / 35;

  // Head Shape
  var headWidthRange = [65,95];

  // Eyes
  var eyePositionRange = [30,50];
  var eyeDistaneRange = [15,36];
  var eyeSizeRange = [1,4];

  // Eye Brows
  var eyeBrowsangleRange = [-10,10]; // Smiley or Frowney?
  var eyeBrowsWidthRange = [12,25];
  var eyeBrowsGapRange = [1,20];
  var eyeBrowsStrengthRange = [0.7,3];
  var eyeBrowsOffsetRange = [-3,-15]; // Above Eye, relative to eyebrow length

  // Nose
  var nosePositionRange = [53,67];
  var noseWidthRange = [3,20];

  // Mouth
  var mouthPositionRange = [70,88];
  var mouthWidthRange = [8,30];
  var mouthLowerWidthRange = [0.2,0.6]; // relative to the mouth width
  var mouthAngleRange = [-5,5];

  // Background Color
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
    '#7F1416'
  ]

  // Skin Tones
  var skinColors = [
    '#fae3ca',
    '#fae3ca',
    '#fae3ca',
    '#fae3ca',
    '#ac8a62',
    '#d2c0aa',
    '#854f39',
    '#faf8ca'
  ]

  // Watermark
  var watermark = "SimplyDo.com";



  // --------------------- Helper Functions ----------------------------

  $scope.convertCanvasToImage = function() {
    return c.toDataURL("image/png");
  }

  $scope.rangeValue = function(base, range, percentage) {

    // returns a value from a range between min and max based on a percentage
    if (base == true) {
      return headHeight / 100 * ((range[1]-range[0]) / 100 * percentage + range[0]);
    } else {
      return (range[1]-range[0]) / 100 * percentage + range[0];
    }

  }

  $scope.setUpTiles = function(number) {

    $scope.faces = [];

    for (var i = 0; i < number; i++ ) {

      $scope.createNewFace();
      $scope.faces[i] = {'src':$scope.convertCanvasToImage()};
      
    }

  }



  // --------------------- Drawing Functions ----------------------------

  $scope.createNewFace = function() {

    // reset the canvas and render each element
    $scope.resetCanvas();
    $scope.drawHead(Math.random()*100,'#FFEEDD','#FFDDBB');
    $scope.drawEyes(Math.random()*100,Math.random()*100,Math.random()*100);
    $scope.drawNose(Math.random()*100,Math.random()*100);
    $scope.drawMouth(Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100);

    // increase the count of faces created
    $scope.totalFaces++;
    if (qs != false) {
      qs.setPlayerData('totalFaces', $scope.totalFaces);
    }

  }

  $scope.resetCanvas = function() {

    // set background colour
    ctx.fillStyle=backgroundColors[Math.floor(Math.random()*backgroundColors.length)];

    // fill entire canvas
    ctx.fillRect(0,0,CanvasWidth,CanvasHeight);

    // add water mark
    ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.font = "bold "+ CanvasWidth/25 +"px sans-serif";  
    ctx.fillText(watermark, CanvasWidth/20, CanvasHeight-CanvasHeight/20);

  }

  $scope.drawHead = function(wideness,topColor,bottomColor) {

    // calculating face wideness based on wideness paramter and preset headWidthRange
    var headWidth = $scope.rangeValue(true, headWidthRange, wideness);

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

    ctx.closePath();

    // Fill with random skin colour
    ctx.fillStyle=skinColors[Math.floor(Math.random()*skinColors.length)];
    ctx.fill();

    // Draw the outline
    ctx.lineWidth=faceOutlineWidth;
    ctx.strokeStyle='black';
    ctx.stroke();

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

    // Draw the brows
    ctx.lineWidth=eyeBrowLineWidth*eyeBrowStrength;
    ctx.strokeStyle='black';
    ctx.stroke();
    
  }

  $scope.drawEyes = function(position, distance, size) {

    //calculating values for drawing
    var eyeSize = $scope.rangeValue(true, eyeSizeRange, size);
    var eyeDistance = $scope.rangeValue(true, eyeDistaneRange, distance);
    var eyePosition = $scope.rangeValue(true, eyePositionRange, position) + (CanvasHeight - headHeight) / 2;

    ctx.beginPath();
    ctx.arc(CanvasWidth/2-eyeDistance/2, eyePosition, eyeSize, 0, Math.PI*2, true); 
    ctx.arc(CanvasWidth/2+eyeDistance/2, eyePosition, eyeSize, 0, Math.PI*2, true); 
    ctx.closePath();

    // Fill
    ctx.fillStyle='black';
    ctx.fill();

    // draw eye brows (require position of eyes)
    $scope.drawEyeBrows(eyePosition,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100);

  }

  $scope.drawNose = function(position, width) {

    //calculating values for drawing
    var noseWidth = $scope.rangeValue(true, noseWidthRange, width);
    var nosePosition = $scope.rangeValue(true, nosePositionRange, position) + (CanvasHeight - headHeight) / 2;

    ctx.beginPath();
    ctx.moveTo(CanvasWidth/2-noseWidth/2, nosePosition);
    ctx.lineTo(CanvasWidth/2+noseWidth/2, nosePosition);
    ctx.closePath();

    // Draw the nose
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


    // Upper lip
    ctx.beginPath();
    ctx.moveTo(CanvasWidth/2-mouthWidth/2, mouthPosition-mouthWidth/100*mouthAngle);
    ctx.lineTo(CanvasWidth/2+mouthWidth/2, mouthPosition);
    ctx.closePath();

    ctx.lineWidth=mouthLineWidth;
    ctx.strokeStyle='red';
    ctx.stroke();

    // lower lip
    ctx.beginPath();
    ctx.moveTo(CanvasWidth/2-(mouthWidth/2 * mouthLowerWidth), mouthPosition+mouthLineWidth*2-mouthLowerWidth/100*mouthAngle);
    ctx.lineTo(CanvasWidth/2+(mouthWidth/2 * mouthLowerWidth), mouthPosition+mouthLineWidth*2);
    ctx.closePath();

    ctx.lineWidth=mouthLineWidth;
    ctx.strokeStyle='rgba(0,0,0,0.2)';
    ctx.stroke();
    
  }



  // --------------------- Init ----------------------------

  $scope.setUpTiles(facesCount);




}