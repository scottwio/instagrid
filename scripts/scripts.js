// This is going to work with two things users profile names and tag searchs that's all for now
(function($){
	$.fn.instagramer = function(options) {  
	  var that = this
	  , endPointUrl = "https://api.instagram.com/v1/";

	  var settings = {
	   userId: null
	   , searchTags: 'love'
	   , numberOfImages: 10
	   , quality: 'low'
	   , likes: true
	   , comments: true
	   , tags: true
	   , username: true
	   , clientID: '9ab54abfc049493b928e142574d2bbd9'
	   , accessToken: ''
	   , responsive: true
	   , fixedHeight: 200
	  };  

	  options && $.extend(settings, options);

	  	instagrid = {
	  		ImageCollection:[],
	  		markup: '',
	  		createObj: function(requestData){
	  			// constructor function for image object
					function ImageObj(i){
						this.url = requestData.data[i].images.standard_resolution.url;
						this.urlLow = requestData.data[i].images.low_resolution.url;
						this.urlThumb = requestData.data[i].images.thumbnail.url;
						this.linkUrl = requestData.data[i].link;
						this.likes = requestData.data[i].likes.count;
						this.comments = requestData.data[i].comments.count;
						this.username = requestData.data[i].user.full_name;
						this.avatar = requestData.data[i].user.profile_picture;  
						this.imgHeight = getHeight();
						this.imgWidth = getHeight();
					}

					// create image objects
					for (var i = 0; i <= settings.numberOfImages; i++){	
						instagrid.ImageCollection.push(new ImageObj(i));
					};

					function getHeight(){
						switch(settings.quality)
						{
							case 'standard':
								return 612;
							break;
							case 'low':
								return 306;
							break;
							case 'thumbnail':
								return 150;
							break;
						}
					}
	  		},

	  		applyHover: function(){
	  				$('.image').hover(function() {
	  				$(this).addClass('flipped');
	  			}, function() {
	  				$(this).removeClass('flipped');
	  			});
	  		},
	  		createMarkup: function(){
	  			// variables
				var out
				, image;

				// start creating the html
				out = ""

				// Start looping through items
				for (i = 1; i < instagrid.ImageCollection.length; i++) {
					out += '<div class="image-wrapper ' + settings.quality + '"><div class="image">';
					image = instagrid.ImageCollection[i];

					// choose the correct image quality
					switch(settings.quality)
					{
						case 'standard':
							out += '<img src=" '+ image.url +' " />';
						break;
						case 'low':
							out += '<img src=" '+ image.urlLow +' " />';
						break;
						case 'thumbnail':
							out += '<img src=" '+ image.urlThumb +' " />';
						break;
					}

					// add meta data
					if(settings.likes || settings.comments || settings.username){
						out += '<ul>';
						if(settings.username){
							// add username
							out += '<li><img src=" '+ image.avatar +' "/><span>'+ image.username  +'</span></li>';
						}
						if(settings.likes){
							// add like count
							out += '<li> likes ' + image.likes + '</li>';
						}
						if(settings.comments){
							// add comment count
							out += '<li> comments ' + image.comments + '</li>';
						}
						if(settings.linkUrl){
							// add username
							out += '<li><a href="' + image.linkUrl + '">link</li>';
						}
						
						out += '</ul>';
					}
					// end html creation
					out += '</div></div>';
				}
				instagrid.applyMarkup(out);	
	  		},

	  		applyMarkup: function(out){
	  			function applySettings(){
							that[0].innerHTML = instagrid.markup;
							if(settings.responsive){
								instagrid.makeResponsive();
							}
							instagrid.applyHover();
					}
					// comment this tomorrow if 
					// out gets passed in from created make up run else if it isn't run if
					if(out == undefined){
						applySettings();
					}

					else{
						instagrid.markup = out;
						applySettings();
					}	
	  		},
	  		createURL: function(){
	  			completeUrl = endPointUrl + 'tags/'+ settings.searchTags +'/media/recent?client_id='+settings.clientID;
				completeUrl1 = endPointUrl + 'locations/1/media/recent?client_id='+settings.clientID;
				completeUrl2 = endPointUrl + 'locations/search?lat=48.858844&lng=2.294351&client_id='+settings.clientID;
				completeUrl4 = endPointUrl + '/users/70863/media/recent/?access_token='+settings.accessToken;


				if(settings.userId){
				}

				else if(settings.searchTags){
				}

				return completeUrl;
	  		},

	  		makeResponsive: function(){
	  		var totalWidth = $('#instagram').width()		
				, topItem = 0
				, rowCount = 0
				, removedOddItems
				, itemNumber = 0
				, $imgWrapper = $('.image-wrapper')
				, newImgHeight
				, itemsPerRow
				, gridStructureArray = [];

				// works out and applys height and width for responsive images
				// normally would be done with css but images need to be positioned
				// relative in absolute container for 3D animations
				itemsPerRow = Math.ceil((totalWidth / instagrid.ImageCollection[0].imgWidth));
				newImgHeight = totalWidth / itemsPerRow
				$imgWrapper.height(newImgHeight);
				$imgWrapper.width(newImgHeight);
				
				
				// gets the number of rows on display then creates an array containing the
				// the number of rows and how many items are contained in that row, this is then
				// held inside gridStructureArray

				$imgWrapper.each(function(index, element){
				 	var position = $(element).position();
				 	
				 	if (position.top > topItem){
				 		topItem = position.top;
				 		gridStructureArray.push([]);
				 		rowCount++;
				 		itemNumber = 0;	 		
				 	}

				 	if (position.top == topItem){
				 		gridStructureArray[(rowCount-1)].push(itemNumber);
				 		itemNumber +=1;
				 	}
				});

				// remove any row that does not have enough items to completely fill them
				function makeTheGridEven(){
					var numberOfItemsInFullRow = gridStructureArray[0].length
					, numberOfItemsToShow = 0;

					for(var i = 0; i < gridStructureArray.length; i++){
						if(gridStructureArray[i].length == numberOfItemsInFullRow){
							numberOfItemsToShow += gridStructureArray[i].length;
						}
					}
					removedOddItems = $('.image-wrapper:gt(' + ( numberOfItemsToShow-1 ) + ')' ).detach();
				}
				makeTheGridEven(); 
	  		}
	  	}

			function init(){
				$.ajax({
				  url: instagrid.createURL(),
				  type: 'GET',
				  dataType: 'jsonp',
				  data: {},
				  complete: function(xhr, textStatus) {
				   instagrid.createMarkup();
				  },
				  success: function(data, textStatus, xhr) {
				   	instagrid.createObj(data);
				  },
				  error: function(xhr, textStatus, errorThrown) {
				    console.log(
				    	'error');
				  }
				});

				$(window).resize(function(){
					if(settings.responsive){
						instagrid.applyMarkup();
					}
				});	
			}
			init();
	 };
})(jQuery);

$(document).ready(function() {
  $('#instagram').instagramer();
});




