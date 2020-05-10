//MODAL
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 
function modalStart(id){
    document.getElementById("dayPrice").value = 1;
    modal.style.display = "block";
    modal.querySelectorAll("h4")[0].innerHTML =  baseOriginal[id][1];
    modal.querySelectorAll("img")[0].src = baseOriginal[id][0];
    modal.querySelectorAll("#im-estado")[0].innerHTML =  baseOriginal[id][4];
    modal.querySelectorAll("#im-cidade")[0].innerHTML =  baseOriginal[id][5];
    modal.querySelectorAll("#im-tipo")[0].innerHTML =  baseOriginal[id][2];
    modal.querySelectorAll("#im-valor")[0].innerHTML =  formatter.format(baseOriginal[id][3]);
    modal.querySelectorAll("#price-raw")[0].value =  baseOriginal[id][3];
    dayPrice();

}

function modalSearch(id){
    document.getElementById("dayPrice").value = 1;
    modal.style.display = "block";
    modal.querySelectorAll("h4")[0].innerHTML =  buscaRefinada[id][1];
    modal.querySelectorAll("img")[0].src = buscaRefinada[id][0];
    modal.querySelectorAll("#im-estado")[0].innerHTML =  buscaRefinada[id][4];
    modal.querySelectorAll("#im-cidade")[0].innerHTML =  buscaRefinada[id][5];
    modal.querySelectorAll("#im-tipo")[0].innerHTML =  buscaRefinada[id][2];
    modal.querySelectorAll("#im-valor")[0].innerHTML =  formatter.format(buscaRefinada[id][3]);
    modal.querySelectorAll("#price-raw")[0].value =  buscaRefinada[id][3];
    dayPrice();

}

//DAY PRICE
function dayPrice(){
    day = document.getElementById("dayPrice").value;
    price = modal.querySelectorAll("#price-raw")[0].value;
    document.getElementById("calc-result").innerHTML = formatter.format((price * day));;
}

//FORMAT MONEY
var formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

//JSON REQUEST
var getJSON = function(url) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
       if (status == 200) {
          resolve(xhr.response);
        } else {
          reject(status);
        }
      };
      xhr.send();
    });
  };

// CREATE RANDON LOCATION
function randonLocation(){

    var locations = [];
    
    locations.push(["Pirituba", "SP"]);
    locations.push(["Caieiras", "SP"]);
    locations.push(["São Paulo", "SP"]);
    locations.push(["Cajamar", "SP"]);
    locations.push(["Realengo", "RJ"]);
    locations.push(["Rio de Janeiro", "RJ"]);
    locations.push(["Blumenau", "SC"]);
    locations.push(["Porto Alegre", "RS"]);
    locations.push(["Canoas", "RS"]);
    locations.push(["Pelotas", "RS"]);
    
    return locations[Math.round(Math.random() * 9)];

}

//GLOBAL BASE
var baseOriginal = [];


//UPDATE ARRAY WITH RANDON LOCATION
getJSON("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72").then(function(data) { 
    data.forEach(function(index){
        var location = randonLocation();
        baseOriginal.push([index.photo, index.name, index.property_type, index.price, location[1], location[0]]);
    });
    loadsite();
    document.querySelectorAll(".modal-load")[0].style.display = "none";
}, function(status) {
  alert('Alguma coisa deu errado na requisição de dados');
});



//UPDATE SITE HOME 
function updateHome(){
    //MOSAIC
    updateItem("destaque",0);
    updateItem("half1",1);
    updateItem("half2",2);
    updateItem("full",3);
   
}

//UPDATE ITEM
function updateItem(id, position){
    var selector = "."+id;
    var selectorName = "."+id+" h3";
    document.querySelectorAll(selector)[0].style.backgroundImage = "url('"+baseOriginal[position][0]+"')";
    document.querySelectorAll(selector)[0].setAttribute("onCLick", "modalStart("+position+")"); 
    document.querySelectorAll(selectorName)[0].innerHTML= baseOriginal[position][1];
    
}

//CREATE LIST
function createList(){

    var listOffset = 4;
    var listLimit = 8;
    for (var i = 0; i < listLimit; i++) {
        var img = baseOriginal[i+listOffset][0];
        var name = baseOriginal[i+listOffset][1];
        document.getElementById("listHome").innerHTML += '<div onClick="modalStart('+(i+listOffset)+')" class="mosaic-half" style="background-image: url('+img+');"><div class="mosaic-footer"><h3>'+name+'</h3></div></div>';
    }
}

//LOAD MORE
function loadMore(){
    var newItens = 4;
    var maxItens = baseOriginal.length;

    for (var i = 0; i < newItens; i++) {
        var pointer = i+globalOffset;
        if(pointer >= maxItens){
            document.getElementById("loadMore").style.display = "none"; 
            document.getElementById("no-results").style.display = "block"; 
        }else{
            var img = baseOriginal[pointer][0];
            var name = baseOriginal[pointer][1];    
            document.getElementById("listHome").innerHTML += '<div onClick="modalStart('+(pointer)+')" class="mosaic-half" style="background-image: url('+img+');"><div class="mosaic-footer"><h3>'+name+'</h3></div></div>';
        }
    }

    globalOffset = globalOffset + newItens;
}

//MENU BUILD
function menuBuild(){
    var estados = [];
    for (var i = 0; i < baseOriginal.length; i++) {
        var estado = baseOriginal[i][4];

        if(!estados.includes(estado)){
            estados.push(estado);
            document.getElementById("estados").querySelectorAll("ul")[0].innerHTML += '<li onClick="refineEstados(\''+estado+'\')">'+estado+'</li>';
        }        
    }
}


//REFINE ESTADOS // BUILD CIDADES
function refineEstados(estado){

    for (var i = 0; i < baseOriginal.length; i++) {
        if(baseOriginal[i][4] == estado){
            buscaRefinada.push(baseOriginal[i]);
        }
    }

    var cidades = [];
    for(var i =0; i < buscaRefinada.length; i++){
        if(!cidades.includes(buscaRefinada[i][5])){
            cidades.push(buscaRefinada[i][5]);
            document.getElementById("cidades").querySelectorAll("ul")[0].innerHTML += '<li onClick="refineCidades(\''+buscaRefinada[i][5]+'\')">'+buscaRefinada[i][5]+'</li>';
        }    
    }

    document.getElementById("cidades").style.display = "inline-block";
    document.getElementById("estados").innerHTML = "Estado: "+estado;

    doSearch();

}

//REFINE CIDADES
function refineCidades(cidade){

    var refinaCidade = []

    for (var i = 0; i < buscaRefinada.length; i++) {
        if(buscaRefinada[i][5] == cidade){
            refinaCidade.push(buscaRefinada[i]);
        }
    }

    buscaRefinada = refinaCidade;

    document.getElementById("cidades").innerHTML = "Cidade: "+cidade;

    doSearch();

}

//DO SEARCH
function doSearch(){
    
    indexElements = document.querySelectorAll(".index");
    for(var i = 0; i < indexElements.length; i++){
        indexElements[i].style.display = "none"
    }

    searchElements = document.querySelectorAll(".do-search");
    for(var i = 0; i < searchElements.length; i++){
        searchElements[i].style.display = "block";
    }    

    document.getElementById("listSearch").innerHTML = "";

    for (var i = 0; i < buscaRefinada.length; i++) {
        var img = buscaRefinada[i][0];
        var name = buscaRefinada[i][1];
        document.getElementById("listSearch").innerHTML += '<div onClick="modalSearch('+(i)+')" class="mosaic-half" style="background-image: url('+img+');"><div class="mosaic-footer"><h3>'+name+'</h3></div></div>';
    }


}

//UNSET SEARCH
function unsetSearch(){
    indexElements = document.querySelectorAll(".index");
    for(var i = 0; i < indexElements.length; i++){
        indexElements[i].style.display = "block";
    }
    searchElements = document.querySelectorAll(".do-search");
    for(var i = 0; i < searchElements.length; i++){
        searchElements[i].style.display = "none";
    }
    document.getElementById("estados").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>Escolha o estado!<ul></ul>';
    document.getElementById("cidades").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7z"/></svg>Escolha a cidade!<ul></ul>';
    document.getElementById("cidades").style.display = "none";
    menuBuild();
    
    
}


//LOAD SITE
function loadsite(){
    menuBuild();
    updateHome();
    createList();
}
var globalOffset = 12;
var buscaRefinada = [];





