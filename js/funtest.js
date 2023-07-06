

var correctOrder = ["color85", "color1", "color2", "color3", "color4", "color5", "color6",
 "color7", "color8", "color9", "color10", "color11", "color12", "color13", "color14",
  "color15", "color16", "color17", "color18", "color19", "color20", "color21", "color22",
  "color23", "color24", "color25", "color26", "color27", "color28", "color29", "color30",
  "color31", "color32", "color33", "color34", "color35", "color36", "color37", "color38",
  "color39", "color40", "color41", "color42", "color43", "color44", "color45", "color46",
 "color47", "color48", "color49", "color50", "color51", "color52", "color53", "color54", 
 "color55", "color56", "color57", "color58", "color59", "color60", "color61", "color62", "color63",
 "color64", "color65", "color66", "color67", "color68", "color69", "color70", "color71", "color72",
  "color73", "color74", "color75", "color76", "color77", "color78", "color79", "color80", "color81", "color82", "color83",
 "color84" ];


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
var contador = 0;
var contadorcomp = contador;
var elementDropped = false;

function drop(ev) {
  
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  var elementDropped = true;
  var match = data.match(/color(\d+)/);
  if (match) {
    var number = match[1];
    var dropzoneId = event.target.id;
    var dropzoneNumberMatch = dropzoneId.match(/drop(\d+)/);
    if (dropzoneNumberMatch) {
      var dropzoneNumber = dropzoneNumberMatch[1];
      console.log(number);
      console.log(dropzoneNumber);
    }
  }
  if (number!==dropzoneNumber) {
    contador = contador + 1;
    console.log(contador)
  
}
var data2 = document.getElementById(data)

data2.addEventListener("dragstart", function(event) {
  
  event.dataTransfer.setData("text/plain", data2.draggable);
});

data2.addEventListener("dragend", function(event) {

  data2.draggable = false;
});

data2.addEventListener("drop", function(event) {
  event.preventDefault();
});

data2.addEventListener("dragover", function(event) {
  event.preventDefault();
});

};





document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.color');
  const dropzones = document.querySelectorAll('.drop');
  const ordenarBtn = document.getElementById('ordenar-btn');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
  });

  ordenarBtn.addEventListener('click', ordenar);

  function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function drop(e) {
    e.preventDefault();
    const draggableId = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(draggableId);
    const dropzone = e.target;

    if (dropzone.classList.contains('drop')) {
      dropzone.appendChild(draggable);
    }
  }

  function ordenar() {
    contador = 0;

    const sortedDraggables = Array.from(draggables).sort((a, b) => {
      const orderA = parseInt(a.getAttribute('data-order'));
      const orderB = parseInt(b.getAttribute('data-order'));
      return orderA - orderB;
    });

    sortedDraggables.forEach((draggable, index) => {
      const dropzone = dropzones[index];
      dropzone.appendChild(draggable);
    });
  }
});
function verificar() {
  
    
  if (contador >= 1) {
    alert("Incorrecto, se equivoco en: " + contador )
    location. reload()
  
  } else {
    alert("Correcto")
   
  }
}


