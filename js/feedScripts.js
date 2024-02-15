import { fetchWithToken } from './apiCalls.js'
import { displayPost, displayPosts } from './ui.js'
import { eventHandlers } from './eventHandlers.js'
const API_BASE_URL = 'https://api.noroff.dev'

// Limits on displayed posts
let currentOffset = 0
const limit = 10

fetchWithToken(API_BASE_URL + '/api/v1/social/posts', limit, currentOffset)
  .then((posts) => {
    displayPosts(posts)
    currentOffset += limit
    eventHandlers()
  })
  .catch((error) => console.error(error))
