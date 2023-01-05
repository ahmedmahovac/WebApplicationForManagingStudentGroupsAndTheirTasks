const { assert } = require("chai")
let chai = require("chai")
let chaiHttp = require("chai-http")
const { set } = require("express/lib/application")
chai.use(chaiHttp)
chai.should()
let podaci = require("./index.js")
app = podaci.app

describe("testiranje dodajStudenta", function(){
    it("test 1 dodajStudenta", function(done){
        this.timeout(10000)
        let ch = chai.request(app)
        setTimeout(function(){

        }, 2000)
        ch.post("/student")
        .set("Content-Type", "application/json")
        .send({ime: "Ahmed", prezime: "Mahovac", index: "18735", grupa: "grupa1"})
        .end(function(err, res){
            podaci.grupa.findOne({where: {index: "18735"}}).then(function(student){
                assert.isNotNull(student)
            })
            podaci.grupa.findOne({where: {naziv: "grupa1"}}).then(function(grupa){
                assert.isNotNull(grupa)
                assert.equal(s.grupaId,grupa.id)
            }).then(function(){
                done()
            }).catch(done)
        })
    })
})