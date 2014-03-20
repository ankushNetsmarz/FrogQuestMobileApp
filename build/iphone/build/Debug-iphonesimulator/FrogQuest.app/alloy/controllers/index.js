function Controller() {
    function funcCloseView(viewId) {
        previousOpenView = viewId;
        viewId.hide();
    }
    function funcShowView(viewId) {
        currentOpenView = viewId;
        viewId.show();
        alert("show " + viewId);
    }
    function funcOnClickLoginUser() {
        if (funcIsInternetAvailable()) {
            funcShowProgressIndicator();
            funcLoginUser("chris@geirman.com", "123");
        } else funcShowDialog(strTitle, strNoInternetAvailable);
    }
    function funcLoginUser(username, password) {
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onerror = function(e) {
            Ti.API.error("Bad Sever =>" + e.error);
            funcShowDialog(strTitle, e.error);
        };
        xhr.open("POST", BaseUrl + "getUser");
        xhr.setRequestHeader("content-type", "application/json");
        var params = {
            AuthToken: AuthToken,
            email: username,
            password: password
        };
        xhr.send(JSON.stringify(params));
        xhr.onload = function() {
            if ("200" == this.status) if (4 == this.readyState) {
                var response = JSON.parse(this.responseText);
                Ti.API.info("Response = " + response);
                if (response.hasOwnProperty("firstname")) {
                    funcCloseView($.LoginView);
                    hideProgressIndicator();
                    funcGetEventList(response.id);
                } else {
                    hideProgressIndicator();
                    funcShowDialog(strTitle, response.friendly_message);
                }
            } else {
                alert("HTTp Error Response Status Code = " + this.status);
                hideProgressIndicator();
            } else {
                alert("HTTp Error Response Status Code = " + this.status);
                hideProgressIndicator();
            }
        };
    }
    function funcChangeColorOntouchStart(e) {
        e.source.id.backgroundColor = "#ffffffff";
    }
    function funcChangeColorOntouchEnd(e) {
        e.source.id.backgroundColor = "#dd5522";
    }
    function funcRegister() {
        Titanium.Platform.openURL(urlRegister);
    }
    function funcResetPwd() {
        Titanium.Platform.openURL(urlResetPassword);
    }
    function findeven() {
        Titanium.Platform.openURL(urlFindEvents);
    }
    function toggle() {
        return isVisible ? hide() : show();
    }
    function hide() {
        $.textFieldUsername.blur();
        $.textFieldPassword.blur();
        funcHideKeyboard();
        isVisible = false;
        $.container.visible = false;
        $.container.height = Ti.UI.SIZE;
        $.container.width = Ti.UI.SIZE;
        return;
    }
    function mayHide(e) {
        "up" === e.direction && hide();
        return;
    }
    function show() {
        isVisible = true;
        $.container.visible = true;
        $.container.height = Ti.UI.FILL;
        $.container.width = Ti.UI.FILL;
        return;
    }
    function logOut() {
        hide();
        alert(currentOpenView);
        funcCloseView(currentOpenView);
        funcShowView($.LoginView);
    }
    function preference() {
        hide();
        alert("Coming soon");
    }
    function Home() {
        hide();
        funcCloseView(currentOpenView);
        funcShowView($.Page2);
    }
    function funcShowProgressIndicator() {
        funcHideKeyboard();
        $.blurout.show();
        $.activityIndicator.message = "Please wait....";
        $.activityIndicator.style = style;
        $.activityIndicator.show();
    }
    function hideProgressIndicator() {
        $.blurout.hide();
        $.activityIndicator.hide();
    }
    function funcHideKeyboard() {
        if ("iphone" === Ti.Platform.osname) {
            $.textFieldUsername.blur();
            $.textFieldPassword.blur();
        } else Ti.UI.Android.hideSoftKeyboard();
    }
    function funcIsInternetAvailable() {
        return Titanium.Network.networkType === Titanium.Network.NETWORK_NONE ? false : true;
    }
    function funcPlatformDependedAdjustments() {
        if ("iphone" === Ti.Platform.osname) {
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
        var myDate = [];
        myDate = strDate.split(" ");
        var strEventMonth = myDate[0].substring(myDate[0].length - 1, 0);
        var strEventShortMonth = strEventMonth.substring(0, 3);
        var strEventDate = myDate[1];
        myDate[2];
        myDate[3];
        var strdateToCompare = myDate[0] + " " + myDate[1] + " " + myDate[2];
        var strColor, strImage;
        if (getDate() == strdateToCompare) {
            strColor = "#dd5522";
            strImage = "/images/org_arrow_icon.png";
        } else {
            strColor = "#667733";
            strImage = "/images/green_arrow_icon.png";
        }
        var tableRow = Ti.UI.createTableViewRow({
            height: 70,
            opacity: 0,
            separatorColor: "transparent"
        });
        "iphone" === Ti.Platform.osname ? tableRow.pageTitle = strTeamId : tableRow.title = strTeamId;
        var viewListBg = Ti.UI.createView({
            backgroundColor: "#b3ffffff",
            width: "100%",
            height: "70dp",
            left: "0dp"
        });
        var viewDateBg = Ti.UI.createView({
            backgroundColor: "#ffffff",
            width: "12%",
            height: "50dp",
            left: "10dp",
            borderRadius: "10"
        });
        var labelMth = Ti.UI.createLabel({
            backgroundColor: strColor,
            width: "100%",
            height: "20dp",
            top: "0dp",
            textAlign: "center",
            color: "#ffffff",
            font: {
                fontSize: "14",
                fontFamily: "Roboto-Bold"
            }
        });
        var labelDateno = Ti.UI.createLabel({
            color: "#000000",
            top: "18dp",
            textAlign: "center",
            font: {
                fontSize: "22",
                fontFamily: "Roboto-Bold"
            }
        });
        viewDateBg.add(labelMth);
        viewDateBg.add(labelDateno);
        var viewtextBg = Ti.UI.createView({
            width: "70%",
            height: "60dp"
        });
        var labelEventTitle = Ti.UI.createLabel({
            textAlign: "center",
            color: strColor,
            font: {
                fontSize: "17",
                fontFamily: "RobotoCondensed-Regular"
            },
            top: "0dp",
            left: "3dp"
        });
        var labelEventLocation = Ti.UI.createLabel({
            textAlign: "left",
            color: "#61615d",
            font: {
                fontSize: "13",
                fontFamily: "RobotoCondensed-Regular"
            },
            bottom: "5dp",
            left: "3dp"
        });
        viewtextBg.add(labelEventTitle);
        viewtextBg.add(labelEventLocation);
        var selectArrowBg = Ti.UI.createView({
            backgroundColor: "#b3ffffff",
            width: "15%",
            height: "70dp",
            right: "0dp",
            textAlign: "center"
        });
        var imageSelectedArrow = Ti.UI.createImageView({
            image: strImage,
            height: "34dp",
            right: "20dp",
            textAlign: "center"
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
        tableRow.addEventListener("click", function() {
            if ("iphone" === Ti.Platform.osname) {
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
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onerror = function(e) {
            Ti.API.error("Bad Sever =>" + e.error);
        };
        xhr.open("GET", BaseUrl + "getUserEvents?AuthToken=" + AuthToken + "&UserId=" + Userid);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send();
        xhr.onload = function() {
            if ("200" == this.status) if (4 == this.readyState) {
                var response;
                response = JSON.parse(this.responseText);
                if (void 0 === response[0]) {
                    funcSetViewBodyForPage2(response.friendly_message.title, response.friendly_message.body);
                    funcShowView($.Page2);
                    hideProgressIndicator();
                } else if (response[0].hasOwnProperty("location")) {
                    var tableData = [];
                    for (var i = 0; response.length > i; i++) {
                        var splitStartDate = response[i].startDate.split(" ");
                        if (globalYearContainer != splitStartDate[2]) if (null === globalYearContainer) tableData.push(createEventYearRow(splitStartDate[2])); else {
                            tableData.push(createBlankRow());
                            tableData.push(createEventYearRow(splitStartDate[2]));
                        }
                        tableData.push(funcCreateEventRow(response[i].startDate, response[i].eventTitle, response[i].location, response[i].teamId));
                    }
                    $.eventListTable.height = 70 * tableData.length;
                    $.eventListTable.setData(tableData);
                    tableData = null;
                    $.Page3.show();
                    hideProgressIndicator();
                }
            } else alert("HTTp Error Response Status Code = " + this.status); else alert("HTTp Error Response Status Code = " + this.status);
        };
    }
    function funcSetViewBodyForPage2(title, body) {
        $.lableNoEventTitle.text = title;
        $.lableNoEventBody.height = "auto";
        $.lableNoEventBody.text = body;
    }
    function createEventYearRow(strYear) {
        var tableRow = Ti.UI.createTableViewRow({
            height: 30,
            opacity: 0,
            separatorColor: "transparent"
        });
        globalYearContainer = strYear;
        var labelYearBg = Ti.UI.createLabel({
            color: "#ffffff",
            backgroundColor: "#444411",
            font: {
                fontSize: "15",
                fontFamily: "RobotoCondensed-Bold"
            },
            height: "30dp",
            left: "0dp",
            width: "20%",
            textAlign: "center"
        });
        labelYearBg.text = strYear;
        tableRow.add(labelYearBg);
        return tableRow;
    }
    function createBlankRow() {
        var tableRow = Ti.UI.createTableViewRow({
            height: 40,
            opacity: 0,
            separatorColor: "transparent"
        });
        return tableRow;
    }
    function funcShowDialog(title, body) {
        Ti.UI.createAlertDialog({
            message: body,
            ok: "OK",
            title: title
        }).show();
    }
    function getDate() {
        var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        var currentTime = new Date();
        var month = currentTime.getMonth();
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        return monthNames[month] + ", " + day + " " + year;
    }
    function funcGetVars() {
        var xhr = Titanium.Network.createHTTPClient();
        xhr.onerror = function(e) {
            Ti.API.error("Bad Sever =>" + e.error);
        };
        xhr.open("GET", BaseUrl + "getVars?AuthToken=" + AuthToken);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send();
        xhr.onload = function() {
            if ("200" == this.status) if (4 == this.readyState) {
                var response;
                response = JSON.parse(this.responseText);
            } else alert("HTTp Error Response Status Code = " + this.status); else alert("HTTp Error Response Status Code = " + this.status);
        };
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundImage: "/images/bg.png",
        navBarHidden: "true",
        fullscreen: "true",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    hide ? $.__views.index.addEventListener("click", hide) : __defers["$.__views.index!click!hide"] = true;
    $.__views.LoginView = Ti.UI.createView({
        backgroundImage: "/images/logoshadow.png",
        id: "LoginView"
    });
    $.__views.index.add($.__views.LoginView);
    var __alloyId1 = [];
    $.__views.__alloyId2 = Ti.UI.createTableViewRow({
        border: "none",
        height: "9dp",
        backgroundImage: "/images/top_bg.png",
        width: "100%",
        id: "__alloyId2"
    });
    __alloyId1.push($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId3"
    });
    __alloyId1.push($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        color: "#fff",
        height: "50dp",
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        text: "Login",
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId5"
    });
    __alloyId1.push($.__views.__alloyId5);
    $.__views.imageView = Ti.UI.createImageView({
        image: "/images/fqlogo.png",
        top: "20dp",
        bottom: "20dp",
        height: "90dp",
        id: "imageView"
    });
    $.__views.__alloyId5.add($.__views.imageView);
    $.__views.tableRowParent = Ti.UI.createTableViewRow({
        border: "none",
        id: "tableRowParent"
    });
    __alloyId1.push($.__views.tableRowParent);
    var __alloyId6 = [];
    $.__views.tableRowUid = Ti.UI.createTableViewRow({
        border: "none",
        id: "tableRowUid"
    });
    __alloyId6.push($.__views.tableRowUid);
    $.__views.txtuid = Ti.UI.createView({
        borderRadius: "30",
        color: "#000",
        backgroundColor: "#fff",
        height: "50dp",
        width: "80%",
        top: "30dp",
        id: "txtuid"
    });
    $.__views.tableRowUid.add($.__views.txtuid);
    $.__views.textFieldUsername = Ti.UI.createTextField({
        width: "80%",
        left: "0dp",
        backgroundColor: "#B3ffffff",
        color: "#000000",
        height: "40dp",
        font: {
            fontSize: "15",
            fontFamily: "RobotoCondensed-Regular"
        },
        id: "textFieldUsername",
        hintText: "Email"
    });
    $.__views.txtuid.add($.__views.textFieldUsername);
    $.__views.__alloyId7 = Ti.UI.createImageView({
        image: "/images/email_man_icon.png",
        right: "10dp",
        height: "27dp",
        id: "__alloyId7"
    });
    $.__views.txtuid.add($.__views.__alloyId7);
    $.__views.tableRowPid = Ti.UI.createTableViewRow({
        border: "none",
        id: "tableRowPid"
    });
    __alloyId6.push($.__views.tableRowPid);
    $.__views.txtpid = Ti.UI.createView({
        borderRadius: "30",
        color: "#000",
        backgroundColor: "#fff",
        height: "50dp",
        width: "80%",
        top: "10dp",
        id: "txtpid"
    });
    $.__views.tableRowPid.add($.__views.txtpid);
    $.__views.textFieldPassword = Ti.UI.createTextField({
        width: "80%",
        left: "0dp",
        backgroundColor: "none",
        color: "#000000",
        height: "40dp",
        font: {
            fontSize: "15",
            fontFamily: "RobotoCondensed-Regular"
        },
        id: "textFieldPassword",
        hintText: "Password",
        passwordMask: "True"
    });
    $.__views.txtpid.add($.__views.textFieldPassword);
    $.__views.__alloyId8 = Ti.UI.createImageView({
        image: "/images/lock_icon.png",
        right: "10dp",
        height: "27dp",
        id: "__alloyId8"
    });
    $.__views.txtpid.add($.__views.__alloyId8);
    $.__views.tableRowLogin = Ti.UI.createTableViewRow({
        border: "none",
        id: "tableRowLogin"
    });
    __alloyId6.push($.__views.tableRowLogin);
    $.__views.login = Ti.UI.createButton({
        width: "80%",
        height: "50dp",
        color: "#fff",
        borderRadius: "30",
        top: "20dp",
        bottom: "20dp",
        backgroundColor: "#dd5522",
        font: {
            fontSize: "18",
            fontFamily: "RobotoCondensed-Bold"
        },
        title: "Login",
        id: "login"
    });
    $.__views.tableRowLogin.add($.__views.login);
    funcOnClickLoginUser ? $.__views.login.addEventListener("click", funcOnClickLoginUser) : __defers["$.__views.login!click!funcOnClickLoginUser"] = true;
    $.__views.__alloyId9 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId9"
    });
    __alloyId6.push($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createView({
        backgroundColor: "#4d778833",
        width: "80%",
        height: "1dp",
        id: "__alloyId10"
    });
    $.__views.__alloyId9.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId11"
    });
    __alloyId6.push($.__views.__alloyId11);
    $.__views.__alloyId12 = Ti.UI.createView({
        width: "100%",
        height: "55dp",
        top: "10dp",
        textAlign: "center",
        id: "__alloyId12"
    });
    $.__views.__alloyId11.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Ti.UI.createView({
        width: "49%",
        left: "0dp",
        color: "#61615d",
        id: "__alloyId13"
    });
    $.__views.__alloyId12.add($.__views.__alloyId13);
    $.__views.__alloyId14 = Ti.UI.createImageView({
        image: "/images/reset.png",
        textAlign: "center",
        width: "40dp",
        top: "0dp",
        id: "__alloyId14"
    });
    $.__views.__alloyId13.add($.__views.__alloyId14);
    funcResetPwd ? $.__views.__alloyId14.addEventListener("click", funcResetPwd) : __defers["$.__views.__alloyId14!click!funcResetPwd"] = true;
    $.__views.__alloyId15 = Ti.UI.createLabel({
        width: "100%",
        textAlign: "center",
        bottom: "0dp",
        left: 5,
        color: "#61615d",
        font: {
            fontSize: "13"
        },
        text: "Reset Password",
        id: "__alloyId15"
    });
    $.__views.__alloyId13.add($.__views.__alloyId15);
    funcResetPwd ? $.__views.__alloyId15.addEventListener("click", funcResetPwd) : __defers["$.__views.__alloyId15!click!funcResetPwd"] = true;
    $.__views.__alloyId16 = Ti.UI.createLabel({
        backgroundColor: "#4d778833",
        width: "1dp",
        height: "40dp",
        textAlign: "center",
        id: "__alloyId16"
    });
    $.__views.__alloyId12.add($.__views.__alloyId16);
    $.__views.__alloyId17 = Ti.UI.createView({
        width: "49%",
        right: "0dp",
        color: "#61615d",
        id: "__alloyId17"
    });
    $.__views.__alloyId12.add($.__views.__alloyId17);
    $.__views.__alloyId18 = Ti.UI.createImageView({
        image: "/images/new-ac.png",
        textAlign: "center",
        width: "40dp",
        top: "0dp",
        id: "__alloyId18"
    });
    $.__views.__alloyId17.add($.__views.__alloyId18);
    funcRegister ? $.__views.__alloyId18.addEventListener("click", funcRegister) : __defers["$.__views.__alloyId18!click!funcRegister"] = true;
    $.__views.__alloyId19 = Ti.UI.createLabel({
        width: "100%",
        textAlign: "center",
        bottom: "0dp",
        color: "#778833",
        font: {
            fontSize: "13"
        },
        text: "New Account",
        id: "__alloyId19"
    });
    $.__views.__alloyId17.add($.__views.__alloyId19);
    funcRegister ? $.__views.__alloyId19.addEventListener("click", funcRegister) : __defers["$.__views.__alloyId19!click!funcRegister"] = true;
    $.__views.tableViewLogin = Ti.UI.createTableView({
        data: __alloyId6,
        id: "tableViewLogin",
        scrollable: "false"
    });
    $.__views.tableRowParent.add($.__views.tableViewLogin);
    $.__views.__alloyId0 = Ti.UI.createTableView({
        separatorColor: "transparent",
        backgroundColor: "transparent",
        data: __alloyId1,
        scrollable: "false",
        id: "__alloyId0"
    });
    $.__views.LoginView.add($.__views.__alloyId0);
    $.__views.Error = Ti.UI.createView({
        id: "Error",
        visible: "false"
    });
    $.__views.index.add($.__views.Error);
    var __alloyId21 = [];
    $.__views.__alloyId22 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId22"
    });
    __alloyId21.push($.__views.__alloyId22);
    $.__views.__alloyId23 = Ti.UI.createView({
        id: "__alloyId23"
    });
    $.__views.__alloyId22.add($.__views.__alloyId23);
    $.__views.errorTitleLabel = Ti.UI.createLabel({
        color: "#900",
        font: {
            fontSize: 20
        },
        shadowColor: "#aaa",
        shadowOffset: {
            x: 5,
            y: 5
        },
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        top: 10,
        id: "errorTitleLabel"
    });
    $.__views.__alloyId23.add($.__views.errorTitleLabel);
    $.__views.__alloyId24 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId24"
    });
    __alloyId21.push($.__views.__alloyId24);
    $.__views.__alloyId25 = Ti.UI.createView({
        id: "__alloyId25"
    });
    $.__views.__alloyId24.add($.__views.__alloyId25);
    $.__views.errorMsgLabel = Ti.UI.createLabel({
        color: "#000",
        font: {
            fontSize: 16
        },
        shadowColor: "#aaa",
        shadowOffset: {
            x: 5,
            y: 5
        },
        shadowRadius: 3,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        left: 10,
        id: "errorMsgLabel"
    });
    $.__views.__alloyId25.add($.__views.errorMsgLabel);
    $.__views.__alloyId26 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId26"
    });
    __alloyId21.push($.__views.__alloyId26);
    $.__views.okButton = Ti.UI.createButton({
        width: "50%",
        height: "43dp",
        color: "#fff",
        borderRadius: "33",
        top: "20dp",
        bottom: "20dp",
        backgroundColor: "#dd5522",
        font: {
            fontSize: "18",
            fontFamily: "RobotoCondensed-Bold"
        },
        title: "OK",
        id: "okButton"
    });
    $.__views.__alloyId26.add($.__views.okButton);
    $.__views.__alloyId20 = Ti.UI.createTableView({
        width: "60%",
        height: Ti.UI.SIZE,
        backgroundColor: "#dbdbdb",
        borderRadius: "30",
        separatorColor: "transparent",
        bottom: "50%",
        data: __alloyId21,
        id: "__alloyId20"
    });
    $.__views.Error.add($.__views.__alloyId20);
    $.__views.Page2 = Ti.UI.createView({
        backgroundImage: "/images/logoshadow.png",
        id: "Page2",
        visible: "false"
    });
    $.__views.index.add($.__views.Page2);
    var __alloyId28 = [];
    $.__views.__alloyId29 = Ti.UI.createTableViewRow({
        border: "none",
        height: "9dp",
        backgroundImage: "/images/top_bg.png",
        width: "100%",
        id: "__alloyId29"
    });
    __alloyId28.push($.__views.__alloyId29);
    $.__views.__alloyId30 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId30"
    });
    __alloyId28.push($.__views.__alloyId30);
    $.__views.__alloyId31 = Ti.UI.createView({
        color: "#fff",
        height: "50dp",
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        id: "__alloyId31"
    });
    $.__views.__alloyId30.add($.__views.__alloyId31);
    $.__views.backBtn = Ti.UI.createButton({
        left: "15dp",
        backgroundImage: "/images/back_space_bg.png",
        backgroundColor: "none",
        color: "#444411",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Bold"
        },
        textAlign: "center",
        height: "25dp",
        width: "60dp",
        title: "Back",
        id: "backBtn",
        visible: "false"
    });
    $.__views.__alloyId31.add($.__views.backBtn);
    $.__views.__alloyId32 = Ti.UI.createLabel({
        color: "#fff",
        height: "50dp",
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        text: "Events",
        id: "__alloyId32"
    });
    $.__views.__alloyId31.add($.__views.__alloyId32);
    $.__views.__alloyId33 = Ti.UI.createView({
        id: "__alloyId33"
    });
    $.__views.__alloyId31.add($.__views.__alloyId33);
    $.__views.bar = Ti.UI.createButton({
        right: "0dp",
        backgroundColor: "none",
        height: "30dp",
        width: "30dp",
        bubbleParent: false,
        id: "bar"
    });
    $.__views.__alloyId33.add($.__views.bar);
    toggle ? $.__views.bar.addEventListener("click", toggle) : __defers["$.__views.bar!click!toggle"] = true;
    $.__views.__alloyId34 = Ti.UI.createButton({
        right: "10dp",
        backgroundImage: "/images/right_side_dot.png",
        backgroundColor: "none",
        height: "30dp",
        width: "9dp",
        bubbleParent: false,
        id: "__alloyId34"
    });
    $.__views.__alloyId33.add($.__views.__alloyId34);
    toggle ? $.__views.__alloyId34.addEventListener("click", toggle) : __defers["$.__views.__alloyId34!click!toggle"] = true;
    $.__views.__alloyId35 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId35"
    });
    __alloyId28.push($.__views.__alloyId35);
    var __alloyId36 = [];
    $.__views.tableRowNoEventTitle = Ti.UI.createTableViewRow({
        border: "none",
        opacity: "0",
        id: "tableRowNoEventTitle"
    });
    __alloyId36.push($.__views.tableRowNoEventTitle);
    $.__views.lableNoEventTitle = Ti.UI.createLabel({
        font: {
            fontSize: "24",
            fontFamily: "RobotoCondensed-Bold"
        },
        color: "#444411",
        textAlign: "center",
        top: "35dp",
        bottom: "50dp",
        id: "lableNoEventTitle"
    });
    $.__views.tableRowNoEventTitle.add($.__views.lableNoEventTitle);
    $.__views.__alloyId37 = Ti.UI.createTableViewRow({
        border: "none",
        opacity: "0",
        id: "__alloyId37"
    });
    __alloyId36.push($.__views.__alloyId37);
    $.__views.__alloyId38 = Ti.UI.createView({
        backgroundColor: "#4d778833",
        width: "80%",
        height: "1dp",
        id: "__alloyId38"
    });
    $.__views.__alloyId37.add($.__views.__alloyId38);
    $.__views.tableRowEventBody = Ti.UI.createTableViewRow({
        border: "none",
        opacity: "0",
        id: "tableRowEventBody"
    });
    __alloyId36.push($.__views.tableRowEventBody);
    $.__views.lableNoEventBody = Ti.UI.createLabel({
        font: {
            fontSize: "18",
            fontFamily: "RobotoCondensed-Regular"
        },
        color: "#444411",
        textAlign: "center",
        top: "15dp",
        bottom: "20dp",
        width: "80%",
        id: "lableNoEventBody"
    });
    $.__views.tableRowEventBody.add($.__views.lableNoEventBody);
    $.__views.__alloyId39 = Ti.UI.createTableViewRow({
        border: "none",
        opacity: "0",
        id: "__alloyId39"
    });
    __alloyId36.push($.__views.__alloyId39);
    $.__views.findEvents = Ti.UI.createButton({
        width: "60%",
        height: "50dp",
        color: "#fff",
        borderRadius: "30",
        top: "20dp",
        bottom: "20dp",
        backgroundColor: "#dd5522",
        font: {
            fontSize: "18",
            fontFamily: "RobotoCondensed-Bold"
        },
        title: "FIND EVENTS",
        id: "findEvents"
    });
    $.__views.__alloyId39.add($.__views.findEvents);
    findeven ? $.__views.findEvents.addEventListener("click", findeven) : __defers["$.__views.findEvents!click!findeven"] = true;
    $.__views.tableNoEventmain = Ti.UI.createTableView({
        width: "80%",
        backgroundColor: "#99ffffff",
        borderRadius: "30",
        separatorColor: "transparent",
        top: "30dp",
        data: __alloyId36,
        id: "tableNoEventmain",
        backgroundcolor: "transparent",
        scrollable: "false"
    });
    $.__views.__alloyId35.add($.__views.tableNoEventmain);
    $.__views.noeventArrowId = Ti.UI.createTableViewRow({
        border: "none",
        top: "0dp",
        separatorColor: "transparent",
        opacity: "0",
        id: "noeventArrowId"
    });
    __alloyId28.push($.__views.noeventArrowId);
    $.__views.noeventArrow = Ti.UI.createImageView({
        image: "/images/noevent-arrow.png",
        top: "-1dp",
        bottom: "0dp",
        height: "30dp",
        id: "noeventArrow"
    });
    $.__views.noeventArrowId.add($.__views.noeventArrow);
    $.__views.__alloyId40 = Ti.UI.createTableViewRow({
        border: "none",
        opacity: "0",
        id: "__alloyId40"
    });
    __alloyId28.push($.__views.__alloyId40);
    $.__views.frogView = Ti.UI.createImageView({
        image: "/images/frog_icon_1.png",
        top: "0dp",
        bottom: "20dp",
        height: "90dp",
        id: "frogView"
    });
    $.__views.__alloyId40.add($.__views.frogView);
    $.__views.__alloyId27 = Ti.UI.createTableView({
        separatorColor: "transparent",
        backgroundColor: "transparent",
        data: __alloyId28,
        scrollable: "false",
        id: "__alloyId27"
    });
    $.__views.Page2.add($.__views.__alloyId27);
    $.__views.Page3 = Ti.UI.createView({
        backgroundImage: "/images/logoshadow.png",
        id: "Page3",
        visible: "false"
    });
    $.__views.index.add($.__views.Page3);
    var __alloyId42 = [];
    $.__views.__alloyId43 = Ti.UI.createTableViewRow({
        border: "none",
        height: "9dp",
        backgroundImage: "/images/top_bg.png",
        width: "100%",
        id: "__alloyId43"
    });
    __alloyId42.push($.__views.__alloyId43);
    $.__views.__alloyId44 = Ti.UI.createTableViewRow({
        border: "none",
        scrollable: "false",
        id: "__alloyId44"
    });
    __alloyId42.push($.__views.__alloyId44);
    $.__views.__alloyId45 = Ti.UI.createView({
        color: "#fff",
        height: "50dp",
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        id: "__alloyId45"
    });
    $.__views.__alloyId44.add($.__views.__alloyId45);
    $.__views.backBtn = Ti.UI.createButton({
        left: "15dp",
        backgroundImage: "/images/back_space_bg.png",
        backgroundColor: "none",
        color: "#444411",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Bold"
        },
        textAlign: "center",
        height: "25dp",
        width: "60dp",
        title: "Back",
        id: "backBtn",
        visible: "false"
    });
    $.__views.__alloyId45.add($.__views.backBtn);
    $.__views.__alloyId46 = Ti.UI.createLabel({
        color: "#fff",
        height: "50dp",
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        text: "Frog Quest Events",
        id: "__alloyId46"
    });
    $.__views.__alloyId45.add($.__views.__alloyId46);
    $.__views.__alloyId47 = Ti.UI.createView({
        id: "__alloyId47"
    });
    $.__views.__alloyId45.add($.__views.__alloyId47);
    $.__views.bar = Ti.UI.createButton({
        right: "0dp",
        backgroundColor: "none",
        height: "30dp",
        width: "30dp",
        bubbleParent: false,
        id: "bar"
    });
    $.__views.__alloyId47.add($.__views.bar);
    toggle ? $.__views.bar.addEventListener("click", toggle) : __defers["$.__views.bar!click!toggle"] = true;
    $.__views.__alloyId48 = Ti.UI.createButton({
        right: "10dp",
        backgroundImage: "/images/right_side_dot.png",
        backgroundColor: "none",
        height: "30dp",
        width: "9dp",
        bubbleParent: false,
        id: "__alloyId48"
    });
    $.__views.__alloyId47.add($.__views.__alloyId48);
    toggle ? $.__views.__alloyId48.addEventListener("click", toggle) : __defers["$.__views.__alloyId48!click!toggle"] = true;
    $.__views.tableViewPage = Ti.UI.createTableViewRow({
        border: "none",
        id: "tableViewPage"
    });
    __alloyId42.push($.__views.tableViewPage);
    $.__views.eventlistpageId = Ti.UI.createView({
        width: "85%",
        id: "eventlistpageId"
    });
    $.__views.tableViewPage.add($.__views.eventlistpageId);
    $.__views.listofEvents = Ti.UI.createButton({
        width: "71%",
        height: "50dp",
        color: "#fff",
        borderRadius: "30",
        left: "0dp",
        backgroundColor: "#dd5522",
        font: {
            fontSize: "18",
            fontFamily: "RobotoCondensed-Bold"
        },
        title: "FIND MORE EVENTS",
        id: "listofEvents"
    });
    $.__views.eventlistpageId.add($.__views.listofEvents);
    findeven ? $.__views.listofEvents.addEventListener("click", findeven) : __defers["$.__views.listofEvents!click!findeven"] = true;
    $.__views.eventList = Ti.UI.createImageView({
        image: "/images/frog_icon.png",
        top: "0dp",
        bottom: "0dp",
        height: "120dp",
        right: "0dp",
        id: "eventList"
    });
    $.__views.eventlistpageId.add($.__views.eventList);
    $.__views.tableViewTable = Ti.UI.createTableViewRow({
        border: "none",
        id: "tableViewTable",
        opacity: "0"
    });
    __alloyId42.push($.__views.tableViewTable);
    $.__views.eventListTable = Ti.UI.createTableView({
        id: "eventListTable",
        separatorColor: "transparent"
    });
    $.__views.tableViewTable.add($.__views.eventListTable);
    $.__views.__alloyId41 = Ti.UI.createTableView({
        separatorColor: "transparent",
        backgroundColor: "transparent",
        data: __alloyId42,
        scrollable: "false",
        id: "__alloyId41"
    });
    $.__views.Page3.add($.__views.__alloyId41);
    $.__views.Page4 = Ti.UI.createView({
        backgroundImage: "/images/logoshadow.png",
        id: "Page4",
        visible: "false"
    });
    $.__views.index.add($.__views.Page4);
    var __alloyId50 = [];
    $.__views.__alloyId51 = Ti.UI.createTableViewRow({
        border: "none",
        height: "9dp",
        backgroundImage: "/images/top_bg.png",
        width: "100%",
        id: "__alloyId51"
    });
    __alloyId50.push($.__views.__alloyId51);
    $.__views.__alloyId52 = Ti.UI.createTableViewRow({
        border: "none",
        scrollable: "false",
        id: "__alloyId52"
    });
    __alloyId50.push($.__views.__alloyId52);
    $.__views.__alloyId53 = Ti.UI.createView({
        color: "#fff",
        height: "50dp",
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        id: "__alloyId53"
    });
    $.__views.__alloyId52.add($.__views.__alloyId53);
    $.__views.backBtn = Ti.UI.createButton({
        left: "15dp",
        backgroundImage: "/images/back_space_bg.png",
        backgroundColor: "none",
        color: "#444411",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Bold"
        },
        textAlign: "center",
        height: "25dp",
        width: "60dp",
        title: "Back",
        id: "backBtn",
        visible: "true"
    });
    $.__views.__alloyId53.add($.__views.backBtn);
    var __alloyId55 = [];
    $.__views.__alloyId56 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId56"
    });
    __alloyId55.push($.__views.__alloyId56);
    $.__views.__alloyId57 = Ti.UI.createLabel({
        font: {
            fontSize: "17",
            fontFamily: "Roboto-Bold"
        },
        color: "#fff",
        text: "The Frog Whisperers",
        id: "__alloyId57"
    });
    $.__views.__alloyId56.add($.__views.__alloyId57);
    $.__views.__alloyId58 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId58"
    });
    __alloyId55.push($.__views.__alloyId58);
    $.__views.__alloyId59 = Ti.UI.createLabel({
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        color: "#fff",
        top: "0dp",
        text: "Lorem ipsum Frog Quest",
        id: "__alloyId59"
    });
    $.__views.__alloyId58.add($.__views.__alloyId59);
    $.__views.__alloyId54 = Ti.UI.createTableView({
        separatorColor: "transparent",
        backgroundColor: "transparent",
        data: __alloyId55,
        id: "__alloyId54"
    });
    $.__views.__alloyId53.add($.__views.__alloyId54);
    $.__views.__alloyId60 = Ti.UI.createView({
        id: "__alloyId60"
    });
    $.__views.__alloyId53.add($.__views.__alloyId60);
    $.__views.bar = Ti.UI.createButton({
        right: "0dp",
        backgroundColor: "none",
        height: "30dp",
        width: "30dp",
        bubbleParent: false,
        id: "bar"
    });
    $.__views.__alloyId60.add($.__views.bar);
    toggle ? $.__views.bar.addEventListener("click", toggle) : __defers["$.__views.bar!click!toggle"] = true;
    $.__views.__alloyId61 = Ti.UI.createButton({
        right: "10dp",
        backgroundImage: "/images/right_side_dot.png",
        backgroundColor: "none",
        height: "30dp",
        width: "9dp",
        bubbleParent: false,
        id: "__alloyId61"
    });
    $.__views.__alloyId60.add($.__views.__alloyId61);
    toggle ? $.__views.__alloyId61.addEventListener("click", toggle) : __defers["$.__views.__alloyId61!click!toggle"] = true;
    $.__views.__alloyId62 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId62"
    });
    __alloyId50.push($.__views.__alloyId62);
    $.__views.__alloyId63 = Ti.UI.createView({
        width: "100%",
        height: "70dp",
        left: "10dp",
        top: "15dp",
        bottom: "15dp",
        right: "10dp",
        id: "__alloyId63"
    });
    $.__views.__alloyId62.add($.__views.__alloyId63);
    $.__views.__alloyId64 = Ti.UI.createView({
        backgroundColor: "#ffffff",
        width: "22%",
        height: "70dp",
        left: "5dp",
        borderRadius: "10",
        id: "__alloyId64"
    });
    $.__views.__alloyId63.add($.__views.__alloyId64);
    $.__views.__alloyId65 = Ti.UI.createLabel({
        backgroundColor: "#2077a2",
        width: "100%",
        height: "30dp",
        top: "0dp",
        textAlign: "center",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "Roboto-Bold"
        },
        text: "Pending",
        id: "__alloyId65"
    });
    $.__views.__alloyId64.add($.__views.__alloyId65);
    $.__views.__alloyId66 = Ti.UI.createLabel({
        color: "#444444",
        top: "33dp",
        textAlign: "center",
        font: {
            fontSize: "20",
            fontFamily: "Roboto-Bold"
        },
        text: "1",
        id: "__alloyId66"
    });
    $.__views.__alloyId64.add($.__views.__alloyId66);
    $.__views.__alloyId67 = Ti.UI.createView({
        backgroundColor: "#ffffff",
        width: "22%",
        height: "70dp",
        left: "25%",
        borderRadius: "10",
        id: "__alloyId67"
    });
    $.__views.__alloyId63.add($.__views.__alloyId67);
    $.__views.__alloyId68 = Ti.UI.createLabel({
        backgroundColor: "#b03230",
        width: "100%",
        height: "30dp",
        top: "0dp",
        textAlign: "center",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "Roboto-Bold"
        },
        text: "Invalid",
        id: "__alloyId68"
    });
    $.__views.__alloyId67.add($.__views.__alloyId68);
    $.__views.__alloyId69 = Ti.UI.createLabel({
        color: "#444444",
        top: "33dp",
        textAlign: "center",
        font: {
            fontSize: "20",
            fontFamily: "Roboto-Bold"
        },
        text: "1",
        id: "__alloyId69"
    });
    $.__views.__alloyId67.add($.__views.__alloyId69);
    $.__views.__alloyId70 = Ti.UI.createView({
        backgroundColor: "#ffffff",
        width: "22%",
        height: "70dp",
        left: "49%",
        borderRadius: "10",
        id: "__alloyId70"
    });
    $.__views.__alloyId63.add($.__views.__alloyId70);
    $.__views.__alloyId71 = Ti.UI.createLabel({
        backgroundColor: "#2d782e",
        width: "100%",
        height: "30dp",
        top: "0dp",
        textAlign: "center",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "Roboto-Bold"
        },
        text: "Valid",
        id: "__alloyId71"
    });
    $.__views.__alloyId70.add($.__views.__alloyId71);
    $.__views.__alloyId72 = Ti.UI.createLabel({
        color: "#444444",
        top: "33dp",
        textAlign: "center",
        font: {
            fontSize: "20",
            fontFamily: "Roboto-Bold"
        },
        text: "1",
        id: "__alloyId72"
    });
    $.__views.__alloyId70.add($.__views.__alloyId72);
    $.__views.__alloyId73 = Ti.UI.createView({
        backgroundColor: "#ffffff",
        width: "22%",
        height: "70dp",
        left: "73%",
        borderRadius: "10",
        id: "__alloyId73"
    });
    $.__views.__alloyId63.add($.__views.__alloyId73);
    $.__views.__alloyId74 = Ti.UI.createLabel({
        backgroundColor: "#8b8b3e",
        width: "100%",
        height: "30dp",
        top: "0dp",
        textAlign: "center",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "Roboto-Bold"
        },
        text: "Remaining",
        id: "__alloyId74"
    });
    $.__views.__alloyId73.add($.__views.__alloyId74);
    $.__views.__alloyId75 = Ti.UI.createLabel({
        color: "#444444",
        top: "33dp",
        textAlign: "center",
        font: {
            fontSize: "20",
            fontFamily: "Roboto-Bold"
        },
        text: "1",
        id: "__alloyId75"
    });
    $.__views.__alloyId73.add($.__views.__alloyId75);
    $.__views.__alloyId76 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId76"
    });
    __alloyId50.push($.__views.__alloyId76);
    $.__views.__alloyId77 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "100%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId77"
    });
    $.__views.__alloyId76.add($.__views.__alloyId77);
    $.__views.__alloyId78 = Ti.UI.createView({
        backgroundColor: "#8b8b3e",
        width: "16%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId78"
    });
    $.__views.__alloyId77.add($.__views.__alloyId78);
    $.__views.uploadPic = Ti.UI.createImageView({
        image: "/images/upload-pic.png",
        height: "34dp",
        textAlign: "center",
        top: "30%",
        id: "uploadPic"
    });
    $.__views.__alloyId78.add($.__views.uploadPic);
    $.__views.__alloyId79 = Ti.UI.createView({
        width: "68%",
        height: "80dp",
        id: "__alloyId79"
    });
    $.__views.__alloyId77.add($.__views.__alloyId79);
    $.__views.__alloyId80 = Ti.UI.createLabel({
        textAlign: "center",
        color: "#8b8b3e",
        font: {
            fontSize: "17",
            fontFamily: "RobotoCondensed-Regular"
        },
        top: "0dp",
        left: "3dp",
        text: "Hello",
        id: "__alloyId80"
    });
    $.__views.__alloyId79.add($.__views.__alloyId80);
    $.__views.__alloyId81 = Ti.UI.createLabel({
        textAlign: "left",
        color: "#61615d",
        font: {
            fontSize: "13",
            fontFamily: "RobotoCondensed-Regular"
        },
        bottom: "5dp",
        left: "3dp",
        text: "Suspendisse potenti. Quisque et lorem porttitor, rhoncus mauris non, eleifend arcu",
        id: "__alloyId81"
    });
    $.__views.__alloyId79.add($.__views.__alloyId81);
    $.__views.__alloyId82 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "15%",
        height: "80dp",
        right: "0dp",
        textAlign: "center",
        id: "__alloyId82"
    });
    $.__views.__alloyId77.add($.__views.__alloyId82);
    $.__views.__alloyId83 = Ti.UI.createView({
        id: "__alloyId83"
    });
    $.__views.__alloyId82.add($.__views.__alloyId83);
    $.__views.questSelectArrow = Ti.UI.createImageView({
        image: "/images/green_arrow_icon.png",
        height: "34dp",
        right: "10dp",
        textAlign: "center",
        top: "5dp",
        id: "questSelectArrow"
    });
    $.__views.__alloyId83.add($.__views.questSelectArrow);
    $.__views.smallCupBg = Ti.UI.createView({
        width: "100%",
        height: "20dp",
        left: "10dp",
        textAlign: "center",
        bottom: "10dp",
        id: "smallCupBg"
    });
    $.__views.__alloyId82.add($.__views.smallCupBg);
    $.__views.questSmallCup = Ti.UI.createImageView({
        image: "/images/cup_green_icon.png",
        height: "15dp",
        left: "0dp",
        id: "questSmallCup"
    });
    $.__views.smallCupBg.add($.__views.questSmallCup);
    $.__views.__alloyId84 = Ti.UI.createLabel({
        color: "#778833",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "5",
        id: "__alloyId84"
    });
    $.__views.smallCupBg.add($.__views.__alloyId84);
    $.__views.__alloyId85 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId85"
    });
    __alloyId50.push($.__views.__alloyId85);
    $.__views.__alloyId86 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "100%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId86"
    });
    $.__views.__alloyId85.add($.__views.__alloyId86);
    $.__views.__alloyId87 = Ti.UI.createView({
        backgroundColor: "#2d782e",
        width: "16%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId87"
    });
    $.__views.__alloyId86.add($.__views.__alloyId87);
    $.__views.uploadPic = Ti.UI.createImageView({
        image: "/images/upload-pic.png",
        height: "34dp",
        textAlign: "center",
        top: "30%",
        id: "uploadPic"
    });
    $.__views.__alloyId87.add($.__views.uploadPic);
    $.__views.__alloyId88 = Ti.UI.createView({
        width: "68%",
        height: "80dp",
        id: "__alloyId88"
    });
    $.__views.__alloyId86.add($.__views.__alloyId88);
    $.__views.__alloyId89 = Ti.UI.createLabel({
        textAlign: "center",
        color: "#8b8b3e",
        font: {
            fontSize: "17",
            fontFamily: "RobotoCondensed-Regular"
        },
        top: "0dp",
        left: "3dp",
        text: "Hello",
        id: "__alloyId89"
    });
    $.__views.__alloyId88.add($.__views.__alloyId89);
    $.__views.__alloyId90 = Ti.UI.createLabel({
        textAlign: "left",
        color: "#61615d",
        font: {
            fontSize: "13",
            fontFamily: "RobotoCondensed-Regular"
        },
        bottom: "5dp",
        left: "3dp",
        text: "Suspendisse potenti. Quisque et lorem porttitor, rhoncus mauris non, eleifend arcu",
        id: "__alloyId90"
    });
    $.__views.__alloyId88.add($.__views.__alloyId90);
    $.__views.__alloyId91 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "15%",
        height: "80dp",
        right: "0dp",
        textAlign: "center",
        id: "__alloyId91"
    });
    $.__views.__alloyId86.add($.__views.__alloyId91);
    $.__views.__alloyId92 = Ti.UI.createView({
        id: "__alloyId92"
    });
    $.__views.__alloyId91.add($.__views.__alloyId92);
    $.__views.questSelectArrow = Ti.UI.createImageView({
        image: "/images/green_arrow_icon.png",
        height: "34dp",
        right: "10dp",
        textAlign: "center",
        top: "5dp",
        id: "questSelectArrow"
    });
    $.__views.__alloyId92.add($.__views.questSelectArrow);
    $.__views.smallCupBg = Ti.UI.createView({
        width: "100%",
        height: "20dp",
        left: "10dp",
        textAlign: "center",
        bottom: "10dp",
        id: "smallCupBg"
    });
    $.__views.__alloyId91.add($.__views.smallCupBg);
    $.__views.questSmallCup = Ti.UI.createImageView({
        image: "/images/cup_green_icon.png",
        height: "15dp",
        left: "0dp",
        id: "questSmallCup"
    });
    $.__views.smallCupBg.add($.__views.questSmallCup);
    $.__views.__alloyId93 = Ti.UI.createLabel({
        color: "#778833",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "5",
        id: "__alloyId93"
    });
    $.__views.smallCupBg.add($.__views.__alloyId93);
    $.__views.__alloyId94 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId94"
    });
    __alloyId50.push($.__views.__alloyId94);
    $.__views.__alloyId95 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "100%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId95"
    });
    $.__views.__alloyId94.add($.__views.__alloyId95);
    $.__views.__alloyId96 = Ti.UI.createView({
        backgroundColor: "#b03230",
        width: "16%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId96"
    });
    $.__views.__alloyId95.add($.__views.__alloyId96);
    $.__views.uploadPic = Ti.UI.createImageView({
        image: "/images/upload-pic.png",
        height: "34dp",
        textAlign: "center",
        top: "30%",
        id: "uploadPic"
    });
    $.__views.__alloyId96.add($.__views.uploadPic);
    $.__views.__alloyId97 = Ti.UI.createView({
        width: "68%",
        height: "80dp",
        id: "__alloyId97"
    });
    $.__views.__alloyId95.add($.__views.__alloyId97);
    $.__views.__alloyId98 = Ti.UI.createLabel({
        textAlign: "center",
        color: "#8b8b3e",
        font: {
            fontSize: "17",
            fontFamily: "RobotoCondensed-Regular"
        },
        top: "0dp",
        left: "3dp",
        text: "Hello",
        id: "__alloyId98"
    });
    $.__views.__alloyId97.add($.__views.__alloyId98);
    $.__views.__alloyId99 = Ti.UI.createLabel({
        textAlign: "left",
        color: "#61615d",
        font: {
            fontSize: "13",
            fontFamily: "RobotoCondensed-Regular"
        },
        bottom: "5dp",
        left: "3dp",
        text: "Suspendisse potenti. Quisque et lorem porttitor, rhoncus mauris non, eleifend arcu",
        id: "__alloyId99"
    });
    $.__views.__alloyId97.add($.__views.__alloyId99);
    $.__views.__alloyId100 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "15%",
        height: "80dp",
        right: "0dp",
        textAlign: "center",
        id: "__alloyId100"
    });
    $.__views.__alloyId95.add($.__views.__alloyId100);
    $.__views.__alloyId101 = Ti.UI.createView({
        id: "__alloyId101"
    });
    $.__views.__alloyId100.add($.__views.__alloyId101);
    $.__views.questSelectArrow = Ti.UI.createImageView({
        image: "/images/green_arrow_icon.png",
        height: "34dp",
        right: "10dp",
        textAlign: "center",
        top: "5dp",
        id: "questSelectArrow"
    });
    $.__views.__alloyId101.add($.__views.questSelectArrow);
    $.__views.smallCupBg = Ti.UI.createView({
        width: "100%",
        height: "20dp",
        left: "10dp",
        textAlign: "center",
        bottom: "10dp",
        id: "smallCupBg"
    });
    $.__views.__alloyId100.add($.__views.smallCupBg);
    $.__views.questSmallCup = Ti.UI.createImageView({
        image: "/images/cup_green_icon.png",
        height: "15dp",
        left: "0dp",
        id: "questSmallCup"
    });
    $.__views.smallCupBg.add($.__views.questSmallCup);
    $.__views.__alloyId102 = Ti.UI.createLabel({
        color: "#778833",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "5",
        id: "__alloyId102"
    });
    $.__views.smallCupBg.add($.__views.__alloyId102);
    $.__views.__alloyId103 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId103"
    });
    __alloyId50.push($.__views.__alloyId103);
    $.__views.__alloyId104 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "100%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId104"
    });
    $.__views.__alloyId103.add($.__views.__alloyId104);
    $.__views.__alloyId105 = Ti.UI.createView({
        backgroundColor: "#2077a2",
        width: "16%",
        height: "80dp",
        left: "0dp",
        id: "__alloyId105"
    });
    $.__views.__alloyId104.add($.__views.__alloyId105);
    $.__views.uploadPic = Ti.UI.createImageView({
        image: "/images/upload-pic.png",
        height: "34dp",
        textAlign: "center",
        top: "30%",
        id: "uploadPic"
    });
    $.__views.__alloyId105.add($.__views.uploadPic);
    $.__views.__alloyId106 = Ti.UI.createView({
        width: "68%",
        height: "80dp",
        id: "__alloyId106"
    });
    $.__views.__alloyId104.add($.__views.__alloyId106);
    $.__views.__alloyId107 = Ti.UI.createLabel({
        textAlign: "center",
        color: "#8b8b3e",
        font: {
            fontSize: "17",
            fontFamily: "RobotoCondensed-Regular"
        },
        top: "0dp",
        left: "3dp",
        text: "Hello",
        id: "__alloyId107"
    });
    $.__views.__alloyId106.add($.__views.__alloyId107);
    $.__views.__alloyId108 = Ti.UI.createLabel({
        textAlign: "left",
        color: "#61615d",
        font: {
            fontSize: "13",
            fontFamily: "RobotoCondensed-Regular"
        },
        bottom: "5dp",
        left: "3dp",
        text: "Suspendisse potenti. Quisque et lorem porttitor, rhoncus mauris non, eleifend arcu",
        id: "__alloyId108"
    });
    $.__views.__alloyId106.add($.__views.__alloyId108);
    $.__views.__alloyId109 = Ti.UI.createView({
        backgroundColor: "#b3ffffff",
        width: "15%",
        height: "80dp",
        right: "0dp",
        textAlign: "center",
        id: "__alloyId109"
    });
    $.__views.__alloyId104.add($.__views.__alloyId109);
    $.__views.__alloyId110 = Ti.UI.createView({
        id: "__alloyId110"
    });
    $.__views.__alloyId109.add($.__views.__alloyId110);
    $.__views.questSelectArrow = Ti.UI.createImageView({
        image: "/images/green_arrow_icon.png",
        height: "34dp",
        right: "10dp",
        textAlign: "center",
        top: "5dp",
        id: "questSelectArrow"
    });
    $.__views.__alloyId110.add($.__views.questSelectArrow);
    $.__views.smallCupBg = Ti.UI.createView({
        width: "100%",
        height: "20dp",
        left: "10dp",
        textAlign: "center",
        bottom: "10dp",
        id: "smallCupBg"
    });
    $.__views.__alloyId109.add($.__views.smallCupBg);
    $.__views.questSmallCup = Ti.UI.createImageView({
        image: "/images/cup_green_icon.png",
        height: "15dp",
        left: "0dp",
        id: "questSmallCup"
    });
    $.__views.smallCupBg.add($.__views.questSmallCup);
    $.__views.__alloyId111 = Ti.UI.createLabel({
        color: "#778833",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "5",
        id: "__alloyId111"
    });
    $.__views.smallCupBg.add($.__views.__alloyId111);
    $.__views.__alloyId49 = Ti.UI.createTableView({
        separatorColor: "transparent",
        backgroundColor: "transparent",
        data: __alloyId50,
        scrollable: "false",
        id: "__alloyId49"
    });
    $.__views.Page4.add($.__views.__alloyId49);
    var __alloyId113 = [];
    $.__views.__alloyId114 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId114"
    });
    __alloyId113.push($.__views.__alloyId114);
    $.__views.__alloyId115 = Ti.UI.createView({
        id: "__alloyId115"
    });
    $.__views.__alloyId114.add($.__views.__alloyId115);
    $.__views.__alloyId116 = Ti.UI.createView({
        width: "33%",
        height: "70dp",
        left: "0dp",
        backgroundImage: "/images/bottom-nav-slct.png",
        id: "__alloyId116"
    });
    $.__views.__alloyId115.add($.__views.__alloyId116);
    $.__views.questIcon = Ti.UI.createImageView({
        image: "/images/Quests_white_icon.png",
        height: "23dp",
        textAlign: "center",
        top: "12dp",
        id: "questIcon"
    });
    $.__views.__alloyId116.add($.__views.questIcon);
    $.__views.__alloyId117 = Ti.UI.createLabel({
        textAlign: "center",
        bottom: "10dp",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "Quest",
        id: "__alloyId117"
    });
    $.__views.__alloyId116.add($.__views.__alloyId117);
    $.__views.__alloyId118 = Ti.UI.createView({
        width: "34%",
        height: "70dp",
        textAlign: "center",
        id: "__alloyId118"
    });
    $.__views.__alloyId115.add($.__views.__alloyId118);
    $.__views.rankingIcon = Ti.UI.createImageView({
        image: "/images/ranking_white_icon.png",
        height: "23dp",
        textAlign: "center",
        top: "12dp",
        id: "rankingIcon"
    });
    $.__views.__alloyId118.add($.__views.rankingIcon);
    $.__views.__alloyId119 = Ti.UI.createLabel({
        textAlign: "center",
        bottom: "10dp",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "Ranking",
        id: "__alloyId119"
    });
    $.__views.__alloyId118.add($.__views.__alloyId119);
    $.__views.__alloyId120 = Ti.UI.createView({
        width: "33%",
        height: "70dp",
        right: "0dp",
        id: "__alloyId120"
    });
    $.__views.__alloyId115.add($.__views.__alloyId120);
    $.__views.galleryIcon = Ti.UI.createImageView({
        image: "/images/gallery_white_icon.png",
        height: "24dp",
        textAlign: "center",
        top: "12dp",
        id: "galleryIcon"
    });
    $.__views.__alloyId120.add($.__views.galleryIcon);
    $.__views.__alloyId121 = Ti.UI.createLabel({
        textAlign: "center",
        bottom: "10dp",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "Gallery",
        id: "__alloyId121"
    });
    $.__views.__alloyId120.add($.__views.__alloyId121);
    $.__views.__alloyId112 = Ti.UI.createTableView({
        bottom: "0dp",
        height: "70dp",
        width: "100%",
        backgroundImage: "/images/bottom-bg.png",
        data: __alloyId113,
        separatorColor: "transparent",
        id: "__alloyId112"
    });
    $.__views.Page4.add($.__views.__alloyId112);
    $.__views.Page5 = Ti.UI.createView({
        backgroundImage: "/images/logoshadow.png",
        id: "Page5",
        visible: "false"
    });
    $.__views.index.add($.__views.Page5);
    var __alloyId123 = [];
    $.__views.__alloyId124 = Ti.UI.createTableViewRow({
        border: "none",
        height: "9dp",
        backgroundImage: "/images/top_bg.png",
        width: "100%",
        id: "__alloyId124"
    });
    __alloyId123.push($.__views.__alloyId124);
    $.__views.__alloyId125 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId125"
    });
    __alloyId123.push($.__views.__alloyId125);
    $.__views.__alloyId126 = Ti.UI.createView({
        color: "#fff",
        height: "50dp",
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        id: "__alloyId126"
    });
    $.__views.__alloyId125.add($.__views.__alloyId126);
    $.__views.backBtn = Ti.UI.createButton({
        left: "15dp",
        backgroundImage: "/images/back_space_bg.png",
        backgroundColor: "none",
        color: "#444411",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Bold"
        },
        textAlign: "center",
        height: "25dp",
        width: "60dp",
        title: "Back",
        id: "backBtn",
        visible: "true"
    });
    $.__views.__alloyId126.add($.__views.backBtn);
    var __alloyId128 = [];
    $.__views.__alloyId129 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId129"
    });
    __alloyId128.push($.__views.__alloyId129);
    $.__views.__alloyId130 = Ti.UI.createLabel({
        font: {
            fontSize: "17",
            fontFamily: "Roboto-Bold"
        },
        color: "#fff",
        text: "The Frog Whisperers",
        id: "__alloyId130"
    });
    $.__views.__alloyId129.add($.__views.__alloyId130);
    $.__views.__alloyId131 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId131"
    });
    __alloyId128.push($.__views.__alloyId131);
    $.__views.__alloyId132 = Ti.UI.createLabel({
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        color: "#fff",
        top: "0dp",
        text: "Lorem ipsum Frog Quest",
        id: "__alloyId132"
    });
    $.__views.__alloyId131.add($.__views.__alloyId132);
    $.__views.__alloyId127 = Ti.UI.createTableView({
        separatorColor: "transparent",
        backgroundColor: "transparent",
        data: __alloyId128,
        id: "__alloyId127"
    });
    $.__views.__alloyId126.add($.__views.__alloyId127);
    $.__views.__alloyId133 = Ti.UI.createView({
        id: "__alloyId133"
    });
    $.__views.__alloyId126.add($.__views.__alloyId133);
    $.__views.bar = Ti.UI.createButton({
        right: "0dp",
        backgroundColor: "none",
        height: "30dp",
        width: "30dp",
        bubbleParent: false,
        id: "bar"
    });
    $.__views.__alloyId133.add($.__views.bar);
    toggle ? $.__views.bar.addEventListener("click", toggle) : __defers["$.__views.bar!click!toggle"] = true;
    $.__views.__alloyId134 = Ti.UI.createButton({
        right: "10dp",
        backgroundImage: "/images/right_side_dot.png",
        backgroundColor: "none",
        height: "30dp",
        width: "9dp",
        bubbleParent: false,
        id: "__alloyId134"
    });
    $.__views.__alloyId133.add($.__views.__alloyId134);
    toggle ? $.__views.__alloyId134.addEventListener("click", toggle) : __defers["$.__views.__alloyId134!click!toggle"] = true;
    $.__views.__alloyId135 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId135"
    });
    __alloyId123.push($.__views.__alloyId135);
    var __alloyId137 = [];
    $.__views.__alloyId138 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId138"
    });
    __alloyId137.push($.__views.__alloyId138);
    $.__views.__alloyId139 = Ti.UI.createLabel({
        font: {
            fontSize: "24",
            fontFamily: "RobotoCondensed-Bold"
        },
        color: "#444411",
        textAlign: "center",
        top: "25dp",
        bottom: "15dp",
        text: "SLOW YOUR ROLL!",
        id: "__alloyId139"
    });
    $.__views.__alloyId138.add($.__views.__alloyId139);
    $.__views.__alloyId140 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId140"
    });
    __alloyId137.push($.__views.__alloyId140);
    $.__views.__alloyId141 = Ti.UI.createView({
        backgroundColor: "#4d778833",
        width: "80%",
        height: "1dp",
        id: "__alloyId141"
    });
    $.__views.__alloyId140.add($.__views.__alloyId141);
    $.__views.__alloyId142 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId142"
    });
    __alloyId137.push($.__views.__alloyId142);
    $.__views.__alloyId143 = Ti.UI.createLabel({
        font: {
            fontSize: "13",
            fontFamily: "RobotoCondensed-Regular"
        },
        color: "#444411",
        textAlign: "center",
        top: "15dp",
        bottom: "20dp",
        width: "80%",
        text: "You're being a bit over zealous aren't you? This event hasn't yet begun. Why don't you chill for a while and come back when it gets closer to the actual start time?",
        id: "__alloyId143"
    });
    $.__views.__alloyId142.add($.__views.__alloyId143);
    $.__views.__alloyId136 = Ti.UI.createTableView({
        width: "80%",
        backgroundColor: "#99ffffff",
        borderRadius: "30",
        separatorColor: "transparent",
        top: "30dp",
        height: "180dp",
        data: __alloyId137,
        id: "__alloyId136"
    });
    $.__views.__alloyId135.add($.__views.__alloyId136);
    $.__views.__alloyId144 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId144"
    });
    __alloyId123.push($.__views.__alloyId144);
    $.__views.noeventArrow = Ti.UI.createImageView({
        image: "/images/noevent-arrow.png",
        top: "-1dp",
        bottom: "0dp",
        height: "30dp",
        id: "noeventArrow"
    });
    $.__views.__alloyId144.add($.__views.noeventArrow);
    $.__views.__alloyId145 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId145"
    });
    __alloyId123.push($.__views.__alloyId145);
    $.__views.questView = Ti.UI.createImageView({
        image: "/images/frog_icon_2.png",
        top: "20dp",
        bottom: "20dp",
        height: "170dp",
        id: "questView"
    });
    $.__views.__alloyId145.add($.__views.questView);
    $.__views.__alloyId122 = Ti.UI.createTableView({
        separatorColor: "transparent",
        backgroundColor: "transparent",
        data: __alloyId123,
        id: "__alloyId122"
    });
    $.__views.Page5.add($.__views.__alloyId122);
    var __alloyId147 = [];
    $.__views.__alloyId148 = Ti.UI.createTableViewRow({
        border: "none",
        id: "__alloyId148"
    });
    __alloyId147.push($.__views.__alloyId148);
    $.__views.__alloyId149 = Ti.UI.createView({
        id: "__alloyId149"
    });
    $.__views.__alloyId148.add($.__views.__alloyId149);
    $.__views.__alloyId150 = Ti.UI.createView({
        width: "33%",
        height: "70dp",
        left: "0dp",
        backgroundImage: "/images/bottom-nav-slct.png",
        id: "__alloyId150"
    });
    $.__views.__alloyId149.add($.__views.__alloyId150);
    $.__views.questIcon = Ti.UI.createImageView({
        image: "/images/Quests_white_icon.png",
        height: "23dp",
        textAlign: "center",
        top: "12dp",
        id: "questIcon"
    });
    $.__views.__alloyId150.add($.__views.questIcon);
    $.__views.__alloyId151 = Ti.UI.createLabel({
        textAlign: "center",
        bottom: "10dp",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "Quest",
        id: "__alloyId151"
    });
    $.__views.__alloyId150.add($.__views.__alloyId151);
    $.__views.__alloyId152 = Ti.UI.createView({
        width: "34%",
        height: "70dp",
        textAlign: "center",
        id: "__alloyId152"
    });
    $.__views.__alloyId149.add($.__views.__alloyId152);
    $.__views.rankingIcon = Ti.UI.createImageView({
        image: "/images/ranking_white_icon.png",
        height: "23dp",
        textAlign: "center",
        top: "12dp",
        id: "rankingIcon"
    });
    $.__views.__alloyId152.add($.__views.rankingIcon);
    $.__views.__alloyId153 = Ti.UI.createLabel({
        textAlign: "center",
        bottom: "10dp",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "Ranking",
        id: "__alloyId153"
    });
    $.__views.__alloyId152.add($.__views.__alloyId153);
    $.__views.__alloyId154 = Ti.UI.createView({
        width: "33%",
        height: "70dp",
        right: "0dp",
        id: "__alloyId154"
    });
    $.__views.__alloyId149.add($.__views.__alloyId154);
    $.__views.galleryIcon = Ti.UI.createImageView({
        image: "/images/gallery_white_icon.png",
        height: "24dp",
        textAlign: "center",
        top: "12dp",
        id: "galleryIcon"
    });
    $.__views.__alloyId154.add($.__views.galleryIcon);
    $.__views.__alloyId155 = Ti.UI.createLabel({
        textAlign: "center",
        bottom: "10dp",
        color: "#ffffff",
        font: {
            fontSize: "14",
            fontFamily: "RobotoCondensed-Regular"
        },
        text: "Gallery",
        id: "__alloyId155"
    });
    $.__views.__alloyId154.add($.__views.__alloyId155);
    $.__views.__alloyId146 = Ti.UI.createTableView({
        bottom: "0dp",
        height: "70dp",
        width: "100%",
        backgroundImage: "/images/bottom-bg.png",
        data: __alloyId147,
        separatorColor: "transparent",
        id: "__alloyId146"
    });
    $.__views.Page5.add($.__views.__alloyId146);
    $.__views.container = Ti.UI.createView({
        right: 1,
        left: "70%",
        height: Ti.UI.SIZE,
        id: "container",
        visible: "false"
    });
    $.__views.index.add($.__views.container);
    hide ? $.__views.container.addEventListener("click", hide) : __defers["$.__views.container!click!hide"] = true;
    $.__views.options = Ti.UI.createView({
        color: "#fff",
        height: Ti.UI.SIZE,
        textAlign: "center",
        width: Ti.UI.FILL,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "0%",
                y: "0%"
            },
            endPoint: {
                x: "0%",
                y: "100%"
            },
            colors: [ {
                color: "#667733",
                offset: 0
            }, {
                color: "#505e26",
                offset: 1
            } ]
        },
        font: {
            fontSize: "18",
            fontFamily: "Roboto-Bold"
        },
        top: 0,
        right: 0,
        left: 0,
        layout: "vertical",
        bubbleParent: false,
        backgroundColor: "#5f00",
        id: "options"
    });
    $.__views.container.add($.__views.options);
    mayHide ? $.__views.options.addEventListener("swipe", mayHide) : __defers["$.__views.options!swipe!mayHide"] = true;
    $.__views.__alloyId156 = Ti.UI.createView({
        top: 0,
        right: 0,
        left: 0,
        height: 44,
        backgroundColor: "#667733",
        id: "__alloyId156"
    });
    $.__views.options.add($.__views.__alloyId156);
    $.__views.__alloyId157 = Ti.UI.createLabel({
        text: "Home",
        color: "#ffffff",
        id: "__alloyId157"
    });
    $.__views.__alloyId156.add($.__views.__alloyId157);
    Home ? $.__views.__alloyId157.addEventListener("click", Home) : __defers["$.__views.__alloyId157!click!Home"] = true;
    $.__views.__alloyId158 = Ti.UI.createImageView({
        height: "1dp",
        width: "100%",
        backgroundColor: "#ffffff",
        id: "__alloyId158"
    });
    $.__views.options.add($.__views.__alloyId158);
    $.__views.__alloyId159 = Ti.UI.createView({
        top: 0,
        right: 0,
        left: 0,
        height: 44,
        backgroundColor: "#667733",
        id: "__alloyId159"
    });
    $.__views.options.add($.__views.__alloyId159);
    $.__views.__alloyId160 = Ti.UI.createLabel({
        text: "Preference",
        color: "#ffffff",
        id: "__alloyId160"
    });
    $.__views.__alloyId159.add($.__views.__alloyId160);
    preference ? $.__views.__alloyId160.addEventListener("click", preference) : __defers["$.__views.__alloyId160!click!preference"] = true;
    $.__views.__alloyId161 = Ti.UI.createImageView({
        height: "1dp",
        width: "100%",
        backgroundColor: "#ffffff",
        id: "__alloyId161"
    });
    $.__views.options.add($.__views.__alloyId161);
    $.__views.__alloyId162 = Ti.UI.createView({
        top: 0,
        right: 0,
        left: 0,
        height: 44,
        backgroundColor: "#667733",
        id: "__alloyId162"
    });
    $.__views.options.add($.__views.__alloyId162);
    $.__views.__alloyId163 = Ti.UI.createLabel({
        text: "LogOut",
        color: "#ffffff",
        id: "__alloyId163"
    });
    $.__views.__alloyId162.add($.__views.__alloyId163);
    logOut ? $.__views.__alloyId163.addEventListener("click", logOut) : __defers["$.__views.__alloyId163!click!logOut"] = true;
    $.__views.blurout = Ti.UI.createView({
        backgroundImage: "/img/transparent.png",
        backgroundColor: "B3000000",
        color: "B3000000",
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        id: "blurout",
        visible: "false"
    });
    $.__views.index.add($.__views.blurout);
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        color: "orange",
        font: {
            fontSize: "26",
            fontFamily: "Roboto-Bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
        zindex: 100,
        id: "activityIndicator"
    });
    $.__views.blurout.add($.__views.activityIndicator);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var strTitle = "Frog Quest";
    var strNoInternetAvailable = "No Internet Is Available, Please try again later !";
    var globalYearContainer = null;
    var BaseUrl = "http://test.frogquest.com/api/";
    var AuthToken = "2K70q4gmBAe6pONL3sRF";
    var urlRegister = "http://www.frogquest.com/register";
    var urlResetPassword = "http://www.frogquest.com/reset-password";
    var urlFindEvents = "http://www.frogquest.com/events";
    var currentOpenView = $.Page2;
    var previousOpenView = $.LoginView;
    var style;
    arguments[0] || {};
    var isVisible = false;
    var barHeight;
    var optionsHeight;
    optionsHeight = $.options.children.length * $.options.children[0].height;
    barHeight = $.bar.height;
    $.options.applyProperties({
        top: barHeight - optionsHeight
    });
    style = "iphone" === Ti.Platform.osname ? Titanium.UI.iPhone.ActivityIndicatorStyle.DARK : Titanium.UI.ActivityIndicatorStyle.PLAIN;
    $.textFieldUsername.keyboardType = Titanium.UI.KEYBOARD_EMAIL;
    $.login.addEventListener("touchstart", funcChangeColorOntouchStart);
    $.findEvents.addEventListener("touchstart", funcChangeColorOntouchStart);
    $.login.addEventListener("touchstart", funcChangeColorOntouchEnd);
    $.findEvents.addEventListener("touchstart", funcChangeColorOntouchEnd);
    $.login.addEventListener("touchmove", funcChangeColorOntouchStart);
    $.findEvents.addEventListener("touchmove", funcChangeColorOntouchStart);
    funcPlatformDependedAdjustments();
    funcGetVars();
    $.index.addEventListener("android:back", function() {
        if (true === $.LoginView.visible) {
            var activity = Titanium.Android.currentActivity;
            activity.finish();
        } else {
            funcCloseView(currentOpenView);
            funcShowView(previousOpenView);
        }
    });
    $.index.open();
    __defers["$.__views.index!click!hide"] && $.__views.index.addEventListener("click", hide);
    __defers["$.__views.login!click!funcOnClickLoginUser"] && $.__views.login.addEventListener("click", funcOnClickLoginUser);
    __defers["$.__views.__alloyId14!click!funcResetPwd"] && $.__views.__alloyId14.addEventListener("click", funcResetPwd);
    __defers["$.__views.__alloyId15!click!funcResetPwd"] && $.__views.__alloyId15.addEventListener("click", funcResetPwd);
    __defers["$.__views.__alloyId18!click!funcRegister"] && $.__views.__alloyId18.addEventListener("click", funcRegister);
    __defers["$.__views.__alloyId19!click!funcRegister"] && $.__views.__alloyId19.addEventListener("click", funcRegister);
    __defers["$.__views.bar!click!toggle"] && $.__views.bar.addEventListener("click", toggle);
    __defers["$.__views.__alloyId34!click!toggle"] && $.__views.__alloyId34.addEventListener("click", toggle);
    __defers["$.__views.findEvents!click!findeven"] && $.__views.findEvents.addEventListener("click", findeven);
    __defers["$.__views.bar!click!toggle"] && $.__views.bar.addEventListener("click", toggle);
    __defers["$.__views.__alloyId48!click!toggle"] && $.__views.__alloyId48.addEventListener("click", toggle);
    __defers["$.__views.listofEvents!click!findeven"] && $.__views.listofEvents.addEventListener("click", findeven);
    __defers["$.__views.bar!click!toggle"] && $.__views.bar.addEventListener("click", toggle);
    __defers["$.__views.__alloyId61!click!toggle"] && $.__views.__alloyId61.addEventListener("click", toggle);
    __defers["$.__views.bar!click!toggle"] && $.__views.bar.addEventListener("click", toggle);
    __defers["$.__views.__alloyId134!click!toggle"] && $.__views.__alloyId134.addEventListener("click", toggle);
    __defers["$.__views.container!click!hide"] && $.__views.container.addEventListener("click", hide);
    __defers["$.__views.options!swipe!mayHide"] && $.__views.options.addEventListener("swipe", mayHide);
    __defers["$.__views.__alloyId157!click!Home"] && $.__views.__alloyId157.addEventListener("click", Home);
    __defers["$.__views.__alloyId160!click!preference"] && $.__views.__alloyId160.addEventListener("click", preference);
    __defers["$.__views.__alloyId163!click!logOut"] && $.__views.__alloyId163.addEventListener("click", logOut);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;