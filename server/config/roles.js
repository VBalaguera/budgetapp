const AccessControl = require('accesscontrol')

let grantsObject = {
  admin: {
    profile: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
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
    tracker_habits: {
      'read:own': ['*'],
    },
    tracker_habit: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    tracker_hours: {
      'read:own': ['*'],
    },
    tracker_hour: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    lists: {
      'read:own': ['*'],
    },
    list: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
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
    tracker_habits: {
      'read:own': ['*'],
    },
    tracker_habit: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    tracker_hours: {
      'read:own': ['*'],
    },
    tracker_hour: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    lists: {
      'read:own': ['*'],
    },
    list: {
      'create:own': ['*'],
      'read:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
  },
}

const roles = new AccessControl(grantsObject)

module.exports = { roles }
