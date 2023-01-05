const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(express.static("public/html"))
app.use(express.static("public/css"))
app.use(express.static("public/js"))
app.use(express.static("public/images"))


const Sequelize = require('sequelize')
const sequelize = new Sequelize('wt2118735','root','password', {
    host: 'localhost',
    dialect: 'mysql'
})

const zadatak = require('./Zadatak.js')(sequelize)
const vjezba = require('./Vjezba.js')(sequelize) // ovaj redoslijed je bolji zbog fk ?
const grupa = require('./Grupa.js')(sequelize)
const student = require('./Student.js')(sequelize)

vjezba.hasMany(zadatak, {as: 'zadaci', foreignKey: 'zadatakId'})
grupa.hasMany(student, {as: 'studenti', foreignKey:'grupaId'})

sequelize.sync()   
app.get('/vjezbe', function(req, res){
        let brojVjezbi = 0
        let brojZadatakaArray = []
        vjezba.findAll().then(function(vjezbe) {
            brojVjezbi = vjezbe.length
            for(let i=0; i<brojVjezbi; i++) {
                vjezbe[i].getZadaci().then(function(zadaci){
                    brojZadatakaArray.push(zadaci.length)
                    if(i==brojVjezbi-1) {
                        let result = {brojVjezbi: brojVjezbi, brojZadataka: brojZadatakaArray}
                        res.json(result)  
                    }
                })
            }
        })
})


app.post('/vjezbe', function(req, res){
    let tijelo = req.body
    let brojVjezbi = parseInt(tijelo["brojVjezbi"],10)
    let brojZadataka = tijelo["brojZadataka"]
    let data = ""
    if(brojVjezbi<1 || brojVjezbi>15) {
        data = "Pogrešan parametar brojVjezbi"
    }
    
    for(let i=0; i<brojZadataka.length; i++) {
        if(brojZadataka[i]<0 || brojZadataka[i]>10) {
            if(data=="") data = "Pogrešan parametar z" + i
            else data+= ",z" + i
        }
    }

    if(brojZadataka.length != brojVjezbi) {
        if(data=="") data = "Pogrešan parametar brojZadataka"
        else data += ",brojZadataka"
    }

    
    if(data != "") {
            res.end(JSON.stringify({status: "error", data: data}))
    }
        
        vjezba.destroy({cascade:true, where: {}}).then(function(){
            zadatak.destroy({cascade:true, where: {}})
        }).then(async function(){
            for(let i=0; i<brojVjezbi; i++) {
                await vjezba.create().then(async function(kreiranaVjezba){ // bulkcreate ?
                    for(let j=0; j<brojZadataka[i]; j++) {  // mozes imat pogresnu vrijednost varijabli jer se ne izvrsava u uredjenom redoslijedu!
                        console.log(i)
                        await zadatak.create({zadatakId: kreiranaVjezba.id}) // ovdje sigurno mozes dodat bulkCreate
                    }
                })
            }
        }).then(function(){
            res.json({brojVjezbi: brojVjezbi, brojZadataka: brojZadataka})
        })
})

// prvi dio
app.post('/student', function(req, res){
        
   console.log("uso jebote")
    let objStudent = req.body
    let indexStudenta = objStudent["index"]
    student.findOne({where : {index : indexStudenta}}).then(function(nadjeniStudent){
        console.log("USO JEBOTE")
        if(nadjeniStudent != null) {
            res.json({status:`Student sa indexom ${indexStudenta} već postoji!`})
        }
        else { // provjeri jel nadjeniStudent fakat null
            grupa.findOne({where:{naziv: objStudent["grupa"]}}).then(function(nadjenaGrupa){
                if(nadjenaGrupa == null) {
                    grupa.create({naziv:objStudent["grupa"]}).then(function(kreiranaGrupa){
                        student.create({ime: objStudent["ime"], prezime: objStudent["prezime"], index: objStudent["index"], grupaId: kreiranaGrupa.id}).then(function(student){
                            res.json({status:"Kreiran student!"})
                        })
                    })
                }
                else {
                student.create({ime: objStudent["ime"], prezime: objStudent["prezime"], index: objStudent["index"], grupaId: nadjenaGrupa.id}).then(function(student){
                    res.json({status:"Kreiran student!"})
                })
                }
            })
        }
    })
})


// drugi dio
app.put('/student/:index', function(req,res){
    let index = req.params.index
    let grupaNaziv = (req.body)["grupa"]
    student.findOne({where : {index : index}}).then(function(nadjeniStudent){
        if(nadjeniStudent == null) {
            res.json({status:`Student sa indexom ${index} ne postoji`}) // ovako kad je razdvojeno uslovima, nece se svakako dalje izvrsavat promise nijedan
        }
        else {
            grupa.findOrCreate({where:{naziv: grupaNaziv}}).then(function([nadjenaGrupa, kreirana]){
                        nadjeniStudent.grupaId = nadjenaGrupa.id
                        console.log(nadjeniStudent.grupaId)
                        nadjeniStudent.save().then(function(){
                            res.json({status:`Promjenjena grupa studentu ${index}`})
                        })
                })
             }
    })
})

// treci dio
 app.post('/batch/student', function(req,res){
    let csv = req.body
    let studenti = csv.replace('\r',"").split('\n')
    
    let studentiZaDodat = []
    for(let i=0; i<studenti.length; i++){
        let infoArray = studenti[i].split(",")
        studentiZaDodat.push({ime: infoArray[0], prezime: infoArray[1], index: infoArray[2], grupaId: infoArray[3].trim()})
       // console.log(infoArray[3]) 
       // if(i==studenti.length-1) {
        //    studentiZaDodat[i].grupaId += '\r'
        //}
    }
    
    // provjera dal postoje studenti koje ne treba dodat
    student.findAll().then(async function(studenti){
        let studentiZaDodatFinal = []
        let data = "{"
        for(let i=0; i<studentiZaDodat.length; i++){
            if(!studenti.map(t => t.index).includes(studentiZaDodat.map(t => t.index)[i])){
                studentiZaDodatFinal.push(studentiZaDodat[i])
            }
            else {
                data+=(studentiZaDodat[i].index +",")
            }
        }
        let status = `Dodano ${studentiZaDodat.length} studenata!`
        if(data != "{") {
            data = data.slice(0,data.length-1) + "}"
            status = `Dodano ${studentiZaDodatFinal.length} studenata, a studenti ` + data + ` već postoje!`
        }

        for(let i=0; i<studentiZaDodatFinal.length; i++) {
            console.log(studentiZaDodatFinal[i].grupaId)
           await grupa.findOrCreate({where:{naziv: studentiZaDodatFinal[i].grupaId}}).then(function([nadjenaGrupa, kreirana]){
                studentiZaDodatFinal[i].grupaId = nadjenaGrupa.id
                console.log("zavrsio dodavanje")
             })
        }

        student.bulkCreate(studentiZaDodatFinal).then(function(){      // treba eliminisat duple studente u ulaznom nizu studenata
            res.json({status: status})
        })
    })
})


app.listen(3000) // probaj ovo dodat prije ostalih linija koda da vidis hocel radit


module.exports = {app,sequelize,zadatak,vjezba,grupa,student}