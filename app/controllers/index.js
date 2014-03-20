/*
 * Owner: Chris Geirman
 * Written bY: Netsmartz LLC
 */

var strTitle = "Frog Quest";
// title to be used in the creating alertdialog
var strNoInternetAvailable = "No Internet Is Available, Please try again later !";
//string to used when no internet is availanle in alertdilaog
var globalYearContainer = null;
//used to save the year globaly, used when eventlist is generated
var BaseUrl = "http://test.frogquest.com/api/";
//BaseUrl to call the webservice
var AuthToken = "2K70q4gmBAe6pONL3sRF";
//Auth token to use when calling the webservice
var urlRegister='http://www.frogquest.com/register';
// url string for registering event
var urlResetPassword='http://www.frogquest.com/reset-password';
// url string for reset password
var urlFindEvents='http://www.frogquest.com/events';
// url string for finding events
var currentOpenView=$.Page2;
//Contains the current open view
var previousOpenView=$.LoginView;
//contains the prevously open view
var style;
// style vairable for the activity indicator
var args = arguments[0] || {};
// Takes the number of the option in the menu, initialized empty
var isVisible = false;
// Flag valeu whether a meu is visible or not
var barHeight;
//variable having Heignt of the menu parent bar
var optionsHeight;
//variable having Height of the menu 
optionsHeight = $.options.children.length * $.options.children[0].height; // logic decices the menu height
barHeight = $.bar.height; // gets the height of id=bar from xml, basically number of elements inserted in the menu

$.options.applyProperties({
	top : barHeight - optionsHeight // setting the top by minus option hieght from bar height
});

if (Ti.Platform.osname === 'iphone') {
	style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK; // default style activity indicator for iphone
} else {
	style = Titanium.UI.ActivityIndicatorStyle.PLAIN;// default style activity indicator for android
}

$.textFieldUsername.keyboardType = Titanium.UI.KEYBOARD_EMAIL;
// !important - Used to set the keyboard type for emailField
$.login.addEventListener('touchstart', funcChangeColorOntouchStart);
// touchstart event for login, to change the color when pressed
$.findEvents.addEventListener('touchstart', funcChangeColorOntouchStart);
// touchstart event for findEvents, to change the color when pressed
$.login.addEventListener('touchstart', funcChangeColorOntouchEnd);
// touchstart event for login, to change the color when pressed
$.findEvents.addEventListener('touchstart', funcChangeColorOntouchEnd);
// touchstart event for findEvents, to change the color when pressed
$.login.addEventListener('touchmove', funcChangeColorOntouchStart);
// fix for the button to remain white, when they are touch and dragged
$.findEvents.addEventListener('touchmove', funcChangeColorOntouchStart);
// fix for the button to remain white, when they are touch and dragged

funcPlatformDependedAdjustments();
// call for function to adjust the Ui element on diffrent platforms

funcGetVars();
// call for the fucntion to set he string name to be used further in app

function funcCloseView(viewId) {

	/*
	 * function to close the view that is visble to user. Used to create the
	 * effect of closing the current window.
	 */
	previousOpenView=viewId;
	viewId.hide();
}

function funcShowView(viewId) {
	/*
	 * function to open the view that is invisble to user. Used to create the
	 * effect of opening the hidden window.
	 */
	currentOpenView=viewId;
	viewId.show();
	alert("show "+viewId);
}

function funcOnClickLoginUser(e) {
	/*
	 * function on the click of login button at Login screen.
	 * button id="login"
	 */

	if (funcIsInternetAvailable()) {
		funcShowProgressIndicator();
		//loginUser($.textFieldUsername.value,$.textFieldPassword.value);
		funcLoginUser("chris@geirman.com","123");
	} else {
		funcShowDialog(strTitle, strNoInternetAvailable);

	}

}

function funcLoginUser(username, password) {
	/*
	 *  function of core login
	 */
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onerror = function(e) {
		Ti.API.error('Bad Sever =>' + e.error);
		funcShowDialog(strTitle, e.error);// error when connection gets dropped in presence of internet 
	};

	xhr.open("POST", BaseUrl + "getUser"); // opening connection to the server.
	xhr.setRequestHeader("content-type", "application/json");
	var params = { // Params to be send along with the post request
		AuthToken : AuthToken,
		email : username,
		password : password
	};
	xhr.send(JSON.stringify(params)); // params are bounded in json array for passing
	xhr.onload = function() {
		if (this.status == '200') { // if ok

			if (this.readyState == 4) {
				var response = JSON.parse(this.responseText); // responseText the string as reply from web service
				Ti.API.info('Response = ' + response);
				if (response.hasOwnProperty('firstname')) {
					funcCloseView($.LoginView);					
					hideProgressIndicator();
					funcGetEventList(response.id);
				} else {
					hideProgressIndicator();
					funcShowDialog(strTitle, response.friendly_message);
				}
			} else {
				alert('HTTp Error Response Status Code = ' + this.status);
				hideProgressIndicator();
			}
		} else {
			alert('HTTp Error Response Status Code = ' + this.status);
			hideProgressIndicator();

		}
	};
}

function funcChangeColorOntouchStart(e) {
	/*
	 * function when to change the color of the button on touch start
	 */
	e.source.id.backgroundColor = '#ffffffff';
}

function funcChangeColorOntouchEnd(e) {
	/*
	 * function when to change the color of the button on touch end
	 */
	e.source.id.backgroundColor = '#dd5522';
}


function funcRegister(e) {
	/*
	 * Open the web browser to register for the events
	 */
	Titanium.Platform.openURL(urlRegister);
}

function funcResetPwd(e) {
	/*
	 * Open the web browser to reset the password
	 */
	Titanium.Platform.openURL(urlResetPassword);
}

function findeven(e) {
	/*
	 * Open the web browser to find the ongoing events
	 */
	Titanium.Platform.openURL(urlFindEvents);
}


function toggle(e) {
/*
 * function to toggle the visibility of the menu
 */
	return isVisible ? hide() : show();
}

function hide() {
	/*
	 * funciton to hide the menu visibility
	 */
	$.textFieldUsername.blur(); // takes the focus out of the textfield
	$.textFieldPassword.blur(); // takes the focus out of the textfield
	funcHideKeyboard();
	isVisible = false;
	$.container.visible = false;
	$.container.height = Ti.UI.SIZE;
	$.container.width = Ti.UI.SIZE;
	
	return;
}

function mayHide(e) {

	if (e.direction === 'up') {
		hide();
	}

	return;
}

function show() {
	/*
	 * function to show the menu
	 */
	isVisible = true;
	$.container.visible = true;
	$.container.height = Ti.UI.FILL;// occupy the full parent height
	$.container.width = Ti.UI.FILL;// occupy the full parent width
	
	return;
}



function logOut(e) {
	hide();
	alert(currentOpenView);
	funcCloseView(currentOpenView);	
	funcShowView($.LoginView);
}

function preference(e) {
	hide();
	alert("Coming soon");
}

function Home(e) {
hide();
funcCloseView(currentOpenView);	
funcShowView($.Page2);
}

$.index.addEventListener('android:back', function(e) {
	if ($.LoginView.visible === true) {
		var activity = Titanium.Android.currentActivity;
		activity.finish();
	}
	else
	{
		funcCloseView(currentOpenView);
		funcShowView(previousOpenView);
	}

});



function funcShowProgressIndicator() {
	/*
	 * function to show the activity indicator
	 */
	funcHideKeyboard();
	$.blurout.show();
	$.activityIndicator.message = "Please wait....";
	$.activityIndicator.style = style;
	$.activityIndicator.show();
}

function hideProgressIndicator() {
	/*
	 * function to hide the activity indicator
	 */
	$.blurout.hide();
	$.activityIndicator.hide();
}

function funcHideKeyboard() {
	/*
	 * funtion to hide the keyboard when open in front
	 */
	if (Ti.Platform.osname === 'iphone')//if the platform is iPhone
	{
		$.textFieldUsername.blur();
		//remove the focus from iPhone to hide keyboard, its a workaround
		$.textFieldPassword.blur();
		//remove the focus from iPhone to hide keyboard, its a workaround
	} else//else android
	{
		Ti.UI.Android.hideSoftKeyboard();
		//sepecifc function to hide keyboard
	}

}

function funcIsInternetAvailable() {
	/*
	 * function to check whether the internet is available or not
	 */
	if (Titanium.Network.networkType === Titanium.Network.NETWORK_NONE) {
		return false;
		// internet not available
	} else {
		return true;
		//internet available
	}
}

function funcPlatformDependedAdjustments() {
	/*
	 * !important- function to set adjustment for android and iphone to make this whole framework actually work in sensible manner
	 */
	if (Ti.Platform.osname === 'iphone')//if the platform is iphone
	{
		$.container.bottom = "60%";
		$.tableViewPage.height = 120;
		$.tableViewTable.backgroundColor = "transparent";
		$.tableViewTable.height = "90%";
		$.tableViewTable.opacity = 0;
		$.eventListTable.height = "95%";
		$.eventListTable.top = "5%";
		$.eventListTable.backgroundColor = "transparent";
		$.textFieldUsername.paddingLeft = 10;
		$.textFieldPassword.paddingLeft = 10;
		$.tableViewLogin.height = "298dp";
		$.tableViewLogin.backgroundColor = "#B3ffffff";
		$.tableViewLogin.backgroundImage = "/images/bg.png";
		$.tableViewLogin.width = "80%";
		$.tableNoEventmain.backgroundImage = "/images/bg.png";
		$.tableViewLogin.borderRadius = "30";
		$.tableViewLogin.separatorColor = "transparent";
		$.tableViewLogin.bottom = "30dp";
		$.tableNoEventmain.height = "250dp";
		$.tableRowNoEventTitle.opacity = 0;
		$.tableRowNoEventTitle.top = "30";
		$.tableRowNoEventTitle.height = "50";
		$.tableRowEventBody.height = "auto";
	
	} else {
		$.eventlistpageId.top = "20dp";
		$.container.top = 49;
		$.tableViewLogin.height = "300dp";
		$.tableViewLogin.backgroundColor = "#B3ffffff";
		$.tableViewLogin.width = "80%";
		$.tableNoEventmain.height = "300dp";
		$.tableViewLogin.borderRadius = "30";
		$.tableViewLogin.separatorColor = "transparent";
		$.tableViewLogin.bottom = "30dp";
		$.tableRowEventBody.height = "90dp";

	}
}

function funcCreateEventRow(strDate, strEventName, strEventLocation, strTeamId) {
	/*
	 * function to create the row for event list
	 */
	var myDate = [];
	var style;
	var strdefaultYear = null;
	myDate = strDate.split(' ');
	var strEventMonth = myDate[0].substring(myDate[0].length - 1, 0);
	var strEventShortMonth=strEventMonth.substring(0,3);
	var strEventDate = myDate[1];
	var strEventYear = myDate[2];
	var strEventTime = myDate[3];
	var strdateToCompare=myDate[0]+" "+myDate[1]+" "+myDate[2];
	var strColor,strImage;
	if(getDate()==strdateToCompare)
	{
	strColor="#dd5522";
	strImage="/images/org_arrow_icon.png";
	}
	else
	{
	strColor="#667733";
	strImage="/images/green_arrow_icon.png";
	}
	
	var tableRow = Ti.UI.createTableViewRow({
		height : 70,
		opacity : 0,
		separatorColor : "transparent"
	});
	
	
if (Ti.Platform.osname === 'iphone') {
	tableRow.pageTitle = strTeamId;
} else {
	tableRow.title = strTeamId;
}
	
	var viewListBg = Ti.UI.createView({
		backgroundColor : "#b3ffffff",
		width : "100%",
		height : "70dp",
		left : "0dp"
	});

	var viewDateBg = Ti.UI.createView({
		backgroundColor : "#ffffff",
		width : "12%",
		height : "50dp",
		left : "10dp",
		borderRadius : "10"
	});

	var labelMth = Ti.UI.createLabel({
		backgroundColor : strColor,
		width : "100%",
		height : "20dp",
		top : "0dp",
		textAlign : "center",
		color : "#ffffff",
		font : {
			fontSize : "14",
			fontFamily : "Roboto-Bold"
		}
	});

	var labelDateno = Ti.UI.createLabel({
		color : "#000000",
		top : "18dp",
		textAlign : "center",
		font : {
			fontSize : "22",
			fontFamily : "Roboto-Bold"
		}
	});

	viewDateBg.add(labelMth);
	viewDateBg.add(labelDateno);

	var viewtextBg = Ti.UI.createView({
		width : "70%",
		height : "60dp"
	});

	var labelEventTitle = Ti.UI.createLabel({
		textAlign : "center",
		color : strColor,
		font : {
			fontSize : "17",
			fontFamily : "RobotoCondensed-Regular"
		},
		top : "0dp",
		left : "3dp"
	});

	var labelEventLocation = Ti.UI.createLabel({
		textAlign : "left",
		color : "#61615d",
		font : {
			fontSize : "13",
			fontFamily : "RobotoCondensed-Regular"
		},
		bottom : "5dp",
		left : "3dp"
	});

	viewtextBg.add(labelEventTitle);
	viewtextBg.add(labelEventLocation);

	var selectArrowBg = Ti.UI.createView({
		backgroundColor : "#b3ffffff",
		width : "15%",
		height : "70dp",
		right : "0dp",
		textAlign : "center"
	});

	// Create an ImageView.
	var imageSelectedArrow = Ti.UI.createImageView({
		image : strImage,
		height : "34dp",
		right : "20dp",
		textAlign : "center"
	});

	selectArrowBg.add(imageSelectedArrow);
	viewListBg.add(viewDateBg);
	viewListBg.add(viewtextBg);
	viewListBg.add(selectArrowBg);

	labelMth.text = strEventShortMonth;
	labelDateno.text = strEventDate;
	labelEventTitle.text = strEventName;
	labelEventLocation.text = strEventLocation;

	tableRow.add(viewListBg);

	tableRow.addEventListener('click', function(e) {
		if (Ti.Platform.osname === 'iphone') {
	$.Page4.show();
	$.Page3.hide();
} else {
	$.Page4.show();
	$.Page3.hide();
}

	});
	return tableRow;
}

function funcGetEventList(Userid) {
	/*
	 * function to get event List
	 */
	
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onerror = function(e) {
		Ti.API.error('Bad Sever =>' + e.error);
	};

	xhr.open("GET", BaseUrl + "getUserEvents?AuthToken=" + AuthToken + "&UserId=" + Userid);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send();
	xhr.onload = function() {
		if (this.status == '200') {

			if (this.readyState == 4) {
				var response;
				response = JSON.parse(this.responseText);

				if (response[0] === undefined) {
					
					funcSetViewBodyForPage2(response.friendly_message.title,response.friendly_message.body);
					funcShowView($.Page2);					
					hideProgressIndicator();

				} else {
					if (response[0].hasOwnProperty('location')) {

						var tableData = [];
						for (var i = 0; i < response.length; i++) {
							var splitStartDate = response[i].startDate.split(" ");
							if (globalYearContainer != splitStartDate[2]) {
								if (globalYearContainer === null) {
									tableData.push(createEventYearRow(splitStartDate[2]));
								} else {
									tableData.push(createBlankRow());
									tableData.push(createEventYearRow(splitStartDate[2]));
								}

							}

							tableData.push(funcCreateEventRow(response[i].startDate, response[i].eventTitle, response[i].location, response[i].teamId));
						}

						// Set Table Data
						$.eventListTable.height = tableData.length * 70;
						$.eventListTable.setData(tableData);

						// Resource Clean-Up
						tableData = null;

						$.Page3.show();
						hideProgressIndicator();
					}
				}

			} else {
				alert('HTTp Error Response Status Code = ' + this.status);
			}
		} else {
			alert('HTTp Error Response Status Code = ' + this.status);

		}
	};
}

function funcSetViewBodyForPage2(title,body)
{
	$.lableNoEventTitle.text = title; 
					$.lableNoEventBody.height = "auto";
					$.lableNoEventBody.text = body;
}
function createEventYearRow(strYear) {
	/*
	 * function to create the year header to the EventList
	 */
	var tableRow = Ti.UI.createTableViewRow({
		height : 30,
		opacity : 0,
		separatorColor : "transparent"
	});
	globalYearContainer = strYear;
	var labelYearBg = Ti.UI.createLabel({
		color : "#ffffff",
		backgroundColor : "#444411",
		font : {
			fontSize : "15",
			fontFamily : "RobotoCondensed-Bold"
		},
		height : "30dp",
		left : "0dp",
		width : "20%",
		textAlign : "center"

	});
	labelYearBg.text = strYear;

	tableRow.add(labelYearBg);
	return tableRow;
}

function createBlankRow() {
	/*
	 * function to create a blank row between the filled table row
	 */

	var tableRow = Ti.UI.createTableViewRow({
		height : 40,
		opacity : 0,
		separatorColor : "transparent"
	});

	return tableRow;
}

function funcShowDialog(title, body) {
	/*
	 * function to showDialog
	 */
	var dialog = Ti.UI.createAlertDialog({
		message : body,
		ok : 'OK',
		title : title
	}).show();
}

function getDate() {

/*
 * function to get the current date in predefined format
 */
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var currentTime = new Date();
	var month = currentTime.getMonth();
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();

	return monthNames[month] + ", " + day + " " + year;

}

function funcGetVars()
{
	/*
	 * funcitoon to get values from the server
	 */
	
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onerror = function(e) {
		Ti.API.error('Bad Sever =>' + e.error);
	};

	xhr.open("GET", BaseUrl + "getVars?AuthToken=" + AuthToken);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send();
	xhr.onload = function() {
		if (this.status == '200') {

			if (this.readyState == 4) {
				var response;
				response = JSON.parse(this.responseText);
				
			} else {
				alert('HTTp Error Response Status Code = ' + this.status);
			}
		} else {
			alert('HTTp Error Response Status Code = ' + this.status);

		}
	};
}
$.index.open(); // open the the window index.xml to apply the js manipulation
