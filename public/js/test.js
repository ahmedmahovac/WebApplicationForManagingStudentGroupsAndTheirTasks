chai.should();
let assert = chai.assert;
describe('VjezbeAjax', function() {
  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();
 
    this.requests = [];
    this.xhr.onCreate = function(xhr) {
      this.requests.push(xhr);
    }.bind(this);
  });
 
  afterEach(function() {
    this.xhr.restore();
  });
 

  it('ispravno parsira JSON u odgovarajuci objekat', function(done) {
    var data = { brojZadataka: 3, brojVjezbi: [1,2,3] };
    var dataJson = JSON.stringify(data);
   
    VjezbeAjax.dohvatiPodatke(function(err, result) {
      assert.equal(JSON.stringify(data), JSON.stringify(result));
      done();
    });
   
    this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
  });



  it('greska u dobavljanju podataka', function(done) {
    var data = { brojZadataka: 3, brojVjezbi: [1,2,3] };
    var dataJson = JSON.stringify(data);
   
    VjezbeAjax.dohvatiPodatke(function(err, result) {
      assert.equal(result, null);
      assert.equal(err, "greska: nemoguce dobaviti podatke")
      done();
    });
   
    this.requests[0].respond(404, { 'Content-Type': 'text/json' }, dataJson);
  });
 

  it('Test posaljiPodatke - podaci ispravni', function() {
    var vjezbeObjekat = { brojVjezbi : 2, brojZadataka: [1,1]};
    var dataJson = JSON.stringify(vjezbeObjekat);

    VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(err, result) {
        assert.equal(JSON.stringify(result), dataJson)
        assert.equal(err, null)
     });
   
    this.requests[0].requestBody.should.equal(dataJson);
    this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
  });
  


  it('Test posaljiPodatke - podaci neispravni drugi parametar', function() {
    var vjezbeObjekat = { brojVjezbi : 2, brojZadataka: [1,1,3]};
    var dataJson = JSON.stringify(vjezbeObjekat);

    VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(err, result) {
        assert.equal(null, result)
        assert.equal(err, "Pogrešan parametar brojZadataka")
     });
   
    this.requests[0].requestBody.should.equal(dataJson);
    this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify({status: "error", data: "Pogrešan parametar brojZadataka"}));
  });


  it('Test posaljiPodatke - podaci neispravni prvi i drugi parametar', function() {
    var vjezbeObjekat = { brojVjezbi : 16, brojZadataka: [1,1,3]};
    var dataJson = JSON.stringify(vjezbeObjekat);

    VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(err, result) {
        assert.equal(null, result)
        assert.equal(err, "Pogrešan parametar brojVjezbi,brojZadataka")
     });
   
    this.requests[0].requestBody.should.equal(dataJson);
    this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify({status: "error", data: "Pogrešan parametar brojVjezbi,brojZadataka"}));
  });


  
  it('Test posaljiPodatke - podaci neispravni prvi, drugi parametar i broj zadataka', function() {
    var vjezbeObjekat = { brojVjezbi : 16, brojZadataka: [1,1,3,1,3,4,3,2,2,3,4,5,11,12,1,2]};
    var dataJson = JSON.stringify(vjezbeObjekat);

    VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(err, result) {
        assert.equal(null, result)
        assert.equal(err, "Pogrešan parametar brojVjezbi,z12,z13,brojZadataka")
     });
   
    this.requests[0].requestBody.should.equal(dataJson);
    this.requests[0].respond(200, { 'Content-Type': 'text/json' }, JSON.stringify({status: "error", data: "Pogrešan parametar brojVjezbi,z12,z13,brojZadataka"}));
  });

  it('Test posaljiPodatke - server greska', function() {
    var vjezbeObjekat = { brojVjezbi : 3, brojZadataka: [1,1,3]};
    var dataJson = JSON.stringify(vjezbeObjekat);

    VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(err, result) {
        assert.equal(null, result)
        assert.equal(err, "greska")
     });
   
    this.requests[0].requestBody.should.equal(dataJson);
    this.requests[0].respond(404, { 'Content-Type': 'text/json' }, JSON.stringify(vjezbeObjekat));
  });


  it('Test dodajInputPolja', function() {
      let div = document.createElement("div")
      VjezbeAjax.dodajInputPolja(div, 5)
      let inputs = div.childNodes
      for(let i=0; i<10; i++) {
          if(i%2 == 0) {
              assert.equal(inputs[i].getAttribute("for"), "z"+  ((i/2) | 0))
          }
          else {
              assert.equal(inputs[i].getAttribute("id"), "z"+((i/2) | 0))
          }
      }
  });


  it('Test iscrtajVjezbe i zadatke', function() {
    let div = document.createElement("div")
    VjezbeAjax.iscrtajVjezbe(div, {brojVjezbi: 2, brojZadataka: [1,1]})
    let vjezbe = div.childNodes
    for(let i=0; i<2; i++) {
        let item = vjezbe[i]
        let btn = item.childNodes[0]
        btn.click()
        assert.equal(item.getAttribute("id"), "vjezba"+(i + 1))
        let zadatak1 = item.childNodes[1]
        assert.equal(zadatak1.getAttribute("id"), "zadatak" + 1)
    }

});


});