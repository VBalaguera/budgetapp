# Carrington React + Django update

## 2022/12/17

- Users can log in.
- Navbar renders content conditionally if user is logged in or not.

## 2022/11/29

- Created cart reducer.
- Cart items are saved in state and localstorage.
- using Layout for all page comps
- created /cart with CardPage
- created CardProduct.js
- made theme config are stored between pages
- created a banner to inform about cookies
- user registration is a go

## 2022/11/18

- Redux initial setup.
- Products and Note using Redux.

Coming up:

- Using Redux for User. (Module 7)

## 2022/11/17

- Fixed Carrington-C.
- Fixed navbar buttons on responsive.
- protected routes
- user registration + fixes for registration issues

TODO:

## 2022/11/16

- Defined these models: Product, Note, Income, Budget, Expense, Order, OrderItem, Review, ShippingAddress.
- file uploads are live (Set the static folder and registered media root and media url).
- Started implementing AUTH.
- data serialization for Users, Products and Notes
- token refreshes when user logs in again

Coming up:

- protected routes;

Stopped at Module 6, video 6.

## 2022/11/15

BACKEND:

- Created api.
- Created basic routes for notes, budgets, and expenses.

FRONTEND:

- Set react-router-dom.
- Created and tested backend integration. It works.
- Created pages/notes/[id].js which takes individual notes from the backend through an axios req. It works.

Generated new SSH in MB.