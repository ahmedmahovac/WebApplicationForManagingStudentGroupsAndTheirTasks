var VjezbeAjax = function(){

    let zadnjaVjezba = null


    var dodajInputPolja = function(DOMelementDIVauFormi,brojVjezbi) {
        for(let i=0; i<brojVjezbi; i++) { 
            let input = document.createElement("input")
            input.setAttribute("type","number")
            input.setAttribute("id", "z"+i)
            input.setAttribute("name", "z"+i)
            input.setAttribute("value", 4)
            let labela = document.createElement("label")
            labela.setAttribute("for", "z"+i)
            labela.innerHTML = "Broj zadataka u z" + i + ": "
            DOMelementDIVauFormi.appendChild(labela)
            DOMelementDIVauFormi.appendChild(input)
        }
    }

    var posaljiPodatke = function(vjezbeObjekat,callbackFja) {
     const ajax = new XMLHttpRequest()
     ajax.open("POST", "/vjezbe", true)
     ajax.setRequestHeader("Content-Type", "application/json")
     ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
        let response = JSON.parse(ajax.responseText) 
        let error = null
        let data = null
        if('status' in response) {
            error = response["data"]
        }
        else {
           data = response
        }
        callbackFja(error,data)
    }
    else if (ajax.readyState == 4 && ajax.status == 404){
        callbackFja("greska",null)
    }
    }
     ajax.send(JSON.stringify(vjezbeObjekat))
    }


    var dohvatiPodatke = function(callbackFja) {
     const ajax = new XMLHttpRequest()
     ajax.open("GET", "/vjezbe", true)
     ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            callbackFja(null, JSON.parse(ajax.response))
        }
        else if(ajax.readyState == 4 && ajax.status == 404) {
            callbackFja("greska: nemoguce dobaviti podatke", null)
        }
     }
     ajax.send()
    }


    var iscrtajVjezbe = function(divDOMelement, vjezbeObjekat) {
        let brojVjezbi = vjezbeObjekat.brojVjezbi
        let brojZadataka = vjezbeObjekat.brojZadataka
        for(let i=0; i<brojVjezbi; i++) {
            let vjezba = document.createElement("div")
            vjezba.setAttribute("id", "vjezba"+(i+1))
            vjezba.setAttribute("class", "vjezbe")
            let btn = document.createElement("button")
            btn.innerHTML = "<h1>VJEŽBA " + (i+1) + "</h1>"
            btn.setAttribute("id", "vjezba"+(i+1) + "btn")
            btn.addEventListener("click", function() {
                iscrtajZadatke(vjezba, brojZadataka[i])
                })
            vjezba.appendChild(btn)
            divDOMelement.appendChild(vjezba)
        }
    }


    var iscrtajZadatke = function(vjezbaDOMelement, brojZadataka) {
        if(zadnjaVjezba != null && vjezbaDOMelement != zadnjaVjezba) {
          let zadaciZaSakrit = zadnjaVjezba.getElementsByClassName("zadaci")
          for(let i=0; i<zadaciZaSakrit.length; i++) {
            zadaciZaSakrit[i].style.display = "none"
          }
        }
        let zadaci = vjezbaDOMelement.getElementsByClassName("zadaci")
        zadnjaVjezba = vjezbaDOMelement
        if(zadaci.length != 0) {
            for(let i=0; i<zadaci.length; i++) {
                zadaci[i].style.display = "inline"
            }
            return;
        }
        for(let i=0; i<brojZadataka; i++) {
            let zadatak = document.createElement("span")
            zadatak.setAttribute("id", "zadatak" + (i+1))
            zadatak.setAttribute("class", "zadaci")
            zadatak.innerHTML = "ZADATAK " + (i+1)
            vjezbaDOMelement.appendChild(zadatak)
        }
        
    }

    return {
        dodajInputPolja : dodajInputPolja,
        posaljiPodatke : posaljiPodatke,
        dohvatiPodatke : dohvatiPodatke,
        iscrtajVjezbe : iscrtajVjezbe,
        iscrtajZadatke : iscrtajZadatke
    }
}()

