# TODO:

- finish logout and register functions in the backend and frontend;
- create corresponding pages for all those functions.
- use redirect or navigate, an example:

```js
if (!currentUser) {
  return <Navigate to='/login' />
}
```

- Return to Layout and create a separated navbar.
- render conditionally
- keep on keeping on.

- Create notes/[id] page.

- Add this blur effect to the navbar:

```css
.backdrop-blur-sm {
  --tw-backdrop-blur: blur(4px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
    var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(
      --tw-backdrop-hue-rotate
    ) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(
      --tw-backdrop-saturate
    )
    var(--tw-backdrop-sepia);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(
      --tw-backdrop-contrast
    ) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(
      --tw-backdrop-invert
    )
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
```
