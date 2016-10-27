var global_response = {};  // future global data object came from the server with COMPANIES
var current_data = {} ; // future global data object with current state of partners
var global_news = {};  // future global data object came from the server with NEWS

// get companies data
function get_company_data(){
   
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
			var displayIn  = 'ul-list_companies'; //I specify where to display the data
			printTotalCompanies(global_response);
			printCompany(global_response['list'], displayIn);
			printChart(global_response);
			
			
        },
        error:  function(xhr, str){
			console.log('error: ' + xhr.responseCode + str);
        }
    });

	
}


// get news data
function get_news_data(){
    $.ajax({
        type: 'POST',
        url: 'http://codeit.pro/frontTestTask/news/getList',
        success: function(data) {
				global_news  = data;
				printNews(global_news);
				
				var dataLength = global_news['list'].length-1; 
				initNewsButton(dataLength); // init. sliders buttons on News block
			
        },
        error:  function(xhr, str){
			console.log('error: ' + xhr.responseCode + str);
        }
    });
	
}


//by clicking on the company creating a block with a detailed description of the company
function describeCompany(id){  
	var sort_object = {}; // the numerical properties of the object are automatically sorted in ascending order, that i use
	var sort_array = []; // Im using an array and sort the data in ascending object, for simplicity
	
	//id = this is id of current company in block List of Companies
	
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
	
		if(current_data[id]){
			for(var keyCompany in current_data[id]){
				var company = current_data[id][keyCompany].company;
				var value = current_data[id][keyCompany].value;
					draw_company_element(company, value, id); 
			}
		}
		
}


// this function stores the status of selected partners in  Company Partner block  . If  in current_data object is no data then save, and if there is something  - skip
//current_data - storing any company status from Company Partner after sorting (by_name and by_percentage) and other modification. 
//data is not duplicated and the length of the object is equal to the number of companies
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

//by clicking on 'X' hidden block - Company Partner
function hideBlock(){
	$('.describe-block').css("display","none");
}


//display  all the data in a block News
function printNews(res, index){
	var index = index || 0;
	
	// first - empty
	$(".news-img").attr("src",' '); 
	$(".this-author").empty();
	$(".this-public").empty();
	$(".news-title > a").empty();
	$(".news-content").empty();
	
	
	//second - print to html
	var url = res['list'][index].img; 
	$(".news-img").css('background','url('+url+')'); 
	

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
	return words.join(' ')+(words.length !== str.split(' ').length ? '<a href="#0" class="more-text" onClick="showMore(); return false;">&hellip;</a>' : ''); // if text is cropped then add '...' to end 
}

//if a lot of text, this function truncates it and appends dots with event on click   
function less_text() {
	var $allText = $('div.news-content');
	$allText.data('text', $allText.html()); // store untouched text 
	$allText.html( text_cropping($allText.html(), 20) ); // add modified text to html after invoking Cropping-text function
	
}
		
//It shows the whole text.	Event on dots
function showMore(){
	var $allText = $('div.news-content');
	$allText.html($allText.data('text'));
}


// convert date from  milliseconds  to format ~ 30.10.2016
function validate_news_date(dateValidate){
	var date = new Date(1000*dateValidate);

	var dd = date.getDate();
		if(dd < 10) {
			dd = '0' + dd;
		}
		
	var mm = date.getMonth() + 1;
		if(mm < 10){
			mm = '0' + mm;
		}
		
	var yy = date.getFullYear() ;
		if(yy < 10){
			yy = '0' + yy;
		}	
	var current_date = dd + '.' + mm + '.' + yy;

		return current_date;

}

function printTotalCompanies(res){
var count = 0;
	for (var i=0; i < res['list'].length; i++ ) {
		count +=1;
	}
$(".circle").html(count); 
}

// list of all companies displaying in  List of Companies block
function printCompany(res, className){

	for (var i=0; i < res.length; i++ ) {
		$("."+className).append('<li onClick="describeCompany(this.id);return false;" id="'+i+'">'+res[i]['name']+'</li>'); 
		
	}

}


// highlight a list item active
$(function() { 
    $('.highlight-li').on('click', 'li', function(event) {
         $(this).addClass("active").siblings().removeClass("active");   
         event.preventDefault();
    });
});


function my_sort(sortId, sortProperty){
	/*The principle of this function Sorting: get object to sort, copy it into an array,
 sort and return the sorted object to object with all the data.	*/
 /* And Sorting percent, is similar . */
	var sortProperty = sortProperty;
	var currentID = $(".describe-content").attr("relation-id");
		
		var temp_array = []; // Array for sorting
		var temp_obj = current_data[currentID]; //the object that I want to sort
		
		//I rewrite the object to an array
		for(var key in temp_obj){
			temp_array.push(temp_obj[key]);
		}
		
		//I define a dsc or asc sorting
		var trigger_sort = $('#'+sortId).prop('checked');
		
		//asc sorting
		if(trigger_sort == true) {
			// sorting an array
			temp_array.sort(function(obj2, obj1) {
			  if(obj1[sortProperty] < obj2[sortProperty]) return 1;
			  if(obj1[sortProperty] > obj2[sortProperty]) return -1;
			   return 0; // if obj2 == obj1
			});
		}
		 
		//dsc sorting
		if(trigger_sort == false) {
			// sorting an array
			temp_array.sort(function(obj1, obj2) {
			  if(obj1[sortProperty] < obj2[sortProperty]) return 1;
			  if(obj1[sortProperty] > obj2[sortProperty]) return -1;
			  return 0; // if obj2 == obj1
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




// this function define buttons on News block to browse news '<' and '>'
function initNewsButton(dataLength){
	
var max = dataLength;
var min = 0;
var startPosition = 0; 
		
	$('.btn-news-right').click(function() {
		$('.btn-news-left').removeAttr('disabled');
		startPosition++;
	
		
		// define the maximum value of the slider to scroll 
		if(startPosition > max){
			startPosition = max;
			$('.btn-news-right').attr('disabled','disabled');
			return;
		}
		//if all is okay , display data by clicking button(like in slider)
		printNews(global_news, startPosition);		
						
	})

	$('.btn-news-left').click(function() {
		$('.btn-news-right').removeAttr('disabled');
		startPosition--;
		
		// define the minimum value of the slider to scroll 
		if(startPosition < min){
			startPosition = min;
			$('.btn-news-left').attr('disabled','disabled');
			return;
		}
		//if all is okay , display data by clicking button(like in slider)
		printNews(global_news, startPosition);				
	})
	
	
}



// Companies by Location block - this function define relation chart location with companyes location
function getUniqueLocation(countryData){
var global_response = countryData;

	var dataCountry = [];
	//I write  all the cities in the array
	for(var i=0; i < global_response['list'].length; i++){
		dataCountry[i] = global_response['list'][i].location.name;
	}

	var uniqueCountry = {}
	//I make a list of unique cities and the number of repeats
	for(var i=0; i < dataCountry.length; i++){
		var currentCountry = dataCountry[i];
		
		if(uniqueCountry.hasOwnProperty(currentCountry)){
			uniqueCountry[currentCountry] +=1;
		}
		
		if(!uniqueCountry.hasOwnProperty(currentCountry)){
			uniqueCountry[currentCountry] = 1;
		}
		
	}
	
	return uniqueCountry;
}



//I edit the data that will go to chart
function preparation_data_toChart(uniqueCountry){
	
	var dataToChart = [];
	var index=0;
	for(var key in uniqueCountry){
		dataToChart[index] = {'y':uniqueCountry[key], 'indexLabel':[key][0]};
		index ++;
	}
	return dataToChart;
}


//by clicking to the area of chart - display the names by similar location
function Describe_Chart_area(params){
	
var country = params;
var outputData = {};

	if(country){
		
		$('#chartContainer').css('display','none');
		$('.btn-to-chart').css('display','block');
	
		$('.chartCountry').html(country+':');
		var index = 0; // just for beauty index
		for(var i=0; i < global_response['list'].length; i++){
			if(global_response['list'][i].location.name == country){
				outputData[index] = global_response['list'][i].name;
				index ++ ;
			}
		}
		
		for (var key in outputData) {
			$(".ul-list_chart").append('<li>'+outputData[key]+'</li>'); 
		}
			
		
	}
	
}

//graphic displaying in block Companies by Location
function printChart(global_response){
	
	//obtaining data to chart
	var unique = getUniqueLocation(global_response);
	var dataToChart = preparation_data_toChart(unique);
	
	
	// draw the chart on data obtained me
	var chart = new CanvasJS.Chart("chartContainer",
	{
		theme: "theme2",
		title:{
			
		},
		data: [
		{	
			click: function(e){  //click on the graph area
				//console.log( ' ( '+e.dataPoint.indexLabel+' ) ' + e.dataSeries.type+ ", dataPoint { x:" + e.dataPoint.x + ", y: "+ e.dataPoint.y + " }" );
				Describe_Chart_area(e.dataPoint.indexLabel); 
			},
			type: "pie",
			showInLegend: true,
			toolTipContent: "{y}  #percent %",
			yValueFormatString: " ",
			legendText: "{indexLabel}",
			dataPoints: dataToChart // a list of all the countries that are to be displayed
		}
		]
	});
	chart.render();	
	
}



$(document).ready(function(){
	get_company_data(); //receiving data by AJAX
	get_news_data(); // receiving data by AJAX
	
		//trigger change (sorted by name)
		$('#stateInput').change(function() {
			//sort by Name, descending/ascending
			
			var sortId = 'stateInput';
			var sortProperty = 'company';
			my_sort(sortId, sortProperty);
		})
				
		//trigger change (sorted by perscent)
		$('#stateInputPercent').change(function() {
			//sort by Perscent, descending/ascending
			
			var sortId = 'stateInputPercent';
			var sortProperty = 'value';
			my_sort(sortId, sortProperty);
		})
		
		
		$('.btn-to-chart').click(function() {
			$("#chartContainer").empty()
			$('#chartContainer').css('display','block');
			printChart(global_response);
			$(".ul-list_chart").empty()
			$('.btn-to-chart').css('display','none');
			
		})
		
	
		
});



