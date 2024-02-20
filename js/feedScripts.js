import { fetchWithToken } from './apiCalls.js'
import { displayPost, displayPosts } from './ui.js'
import { eventHandlers } from './eventHandlers.js'
const API_BASE_URL = 'https://api.noroff.dev'

// Limits on displayed posts
let currentOffset = 0
const limit = 10

/**
 * Initializes the user interface by fetching the initial set of posts and setting up event handlers.
 * It fetches posts based on the current offset and limit, displays the fetched posts, updates the offset,
 * and then initializes event handlers for UI elements. Errors during the fetch process are logged to the console.
 */

function initUI() {
  fetchWithToken(API_BASE_URL + '/api/v1/social/posts', limit, currentOffset)
    .then((posts) => {
      displayPosts(posts)
      currentOffset += limit
      eventHandlers()
    })
    .catch((error) => console.error(error))
}

initUI()

// There is one error GET http://127.0.0.1:5500/null 404 (Not Found) that comes from the posts that dont have an image attatched to them.
