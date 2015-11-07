((document) => {

  const COMPONENT_ATTR = 'data-component';
  const DETAIL_ATTR = 'data-detail';
  const EVENT_ATTR = 'data-event';

  const OBSERVER_CONFIG = {
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
    return (text) => parse({
      node, text
    });
  }

  function placeElement(params) {
    params.node.innerHTML = params.text;
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
    var getNodeData = getData(node);

    fetch(url)
      .then(getText)
      .then(getNodeData)
      .then(placeElement)
      .then(dispatchEvent)
      .then(fetchNestedComponents)
      .catch(reportError);
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
    nodesToArray(nodes)
      .filter(filterComponents)
      .forEach(deferredNodeFetch);
  }

  var observer = new MutationObserver((mutations) => {
    mutations.forEach(function (mutation) {
      filterNodes(mutation.addedNodes);
    });
  });

  observer.observe(document.body, OBSERVER_CONFIG);

})(document);
