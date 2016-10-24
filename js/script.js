

function validateName(input) {
	
	if (input.value.length < 3) {
		input.setCustomValidity("At least 3 symbols");   
	}else {
		input.setCustomValidity("");
	}
}


function checkPassword(n1, n2) {
	
	if (n1.value != n2.value) {
		n2.setCustomValidity('Names do not match');
	}else {
		n2.setCustomValidity('');
	}
}




function validCheckBox(global_errors){
	if(!document.getElementById("myChek").checked){
			return true;
		
	}
}


function validPass(global_errors){
	if (document.getElementById('pass').value == "" ) {
			return true;
	};
}

function validName(global_errors){
	if (document.getElementById('inp1').value == "" || document.getElementById('inp1').value.length < 3 ) {
			return true;
		
	};
	if (document.getElementById('inp1').value != document.getElementById('inp2').value) {
			return true;
		
	};
}

function validMail(global_errors){
	var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    var myMail = document.getElementById('email').value;
    var valid = re.test(myMail);
	if(!valid){
			return true;
		
	}
}

function validGender(global_errors){
	if (gender.options[gender.selectedIndex].value == "" ){
		return true;
		
	}
}

	
	// sending the form data to the server and error handling
	function senddata(event) {
		event.preventDefault(); 
		
		//checking  form on the client side for correct filling
		validCheckBox();
		validName();
		validMail();
		validGender();
		validPass();
			
		//If the form is completed correctly then sends a request
		if(!validCheckBox() && !validName() && !validMail() && !validGender() && !validPass()) {
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



$(document).ready(function(){


 	
		
});