var lastCoords;
			document.addEventListener("touchmove", function(event) { event.preventDefault(); } );
			
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext('2d');
			
			var cursorRadius = 20;
			
			var min = Math.min(window.innerWidth, window.innerHeight) - 20;
			var padding = cursorRadius / 2 + 10;
			
			ctx.canvas.width = ctx.canvas.height = min;
		
			
			var triad = {
			  first : {
				x : min - padding,
				y : getHeight(min) - padding
			  },
			  second : {
				x : padding,
				y : getHeight(min) - padding
			  },
			  third : {
				x : min / 2,
				y : padding
			  }
			};

			var point = {
				x : -1,
				y : -1
			};
			
			insideData = {
				x: 0.33,
				y: 0.33,
				z: 0.34
			}
			
			function drawTriangle()
			{
				
				ctx.shadowColor = '#000';
			  
				
				ctx.shadowBlur = 6;
				ctx.shadowOffsetX = 1;
				ctx.shadowOffsetY = 1;
				ctx.beginPath();
			  
				ctx.moveTo(triad.first.x, triad.first.y);
				ctx.lineTo(triad.second.x, triad.second.y);
				ctx.lineTo(triad.third.x, triad.third.y);
			  
				ctx.moveTo(triad.third.x, triad.third.y);
				ctx.lineTo(triad.first.x, triad.first.y);
				
				ctx.fillStyle = calculateFillColour(false);
				ctx.fill();
				
				//ctx.shadowColor = rgba(0,0,0,0)
				ctx.shadowBlur = 0
				ctx.shadowOffsetX = 0
				ctx.shadowOffsetY = 0
			}

			var checkIfInside = function(p, p1, p2, p3) {
				//var p1 = triad.first, p2 = triad.second, p3 = triad.third;

				//Can be calculated only once:
				var denom = (p1.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y);

				//These will be continously calculated
				var pResults = {
					x: (p.x - p3.x),
					y: (p.y - p3.y)
				};

				//The rest of these can be cached if the triangle never moves
				var a = ((p2.y - p3.y) * pResults.x + (p3.x - p2.x) * pResults.y) / denom;
				var b = ((p3.y - p1.y) * pResults.x + (p1.x - p3.x) * pResults.y) / denom;
				var c = 1.0 - a - b;

				//Test whether or not a, b and c are between 0 and 1 inclusive.
				var aNormalized = (0 <= a && a <= 1);
				var bNormalized = (0 <= b && b <= 1);
				var cNormalized = (0 <= c && c <= 1);

				if(aNormalized && bNormalized && cNormalized)
				{
					return { x : a, y : b, z : c };
				}
				else
				{
					return null;
				}
			};

			var insideData;
			
			var canvasDrag = function(ev)
			{				
				var x = ev.changedTouches[0].pageX - canvas.offsetLeft;
				var y = ev.changedTouches[0].pageY - canvas.offsetTop;
				
			  //ev.clientX -= canvas.offsetLeft;
			  //ev.clientY -= canvas.offsetTop;
			  
				insideData = checkIfInside({ "x" : x, "y" : y }, triad.first, triad.second, triad.third);
				
				if(insideData != null)
					point.x = x,
					point.y = y;
				else
					console.log("didn't move. outside");

				//console.log(insideData.x * 100 + ", " + insideData.y * 100 + ", " + insideData.z * 100 + " :: " + (insideData.x + insideData.y + insideData.z));
				
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				draw();
			}
			
			var canvasDragEnd = function(ev)
			{
				resizeBar();
				var x = ev.changedTouches[0].pageX - canvas.offsetLeft;
				var y = ev.changedTouches[0].pageY - canvas.offsetTop;
				
				if(checkIfInside(point, triad.first, triad.second, triad.third))
					console.log("inside");
				else
					console.log("outside");
				
				
			}

			function drawPoint()
			{
				if(point.x == -1 && point.y == -1)
					return;
					
				ctx.beginPath();
				ctx.fillStyle = calculateFillColour(true);
				ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI, false);
				ctx.fill();
			}
			function resizeBar(){
				document.getElementById("red").style.width =  Math.round(99 * lastCoords.x)+"%";
				document.getElementById("green").style.width =  Math.round(99 * lastCoords.y)+"%";
				document.getElementById("blue").style.width =  Math.round(99 * lastCoords.z)+"%";
			}
			function calculateFillColour(xor)
			{
				//triad.first = red
				//triad.second = green
				//triad.third = blue

				
				var a;
				
				if(!xor)
				{
					a =  "rgb(" + Math.round(255 * lastCoords.x) + ", " + 
								Math.round(255 * lastCoords.y) + ", " + 
								Math.round(255 * lastCoords.z) + ")";
				}
				else
				{
					a =  "rgb(" + (Math.round(255 * lastCoords.x) ^ 255) + ", " + 
								(Math.round(255 * lastCoords.y)  ^ 255) + ", " + 
								(Math.round(255 * lastCoords.z) ^ 255) + ")";
				}
				
				console.log(a + ", " + xor);
				
				return a;
				
			}
			
			function draw() {
			  canvas.addEventListener('touchmove', canvasDrag, false);
			  //canvas.addEventListener('touchbegin', canvasDrag, false);
			  canvas.addEventListener('touchend', canvasDragEnd, false);
			  if(insideData){
					lastCoords = insideData;
				}
			  drawTriangle();
			  drawPoint();
			  
			}

			draw();	
			
			function getHeight(num){
				return Math.sqrt(Math.pow(num,2) - Math.pow(num/2, 2));
			}


var app = angular.module("app", ["firebase"]);

app.controller("BlahCtrl", function($scope, $firebase) {
  $scope.ref = new Firebase("https://interactive-lecture.firebaseio.com/data");

  $scope.sendData = function(e){
		e.preventDefault();
		//alert("hello");
	  	var kid = $scope.ref.child("Test");
	  	kid.push(lastCoords);
};
});

