function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
}



/* dribbble */

var dribbble_load = false;

function open_dribbble(obj){
	url = $(obj).attr('href');
	src = $(obj).find('img').attr('src').replace('_teaser','');
	$('#dribbble_big li').html('<a href="' + url +'" class="thumbnail" target="_blank"><img src="' + src + '"/></a>');
	return false;
}

function get_dribbble(){
	if( !dribbble_load ){
		$('#loader').show();
		dribbble_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				if( data.shots.length ){
				    $.each(data.shots, function(i,item){

				      $('<li><a class="thumbnail quimby_search_image" href="http://drbl.in/' + item.id + '" onclick="return open_dribbble(this)"><img src="' + item.image_teaser_url + '"/></a></li>').appendTo("#dribbble_images");
				      if ( i == 4 ) return false;
				    });
					$('#dribbble_images A:first').click();
				}else{
					$('#dribbble').html('no se han encontrado imagenes');
				}
			},
			type: 'GET',
			url: 'http://api.dribbble.com/players/' + dribbble_user + '/shots'
		});
	}
}

/* flickr */

var flickr_load = false;
var flickr_api = '8d90a5ce3814eb72cd5a86da09530127';

function open_flickr(obj){
	url = $(obj).attr('href');
	src = $(obj).find('img').attr('src').replace('_s','');
	$('#flickr_big li').html('<a href="' + url +'" class="thumbnail" target="_blank"><img src="' + src + '"/></a>');
	return false;
}

function get_flickr(){
	if( !flickr_load ){
		$('#loader').show();
		flickr_load = true;
		$.ajax({
			dataType: 'json',
			success: function(data){
				$('#loader').hide();
				
				if( data.user ){
					user_id = data.user.id;
					
					$.ajax({
						dataType: 'json',
						success: function(data){

							if( data.photos.photo.length ){
							    $.each(data.photos.photo, function(i,item){

							      $('<li><a class="thumbnail quimby_search_image" href="http://www.flickr.com/photos/' + user_id + '/' + item.id + '" onclick="return open_flickr(this)"><img src="http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_s.jpg"/></a></li>').appendTo("#flickr_images");

							    });
								$('#flickr_images A:first').click();
							}else{
								$('#flickr').html('no se han encontrado imagenes');
							}
						},
						type: 'GET',
						url: 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickr_api +  '&user_id=' + user_id + '&per_page=5&format=json&nojsoncallback=1'
					});
					
					data.user.id
					
					
					
				}else{
					$('#flickr').html('no se han encontrado imagenes');
				}
				
				
			},
			type: 'GET',
			url: 'http://api.flickr.com/services/rest/?method=flickr.urls.lookupUser&api_key=' + flickr_api + '&url=flickr.com%2Fphotos%2F' + flickr_user + '%2F&format=json&nojsoncallback=1'
		});
	}
}


/* github */

var github_load = false;
var github_langs = [];
var github_langs_values = {};
var github_langs_values_aux = [];

function get_github(){
	if( !github_load ){
		$('#loader').show();
		github_load = true;
		$.ajax({
			//data: options,
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				
				if( data.repositories.length ){
				    $.each(data.repositories, function(i,item){
					  
					  if( item.language ){
						  if( github_langs_values[item.language] ){
							github_langs_values[item.language]++;
						  }else{
							github_langs_values[item.language] = 1;
						  }
					  }

				      $('<li><a href="' + item.url + '" target="_blank">' + item.name + ' (' + item.language + ')</a><br/>' + item.description + '</li>').appendTo("#github_projects");

				    });
					
					
					
					for( lang in github_langs_values ){
						github_langs.push( lang );
						github_langs_values_aux.push(github_langs_values[lang]);
					}
					
					
					url = 'https://chart.googleapis.com/chart?cht=p&chd=t:' + github_langs_values_aux.join(',') + '&chs=300x150&chl=' + github_langs.join('|');
					$('#github_graph').html('<img src="' + url + '"/>');
					
				}else{
					$('#github').html('no se han encontrado proyectos');
				}
			},
			type: 'GET',
			url: 'https://github.com/api/v2/json/repos/show/' + github_user
		});
	}
}

/* youtube */


var youtube_load = false;

function open_youtube(id){
	$('#youtube_big').html('<iframe width="420" height="315" src="http://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>');
	return false;
}

function get_youtube(){
	if( !youtube_load ){
		$('#loader').show();
		youtube_load = true;
		$.ajax({
			//data: options,
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				
				if( data.feed.entry ){
				    $.each(data.feed.entry, function(i,item){
					  
					  id = item.id.$t.split('/')[5];
				
				      $('<li><a rel="twipsy" data-original-title="' + item.title.$t + '" class="thumbnail quimby_search_image" href="' + item.link[0].href + '" onclick="return open_youtube(\'' + id + '\')"><img src="http://img.youtube.com/vi/' + id + '/1.jpg"/></a></li>').appendTo("#youtube_list");
				      if ( i == 4 ) return false;
				    });
					$('#youtube_list A:first').click();

				}else{
					$('#youtube').html('no se han encontrado videos');
				}
			},
			type: 'GET',
			url: 'http://gdata.youtube.com/feeds/users/' + youtube_user + '/uploads?alt=json'
		});
	}
}


/* twitter */

var twitter_load = false;

function get_twitter(){
	if( !twitter_load ){
		$('#loader').show();
		twitter_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				
				$('#twitter').html("Una forma de saber que hace una persona es ver en que listas lo han añadido en twitter<br/><br/>");

				if( data.lists.length ){
				    $.each(data.lists, function(i,item){
					
				      $('<a href="http://twitter.com' + item.uri + '" target="_blank"><b>' + item.name + '</b>@' + item.user.screen_name + '</a>').appendTo("#twitter");

				    });

					$('<a href="http://twitter.com/' + twitter_user + '/lists/memberships" target="_blank"><b>Ver más listas</b></a>').appendTo("#twitter");

					
				}else{
					$('#twitter').html('todavía no ha sido añadido en una lista');
				}
			},
			type: 'GET',
			url: 'https://api.twitter.com/1/lists/memberships.json?screen_name=' + twitter_user
		});
	}
}


/* twitterstatus */

var twitterstatus_load = false;

function get_twitterstatus(){
	if( !twitterstatus_load ){
		$('#loader').show();
		twitterstatus_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				
				$('#loader').hide();
				if( data ){
					
					html = '<div style="float:left;padding-right:40px"><b>Tweets</b><br/><span style="font-size:30px">' + data[0].user.statuses_count + '</span></div>';
					html += '<div style="float:left;padding-right:40px"><b>Seguidores</b><br/><span style="font-size:30px">' + data[0].user.followers_count + '</span></div>';
					html += '<div style="float:left;padding-right:40px"><b>Amigos</b><br/><span style="font-size:30px">' + data[0].user.friends_count + '</span></div>';
					html += '<div style="float:left;padding-right:40px"><b>Favoritos</b><br/><span style="font-size:30px">' + data[0].user.favourites_count + '</span></div>';
					html += '<br class="clear"/><br/><br/><b>Ultimos estados</b><br/><br/>';
					$("#twitterstatus_info").html(html);
					
				    $.each(data, function(i,item){
				      $('<li>' + replaceURLWithHTMLLinks( item.text ) + '<br/><br/></li>').appendTo("#twitterstatus_list"); //<span class="date">' + item.created_at + '</span>
				    });

				}else{
					$('#twitterstatus').html('no se han encontrado tweets');
				}
				
			},
			type: 'GET',
			url: 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=false&include_rts=false&count=10&screen_name=' + twitter_user
		});
	}
}

/* stackoverflow */

var stackoverflow_load = false;
var stackoverflow_reputation = false;
var stackoverflow_tags = [];
var stackoverflow_error = false;

function get_stackoverflow(){
	if( !stackoverflow_load ){
		$('#loader').show();
		stackoverflow_load = true;
		html = '';

		$.ajax({
			dataType: 'jsonp',
			jsonp: 'jsonp',
			success: function(data){
				
				
				if( data.error ){
					$('#loader').hide();
					stackoverflow_error = true;
					$('#stackoverflow').html('el usuario no existe');
					return false;
				}
				
				html += '<b>Ha preguntado</b><br/>'
				if( data.questions.length ){
					html += '<ul>';
				    $.each(data.questions, function(i,item){
					  
					  if( !stackoverflow_reputation ) stackoverflow_reputation = item.owner.reputation;
					
					  stackoverflow_tags = stackoverflow_tags.concat(item.tags);
					
				      html += '<li><a href="http://stackoverflow.com' + item.question_answers_url + '" target="_blank">' + item.title.replace(/\</g,'&lt;').replace(/\>/g,'&gt;') + '</a></li>';
					  if( i == 4 ) return false;
				    });
					html += '</ul>';
					
				}else{
					html += 'todavía no ha hecho preguntas<br/><br/>';
				}				
				
			},
			type: 'GET',
			url: 'http://api.stackoverflow.com/1.1/users/' + stackoverflow_user + '/questions'
		});
		
		
		$.ajax({
			dataType: 'jsonp',
			jsonp: 'jsonp',
			success: function(data){

				if( !stackoverflow_error ){
					html += '<b>Ha respondido</b><br/>'
					if( data.answers.length ){
						html += '<ul>';
					    $.each(data.answers	, function(i,item){

						  if( !stackoverflow_reputation ) stackoverflow_reputation = item.owner.reputation;

					      html += '<li><a href="http://stackoverflow.com' + item.answer_comments_url + '" target="_blank">' + item.title.replace(/\</g,'&lt;').replace(/\>/g,'&gt;') + '</a></li>';
						  if( i == 4 ) return false;
					    });
						html += '</ul>';

					}else{
						html += 'todavía no ha respondido preguntas';
					}
				


					if( !stackoverflow_reputation ) stackoverflow_reputation = 1;
				
					html_aux = '<b>Reputación</b><br/><span style="font-size:30px">' + stackoverflow_reputation + '</span><br/><br/>';

				
					if( stackoverflow_tags.length ){
						html_aux += '<b>Tags</b><br/>' + stackoverflow_tags.join(', ') + '<br/><br/>';
					}

					$('#loader').hide();
					$('#stackoverflow').html(html_aux+html);
				}
			},
			type: 'GET',
			url: 'http://api.stackoverflow.com/1.1/users/' + stackoverflow_user + '/answers'
		});
		
	}
}


/* vimeo */


var vimeo_load = false;

function open_vimeo(id){
	$('#vimeo_big').html('<iframe src="http://player.vimeo.com/video/' + id + '?title=0&amp;byline=0&amp;portrait=0&amp;color=8cc63f" width="377" height="214" frameborder="0" webkitAllowFullScreen allowFullScreen></iframe>');
	return false;
}

function get_vimeo(){
	if( !vimeo_load ){
		$('#loader').show();
		vimeo_load = true;
		$.ajax({
			//data: options,
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				
				if( !data.error && data ){
				    $.each(data, function(i,item){
				      $('<li><a rel="twipsy" data-original-title="' + item.title + '" class="thumbnail quimby_search_image" href="' + item.url + '" onclick="return open_vimeo(\'' + item.id + '\')"><img src="' + item.thumbnail_small + '"/></a></li>').appendTo("#vimeo_list");
				      if ( i == 4 ) return false;
				    });
					$('#vimeo_list A:first').click();

				}else{
					$('#vimeo').html('no se han encontrado videos');
				}
			},
			type: 'GET',
			url: 'http://vimeo.com/api/v2/' + vimeo_user + '/videos.json'
		});
	}
}

/* user edit preview avatar */

var gravatar_id, twitter_id, facebook_id;

function userAvatar(type){
	var rand = Math.floor(Math.random()*11);
	switch( parseInt( type ) ){
		case 0: //gravatar
			url = 'http://www.gravatar.com/avatar/' + gravatar_id + '?s=50&d=http://dir.betabeers.com/bundles/applicationanuncios/images/default_avatar.png';
			break;
			
		case 1: // twitter
			url = 'http://api.twitter.com/1/users/profile_image/' + twitter_id + '.json?size=normal';
			break;
			
		case 2: // facebook
			url = 'http://graph.facebook.com/' + facebook_id + '/picture?type=square';
			break;
	
	}
	url += '&rand=' + rand;
	$('#user_avatar').attr('src', url);
	$('#user_avatar').load(function(){
		$('#user_avatar').fadeIn('slow');
	});
	
}

/* tooltips user networks edit */

function networks_tooltip(){
	$('#networks input').each(function(index) {
		tooltip = false;
		id = $(this).attr('id');
		
		switch( true ){
			case ( id.indexOf('usertype_url') > -1 ):
				tooltip = 'http://tudominio.com';
				break;
			case ( id.indexOf('twitter') > -1 ):
				tooltip = 'twitter.com/USUARIO';
				break;		
			case ( id.indexOf('linkedin') > -1 ):
				tooltip = 'es.linkedin.com/in/USUARIO';
				break;
			case ( id.indexOf('forrst') > -1 ):
				tooltip = 'forrst.com/people/USUARIO';
				break;
			case ( id.indexOf('github') > -1 ):
				tooltip = 'github.com/USUARIO';
				break;
			case ( id.indexOf('dribbble') > -1 ):
				tooltip = 'dribbble.com/USUARIO';
				break;
			case ( id.indexOf('flickr') > -1 ):
				tooltip = 'flickr.com/photos/USUARIO';
				break;
			case ( id.indexOf('youtube') > -1 ):
				tooltip = 'youtube.com/user/USUARIO';
				break;
			case ( id.indexOf('stackoverflow') > -1 ):
				tooltip = 'stackoverflow.com/users/ID';
				break;
			case ( id.indexOf('vimeo') > -1 ):
				tooltip = 'vimeo.com/USUARIO';
				break;
			case ( id.indexOf('delicious') > -1 ):
				tooltip = 'delicious.com/USUARIO';
				break;
			case ( id.indexOf('pinboard') > -1 ):
				tooltip = 'pinboard.in/u:USUARIO';
				break;
			case ( id.indexOf('itunes') > -1 ):
				tooltip = 'appannie.com/company/USUARIO';
				break;
			case ( id.indexOf('android') > -1 ):
				tooltip = 'market.android.com/developer?pub=USUARIO';
				break;
			case ( id.indexOf('chrome') > -1 ):
				tooltip = 'chrome.google.com/webstore/search?q=USUARIO';
				break;
			case ( id.indexOf('masterbranch') > -1 ):
				tooltip = 'masterbranch.com/developer/USUARIO';
				break;
		}
		
		if( tooltip ){
			$(this).attr('data-original-title',tooltip);
			$(this).attr('rel','twipsy');
		}
	});
}

/* chrome */

var chrome_load = false;

function get_chrome(){
	
	/*
	
	if( !chrome_load ){
		$('#loader').show();
		chrome_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				if( data.length ){
				    $.each(data, function(i,item){
				      $('<div style="float:left;width:250px;padding:0 20px 20px 0"><a href="' + item.url + '" target="_blank"><img src="' + item.icon + '" width="50" height="50" align="middle" style="float:left;margin-right:10px"/> ' + item.title + '</a><br/>' + item.text + '</div>').appendTo("#chrome_list");
				    });

				}else{
					$('#chrome').html('no se han encontrado extensiones');
				}
			},
			type: 'GET',
			url: '/user/scrapper?id=' + chrome_user + '&type=chrome'
		});
	}
	
	*/
	
	$('#chrome').html('<div style="text-align:center"><a href="https://chrome.google.com/webstore/search?q=' + chrome_user + '" target="_blank">Ver extensiones de chrome</a></div>');
}


/* android */

var android_load = false;

function get_android(){
	if( !android_load ){
		$('#loader').show();
		android_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				if( data.length ){
				    $.each(data, function(i,item){
				      $('<div style="float:left;width:250px;padding-right:20px;height:70px"><a href="' + item.url + '" target="_blank"><img src="' + item.icon + '" width="50" height="50" align="middle" style="float:left;margin-right:10px"/> ' + item.title + '</a><br/>' + item.text + '</div>').appendTo("#android_list");
				    });

				}else{
					$('#android').html('no se han encontrado aplicaciones');
				}
			},
			type: 'GET',
			url: '/user/scrapper?id=' + android_user + '&type=android'
		});
	}
}



/* masterbranch */

var masterbranch_load = false;

function get_masterbranch(){
	if( !masterbranch_load ){
		$('#loader').show();
		masterbranch_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				html = '';
				if( data.score ){
					html += '<div style="float:left;padding-right:40px"><b>Devscore</b><br/><span style="font-size:30px">' + data.score + '</span></div>';
					if( data.beers ) html += '<div style="float:left;padding-right:40px"><b>Beers</b><br/><a href="' + data.beers_url + '" target="_blank" style="font-size:30px">' + data.beers + '</a></div>';
					html += '<br class="clear"/><br/><br/><b>Proyectos</b><br/><ul>';
				    $.each(data.projects, function(i,item){
				      html += '<li><a href="' + item.url + '" target="_blank">' + item.title + '</a></li>';
				    });
					html += '</ul>';
				}else{
					html = 'no se han encontrado proyectos';
				}
				$('#masterbranch').html(html);
			},
			type: 'GET',
			url: '/user/scrapper?id=' + masterbranch_user + '&type=masterbranch'
		});
	}
}

/* itunes */

var itunes_load = false;

function get_itunes(){
	if( !itunes_load ){
		$('#loader').show();
		itunes_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				if( data.length ){
				    $.each(data, function(i,item){
				      $('<div style="float:left;width:250px;padding:0 20px 20px 0"><a href="' + item.url + '" target="_blank"><img src="' + item.icon + '" width="50" height="50" align="middle" style="margin-right:10px"/> ' + item.title + '</a></div>').appendTo("#itunes_list");
				    });

				}else{
					$('#itunes').html('no se han encontrado aplicaciones');
				}
			},
			type: 'GET',
			url: '/user/scrapper?id=' + itunes_user + '&type=itunes'
		});
	}
}


/* linkedin */

var linkedin_load = false;

function get_linkedin(){
	if( !linkedin_load ){
		$('#loader').show();
		linkedin_load = true;
		$.ajax({
			dataType: 'html',
			success: function(data){
				$('#loader').hide();
				if( data ){
					$('#linkedin').html(data);

				}else{
					$('#linkedin').html('no se han encontrado información');
				}
			},
			type: 'GET',
			url: '/user/scrapper?id=' + linkedin_user + '&type=linkedin'
		});
	}
}

/* forrst */


var forrst_load = false;

function get_forrst(){
	if( !forrst_load ){
		$('#loader').show();
		forrst_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				$('#loader').hide();
				
				if( data.resp.posts.length ){
				    $.each(data.resp.posts, function(i,item){
					  image = item.snaps ? '<img src="' + item.snaps.large_url + '" width="60" height="60" class="pull-right"/>' : false;
				      $('<li><a href="' + item.post_url + '" target="_blank">' + image + item.title + '</a><br/>' + item.description + '<br class="clear"/><br/></li>').appendTo("#forrst_list");
				    });

				}else{
					$('#forrst').html('no se han encontrado entradas');
				}
			},
			type: 'GET',
			url: 'https://forrst.com/api/v2/user/posts?username=' + forrst_user
		});
	}
}


/* delicious */

var delicious_load = false;

function get_delicious(){
	if( !delicious_load ){
		$('#loader').show();
		delicious_load = true;
		$.ajax({
			dataType: 'jsonp',
			success: function(data){
				
				$('#loader').hide();
				if( data ){
				    $.each(data, function(i,item){
				      $('<li><a href="' + item.u + '" target="_blank">' + decodeURIComponent( escape( item.d ) ) + '</a></li>').appendTo("#delicious_list");
				    });

				}else{
					$('#delicious').html('no se han encontrado enlaces');
				}
				
			},
			type: 'GET',
			url: 'http://delicious.com/v2/json/' + delicious_user + '?count=20'
		});
	}
}


/* pinboard */

var pinboard_load = false;

function get_pinboard(){
	if( !pinboard_load ){
		$('#loader').show();
		pinboard_load = true;
		$.ajax({
			dataType: 'jsonp',
			//success: function(data){},
			type: 'GET',
			url: 'http://feeds.pinboard.in/json/v1/u:' + pinboard_user + '/?cb=pinboardNS_show_bmarks&count=20'
		});
	}
}

function pinboardNS_show_bmarks(data){
	$('#loader').hide();
	if( data ){
	    $.each(data, function(i,item){
	      $('<li><a href="' + item.u + '" target="_blank">' + item.d + '</a></li>').appendTo("#pinboard_list");
	    });

	}else{
		$('#pinboard').html('no se han encontrado enlaces');
	}
}




function autoGeo(){

	$('#geo input:first').autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "/user/getlocation",//"http://ws.geonames.org/searchJSON",
				dataType: "jsonp",
				data: {
					//featureClass: "P",
					//style: "full",
					//maxRows: 12,
					city: request.term
				},
				success: function( data ) {
					response( $.map( data.geonames, function( item ) {
						city = item.city + ', ' + item.country;
						return {
							label: city,
							value: city,
							cit_id: item.cit_id,
							cou_id: item.cou_id
						}
					}));
				}
			});
		},
		minLength: 2,
		select: function( event, ui ) {
	
			if( $('#geo .hide input').size() ){
				$('#geo .hide input:eq(0)').val( ui.item.cou_id );
				$('#geo .hide input:eq(1)').val( ui.item.cit_id );
			}

		},
		open: function() {
			$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		},
		close: function() {
			$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		}
	});
}


$.datepicker.regional['es'] = {
	                closeText: 'Cerrar',
	                prevText: '&#x3c;Ant',
	                nextText: 'Sig&#x3e;',
	                currentText: 'Hoy',
	                monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
	                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
	                monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
	                'Jul','Ago','Sep','Oct','Nov','Dic'],
	                dayNames: ['Domingo','Lunes','Martes','Mi&eacute;rcoles','Jueves','Viernes','S&aacute;bado'],
	                dayNamesShort: ['Dom','Lun','Mar','Mi&eacute;','Juv','Vie','S&aacute;b'],
	                dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S&aacute;'],
	                weekHeader: 'Sm',
	                dateFormat: 'dd-mm-yy',
	                firstDay: 1,
	                isRTL: false,
	                showMonthAfterYear: false,
	                yearSuffix: ''};

$.datepicker.setDefaults($.datepicker.regional['es']);



function getMap(){
	// 	var geocoder, map;
	if( $('#map_canvas').html() == '' ){
	    geocoder = new google.maps.Geocoder();
	    var myOptions = {
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    }
	    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	    var address = $('#address').html();

	    geocoder.geocode( { 'address': address}, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
	        map.setCenter(results[0].geometry.location);
	        var marker = new google.maps.Marker({
	            map: map, 
	            position: results[0].geometry.location
	        });
	      } else {
	        //alert("Geocode was not successful for the following reason: " + status);
	      }
	    });

	}
}