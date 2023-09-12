var contador = 1;
var contadorcorrecta = 0;
var respuestacorrecta = "12";
var respuestaincorrecta = "distingo";

document.getElementById("npregunta").innerHTML= contador;

function bien(id)
{
	document.getElementById("btnsiguiente").style.display = "block";
	
	document.getElementById("npregunta").innerHTML= contador;
	document.getElementById("btn1").disabled = true;
	document.getElementById("btn2").disabled = true;
	document.getElementById("btn3").disabled = true;
	document.getElementById("btn4").disabled = true;
	document.getElementById("btn5").disabled = true;

	if (respuestacorrecta == document.getElementById(id).innerHTML)
	{
		contadorcorrecta = contadorcorrecta + 1;
		document.getElementById("contadorcorrecta").innerHTML=contadorcorrecta;

		localStorage.correctas = contadorcorrecta;
	}
} 
function campregunta()

{
/*Preguntas*/
		contador = contador + 1;
	if (contador == 2) {
		document.getElementById("imgpregunta").src="img/test2.png";
		document.getElementById("btn1").innerHTML="10";
		document.getElementById("btn2").innerHTML="15";
		document.getElementById("btn3").innerHTML="9";
		document.getElementById("btn4").innerHTML="No distingo ningún número";
		document.getElementById("btn5").innerHTML="Ninguno de los anteriores";
		respuestacorrecta= "15";
	}

	if (contador == 3) {
		document.getElementById("imgpregunta").src="img/test3.jpg";
		document.getElementById("btn1").innerHTML="96";
		document.getElementById("btn2").innerHTML="36";
		document.getElementById("btn3").innerHTML="5";
		document.getElementById("btn4").innerHTML="No distingo ningún número";
		document.getElementById("btn5").innerHTML="Ninguno de los anteriores";
		respuestacorrecta= "5";
	}

		if (contador == 4) {
		document.getElementById("imgpregunta").src="img/test4.jpg";
		document.getElementById("btn1").innerHTML="74";
		document.getElementById("btn2").innerHTML="2";
		document.getElementById("btn3").innerHTML="15";
		document.getElementById("btn4").innerHTML="No distingo ningún número";
		document.getElementById("btn5").innerHTML="Ninguno de los anteriores";
		respuestacorrecta= "2";
	}

		if (contador == 5) {
		document.getElementById("imgpregunta").src="img/test5.jpg";
		document.getElementById("btn1").innerHTML="6";
		document.getElementById("btn2").innerHTML="8";
		document.getElementById("btn3").innerHTML="9";
		document.getElementById("btn4").innerHTML="No distingo ningún número";
		document.getElementById("btn5").innerHTML="Ninguno de los anteriores";
		respuestacorrecta= "6";
	}
	if (contador == 6)
	{
		document.getElementById("btn1").disabled = true;
		document.getElementById("btn2").disabled = true;
		document.getElementById("btn3").disabled = true;
		document.getElementById("btn4").disabled = true;
		document.getElementById("btn5").disabled = true;
		document.getElementById("btnsiguiente").style.display = "none";
		document.getElementById("btnres").style.display = "block";
		
	}

	else
	{
		document.getElementById("btn1").disabled = false;
		document.getElementById("btn2").disabled = false;
		document.getElementById("btn3").disabled = false;
		document.getElementById("btn4").disabled = false;
		document.getElementById("btn5").disabled = false;

		document.getElementById("btnsiguiente").style.display = "none";

	}
}
	function resultados()
		{


			if (contadorcorrecta == 5)
		{
			swal({
	 		 title: "Distinguiste los 5 números:",
	 		 text: "Eso quiere decir que es muy poco probable que padezcas daltnismo, cualquier duda consulte con un profesional. ",
			  icon: "success",
					});
		}
		if (contadorcorrecta == 4)
		{
			swal({
	 		 title: "Distinguiste 4 números:",
	 		 text: "Eso quiere decir que es muy poco probable que padezcas daltnismo, cualquier duda consulte con un profesional. ",
			  icon: "succes",
					});
		}
		if (contadorcorrecta == 3)
		{
			swal({
	 		 title: "Distinguiste 3 números:",
	 		 text: "Eso quiere decir que podrias llegar a padecer una ausencia parcial de algún color. Recomendamos consultar a un oftalmólogo",
			  icon: "warning",
					});
		}
		if (contadorcorrecta == 2)
		{
			swal({
	 		 title: "Distinguiste 2 números:",
	 		 text: "Eso quiere decir que podrias llegar a padecer una ausencia parcial de algún color. Recomendamos consultar a un oftalmólogo",
			  icon: "warning",
					});
		}

		if (contadorcorrecta == 1)
		{
			swal({
	 		 title: "Distinguiste 1 número:",
	 		 text: "Eso quiere decir que podrias llegar a padecer ausencia de algún color. Recomendamos consultar a un oftalmólogo",
			  icon: "warning",
					});
		}
		if (contadorcorrecta == 0)
		{
			swal({
	 		 title: "No distinguiste ningún número:",
	 		 text: "Eso quiere decir que podrias llegar a padecer ausencia de colores. Recomendamos consultar a un oftalmólogo",
			  icon: "warning",
					});
		}
	}
