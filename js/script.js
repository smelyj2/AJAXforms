
function chckMyForm(){
	
var	errors_list = []; // for errors
var elem; //  element on the form
var elemsName; // name of the element 
var value; // the value entered in a form element
var type; //  form elements type attribute

	
	// I pass all the elements of the form
	for (var i = 0; i < myForm.elements.length; i++){
		elem = myForm.elements[i];	
		elemsName = elem.nodeName.toLowerCase();		
		value = elem.value;
	
	
		// INPUT validation on form
		if (elemsName == "input") {
			type = elem.type.toLowerCase();
			
			// sort out all types of INPUT attributes
			switch (type) {
				
				case "text" :
					if (elem.name == "name" && value == "" || elem.name == "name" && value.length < 3) errors_list.push(1); 
					break; 
									 
				case "email" :
					
					var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
					var myMail = elem.value;
					var valid = re.test(myMail);
					if(!valid){
						errors_list.push(2)
					}
					break;
					
				case "password" :
					if (elem.name == "pass" && value == "") errors_list.push(3); 
					 break; 
				 
				case "checkbox" :
					if (!elem.checked) errors_list.push(4);
					break;
			}	
			
			
		}	
		
		//check the select
		if(elemsName == "select") { 
			if (value == 0) errors_list.push(5);
		} 
		
		
	}

	
		if (!errors_list.length) {
			return true;
		}else{
			return false;
		} 
	
	
}


	
// sending the form data to the server and error handling
function senddata(event) {
		event.preventDefault(); 
		
		console.log(chckMyForm());
	
		
		//If the form is completed correctly then sends a request	
		if(chckMyForm){	
			var msg = $('#myForm').serialize();
			$.ajax({
				type: 'POST',
				url: 'http://codeit.pro/frontTestTask/user/registration',
				data: msg,
				success: function(data) {
					var res = JSON.parse(data);
						if (res['status']=='Error'){
							var regV = /Email already exist/gi;
							var result = res['message'].match(regV); 
							if (result) {
								console.warn("User with this Email is already registered!");
								$('#email').css("border-color", "#a94442" ); 
								alert("User with this Email is already registered!");
								return;
							} 
							alert('Error: something went wrong (most likely the server address is changed)');
							return;
						}
						if(res['status']=='OK'){
							location.href='company.html';
					
						}
											
					console.log("mesage: "+data+res+" "+res['status']);
						
				},
				error:  function(xhr, str){
					console.log('error: ' + xhr.responseCode + str);
				}
			});
			
	
		}

}

