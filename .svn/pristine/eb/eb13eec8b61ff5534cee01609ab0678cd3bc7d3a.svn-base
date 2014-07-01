
//==============Handle DOM retrieval here====================//
  
function GEO(parentname,ind){
  var parentelement = false;
  if(typeof(window[parentname]) == "[object]"){
    parentelement = parentname;
  }
  else{
    if(document.getElementById(parentname) && ind != "all"){
      parentelement = document.getElementById(parentname);
    }
    else if(document.getElementsByTagName(parentname) && document.getElementsByTagName(parentname).length > 0){
      if(ind == "all" || ind == "")
        parentelement = document.getElementsByTagName(parentname);
      else
        parentelement = document.getElementsByTagName(parentname)[ind];
    }
    else if(document.getElementsByName(parentname) && document.getElementsByName(parentname).length > 0){
      if(ind == "all" || ind == "")
        parentelement = document.getElementsByName(parentname);
      else
        parentelement = document.getElementsByName(parentname)[ind];
    }
    else{
      return false;
    }
  }
  return parentelement;
}