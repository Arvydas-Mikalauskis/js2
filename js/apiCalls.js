import {
  displayPost,
  displayPosts,
  updateModal_Data,
  closeUpdatePost_Modal,
} from './ui.js'
import { eventHandlers } from './eventHandlers.js'
const API_BASE_URL = 'https://api.noroff.dev'

// Limits on displayed posts
let currentOffset = 0
let limit = 10

// Fetch posts
async function fetchWithToken(
  url,
  limit = 15,
  offset = 0,
  sort = null,
  sortOrder = null
) {
  try {
    const token = localStorage.getItem('accessToken')
    const sortParams = sort ? `&sort=${sort}&sortOrder=${sortOrder}` : ''
    const paginatedURL = `${url}?limit=${limit}&offset=${offset}${sortParams}`
    const getData = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(paginatedURL, getData)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    console.log(response)
    const posts = await response.json()
    console.log(posts)
    return posts
  } catch (error) {
    console.log(error)
  }
}

// Post message API call // Updated
async function displayMessage(url, postData) {
  try {
    const token = localStorage.getItem('accessToken')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Success', data)

    // refetching posts from updated UI after new post is made
    const refreshedPosts = await fetchWithToken(
      API_BASE_URL + '/api/v1/social/posts',
      limit,
      0
    )
    displayPosts(refreshedPosts)

    currentOffset = refreshedPosts.length
  } catch (error) {
    console.error('Error:', error)
  }
}

// Delete Post
async function deletePost(postId) {
  try {
    const token = localStorage.getItem('accessToken')
    const url = `${API_BASE_URL}/api/v1/social/posts/${postId}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    console.log('Post deleted successfully')
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

// Update Post
async function updatePost(postId, postData) {
  try {
    const token = localStorage.getItem('accessToken')
    const url = `${API_BASE_URL}/api/v1/social/posts/${postId}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    console.log('Post updated successfully')

    const refreshedPage = await fetchWithToken(
      API_BASE_URL + '/api/v1/social/posts',
      limit,
      0
    )
    displayPosts(refreshedPage)
    currentOffset += refreshedPage.length
    closeUpdatePost_Modal()
  } catch (error) {
    console.error('Error while updating post:', error)
  }
}

export { fetchWithToken, displayMessage, deletePost, updatePost, API_BASE_URL }
