# TODO:

- use django docs to improve password auth: https://docs.djangoproject.com/en/4.1/topics/auth/passwords/
  - min length for passwords
  - passwords' formats
  - and so on
- reuse blackguard's AuthForm.js logic for combining both login and signup forms in a single page;

- Return to Layout and create a separated navbar.
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
