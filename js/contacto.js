function validar()
{
	let nombre = document.getElementById('inputname').value;
	let apellido = document.getElementById('inputapellido').value;
	let email= document.getElementById('inputmail').value;
	let asunto= document.getElementById('inputtel').value;
	let mensaje= document.getElementById('inputmensaje').value;

	if (nombre== ""){
    alert ("Ingrese el nombre");
    }
    
    else{

		if (apellido== ""){
    	alert ("Ingrese el apellido");
    	
    	}
    	else{
    		if (email== ""){
   			 alert ("Ingrese el E-mail")
   			 }

   			else{
   				if (asunto== ""){
   				alert ("Ingrese el número de telefono")
   				}
   				

   				else{
   					if (mensaje== ""){
   					 alert ("Ingrese el mensaje")
   					 }
   					 

   					else{ 
   						alert ("Gracias por comunicarte con nosotros, pronto estaremos en contacto con usted.");
   						}

   					}
   					
   				}
   			}
   		}	
   	}


  			
   		
   		



if (true) {} else {}