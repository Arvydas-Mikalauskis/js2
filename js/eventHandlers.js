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

async function showMorePosts() {
  try {
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
