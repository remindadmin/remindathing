/**************************************************************/
var bs = false;
var ACore = {
xmlHttp:null,
waiting:0,
waitwith:new Array(),
strFormName:'',
boolViewCart:false,
objPresentForm:null,
 GetXmlHttpObject:function()
	{
		xmlHttp=null;
		try
			{
				// Firefox, Opera 8.0+, Safari
				xmlHttp=new XMLHttpRequest();
			}
		catch (e)
    		{
			// Internet Explorer
			try
				{
					xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
				}
			catch (e)
				{
					xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
			}
		return xmlHttp;
	},

    Wait:function(){

      if(ACore.waiting == 1)
        setTimeout("ACore.Wait()",200);
      else{
        if(this.waitwith.length > 0)
            ACore.Re_Call();
        }
    },

    Re_Call:function(){
        if(this.waitwith[0] != "")
            ACore.Ajax_Call(this.waitwith[0]);
        ACore.Crunch_Array(this.waitwith,0);
    },

    Crunch_Array:function(arra,des){
    var tempa = new Array();
    if(arra.length > 0){
        for(al=0;al<arra.length;al++){
           if(al == des){
             //alert(des);
           }
           else
            tempa[tempa.length] = arra[al];
        }
        this.waitwith = tempa;
    }
    else
       this.waitwith[0] = "";
       //if(this.waitwith.length < 1)
          //ACore.waiting = 0;
    },

    Ajax_Call:function (arra){
    //alert('start AJAX'+ACore.waiting);
    if(ACore.waiting == 1){
      if(arra.elements && arra.elements.length > 0)
        this.waitwith[this.waitwith.length] = arra;
      else
        this.waitwith[this.waitwith.length] = arra.toString();
      ACore.Wait();
      //make sure request line is open
    }
    if(ACore.waiting == 0){
      ACore.waiting = 1;
      var cash = Math.random();
      xmlHttp = ACore.GetXmlHttpObject();
      if(arra.elements && arra.elements.length > 0){
          var url='AS.php';
          url = url+"?DB=null";
          //url = url+"&dir="+arra[2];
          for(i=0;i<arra.elements.length;i++){
            if(arra.elements[i].type == 'select-multiple'){
              for(e=0;e<arra.elements[i].length;e++){
                if(arra.elements[i][e].selected)
                    url = url+"&"+arra.elements[i].name+"="+arra.elements[i][e].value;
              }
            }
            else{
              if(arra.elements[i].type != 'button')
                 url = url+"&"+arra.elements[i].name+"="+arra.elements[i].value;
            }
          }
          //now let's try to clean this up
          url = ACore.Clean_Call(url);
      }
      else{
        arra = ACore.Clean_Call(arra.toString());
        arra = arra.split(",");
        if(arra && arra.length > 0){
            var url=arra[0];
            url = url+"?DB="+arra[1];
            url = url+"&dir="+arra[2];
            if(arra.length > 3){
              for(x=3;x<arra.length;x++){
                if(arra[x].indexOf('=') < 0)
                    url = url+"&misc"+x+"="+arra[x];
                else
                    url = url+"&"+arra[x];
              }
            }
        }
        else
          alert("Sorry, there are not enough items to make this request. Please try again.");
       }
       if(url == ''){
          alert("Sorry, there are not enough items to make this request. Please try again.");
        return false;
       }
       //we should have everything we need
       url = url+"&cash="+cash;
       //alert(url+'URL');
       xmlHttp.onreadystatechange=ACore.shoresult;
       xmlHttp.open("POST",url,true);
       xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
       xmlHttp.send(null);
       url = "";
     }
        return true;
    },



     shoresult:function(){
    if(xmlHttp.readyState === 4){
    var sling = xmlHttp.responseText;
    if(sling != "" && sling != "fail"){
    while(sling.indexOf("\r") >= 0)
        sling = sling.replace("\r","");
    while(sling.indexOf("\n") >= 0)
        sling = sling.replace("\n","");

        //alert("--"+sling+"--");
    while(sling.indexOf(' ') === 0)
        sling = sling.replace(" ","");
    var direct = sling.slice(0,1);//output to screen 0, or update a variable = 1, both == 2
    var uloc = sling.slice(1,4);//where in the screen to update, or what variable to update
    var rcount = Number(Math.round(sling.slice(4,8)));//number of updates returned
    var response = sling.slice(8,sling.length );//actual info to update or insert
    response = ACore.Fill_Call(response.toString());
    //close the ajax loading image
    if(direct == "<"){
       if(document.getElementById("error"))
             document.getElementById("error").innerHTML = sling;
       if(sling.indexOf("<!DOCTYPE html PUBLIC") == 0)
             window.location = "index.php";
    }
    if(direct == 0){
        if(uloc == "con" || uloc == "ale"){
                   if(uloc == "con"){

                   }
                   if(uloc == "ale"){
                   //response should be alerted to user
                       alert(response);
                   }

                   if(uloc == "Err"){
                       if(document.getElementById("error1"))
                        document.getElementById("error1").innerHTML = response;
                   }
                }
                else{
                    if(uloc == "ref"){
                       window.location.href=window.location.href;
                    }
                    if(uloc == "uer"){
                        if(document.getElementById("formbox")){
                          var objFormBox = document.getElementById("formbox");
                          objFormBox.style.textAlign = 'center';
                          objFormBox.style.fontSize = '25px';
                          objFormBox.innerHTML = response;
                        }
                    }
                    if(uloc == "alD"){
                   //if Floating Div exists, kill it
                     var killdiv;
                      if(killdiv = document.getElementById('tboxy'))
                         Kill_Container(killdiv,0);
                   //response should be alerted to user
                         //alert(response);
                         window.location = window.location.href;
                   }
                    else{
                      if(document.getElementById(uloc))
                        document.getElementById(uloc).innerHTML = response;
                    }
                 }


    }
    //alert(rcount+"--"+sling.slice(4,8));
    if(direct == 1 && rcount == 1){

        if(uloc == "urm"){
         //return is user update form
         //first we slice the return, since our element ID is hiding in front of the  '='
         var responses = response.split("|*|");
         //is it there?
         if(responses.length > 1){
            var responseelement;
            //alert(responses[1] + "--" + responses.length + "--" + responses[0]);
            //lets see if it exists first
            if(responseelement = document.getElementById(responses[0])){
            //alert(responses[0]);
             //ok, it exists, lets fill it with the return data
              responseelement.innerHTML = responses[1];
            }
         }
        }
        if(uloc == "psc"){
          //product status check
          var objStatusBox = document.getElementById("productstatus");
          if(objStatusBox){
            if(response == "none"){
               boolProductStatusCheck = false;
               objStatusBox.style.display = "none";
            }
            else{
               objStatusBox.style.backgroundColor = "#FF4876";
               objStatusBox.innerHTML = response;
               objStatusBox.style.display = "block";
            }
          }
        }
        if(uloc == "apd"){
        //append an existing html element.innerHTML
          var objParentElement = GEO(ACore.strFormName,'');
          if(objParentElement){
             var newdiv = document.createElement('span');
             newdiv.innerHTML = response;
             objParentElement.appendChild(newdiv);
          }
        }
        if(uloc == "mff"){
            ACore.objPresentForm.style.backgroundColor = '#CEFFDB';
            ACore.objPresentForm.innerHTML = response;
            ACore.objPresentForm = null;
        }
    }
    if(direct == 2){
          var coms = response.split("*|*");
          for(x=0;x<coms.length;x++){
            var d2 = coms[x].slice(0,1);//output to screen 0, or update a variable = 1, array == 2
            var u2 = coms[x].slice(1,4);//where in the screen to update, or what variable to update
            var up_d = coms[x].slice(8,sling.length );
            if(d2 === 0){
                if(u2 == "con" || u2 == "ale"){
                   if(u2 == "con"){

                   }
                   if(u2 == "ale"){

                   }
                   if(u2 == "sub"){

                   }
                }
                else{
                    if(document.getElementById(uloc))
                        document.getElementById(uloc).innerHTML = up_d;
                }
            }
            if(d2 == 1){
            //do something

            }
            if(d2 == 2){
                //do something
                }

            }
          }
          if(uloc == "tst"){

          }
    }

    else{
     //alert("return content is empty-" + sling + "--");
    }
    ACore.waiting = 0;
    }
    return true;
    },


    Clean_Call:function(ar){
    var dirt = new Array();
    dirt["#"] = "%23";
    //dirt["&"] = "$arro$";
    dirt["@"] = "%40";
    //dirt["?"] = "$ques$";
    dirt['"'] = "%22";
    dirt["'"] = "%27";
    //dirt["\r"] = "";
    //dirt["\n"] = "";
        for (var i in dirt){
            while(ar.indexOf(i) > -1){
                ar = ar.replace(i,dirt[i]);
            }
        }
    return ar;
    },

    Fill_Call:function(ar){
        var dirt = new Array();
    dirt["%23"] = "#";
    dirt["%40"] = "@";
    //dirt["$ampe$"] = "&";
    //dirt["$ques$"] = "?";
    dirt["%22"] = '"';
    dirt["%27"] = "'";
        for (var i in dirt){
            while(ar.indexOf(i) > -1){
                ar = ar.replace(i,dirt[i]);
            }
        }
    return ar;
    }
    }