var global_response = {};  // future global data object came from the server with COMPANIES
var current_data = {} ; // future global data object with current state of partners
var global_news = {};  // future global data object came from the server with NEWS

//companies data
$(function(){  
   
    $.ajax({
        type: 'POST',
        url: 'http://codeit.pro/frontTestTask/company/getList',
        success: function(data) {
			var res = data;
			
			//I turn off the animations loader when came the reply from the server
			$('.loader').css("display","none");
			$('.circle').css("display","block");
			$('.wrapper-list_companies').css("display","block");
			
			global_response = res;
			printCompany(global_response);
			
			
        },
        error:  function(xhr, str){
			console.log('error: ' + xhr.responseCode + str);
        }
    });

	
});


//news data
$(function(){  
    $.ajax({
        type: 'POST',
        url: 'http://codeit.pro/frontTestTask/news/getList',
        success: function(data) {
				global_news  = data;
				printNews(global_news);
				
				var dataLength = global_news['list'].length-1; 
				initNewsButton(dataLength); // init sliders buttons on News block
			
        },
        error:  function(xhr, str){
			console.log('error: ' + xhr.responseCode + str);
        }
    });
	
});


//by clicking on the company creating a block with a detailed description of the company
function describeCompany(id){  
	var sort_object = {}; // the numerical properties of the object are automatically sorted in ascending order, that i use
	var sort_array = []; // Im using an array and sort the data in ascending object, for simplicity
	
	$('.describe-block').css("display","block");
			
	for (var i=0; i <global_response['list'][id].partners.length; i++){
		var company_name = global_response['list'][id].partners[i].name;
		var company_value = global_response['list'][id].partners[i].value;
		sort_object[company_name] = company_value;
	}
		
	object_into_array(sort_object , sort_array);
	my_sort_function(sort_array);
	
	
	save_current_state(sort_array, id, current_data);
	
	display_company_partners(current_data, id);
	
	
}


//It displays all the data about the partner companies
function display_company_partners(current_data, id){
	$(".describe-content").remove(); // I delete the last company's to display new
	for(var keyID in current_data){
			if(keyID == id){
				for(var keyCompany in current_data[keyID]){
					//console.log(current_data[keyID][keyCompany].company + " : " + current_data[keyID][keyCompany].value);
					var company = current_data[keyID][keyCompany].company;
					var value = current_data[keyID][keyCompany].value;
					
					draw_company_element(company, value, id); 
				}
			}
		}
	
}


// this function stores the status of selected partners. If no then save, and if there is something missing
function save_current_state(sort_array, id, current_data){
	
	var company_data = {};
	
		for(var i in current_data){
			if(i == id) return;
		}
			
				
		for(var i=0; i < sort_array.length; i++){
			company_data[i] =  {'company':sort_array[i].company, 'value':sort_array[i].value};
		}
		current_data[id] = company_data;
	
}


//for decrease sort partners in array with object's
function my_sort_function(sort_array){
	
	for(var i = 0; i < sort_array.length-1; i++){
		
		if(sort_array[i].value < sort_array[i+1].value){
			
			var company = sort_array[i+1].company;
			var value = sort_array[i+1].value;
			
			sort_array[i+1].value = sort_array[i].value
			sort_array[i+1].company = sort_array[i].company;
			
			sort_array[i].value = value;
			sort_array[i].company = company;
		}
	}
	
}


//transfer object into array
function object_into_array(sort_object , sort_array){
	var index = 0;	
	for(key in sort_object){
		sort_array[index] = {'value':sort_object[key], 'company':[key][0]};
		index++;
	}	
}

//rendering of the partners and the company's share
function draw_company_element(company, value, id){	
		
	var divAll = document.createElement('div');
	$(divAll).addClass("describe-content");
	$(divAll).attr('relation-id', id);
	
	var divCircle = document.createElement('div');
	$(divCircle).addClass("describe_circle_part");
		divCircle.innerHTML = value+"%"; 
	var divLine = document.createElement('div');
	$(divLine).addClass("describe_line_part");
	var divRectangle = document.createElement('div');
	$(divRectangle).addClass("describe_rectangle_part");
		var divText = document.createElement('div');
		$(divText).addClass("describe-text");
		divText.innerHTML = company; 
	$(divRectangle).append(divText); 		
		
	$(divAll).append(divCircle); 	
	$(divAll).append(divLine); 	
	$(divAll).append(divRectangle); 	
	
	$('.describe-main').append(divAll); 
	
}


function hideBlock(){
	$('.describe-block').css("display","none");
}



function printNews(res, index){
	var index = index || 0;
	
	// first - empty
	$(".news-img").attr("src",' '); 
	$(".this-author").empty();
	$(".this-public").empty();
	$(".news-title > a").empty();
	$(".news-content").empty();
	
	//second - print to html
	$(".news-img").attr("src",res['list'][index].img); 
	$(".this-author").append(res['list'][index].author);
	
	//validate Date from millisecond to current Date
	var current_date = validate_news_date(res['list'][index].date);
	$(".this-public").append(current_date);
	
	$(".news-title > a").append(res['list'][index].link);
	$(".news-title > a").attr("href",'http:\\'+res['list'][index].link);  
	
	$(".news-content").append(res['list'][index].description);
	less_text(); // correction text
	
}


//cropping the input text
function text_cropping(str, number_words) {
	var words = str.split(' ');
	words.splice(number_words, words.length-1);
	return words.join(' ') + (words.length !== str.split(' ').length ? '<a href="#0" class="more-text" onClick="showMore(); return false;">&hellip;</a>' : ''); // if text is cropped then add '...' to end 
}


function less_text() {
	var $allText = $('div.news-content');
	$allText.data('text', $allText.html()); // store untouched text 
	$allText.html( text_cropping($allText.html(), 20) ); // add modified text to html after invoking Cropping-text function
	
}
		
//It shows the whole text	
function showMore(){
	var $allText = $('div.news-content');
	$allText.html($allText.data('text'));
}


function validate_news_date(dateValidate){
	var date = new Date(1000*dateValidate);

	var dd = date.getDate();
		if (dd < 10) {
			dd = '0' + dd;
		}
		
	var mm = date.getMonth() + 1;
		if (mm < 10){
			mm = '0' + mm;
		}
		
	var yy = date.getFullYear() ;
		if (yy < 10){
			yy = '0' + yy;
		}	
	var current_date = dd + '.' + mm + '.' + yy;

		return current_date;

}


function printCompany(res){
var count = 0;
	for (var i=0; i < res['list'].length; i++ ) {
		$(".ul-list_companies").append('<li onClick="describeCompany(this.id);return false;" id="'+count+'">'+res['list'][i]['name']+'</li>'); 
		count +=1;
	}
$(".circle").html(count); 
 		
}


// highlight a list item active
$(function() { 
    $('.ul-list_companies').on('click', 'li', function(event) {
         $(this).addClass("active").siblings().removeClass("active");   
         event.preventDefault();
    });
});



function sort_name(){
/*The principle of this function Sorting: get object to sort, copy it into an array,
 sort and return the sorted object to object with all the data.	*/
	var currentID = $(".describe-content").attr("relation-id");
		
		var temp_array = []; // Array for sorting
		var temp_obj = current_data[currentID]; //the object that I want to sort
		
		//I rewrite the object to an array
		for(var key in temp_obj){
			temp_array.push(temp_obj[key]);
		}
		
		//I define a dsc or asc sorting
		var trigger_sort = $('#stateInput').prop('checked');
		
		//asc sorting
		if(trigger_sort == true) {
			// sorting an array
			temp_array.sort(function(obj2, obj1) {
			  if(obj1.company < obj2.company) return 1;
			  if(obj1.company > obj2.company) return -1;
			  return 0;
			});
		}
		
		//dsc sorting
		if(trigger_sort == false) {
			// sorting an array
			temp_array.sort(function(obj1, obj2) {
			  if(obj1.company < obj2.company) return 1;
			  if(obj1.company > obj2.company) return -1;
			  return 0;
			});
		}
		
		
		//I copy an array to an object
		var temp_obj2 = {};	
		for(var i=0; i < temp_array.length; i++){
			temp_obj2[i] = {'company':temp_array[i].company, 'value':temp_array[i].value}
		}	

		//sorted data put at their previous place
		current_data[currentID] = temp_obj2;
		
		//displaying sorted data
		display_company_partners(current_data, currentID);
	
}



function sorting_percent(){
/* Sorting percent, similar to sorting by name. */
	var currentID = $(".describe-content").attr("relation-id");
		
		var temp_array = []; // Array for sorting
		var temp_obj = current_data[currentID]; //the object that I want to sort
		
		//I rewrite the object to an array
		for(var key in temp_obj){
			temp_array.push(temp_obj[key]);
		}
		
		//I define a dsc or asc sorting
		var trigger_sort = $('#stateInputPercent').prop('checked');
		
		//asc sorting
		if(trigger_sort == true) {
			// sorting an array
			temp_array.sort(function(obj2, obj1) {
			  if(obj1.value < obj2.value) return 1;
			  if(obj1.value > obj2.value) return -1;
			  return 0;
			});
		}
		
		//dsc sorting
		if(trigger_sort == false) {
			// sorting an array
			temp_array.sort(function(obj1, obj2) {
			  if(obj1.value < obj2.value) return 1;
			  if(obj1.value > obj2.value) return -1;
			  return 0;
			});
		}
		
		
		//I copy an array to an object
		var temp_obj2 = {};	
		for(var i=0; i < temp_array.length; i++){
			temp_obj2[i] = {'company':temp_array[i].company, 'value':temp_array[i].value}
		}	

		//sorted data put at their previous place
		current_data[currentID] = temp_obj2;
		
		//displaying sorted data
		display_company_partners(current_data, currentID);

	
}


function initNewsButton(dataLength){
	
var max = dataLength;
var min = 0;
var a=0; // start position 
		
	$('.btn-news-right').click(function() {
		$('.btn-news-left').removeAttr('disabled');
		a++;
	
		
		// define the maximum value of the slider to scroll 
		if(a > max){
			a = max;
			$('.btn-news-right').attr('disabled','disabled');
			return;
		}
		//if all is okay , display data by clicking button(like in slider)
		printNews(global_news, a);		
						
	})

	$('.btn-news-left').click(function() {
		$('.btn-news-right').removeAttr('disabled');
		a--;
		
		// define the minimum value of the slider to scroll 
		if(a < min){
			a = min;
			$('.btn-news-left').attr('disabled','disabled');
			return;
		}
		//if all is okay , display data by clicking button(like in slider)
		printNews(global_news, a);				
	})
	
	
}


$(document).ready(function(){
	
		//trigger change (sorted by name)
		$('#stateInput').change(function() {
			//sort by Name, descending/ascending
			sort_name();
				
		})
				
		//trigger change (sorted by perscent)
		$('#stateInputPercent').change(function() {
			//sort by Perscent, descending/ascending
			sorting_percent();
			
		})
	
});
