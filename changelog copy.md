# CHANGELOG

## 2022/06/19

- vblackguard redirects to https://mern-blackguard.herokuapp.com/
- blog page grid restored.
- styles in tmik restored.

## 2022/06/17

vblackguard.com redirects to mern-blackguard.herokuapp.com for now;

- all tmiks included
- projects/proyectos updated.
- fixed contact modal
- commented contact on sideNavigation

TODO:

- mongo db question
- deep styling.
- final deployment

## 2022/06/16

- deleted section from posts model;
- corrected errors in dashboard
- tested everything, it works so far

## 2022/06/15

## BLACKGUARD PARTITION; NEW REPO @ git@github.com:VBalaguera/mern_blackguard.git

- clean up of store
- posts now use slugs
- overall styling
- header and sideNavigation
- clean up of models, routes, roles, etc.
- using a modal for contact instead of displaying a whole new page because why not.
- corrected font color issues on wysiwyg modals
- figure out why posts are not showing in order: 'desc'

TODO:

- write down all tmiks
- mongo db question
- deep styling.
- final deployment

## 2022/06/14

- projects/proyectos: pagination fixed;
- first deployment attempts. deployed.
- take components/articles/article/index.js as a model to create \_slugs for:
  - posts, publications

TODO:

- wait until today's call (15:15-15:45 pm) with Mongodb's custome services about upgrading current Cluster; will suffice a $9/month one for a project this big?
- take components/articles/article/index.js as a model to create \_slugs for:
  - blackguard_posts

## 2022/06/13

- installed react-i18next, i18next and i18next-browser-languagedetector. it all works.
- using i18n.language === 'es' and others work too.
- began localization, implanted on:

  - projects/proyectos
  - blog
  - all portfolio components
  - sideNavigation

- fixed getPosts/ getPublicaciones: problem was status!.

- Plus implementation of dashboard pagination, edition, updating, and deletion for:
  - posts and publicaciones
  - blackguard_posts
  - tmiks
  - projects/proyectos; EXCEPT pagination on dashboard/index, which is failing atm. Will check it out later

TODO:

- projects/proyectos: fix pagination

## 2022/06/09

- Finished videos 54 and 55.
- implementation of load more button for:
  - post, publicaciones, blackguard_posts, and tmiks; which is done but there's a problem to fix. TODO:
  - disable button when loaded all possible items.

TODO:

- Plus implementation of dashboard pagination, edition, updating, and deletion for:
  - posts and publicaciones
  - blackguard_posts
  - tmiks
- localization, start here:
  - https://phrase.com/blog/posts/roll-your-own-i18n-solution-react-redux/
  - https://react.i18next.com/latest/usetranslation-hook

## 2022/06/08

- Finished videos 51, 52, 53, .

TODO:

- Finish videos 54-55.

## 2022/06/07
STOPPED AT VIDEO 50.

- Dashboard and wysiwyg work for:
  - articles,
  - posts,
  - publicaciones
  - blackguard_posts
  - projects
  - proyectos
  - tmiks
- Corrected minor errors in postcard.js and added post.excerpt
- corrected minor errors in publicacion/post.js.
- Pagination created in dashboard for:
  - articles.

## 2022/06/06

- Stopped at video 44.
- Solved the problem in article/add. Watch out validationSchema and comment everything that is not in the form yet.

## 2022/06/05

- Created and tested 'slug' equivalents for articles, posts, publicacions, and blackguardposts.
- created their respective comps.
- Stopped at video 44: started dashboard section and added 'add' to articles.

## 2022/06/03

- Fixed db's problems: they were related to ip security. Fixed them in mongodb's config.
- updated sideNavigation's name.
- corrected blackguardindex's export.

## 2022/06/01:

- recreated these pages and their respective comps/styles:
  - blog
  - blackguard tmik
  - blackguard blog

## 2022/05/31:

- Added models/routes/roles for: projects/proyectos, posts/publicaciones, tmiks and posts_blackguard.
- Added slugify like tool: slug updated for mongoose.
- Added and adapted:
  - Logo,
  - Header,
  - postcard,
  - postcomponent,
  - projectcard.
  - projectsgrid,
  - intro
  - footer
  - cta
- Added and adapted sideNavigation.
- proyectos, projects and tmiks are not using redux atm. using api calls. created new /get_all for those three. everything works.
- articles, posts, and publicaciones are using redux atm. everything works so far.
- integrated Layout on routes.js
- installed the following packages:
  - react-fade-in
  - @material-ui/icons --force
