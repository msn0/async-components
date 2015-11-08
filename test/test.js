describe("Async Components", function () {

  var container, doc;

  beforeEach(function () {
    container = document.createElement('div');
    container.id = 'container';
    doc = document;
    doc.body.appendChild(container);
  });

  afterEach(function () {
    container.parentNode.removeChild(container);
  });

  describe("Non-nested case", function () {

    var component;

    beforeEach(function () {
      component = doc.createElement('div');
      component.setAttribute('data-component', '/base/test/fixtures/foo.html');
      component.setAttribute('data-event', 'component-loaded');
      component.setAttribute('data-detail', JSON.stringify({foo: "bar"}));
      container.appendChild(component);
    });

    it("should have proper innerHTML", function (done) {
      doc.addEventListener('component-loaded', function () {
        var expectedElement = doc.getElementById('foo');
        expect(expectedElement.innerHTML).toBe('foo');
        done();
      });
    });

    it("should pass data-detail as event.detail.data", function (done) {
      doc.addEventListener('component-loaded', function (event) {
        expect(event.detail.data).toEqual({foo: "bar"});
        done();
      });
    });

  });

  describe("Nested case", function () {

    var component;

    beforeEach(function () {
      component = doc.createElement('div');
      component.setAttribute('data-component', '/base/test/fixtures/parent.html');
      component.setAttribute('data-event', 'parent-loaded');
      component.setAttribute('data-detail', JSON.stringify({foo: "bar"}));
      container.appendChild(component);
    });

    it("should load nested component", function (done) {
      doc.addEventListener('nested-loaded', function (event) {
        var expectedElement = doc.getElementById('foo-nested');
        expect(expectedElement.innerHTML).toBe('nested html');
        expect(event.detail.data).toEqual({data: "data for nested"});
        done();
      });
    });

  });

});
