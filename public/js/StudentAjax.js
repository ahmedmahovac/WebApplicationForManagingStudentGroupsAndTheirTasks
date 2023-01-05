var StudentAjax = function(){

function dodajStudenta(student,fnCallback) {
    const ajax = new XMLHttpRequest()
    ajax.open("POST", "/student", true)
    ajax.setRequestHeader("Content-Type", "application/json")
    ajax.onreadystatechange = function() {
       if (ajax.readyState == 4 && ajax.status == 200) {
         fnCallback(null,JSON.parse(ajax.responseText))
       }
       else if (ajax.readyState == 4 && ajax.status == 404){
        fnCallback("greska",null)
       }
    }
    ajax.send(JSON.stringify(student))
}

function postaviGrupu(index,grupa,fnCallback) {
    const ajax = new XMLHttpRequest()
    ajax.open("PUT", "/student/"+index, true)
    ajax.setRequestHeader("Content-Type", "application/json")
    ajax.onreadystatechange = function() {
       if (ajax.readyState == 4 && ajax.status == 200) {
         fnCallback(null,JSON.parse(ajax.responseText))
       }
       else if (ajax.readyState == 4 && ajax.status == 404){
         fnCallback("greska",null)
       }
    }
    ajax.send(JSON.stringify({grupa: grupa}))
}

function dodajBatch(csvStudenti,fnCallback) {
    const ajax = new XMLHttpRequest()
    ajax.open("POST", "batch/student/", true)
    ajax.setRequestHeader("Content-Type", "text/plain")
    ajax.onreadystatechange = function() {
       if (ajax.readyState == 4 && ajax.status == 200) {
         fnCallback(null,JSON.parse(ajax.responseText))
       }
       else if (ajax.readyState == 4 && ajax.status == 404){
        fnCallback("greska",null)
       }
    }
    ajax.send(csvStudenti)
}

return {
    dodajStudenta: dodajStudenta,
    postaviGrupu: postaviGrupu,
    dodajBatch: dodajBatch
    }


}()