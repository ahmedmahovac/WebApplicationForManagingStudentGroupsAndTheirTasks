let studenti = document.getElementById("textAreaStudenti")
let ajaxstatus = document.getElementById("ajaxstatus")
let button = document.getElementById("btnPosalji")
button.addEventListener("click", function(){
    StudentAjax.dodajBatch(studenti.value,function(error, data){
        if(error==null) {
            ajaxstatus.innerHTML = data.status
        }
        else {
            ajaxstatus.innerHTML = error
        }
    })
})