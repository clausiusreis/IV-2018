var canvas, ctx;
var WIDTH, HEIGHT;
var points = [];
var running;
var canvasMinX, canvasMinY;
var doPreciseMutate;

var POPULATION_SIZE;
var ELITE_RATE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;

var mutationTimes;
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;

// $(function() {
//   init();
//   initData();
//   points = data200;
//   $('#addRandom_btn').click(function() {
//     addRandomPoints(50);
//     $('#status').text("");
//     running = false;
//   });
//   $('#start_btn').click(function() {
//     if(points.length >= 3) {
//       initData();
//       GAInitialize();
//       running = true;
//     } else {
//       alert("add some more points to the map!");
//     }
//   });
//   $('#clear_btn').click(function() {
//     running === false;
//     initData();
//     points = new Array();
//   });
//   $('#stop_btn').click(function() {
//     if(running === false && currentGeneration !== 0){
//       if(best.length !== points.length) {
//           initData();
//           GAInitialize();
//       }
//       running = true;
//     } else {
//       running = false;
//     }
//   });
// });
function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $('#canvas').width();
  HEIGHT = $('#canvas').height();
  setInterval(draw, 10);
  init_mouse();
}
function init_mouse() {
  $("canvas").click(function(evt) {
    if(!running) {
      canvasMinX = $("#canvas").offset().left;
      canvasMinY = $("#canvas").offset().top;
      $('#status').text("");

      x = evt.pageX - canvasMinX;
      y = evt.pageY - canvasMinY;
      points.push(new Point(x, y));
    }
  });
}
function initData() {
  running = false;
  POPULATION_SIZE = 30;
  ELITE_RATE = 0.3;
  CROSSOVER_PROBABILITY = 0.9;
  MUTATION_PROBABILITY  = 0.01;
  //OX_CROSSOVER_RATE = 0.05;
  UNCHANGED_GENS = 0;
  mutationTimes = 0;
  doPreciseMutate = true;

  bestValue = undefined;
  best = [];
  currentGeneration = 0;
  currentBest;
  population = []; //new Array(POPULATION_SIZE);
  values = new Array(POPULATION_SIZE);
  fitnessValues = new Array(POPULATION_SIZE);
  roulette = new Array(POPULATION_SIZE);
}
function distribucion(radio,attributos){
  var puntos=new Array(parseInt(attributos.length));
  // var radio=(parseFloat(BEST)+parseFloat(WORST))/2.0;
  var PI=3.14159;
  var b=parseFloat(360.0/parseFloat(attributos.length));
  // console.log("	NUM:"+num);
  var vector=new Array(attributos.length);
  for(i=0;i<parseInt(attributos.length);i++){
       var valor=(i)*parseFloat(b);
       var Radianes=(parseFloat(valor)*parseFloat(PI)/parseFloat(180.0));
       var x=Math.cos(parseFloat(Radianes))*parseFloat(radio)+200;
       var y=Math.sin(parseFloat(Radianes))*parseFloat(radio)+200;
       vector[i]={"id":attributos[i].indices,"text":attributos[i].text,"x":parseFloat((x)),"y":parseFloat((y))};
   }
  return vector;
}
function addRandomPoints(number) {
  running = false;
  var atributos=[]
  for(var i = 0; i<number; i++) {
    atributos.push({"indices":i,"text":i})
  }
  points=(distribucion(number,atributos))
}
function drawCircle(point) {
  ctx.fillStyle   = '#000';
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
function drawLines(array) {
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 1;
  ctx.beginPath();

  ctx.moveTo(points[array[0]].x, points[array[0]].y);
  for(var i=1; i<array.length; i++) {
    ctx.lineTo( points[array[i]].x, points[array[i]].y )
  }
  ctx.lineTo(points[array[0]].x, points[array[0]].y);

  ctx.stroke();
  ctx.closePath();
}
function draw() {
  if(running && currentGeneration <= 200) {
    GANextGeneration();
    $('#status').text("There are " + points.length + " cities in the map, "
                      +"the " + currentGeneration + "th generation with "
                      + mutationTimes + " times of mutation. best value: "
                      + ~~(bestValue));
  } else {
    $('#status').text("There are " + points.length + " Cities in the map. ")
  }
  clearCanvas();
  if (points.length > 0) {
    for(var i=0; i<points.length; i++) {
      drawCircle(points[i]);
    }
    if(best.length === points.length) {
      drawLines(best);
    }
  }
}
function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// function VarianceReordering(){
//
//   flagOrder=0;
//   //console.log("INFORMACION DE LOS PUNTOS DE CONTROL");
//   //console.log(MYCONTROLPOINTS);
//
//   var distancia=GetPureSimilarityMatrix(MYCONTROLPOINTS,osDados);
//   var points=MYCONTROLPOINTS;
//
//   initData();
//   GAInitialize(distancia,points);
//
//   for(i=0;i<100;i++){
//       GANextGeneration();
//   }
//
//   var BestOrder=best;
//   //hallamos las mejores distancias
//   var BestDistances=new Array();
//
//   for(i=0;i<MYCONTROLPOINTS.length-1;i++){
//      BestDistances.push(distancia[i][i+1]);
//   }
//
//   BestDistances.push(distancia[MYCONTROLPOINTS.length-1][0]);
//
//   var sum=0; BestDistances.forEach(function(f){sum+=f;});
//   var scale=d3.scale.linear().domain([0,sum]).range([0,360]);
//   BestDistances.forEach(function(f,i){BestDistances[i]=scale(f);});
//
//   var Auxiliar=new Array();
//   BestOrder.forEach(function(d){Auxiliar.push(MYCONTROLPOINTS[parseInt(d)])});
//   distribucionLocal(Auxiliar,BestDistances);
//   MYCONTROLPOINTS=new Array();
//   MYCONTROLPOINTS=Auxiliar;
//   //StarCoordinatesRender();
//
// }
