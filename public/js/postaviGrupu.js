let index = document.getElementById("inputIndex")
let grupa = document.getElementById("inputGrupa")
let button = document.getElementById("btnPosalji")
let ajaxstatus = document.getElementById("ajaxstatus")
button.addEventListener("click", function(){
    StudentAjax.postaviGrupu(index.value, grupa.value, function(error, data){
        if(error==null) {
            ajaxstatus.innerHTML = data.status
        }
        else {
            ajaxstatus.innerHTML = error
        }
    })
})