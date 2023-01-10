# Carrington React + Django update

## 2023/01/10

TODO:

- Start implementing toast + modals.
- overall styling for /transactions, /login, etc.
- If there's time, create a new model for notes.

FRONTEND SIDE:

- trying npm i react-datepicker for date picking
- transactions:
  - USERS CAN PICK CATEGORIES.
  - USERS CAN PICK DATES.
  - TRANSACTIONS/TOTALS are displayed by selecting categories.

## 2023/01/09

//// DONE

BACKEND SIDE

- I am testing two different models for keeping records of transactions and budgets: one is budget, the other is transaction.
- transactions recap:
  - getTransaction works
  - addTransaction works
  - deleteTransaction works
- day_posts recap:
  - addDayPost works
  - getDayPostById works
  - getDayPostsByUser works
  - updateDayPost works
  - deleteDayPost works
  - loadmoreDayPost (functional but incomplete)
  - paginateDayPost (functional but incomplete)

FRONTEND SIDE:

- TransactionsPage created.
  - WORKS WITH BACKEND NOW
  - WORKS WITH REDUX NOW
  - Uses user.id as filter.
  - USERS CAN CREATE TRANSACTIONS.
  - ProgressBar added. Max Budget amount added, hardcoded for now.
  - USERS CAN DELETE TRANSACTIONS.
- DayPostPage created.
  - WORKS WITH BACKEND NOW.
  - WORKS WITH REDUX NOW
  - Uses user.id as filter.
  - Stuck creating forms for dayPosts. Need to go deeper.

## 2022/12/29

- Temporary disabled checkLoggedIn and grantAccess in get api call for day_posts. jwt/token problems are still persisting.
- Models created and implemented in the backend:
  - Trackers (habits, and hours)
  - List.
  - Budget (used some project I found).

TODO:

- organize notes into separated files by themes.
- code cleaning.

## 2022/12/28

- users can register on the frontend side.
- There are problems with frontend:
  - I cannot generate or access x-access-token when users register/sign in. From the backend side, everything works. From the frontend side, nothing.
- testing Trackers' models.

## 2022/12/27

- I am going to switch to a MERN stack for testing purposes. I am using a new server in MongoDB. Also, using old instances of testing in Postman for the previous blackguard mern project. They all work.
- Users can log in on the backend/frontend side.
- Users can register on the backend side.
- Users can create day_posts on the backend side.

TODO:

- Need to define models for:
  - day_posts. DONE.
  - Monthly trackers.
  - monthly recaps.
  - Yearly recaps.

## 2022/12/22

- AuthForm.js created.
- installed formik and yup.
- recreate AuthForm using the blackguard model.
- implement it into SignUpPage.js
- set up form validation models in both AuthForm.js (login, used in LoginPage.js) and SignUpForm.js (used in SignUpPage.js)
- pull out all custom password validators from settings.py and delete validators.py

TODO:

- more to come, check out todo.md

## 2022/12/21

- finish logout and register functions in the backend and frontend;
- create corresponding pages for all those functions.
- logout function implemented
- navbar renders logout/signin functions conditionally
- users can enter their names now, changed user's views and signup form
- feedback when signing up/logging in

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
