var contadorcorrecta = localStorage.correctas;
function respuestas_corrrctas() {
	
	document.getElementById("h2correctas").innerHTML=contadorcorrecta;
}
respuestas_corrrctas()

if (contadorcorrecta == 5)
{
	document.getElementById("dis5").style.display="block"
}
if (contadorcorrecta == 4)
{
	document.getElementById("dis4").style.display="block"
}
if (contadorcorrecta == 3)
{
	document.getElementById("dis3").style.display="block"
}
if (contadorcorrecta == 2)
{
	document.getElementById("dis3").style.display="block"
}

if (contadorcorrecta == 1)
{
	document.getElementById("dis3").style.display="block"
}
if (contadorcorrecta == 0)
{
	document.getElementById("dis3").style.display="block"
}

