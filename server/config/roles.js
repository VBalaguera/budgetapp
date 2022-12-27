const AccessControl = require('accesscontrol')

let grantsObject = {
  admin: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    articles: {
      'read:any': ['*'],
    },
    article: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    projects: {
      'read:any': ['*'],
    },
    project: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    proyectos: {
      'read:any': ['*'],
    },
    proyecto: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    posts: {
      'read:any': ['*'],
    },
    post: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    blackguard_posts: {
      'read:any': ['*'],
    },
    blackguard_post: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    days_posts: {
      'read:any': ['*'],
    },
    days_post: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    publicaciones: {
      'read:any': ['*'],
    },
    publicacion: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    tmiks: {
      'read:any': ['*'],
    },
    tmik: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  user: {
    profile: {
      'read:own': ['*', '!password', '!_id', '!date'],
      'update:own': ['*'],
    },
    days_posts: {
      'read:own': ['*'],
    },
    days_post: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  },
}

const roles = new AccessControl(grantsObject)

module.exports = { roles }
