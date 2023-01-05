let btnVjezbe = document.getElementById("dodajVjezbeBtn")
btnVjezbe.addEventListener("click", function() {
    let zadaci = document.getElementById("zadaci")
    let val = parseInt(document.getElementById("brojVjezbi").value, 10)
    if(val<1 || val>15) {
        alert("Broj vjezbi mora biti izmedju 1 i 15 !")
        return;
    }
    VjezbeAjax.dodajInputPolja(zadaci, val)
})

let btnPosalji = document.getElementById("posaljiZadatkeBtn")
btnPosalji.addEventListener("click", function(){
    let brojVjezbi = parseInt(document.getElementById("brojVjezbi").value)
    let brojZadataka = []
    for(let i=0; i<brojVjezbi; i++) {
        brojZadataka.push(parseInt(document.getElementById("z"+i).value))
    }
    VjezbeAjax.posaljiPodatke({brojVjezbi: brojVjezbi, brojZadataka: brojZadataka}, function(error, data) {
       if(error == null) alert("Vježbe i zadaci su uspješno dodani!")
       else {
           alert("Greska! Vjezbe i zadaci nisu dodani!")
       }
    })
})

// probaj nekako ovdje importat modul, a ne onako u script tagu
// kako da ostavim u head scriptu