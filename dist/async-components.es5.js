'use strict';

(function (document) {

  var COMPONENT_ATTR = 'data-component';
  var DETAIL_ATTR = 'data-detail';
  var EVENT_ATTR = 'data-event';

  var OBSERVER_CONFIG = {
    attributes: true,
    childList: true,
    characterData: false,
    subtree: true,
    attributeFilter: [COMPONENT_ATTR]
  };

  function getText(response) {
    return response.text();
  }

  function parse(params) {
    var detail = params.node.getAttribute(DETAIL_ATTR);
    params.eventName = params.node.getAttribute(EVENT_ATTR);
    try {
      params.detail = JSON.parse(detail);
    } catch (e) {
      params.detail = detail;
    }

    return Promise.resolve(params);
  }

  function getData(node) {
    return function (text) {
      return parse({ node: node, text: text });
    };
  }

  function placeElement(params) {

    var parser = new DOMParser();
    var a = parser.parseFromString(params.text, "text/html");

    [].slice.call(a.body.childNodes).forEach(function (e) {
      var el;
      if (e.nodeName === "SCRIPT") {
        el = document.createElement('script');
        el.appendChild(document.createTextNode(e.innerHTML));
        params.node.appendChild(el);
      } else {
        params.node.appendChild(e);
      }
    });

    return Promise.resolve(params);
  }

  function dispatchEvent(params) {
    var e = new CustomEvent(params.eventName, {
      detail: {
        node: params.node,
        data: params.detail
      }
    });
    document.dispatchEvent(e);
    return Promise.resolve(params.node);
  }

  function reportError() {
    console.error("Error occured");
  }

  function fetchNestedComponents(node) {
    var nestedNodes = node.querySelectorAll("[" + COMPONENT_ATTR + "]");
    nodesToArray(nestedNodes).forEach(deferredNodeFetch);
  }

  function fetchComponent(node) {
    var url = node.getAttribute(COMPONENT_ATTR);

    fetch(url).then(getText).then(getData(node)).then(placeElement).then(dispatchEvent).then(fetchNestedComponents)['catch'](reportError);
  }

  function filterComponents(node) {
    return node.nodeType === 1 && node.getAttribute(COMPONENT_ATTR);
  }

  function deferredNodeFetch(node) {
    return setTimeout(fetchComponent(node), 0);
  }

  function nodesToArray(nodes) {
    return [].slice.call(nodes);
  }

  function filterNodes(nodes) {
    nodesToArray(nodes).filter(filterComponents).forEach(deferredNodeFetch);
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      filterNodes(mutation.addedNodes);
    });
  });

  observer.observe(document.body, OBSERVER_CONFIG);
})(document);

//# sourceMappingURL=async-components.es5.js.map