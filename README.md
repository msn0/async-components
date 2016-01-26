# async-components

> Async components allows splitting the web into independent components and easily integrate them, asynchronously.

## Demo

[http://msn0.github.io/async-components](http://msn0.github.io/async-components/)

## Installation

```bash
npm i async-components
# or
bower i async-components
```

## Usage 

Include async-components straight after the `<body>` tag:
```html
<script src="async-components.es5.min.js"></script>
```

Define components:
```html
<body>
  <div data-component="/header.html" data-event="header-loaded"></div>
  <div data-component="/listing.html" data-event="listing-loaded"></div>
  <div data-component="/footer.html" data-event="footer-loaded"></div>
</body>
```

Once component is loaded, the corresponding event is emmited. Let's say `listing` depends on `header`. Then `listing` should listen for `header-loaded` event, e.g.

```js
document.addEventListener('header-loaded', data => console.log(data));
```

## License

MIT
