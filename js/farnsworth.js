var correctOrder = ["color85", "color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9", "color10", "color11", "color12", "color13", "color14", "color15", "color16", "color17", "color18", "color19", "color20", "color21", "color22", "color23", "color24", "color25", "color26", "color27", "color28", "color29", "color30", "color31", "color32", "color33", "color34", "color35", "color36", "color37", "color38", "color39", "color40", "color41", "color42", "color43", "color44", "color45", "color46", "color47", "color48", "color49", "color50", "color51", "color52", "color53", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", "color3", ];
		
		function allowDrop(ev) {
		  ev.preventDefault();
		}
		
		function drag(ev) {
		  ev.dataTransfer.setData("text", ev.target.id);
		}
		
		function drop(ev) {
		  ev.preventDefault();
		  var data = ev.dataTransfer.getData("text");
		  ev.target.appendChild(document.getElementById(data));
		}
		
		function checkAnswers() {
		  var answers = document.querySelectorAll(".droptarget > div");
		  var answerOrder = [];
		  
		  for (var i = 0; i < answers.length; i++) {
			answerOrder.push(answers[i].getAttribute("data-color"));
		  }
		  
		  if (JSON.stringify(answerOrder) === JSON.stringify(correctOrder)) {
			alert("¡Respuesta correcta!");
		  } else {
			alert("Respuesta incorrecta. Intenta de nuevo.");
		  }
		}
			
		

		function allowDrop(ev) {
		  ev.preventDefault();
		}

		function drag(ev) {
		  ev.dataTransfer.setData("text", ev.target.id);
		}

		function drop(ev) {
		  ev.preventDefault();
		  var data = ev.dataTransfer.getData("text");
		  ev.target.appendChild(document.getElementById(data));
		}