let odabirVjezbeDiv = document.getElementById("odabirVjezbe")
VjezbeAjax.dohvatiPodatke(function(err, data){
     if(data != null) {
          VjezbeAjax.iscrtajVjezbe(odabirVjezbeDiv, data)
     }
     
})
