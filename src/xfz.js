var container = document.getElementById('container');
var httpRequest = new XMLHttpRequest();
var XFZ = {
	status : {
		page : 'welcome',
		currUser : {
			unique_id : ''
		},
		input: {
			message: ''
		},
		timeline: {
			data: [],
			first: '',
			last: ''
		},
		nav : 'home',
		notMain : false,
		loadingContent : false
	},
	init : function(){
		document.body.style.overflowY = 'hidden';
		XFZ.status.page = 'welcome';
		XFZ.setPage();
	},
	Get : function(url, callback){
		httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				if(callback){
					callback(JSON.parse(this.responseText));
				}
			}
		};
		httpRequest.open('GET', url, true);
		httpRequest.send();
	},
	Post : function(url, data, callback){
		console.log(data);
		httpRequest = new XMLHttpRequest();
		httpRequest.open('POST', url, true);
		data = JSON.stringify(data);
		httpRequest.setRequestHeader('Content-type', 'application/json');

		httpRequest.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				if(callback){
					callback(JSON.parse(this.responseText));
				}
			}
		};
		httpRequest.send(data);
	},
	setPage : function(){
		switch(XFZ.status.page){
			case 'welcome' : 
				XFZ.page.welcome();
				break;
			case 'login' :
				XFZ.page.login();
				break;
			case 'logout' :
				XFZ.page.logout();
				break;
			case 'main' :
				XFZ.page.main();
				break;
		}
	},
	setInput : function(){
		var inputContainer = document.createElement('div');
		inputContainer.id = 'inputContainer';
		inputContainer.classList.add('t-input-container');

		var textarea = document.createElement('textarea');
		textarea.id = 'inputTextarea';
		textarea.classList.add('t-input-textarea');

		var inputBox = document.createElement('div');
		inputBox.classList.add('t-input');
		inputBox.appendChild(textarea);

		var currUserAvatar = document.createElement('img');
		currUserAvatar.id = 'currUserAvatar';
		currUserAvatar.classList.add('t-avatar');

		var avatarContainer = document.createElement('div');
		avatarContainer.classList.add('t-avatar-container');
		avatarContainer.appendChild(currUserAvatar);

		window.addEventListener('keyup', function (event) {
			if (event.defaultPrevented) {
				return
			}
			console.log(event.key);
			if (event.key === 'Enter' && event.ctrlKey) {
				console.log('pressed enter and control');
			}
			event.preventDefault()
		});
		/*
			logoutBt.addEventListener('click', function(e){
					var target = e.target;
					XFZ.status.page = 'logout';
					XFZ.setPage();
				}, false);
			console.log('here')
			postBt.addEventListener('click', function(e){
				var target = e.target;
				var inputArea = document.getElementById('inputArea');
				var parameter = {};
				var textArray = inputArea.value.split(' ');
				var char;
				for(var i = 0; i < textArray.length; i++){
					char = textArray[i].split('');
					if(char[0] === '@'){
						console.log('textArray :' + textArray[i]);
						console.log('inputArea.dataset :');
						console.log(inputArea.dataset);
						if(textArray[i] === '@' + inputArea.dataset.replyToName){
							parameter = inputArea.dataset;
							parameter.isReply = true;
						}
					}
				}
				parameter.text = inputArea.value;
				console.log(parameter);

				XFZ.Post('/action/postStatus', parameter, function(data){
					document.getElementById('inputArea').value = 'sent';
				});
			}, false);
		*/
		XFZ.appendChilds(inputContainer, [avatarContainer, inputBox]);

		return inputContainer;
	},
	/*
	 *Setup the timeline
	 */
	setTimeline : function(data, hidden){
		var timelineStream = document.getElementById('timelineStream');
		// these css will move to the css file in the future
		var liStyle = {
			width : '340px',
			minHeight : '60px',
			listStyleType : 'none',
			paddingLeft: '2px',
			paddingTop: '2px',
			paddingRight: '2px',
			marginTop: '-3px'
		};
		var userAvatarCellStyle = {
			height : '32px',
			gridColumnStart : '1',
			gridColumnEnd : '2'
		};
		var userAvatarStyle = {
			width: '32px',
			height : '32px',
			fontSize: '12px',
		};
		var contentStyle = {
			gridColumnStart : '2',
			gridColumnEnd : '3'
		};
		var contentTopStyle = {
			display: 'block',
			fontSize : '13px',
		};
		var contentBottomStyle = {
			display: 'block',
			fontSize: '12px',
		};
		var controlPanelStyle = {
			height: '60px',
			gridColumnStart : '3',
			gridColumnEnd : 'end'
			//marginRight : '20px'
		};
		var replyStyle = {
			position : 'absolute',
			zIndex : '1',
			right : '5px'
		};
		var hrStyle = {
			width : '360px',
			marginTop : '2px',
			marginBottom : '2px',
			marginLeft : '0px',
			marginRight : '0px'
		};
		console.log(data[0]);
		console.log(data[1]);
		timelineStream.style.paddingLeft = '0';
		//for each data create a message block
		var message, messageContainer;
		var leftCell, userAvatarLink, userAvatar;
		var middleCell, middleTop, content;
		var controlPanel, reply, hr;
		for(var i = 0; i < data.length; i++){
			message = data[i];
			
			// A contianer for each message
			messageContainer = document.createElement('li');
			messageContainer.classList.add('t-message-container');
			
			// Left cell
			leftCell = document.createElement('div');
			userAvatarLink = document.createElement('a');
			userAvatar = document.createElement('img');
			userAvatar.classList.add('t-avatar')
			userAvatar.src = status.user.profile_image_url;
			userAvatarLink.appendChild(userAvatar);
			leftCell.appendChild(userAvatarLink);
			
			messageContainer.appendChild(leftCell);

			// Middle cell
			middleCell = document.createElement('div');
			middleCell.classList.add('t-middle-cell');
			middleTop = document.createElement('a');
			username = document.createElement('span');
			username.classList.add('t-username');
			username.innerHTML = status.user.name;
			middleTop.appendChild(username);
			middleCell.appendChild(middleTop);

			content = document.createElement('p');
			content.classList.add('t-content')
			content.innerHTML = status.text;
			middleCell.appendChild(content);

			messageContainer.appendChild(middleCell);
			
			// Right cell
			controlPanel = document.createElement('span');
			if(status.is_self == false || status.is_self == 'false'){
				reply = document.createElement('a');
				reply.innerHTML = 'R';
				reply.dataset.replyToName = status.user.name;
				reply.dataset.replyToId = status.user.id;
				reply.dataset.replyId = status.id;
				reply.addEventListener('click', function(e){
					var inputArea = document.getElementById('inputArea');
					var atUserList = [];
					var char;
					inputArea.focus();
					inputArea.dataset.replyId = e.target.dataset.replyId;
					inputArea.dataset.replyToId = e.target.dataset.replyToId;
					inputArea.dataset.replyToName = e.target.dataset.replyToName;
					inputArea.dataset.isReply = true;
					var text = document.getElementById(e.target.dataset.replyId).lastChild.innerHTML;
					console.log(text);
					var textArray = text.split(' ');
					console.log(textArray);
					//找到原消息中所有被@的用户
					for(var i = 0; i < textArray.length; i++){
						char = textArray[i].split('');
						if(char[0] === '@'){
							atUserList.push(textArray[i]);
						}
					}
					inputArea.value = '@' + e.target.dataset.replyToName + ' ';
					for(var i = 0; i < atUserList.length; i++){
						inputArea.value += atUserList + ' ';
					}
				}, false);

				controlPanel.appendChild(reply);
			}
			else{
				destroy = document.createElement('a');
				//当发布信息的用户是自己的话,回复键改为删除键
				destroy.innerHTML = 'D';
				destroy.dataset.msgId = status.id;
				destroy.addEventListener('click', function(e){
					XFZ.Post('/action/destroyStatus', {msgId : e.target.dataset.msgId}, function(data){
						if(data.success == true){
							var last
							var element = document.getElementById(e.target.dataset.msgId).parentElement;
							if(element.classList.contains('first')){
								element.parentElement.firstChild.nextSibling.classList.add('first');
							}
							element.outerHTML = '';
						}
					});
				}, false);
				controlPanel.appendChild(destroy);
			}
			XFZ.setStyle(controlPanel, controlPanelStyle);
			XFZ.appendChilds(timelineContainer, [userAvatarCell, content, controlPanel]);
			li.appendChild(timelineContainer);
			hr = document.createElement('hr');
			XFZ.setStyle(hr, hrStyle);
			li.addEventListener('mouseover', function(e){
				console.log(e);
				if (e.target.localName === 'li'){
					e.target.style.setProperty('background-color','#5EA8C9','important');
				}
			});
			li.addEventListener('mouseleave', function(e){
				console.log(e);
				e.target.style.setProperty('background-color','white','important');
			});
			li.appendChild(hr);
			if(hidden){
				li.style.display = 'none';
				timelineStream.insertBefore(li, document.getElementsByClassName('first')[0]);
				document.getElementsByClassName('first')[0].classList.remove('first');
				li.classList.add('unread');
			}
			else{
				timelineStream.appendChild(li);
				if(i == data.length - 1){
					li.classList.add('last');
				}
			}
			if(li == timelineStream.firstChild){
				li.classList.add('first');
			}
		}
	},
	setBody : function(){
		switch(XFZ.status.nav){
			case 'timeline' : 
				XFZ.body.timeline();
				break;
			case 'mention' :
				XFZ.body.mention();
				break;
			case 'message' :
				XFZ.body.message();
				break;
			case 'favorite' :
				XFZ.body.favorite();
				break;
		}
	},
	/*
	* get new timeline based on the last message id
	*/
	checkNewTimeline : function(){
		var first = document.getElementsByClassName('first')[0].childNodes[0].childNodes[1];
		var notification;
		XFZ.Post('/action/checkNewTimeline', {firstId: first.id}, function(data){
			if(data.success){
				if(data.data.length > 0){
					notification = document.getElementById('timelineNotification');
					// if the notification already here, plus new number to it
					if(notification.innerHTML !== ''){
						notification.firstChild.innerHTML = data.data.length + +notification.firstChild.innerHTML;
					}
					else{
						var button = document.createElement('button');
						var buttonStyle = {
							width : '100%',
							height : '20px',
							textAlign : 'center'
						}
						button.innerHTML = data.data.length;
						XFZ.setStyle(button, buttonStyle);
						notification.appendChild(button);
						button.addEventListener('click', function(e){
							var i = 0;
							var unread = document.getElementsByClassName('unread');
							document.getElementById('timelineNotification').innerHTML = '';
							for(i = 0; i <= unread.length; i++){
								unread[count].style.display = 'block';
								unread[count].classList.remove('unread');
							}
						}, false);
					}
					XFZ.setTimeline(data.data, true);
				}
			}
		});
	},
	body : {
		timeline : function(){
			document.getElementById('bodyContainer').innerHTML = '载入中..';
			if(XFZ.status.notMain){
				bodyContainer.innerHTML = 'Under construction';
			}
			else{
				var timeline = document.createElement('div');
				timeline.id = 'timeline';
				timeline.classList.add('t-timeline-container')

				// The notification area
				var timelineNotification = document.createElement('div');
				timelineNotification.id = 'timelineNotification';

				// The main timeline container. Contains message container
				var timelineStream = document.createElement('ol');
				timelineStream.id = 'timelineStream';

				XFZ.appendChilds(timeline, [timelineNotification, timelineStream]);
				XFZ.Get('/action/getCurrUserHomeTimeline', function(data){
					if(!data.data){
						var li = document.createElement('li');
						li.style.listStyleType = 'none';
						li.innerHTML = '没有信息哦.';
						document.getElementById('ol').appendChild(li);
					}
					else{
						bodyContainer.innerHTML = '';
						bodyContainer.appendChild(timeline);
						XFZ.setTimeline(data.data);
						if(data.data.length >= 10){
							timeline.addEventListener('scroll', function(e){
								var target = e.target;
								var top = target.scrollTop;
								var height = target.scrollHeight;
								var currHeight = target.clientHeight;
								var gap = top / (height - currHeight) * 100;
								if(gap >= 70 && !XFZ.status.loadingContent){
									XFZ.status.loadingContent = true;
									var last = document.getElementsByClassName('last')[0];
									var contentId = last.childNodes[0].childNodes[1].id;
									var loadingLi = document.createElement('li');
									loadingLi.innerHTML = '载入中..';
									last.parentNode.appendChild(loadingLi);
									XFZ.Post('/action/getHomeTimelineBeforeLast', {contentId: contentId}, function(data){
										var parent = document.getElementById('ol');
										if(data.success){
											parent.removeChild(parent.lastChild);
											document.getElementsByClassName('last')[0].classList.remove('last');
											XFZ.setTimeline(data.data);
											XFZ.status.loadingContent = false;
										}
									});
								}
							}, false);
						}
						setInterval(function(){
							XFZ.checkNewTimeline();
						}, 10 * 1000);
					}
				});
			}
		}
	},
	setStyle : function(id, styles){
		for(style in styles){
			id.style[style] = styles[style];
		}
	},
	appendChilds : function(parent, array){
		for(id in array){
			parent.appendChild(array[id]);
		}
	},
	page : {
		welcome : function(){
			container.innerHTML = '请稍候..';
			var containerStyle = {
				overflow : 'hidden'
			}
			XFZ.setStyle(container, containerStyle);
			XFZ.Get('/action/authorize', function(data){
				if(!data.success){
					window.location = data.url;
				}
				else{
					XFZ.status.page = 'main';
					XFZ.setPage();
				}
			});
		},
		logout : function(){
			container.innerHTML = '载入中..';
			var div = document.createElement('div');
			XFZ.Get('/action/logout', function(data){
				if(data.success){
					container.innerHTML = '登出成功!';
				}
			});
		},
		main : function(){
			container.innerHTML = '加载中..';
			var div = document.createElement('div');

			var navBarContainer = document.createElement('div');
			navBarContainer.id = 'navBarContainer';
			var timelineBar = document.createElement('div');
			timelineBar.id = 'timelineBar';
			var navBarContainerStyle = {
				borderWidth : '1px',
				height : '20px',
				width : '350px'
			}
			XFZ.setStyle(navBarContainer, navBarContainerStyle);
			timelineBar.innerHTML = 'Timeline';
			var timelineBarStyle = {
				display: 'inline-block',
				width : '80px',
				paddingLeft : '10px',
				paddingRight : '10px',
				borderBottom : '5px'
			}
			XFZ.setStyle(timelineBar, timelineBarStyle);
			navBarContainer.appendChild(timelineBar);

			var bodyContainer = document.createElement('div');
			bodyContainer.id = 'bodyContainer';
			var timeline = document.createElement('div');
			

			XFZ.Get('/action/getCurrUser', function(data){
				if(data.success){
					var inputContainer = XFZ.setInput();
					XFZ.status.currUser = data.data;
					container.innerHTML = '';
					XFZ.appendChilds(div, [inputContainer, navBarContainer, bodyContainer]);
					container.appendChild(div);

					console.log(XFZ.status.currUser);
					document.getElementById('currUserAvatar').src = XFZ.status.currUser.profile_image_url;
					XFZ.status.nav = 'timeline';
					XFZ.status.notCurrUser = false;
					XFZ.setBody();
				}
			});

		},
	}
};
XFZ.init();
			