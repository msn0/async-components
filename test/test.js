describe("Async Components", function () {

  var component, container, doc;

  beforeEach(function () {
    container = document.createElement('div');
    container.id = 'container';
    doc = document;
    doc.body.appendChild(container);

    component = doc.createElement('div');
    component.setAttribute('data-component', '/base/test/fixtures/foo.html');
    component.setAttribute('data-event', 'component-loaded');
    component.setAttribute('data-detail', JSON.stringify({foo: "bar"}));
    container.appendChild(component);
  });

  afterEach(function () {
    container.parentNode.removeChild(container);
    jasmine.clock().uninstall();
  });

  it("should have proper innerHTML", function (done) {
    doc.addEventListener('component-loaded', function (event) {
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
