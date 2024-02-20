import {
  fetchWithToken,
  displayMessage,
  deletePost,
  updatePost,
  API_BASE_URL,
} from './apiCalls.js'
import {
  displayPost,
  displayPosts,
  openPost,
  updateModal_Data,
  closeUpdatePost_Modal,
} from './ui.js'

// Limits on displayed posts
let currentOffset = 0
const limit = 10

// Make a post
const newPost_Title = document.getElementById('newPost_Title')
const newPost_MessageField = document.getElementById('newPost_Message')
const newPost_ImageField = document.getElementById('imageURL_Input')
const feedPosts_Container = document.getElementById('feedPosts_Container')

/**
 * Registers event listeners for various UI elements. This includes the 'Show More Posts' button,
 * the search bar, the filter selection dropdown, and the 'Post Message' button. Each listener
 * is associated with a specific function to handle the event.
 */

function eventHandlers() {
  document
    .getElementById('showMore_PostsButton')
    .addEventListener('click', showMorePosts)
  document.getElementById('searchBar').addEventListener('keyup', searchPosts)
  document
    .getElementById('select_Filter')
    .addEventListener('change', filterPosts)
  document
    .getElementById('postMessage_Button')
    .addEventListener('click', postMessage)
}

/**
 * Asynchronously fetches the next set of posts based on the current offset and limit. Each fetched
 * post is then displayed by calling `displayPost`. The offset is updated after fetching to prepare
 * for the next potential 'Show More Posts' action.
 *
 * @async
 * @function showMorePosts
 * @throws {Error} Logs an error to the console if the fetch operation fails.
 */

async function showMorePosts() {
  try {
    currentOffset += limit
    const posts = await fetchWithToken(
      API_BASE_URL + '/api/v1/social/posts',
      limit,
      currentOffset
    )
    posts.forEach((post) => {
      displayPost(post)
    })

    currentOffset += posts.length
  } catch (error) {
    console.error(error)
  }
}

/**
 * Asynchronously posts a new message to the server. The message data is collected from input fields
 * in the UI, and upon successful posting, these input fields are cleared. Uses * * `displayMessage`
 * function to handle the POST request.
 *
 * @async
 * @function postMessage
 * @throws {Error} Logs an error to the console if the posting operation fails.
 */

async function postMessage() {
  // Post message data
  const postData = {
    title: newPost_Title.value,
    body: newPost_MessageField.value,
    media: newPost_ImageField.value,
  }

  try {
    await displayMessage(`${API_BASE_URL}/api/v1/social/posts`, postData)

    // Clear input fields
    newPost_Title.value = ''
    newPost_MessageField.value = ''
    newPost_ImageField.value = ''
  } catch (error) {
    console.error('Failed to post message:', error)
  }
}

/**
 * Asynchronously searches for posts that match the text entered in the search bar. This function
 * fetches all 50 latest posts, filters them based on the search input, and then displays the matching posts
 * by calling `displayPosts`.
 *
 * @async
 * @function searchPosts
 * @param {Event} e - The event object from the 'keyup' event listener on the search bar.
 * @throws {Error} Logs an error to the console if the search operation fails.
 */

async function searchPosts(e) {
  const searchInput = e.target.value.toLowerCase()
  try {
    const allPosts = await fetchWithToken(
      API_BASE_URL + '/api/v1/social/posts',
      50
    )
    const filteredPosts = allPosts.filter((post) =>
      post.title.toLowerCase().includes(searchInput)
    )
    displayPosts(filteredPosts)
  } catch (error) {
    console.error('Error while searching for posts:', error)
  }
}

/**
 * Asynchronously filters posts based on the selected filter option. This function handles different
 * filter criteria like 'newest', 'oldest', and 'media' (post with pictures included) to fetch and display the relevant posts.
 * The function updates the global `currentOffset` after filtering.
 *
 * @async
 * @function filterPosts
 * @param {Event} e - The event object from the 'change' event listener on the filter dropdown.
 */

async function filterPosts(e) {
  const selectedOption = e.target.value
  switch (selectedOption) {
    case 'newest':
      const newestPosts = await fetchWithToken(
        API_BASE_URL + '/api/v1/social/posts',
        limit,
        0,
        'created',
        'desc'
      )
      displayPosts(newestPosts)
      break

    case 'oldest':
      const oldestPosts = await fetchWithToken(
        API_BASE_URL + '/api/v1/social/posts',
        limit,
        0,
        'created',
        'asc'
      )
      displayPosts(oldestPosts)
      break

    case 'media':
      const allPosts = await fetchWithToken(
        API_BASE_URL + '/api/v1/social/posts',
        100
      )
      const postsWithMedia = allPosts.filter((post) => post.media)
      displayPosts(postsWithMedia)
      break

    default:
      const defaultPosts = await fetchWithToken(
        API_BASE_URL + '/api/v1/social/posts',
        limit,
        0
      )
      displayPosts(defaultPosts)
  }

  currentOffset = limit
}

export { eventHandlers }
