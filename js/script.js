document.addEventListener("DOMContentLoaded", function() {
    getJson();
});


var firstNames = document.getElementsByClassName("firstName");
var lastNames = document.getElementsByClassName("lastName");
var ids = document.getElementsByClassName("id");
var position = document.getElementsByClassName("function");
var experience = document.getElementsByClassName("experience");
var tBody = document.getElementById('tBody');
var form = document.getElementById("form");
var selectName, selectLastName,selectId,selectPosition;
var arrayOfId,arrayOfNames,arrayOfLastNames,arrayOfPositions, arrayOfExperience = [];
var selectId = document.querySelector(".selectId");
var selectName =  document.querySelector(".selectName");
var selectLastName = document.querySelector(".selectLastName");
var selectExperience = document.querySelector(".selectExperience");
var selectPosition = document.querySelector(".selectPosition");
var tBody = document.getElementById('tBody');
var nextPageButton = document.getElementById("nextPage");
var previousPageButton = document.getElementById("previousPage");
var listing_table = document.getElementById("listingTable");
var pageSpan = document.getElementById("page");
var filterByIdInput = document.getElementById("filterById");
var filterByFirstNameInput = document.getElementById("filterByFirstName");
var filterByLastNameInput = document.getElementById("filterByLastName");
var filterByDateInput = document.getElementById("filterByDate");
var filterbyFunctionInput = document.getElementById("filterbyFunction");
var filterByExperienceInput = document.getElementById("filterByExperience");
var inputs = document.querySelectorAll("input");
var currentToDisplay,currentDataToDisplay,currentDateParameter,currentPage,key,numberOfPages,i,trArrayforSortByDate,re,arrayOfIds,arrayOfFirstNames,arrayOfDate,arrayExperience;

function setDataPicker(person){
     $( "#datepicker" ).datepicker({ dateFormat: 'dd.mm.yy ',
                        timeFormat:  "hh:mm",
                        changeMonth: true,
                        changeYear: true,
                        yearRange: "-100:+0",
                        pickDate: false,
                        pickSeconds: false,
                        pick12HourFormat: false,
                        onClose: function() { 
                            var filterByDateInput = $(this).datepicker('getDate'); 
                            if(filterByDateInput!=null){
                                filterByDateInput = filterByDateInput.toLocaleDateString();
                            }
                            filterByDate(filterByDateInput,person);
                        }                    
    });
}


function getJson(){
    $.getJSON("data/sluzba.json", function(data) {
        const person = data; 
        deletetBody();
        
        displayTable(person,false);
        setDataPicker(person);
        findPerson(person);
        
        
         $("#showAll").click(function(){
            displayTable(person);
             clearInputsValue();
         }); 
        
        $("#sortById").click(function(){
            sortTable(person,"id","asc");});  
        $("#sortByIdDesc").click(function(){
            sortTable(person,"id","desc");}); 
        
        $("#sortByName").click(function(){
            sortTable(person,name,"asc");});  
        $("#sortByNameDesc").click(function(){
            sortTable(person,name,"desc");}); 
        
         $("#sortByLastName").click(function(){
            sortTable(person,"lname","asc");});  
        $("#sortByLastNameDesc").click(function(){
            sortTable(person,"lname","desc");});
        
        $("#sortByDate").click(function(){
            getAlltTrForSortByDate(person,"asc");});
        $("#sortByDateDesc").click(function(){
            getAlltTrForSortByDate(person,"desc");});
        
        $("#sortByFunction").click(function(){
            sortTable(person,"function","asc");});
        $("#sortByFunctionDesc").click(function(){
            sortTable(person,"function","desc");});
        
        $("#sortByExperience").click(function(){
            sortTable(person,"experience","asc");});
        $("#sortByExperienceDesc").click(function(){
            sortTable(person,"experience","desc");});
    });
}



 //add data to a table
function displayTable(dataToDisplay,optionalDateParameter){
    var tBody = document.getElementById('tBody');
    deletetBody();
    changePage(1,dataToDisplay,optionalDateParameter);
}

function clearInputsValue(){
    for(i=0;i<inputs.length;i++){
                inputs[i].value = "";}
}

function changePage(page,dataToDisplay,optionalDateParameter){
    deletetBody();
    currentDataToDisplay=dataToDisplay;    
    currentDateParameter = optionalDateParameter;
    currentPage=page;
    var rowsPerPage = 5;
    
    for (var i = (page-1) * rowsPerPage; i < (page * rowsPerPage) && i < dataToDisplay.length; i++) {
        if(optionalDateParameter){
            tBody.appendChild(dataToDisplay[i]);
        }else{
            var tr = document.createElement('tr');
            for(key in dataToDisplay[i]){
            var td = document.createElement('td');
            td.innerHTML = dataToDisplay[i][key];
            td.classList.add(key);
            tr.appendChild(td);
        }
        tBody.appendChild(tr);
    }
   
    numberOfPages = Math.ceil(dataToDisplay.length / rowsPerPage);

    if (page < 1) page = 1;
    if (page > numberOfPages) page = numberOfPages;
    
    pageSpan.innerHTML = page + "/" + numberOfPages;
        
    nextPageButton.addEventListener("click",nextPage);
    previousPageButton.addEventListener("click",prevPage);    
    
    if (page == 1) {
        previousPageButton.style.display = "none";
    } else {
        previousPageButton.style.display = "flex";
    }

    if (page == numberOfPages) {
        nextPageButton.style.display = "none";
    } else {
        nextPageButton.style.display = "flex";
    }

function prevPage(){
    event.stopImmediatePropagation();
    if (currentPage > 1) {
        currentPage--;
        changePage(currentPage,currentDataToDisplay,currentDateParameter);
    }
}
function nextPage(){
    event.stopImmediatePropagation();    
    if (currentPage < numberOfPages) {
        currentPage++;
        changePage(currentPage,currentDataToDisplay,currentDateParameter);
    }
}
}
}

function getAlltTrForSortByDate(person,order){
    trArrayforSortByDate=[];
    for (var i = 0; i < person.length; i++) {
        var tr = document.createElement('tr');
        
        for(key in person[i]){
            var td = document.createElement('td');
            td.innerHTML = person[i][key];
            td.classList.add(key);
            tr.appendChild(td);
        }
        trArrayforSortByDate.push(tr);       
}
        sortByDate999(trArrayforSortByDate,order);
}

//FILTERING 
      
function findPerson(person){    
    filterByIdInput.addEventListener("input",filterById);
    filterByFirstNameInput.addEventListener("input",filterByFirstName);
    filterByLastNameInput.addEventListener("input",filterByLastName);
    filterbyFunctionInput.addEventListener("input",filterByFunction);
    filterByExperienceInput.addEventListener("input",filterByExperience);

    
    function filterByFunction(){
        arrayOfPositions=[];
        var selectedFunction = this.value;
        for(var i = 0; i < person.length; i++) {
                if(person[i].function.toLowerCase().includes(selectedFunction.toLowerCase())) {
                    arrayOfPositions.push(person[i]);
                    //getUniqueArray(arrayOfPositions);
               }
        }
        var results=[];
        if(arrayOfPositions.length==0){
            results.length=0;
            displayTable(results);
        }else{
            displayTable(arrayOfPositions); 
        }
    }
    
    function filterById(){
        arrayOfIds=[];
        var selectedId = this.value;
        for(var i = 0; i < person.length; i++) {
                if((person[i].id).toString().includes(selectedId)) {
                    arrayOfIds.push(person[i]);
                    //getUniqueArray(arrayOfIds);
               }
        }
        var results=[];
        if(arrayOfIds.length==0){
            results.length=0;
            displayTable(results);
        }else{
            displayTable(arrayOfIds); 
        }
    }
    
    
    function filterByFirstName(){
        arrayOfFirstNames=[];
        var selectedFirstName = this.value;
        for(var i = 0; i < person.length; i++) {
                if(person[i].firstName.toLowerCase().includes(selectedFirstName.toLowerCase())) {
                    arrayOfFirstNames.push(person[i]);
                    //getUniqueArray(arrayOfFirstNames);
               }
        }
        var results=[];
        if(arrayOfFirstNames.length==0){
            results.length=0;
            displayTable(results);
        }else{
            displayTable(arrayOfFirstNames); 
        }
    }
    
    function filterByLastName(){
        arrayOfLastNames=[];
        var selectedLastName = this.value;
        for(var i = 0; i < person.length; i++) {
                if(person[i].lastName.toLowerCase().includes(selectedLastName.toLowerCase())) {
                    arrayOfLastNames.push(person[i]);
                    //getUniqueArray(arrayOfLastNames);
               }
        }
        var results=[];
        if(arrayOfLastNames.length==0){
            results.length=0;
            displayTable(results);
        }else{
            displayTable(arrayOfLastNames); 
        }
    }
    
    
    function filterByExperience(){
        arrayExperience=[];
        var selectedExperience = this.value;
        for(var i = 0; i < person.length; i++) {
                if((person[i].experience).toString().includes(selectedExperience)) {
                    arrayExperience.push(person[i]);
                    //getUniqueArray(arrayExperience);
               }
        }
        var results=[];
        if(arrayExperience.length==0){
            results.length=0;
            displayTable(results);
        }else{
           displayTable(arrayExperience); 
        }
    }
}

function filterByDate(filterByDateInput,person){
        arrayOfDate=[];
    
        if(filterByDateInput ==='1.04.2017'){filterByDateInput = '1.4.2017';}    
        for(var i = 0; i < person.length; i++) {
                if(person[i].dateOfBirth.includes(filterByDateInput)) {
                    arrayOfDate.push(person[i]);
                    //getUniqueArray(arrayOfDate);
               }
        }
    
        var results=[];
        if(arrayOfDate.length==0){
            results.length=0;
            displayTable(results);
        }else{
            displayTable(arrayOfDate);
        }
    }



//SORTING


function sortTable(data,atribute,order){
    
    if(atribute==name){
        if(order=="asc"){
            var orderedNames = data.sort((a, b) => a.firstName > b.firstName ? 1 : -1);
            deletetBody();
            displayTable(orderedNames,false);
        }else{
            var reverseOrderedNames = data.sort((a, b) => a.firstName > b.firstName ? -1 : 1);
            deletetBody();
            displayTable(reverseOrderedNames,false);
        }
    }
    
  if(atribute=="lname"){
        if(order=="asc"){
            var orderedLastNames = data.sort((a, b) => a.lastName > b.lastName ? 1 : -1);
            deletetBody();
            displayTable(orderedLastNames,false);
        }else{
            var reverseOrderedLastNames = data.sort((a, b) => a.lastName > b.lastName ? -1 : 1);
            deletetBody();
            displayTable(reverseOrderedLastNames,false);
        }
    }
    
    
    if(atribute=="id"){
        if(order=="asc"){
            var orderedId = data.sort((a, b) => a.id > b.id ? 1 : -1);
            deletetBody();
            displayTable(orderedId,false);
        }else{
            var reverseOrderedId = data.sort((a, b) => a.id > b.id ? -1 : 1);
            deletetBody();
            displayTable(reverseOrderedId,false);
        }
    }
    
    
     if(atribute=="experience"){
        if(order=="asc"){
            var orderedExperience = data.sort((a, b) => a.experience > b.experience ? 1 : -1);
            deletetBody();
            displayTable(orderedExperience,false);
        }else{
            var reverseOrderedExperience = data.sort((a, b) => a.experience > b.experience ? -1 : 1);
            deletetBody();
            displayTable(reverseOrderedExperience,false);
        }
    }
    
    if(atribute=="function"){
        if(order=="asc"){
            var orderedFunction = data.sort((a, b) => a.function > b.function ? 1 : -1);
            deletetBody();
            displayTable(orderedFunction,false);
        }else{
            var reverseOrderedFunction = data.sort((a, b) => a.function > b.function ? -1 : 1);
            deletetBody();
            displayTable(reverseOrderedFunction,false);
        }
    }
   // displayTable(reverseOrderedNames,false); --> true lub false dla oznaczenia czy sortujemy po dacie, dla date = true;
   //potrzebne ponieważ tablica z datami jest inaczej wyświetlana   
}
    
    function sortByDate999(trArrayforSortByDate,order){ 
        trArrayforSortByDate.sort(function(a, b){
            var first = a.children[3].textContent;
            var second = b.children[3].textContent;
            first = convertDate(first);
            second = convertDate(second);
            
            if(order=="asc"){
                console.log(order);
                if(first > second) return 1;
                if(first < second) return -1;
            }else{
                if(first > second) return -1;
                if(first < second) return 1;
            }
        });
        deletetBody();
        displayTable(trArrayforSortByDate,true);
    }
                 
    function convertDate(stringDateParametr){
        stringDateParametr;
        re = /[.:\s]/;
        var splitdate = stringDateParametr.split(re);
        var date = new Date(splitdate[2],splitdate[1] - 1,splitdate[0],splitdate[3],splitdate[4]);  
        var timestamp = date.getTime();        
        return timestamp; 
    }

function deletetBody(){
    if(tBody.hasChildNodes){
        $(tBody).empty();
    }
}