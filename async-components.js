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
    params.eventDetail = JSON.parse(detail);
  } catch (e) {
    params.eventDetail = detail;
  }

  return Promise.resolve(params);
}

function getData(node) {
  return (text) => parse({
    node: node,
    text: text
  });
}

function placeElement(params) {
  params.node.outerHTML = params.text;
  return Promise.resolve(params);
}

function dispatchEvent(params) {
  var e = new CustomEvent(params.eventName, {
    detail: {
      node: params.node,
      detail: params.detail
    }
  });
  document.dispatchEvent(e);
}

function reportError() {
  console.error("Error occured");
}

function fetchComponent(node) {
  var url = node.getAttribute(COMPONENT_ATTR);
  var getNodeData = getData(node);

  fetch(url)
    .then(getText)
    .then(getNodeData)
    .then(placeElement)
    .then(dispatchEvent)
    .catch(reportError);
}

function filterComponents(node) {
  return node.nodeType === 1 && node.getAttribute(COMPONENT_ATTR);
}

var observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    [].slice.call(mutation.addedNodes)
      .filter(filterComponents)
      .forEach((node) => setTimeout(fetchComponent(node), 0));
  });
});

observer.observe(document.body, OBSERVER_CONFIG);
