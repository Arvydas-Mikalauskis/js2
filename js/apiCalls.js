import {
  displayPost,
  displayPosts,
  updateModal_Data,
  closeUpdatePost_Modal,
} from './ui.js'
import { eventHandlers } from './eventHandlers.js'
const API_BASE_URL = 'https://api.noroff.dev'

/**
 * Asynchronously fetches posts from a given URL, using an access token stored in local storage.
 * The function supports pagination and optional sorting parameters.
 *
 * @async
 * @function fetchWithToken
 * @param {string} url - The URL from which to fetch posts.
 * @param {number} [limit=15] - The maximum number of posts to fetch.
 * @param {number} [offset=0] - The offset from where to start fetching posts.
 * @param {string|null} [sort=null] - The parameter to sort by.
 * @param {string|null} [sortOrder=null] - The order of sorting, e.g., 'asc' or 'desc'.
 * @returns {Promise<Object[]>} A promise that resolves to an array of post objects if the request is successful.
 * @throws {Error} Throws an error if the fetch request fails or the server returns a non-OK HTTP status.
 */

let currentOffset = 0
let limit = 10

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

/**
 * Asynchronously displays posts from a specified URL and updates UI with new posts. The function handles fetched data using an access token and refreshes the displayed posts by fetching latest data.
 *
 * @async
 * @function displayMessage
 * @param {string} url - The URL from which post data will be sent.
 * @param {string|null} [sort=null] - The parameter to sort by.
 * @param {string|null} [sortOrder=null] - The order of sorting, e.g., 'asc' or 'desc'.
 * @param {Object} postData - The data to be posted in JSON format.
 * @throws {Error} Throws an error if the POST request fails or the server returns a non-OK HTTP status.
 */

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

/**
 * Asynchronously deletes a post by its ID using an API call. The function sends a DELETE
 * request to a constructed URL using an access token for authorization.
 *
 * @async
 * @function deletePost
 * @param {string} postId - The unique identifier of the post to be deleted.
 * @throws {Error} Throws an error if the DELETE request fails or the server returns a non-OK HTTP status.
 */

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

/**
 * Asynchronously updates a specific post by its ID with new data. The function sends a PUT
 * request to the server using an access token for authorization. After updating, it refreshes
 * the displayed posts to reflect the changes.
 *
 * @async
 * @function updatePost
 * @param {string} postId - The unique identifier of the post to be updated.
 * @param {Object} postData - The new data for the post in JSON format.
 * @throws {Error} Throws an error if the PUT request fails or the server returns a non-OK HTTP status.
 */

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

//
//
// Aditional features

/**
 * Asynchronously adds a comment on a specific post by its ID with commentData. The function sends a POST
 * request to the server using an access token for authorization.
 *
 * @async
 * @function updatePost
 * @param {string} postId - The unique identifier of the post that will have a comment added.
 * @throws {Error} Throws an error if the POST request fails or the server returns a non-OK HTTP status.
 */

async function commentOnPost(postId, body) {
  const token = localStorage.getItem('accessToken')
  const url = `${API_BASE_URL}/api/v1/social/posts/${postId}/comment`

  const commentData = {
    body: body,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Comment success', data)
    return data
  } catch (error) {
    console.error('Error commenting on post:', error)
  }
}

export {
  fetchWithToken,
  displayMessage,
  deletePost,
  updatePost,
  API_BASE_URL,
  commentOnPost,
}
