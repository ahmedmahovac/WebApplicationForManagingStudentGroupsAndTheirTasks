var TestoviParser = (function(){
    let numOfTests
    let numOfFails
    function dajTacnost(jsonString){
        let fails = []
        let data = ""
        try{
            data = JSON.parse(jsonString)
        }
        catch(error){
            return {
                "tacnost": "0%",
                "greske": ["Testovi se ne mogu izvršiti"]
            }
        }
        const failedTestsArray = data.failures
        numOfFails = failedTestsArray.length
        numOfTests = data.stats.tests
        for(let i=0; i<failedTestsArray.length; i++){
            fails.push(failedTestsArray[i].fullTitle)
        }
        return {
            "tacnost": (Math.round((numOfTests-numOfFails)*100/numOfTests * 10) / 10) + "%",
            "greske": fails
        }
    }

    function porediRezultate(rezultat1, rezultat2) {
        let greske = []
        let promjena = 0
        const data1 = JSON.parse(rezultat1)
        const data2 = JSON.parse(rezultat2)
        const tests1failed = data1.failures
        const tests2 = data2.tests
        const tests1 = data1.tests
        let failedInFirst = 0
        for(let i=0; i<tests1failed.length; i++) {
            let found = false
            for(let j=0; j<tests2.length; j++) {
                if(tests1failed[i].fullTitle==tests2[j].fullTitle) {
                    found = true
                    break
                }
            }
            if(!found) {
                failedInFirst++
            }
            if(found==false) {
                greske.push(tests1failed[i].fullTitle)
            }
        }
        greske.sort(function(a,b){
            if(a>b) return 1
            else if(a<b) return -1
            return 0
        })
        const tests2failed = data2.failures.map(t => t.fullTitle)
        tests2failed.sort(function(a,b){
            if(a>b) return 1
            else if(a<b) return -1
            return 0
        })
       if(tests2failed.length!=0) {
            greske.push(...tests2failed)
       }
           // pretpostavljamo da nema u istoj skupini vise testova sa istim nazivom 
            let i=0
            for(i; i<tests1.length && tests2.length==tests1.length;i++) { // promijeni ovaj uslov, ne valja ovako
                let found = false
                for(let j=0; j<tests2.length;j++){
                    if(tests1[i].fullTitle==tests2[j].fullTitle) {
                        found = true
                        break
                    }   
                }
                if(found==false) {
                    break
                } 
            } 
        if(i==tests1.length) {
            promjena = dajTacnost(rezultat2).tacnost // mozda se jos moze negdje iskoristit ova funkcija
        }  
        else {
            promjena = Math.round((failedInFirst+tests2failed.length)/(failedInFirst+tests2.length)*100 * 10)/10 + "%";
        }
        
        return {
            "promjena" : promjena,
            "greske" : greske
        }
    }


    return {
        dajTacnost: dajTacnost,
        porediRezultate: porediRezultate
    }
}());

