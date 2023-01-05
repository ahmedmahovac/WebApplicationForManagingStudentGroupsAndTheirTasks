let ime = document.getElementById("inputIme")
let prezime = document.getElementById("inputPrezime")
let index = document.getElementById("inputIndex")
let grupa = document.getElementById("inputGrupa")
let button = document.getElementById("btnPosalji")
let ajaxstatus = document.getElementById("ajaxstatus")
button.addEventListener("click", function(){
    StudentAjax.dodajStudenta({ime: ime.value, prezime: prezime.value, index: index.value, grupa: grupa.value}, function(error, data){
        if(error==null) {
            ajaxstatus.innerHTML = data.status
        }
        else {
            ajaxstatus.innerHTML = error
        }
    })
})
