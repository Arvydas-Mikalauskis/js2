// Fetch posts
const API_BASE_URL = 'https://api.noroff.dev'
async function fetchWithToken(url, limit = 15, offset = 0) {
  try {
    const token = localStorage.getItem('accessToken')
    const paginatedURL = `${url}?limit=${limit}&offset=${offset}`
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
// Single post that user posts
function displayPost(postData) {
  const postContainer = document.createElement('div')
  postContainer.classList.add('post-card')

  const newPostTitle = document.createElement('h5')
  newPostTitle.classList.add('card-title')
  newPostTitle.innerText = postData.title
  postContainer.appendChild(newPostTitle)

  const deletePost_Btn = document.createElement('button')
  deletePost_Btn.classList.add('deletePost_Btn')
  deletePost_Btn.innerHTML = `<i class="bi bi-x"></i>`
  postContainer.appendChild(deletePost_Btn)

  deletePost_Btn.addEventListener('click', () => {
    deletePost(postData.id)
    postContainer.remove()
  })

  const newPostElement = document.createElement('p')
  newPostElement.classList.add('card-text')
  newPostElement.innerText = postData.body
  postContainer.appendChild(newPostElement)

  const newPostPhoto = document.createElement('img')
  newPostPhoto.classList.add('card-img-bottom')
  newPostPhoto.src = postData.media
  if (postData.media) {
    postContainer.appendChild(newPostPhoto)
  }

  feedPosts_Container.appendChild(postContainer)
}

// Show more post on show more button click
document
  .getElementById('showMore_PostsButton')
  .addEventListener('click', async () => {
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
  })

// Limits on displayed posts
let currentOffset = 0
const limit = 10

// Probably will need to update more later
fetchWithToken(API_BASE_URL + '/api/v1/social/posts', limit, currentOffset)
  .then((posts) => {
    displayPosts(posts)
    currentOffset += limit
  })
  .catch((error) => console.error(error))

// Search between fetched posts (or should I better implement search between general API posts that are not fetched?)
document.getElementById('searchBar').addEventListener('keyup', (e) => {
  const searchInput = e.target.value.toLowerCase()
  searchPosts(searchInput)
})

// note to myself - dont mix with displayPost function // this one for multiple arr
function displayPosts(posts) {
  feedPosts_Container.innerHTML = ''

  posts.forEach((posts) => {
    displayPost(posts)
  })
}

// Search logic
async function searchPosts(searchTerm) {
  const allPosts = await fetchWithToken(
    API_BASE_URL + '/api/v1/social/posts',
    50
  )
  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm)
  )
  displayPosts(filteredPosts)

  feedPosts_Container.innerHTML = ''

  filteredPosts.forEach((posts) => {
    displayPost(posts)
  })
}

// Make a post
const newPost_Title = document.getElementById('newPost_Title')
const newPost_MessageField = document.getElementById('newPost_Message')
const newPost_ImageField = document.getElementById('imageURL_Input')
const feedPosts_Container = document.getElementById('feedPosts_Container')

const postMessageBtn = document.getElementById('postMessage_Button')

// Post message functions // single post
postMessageBtn.addEventListener('click', async () => {
  // Post message data
  const postData = {
    title: newPost_Title.value,
    body: newPost_MessageField.value,
    media: newPost_ImageField.value,
  }

  try {
    await postMessage(`${API_BASE_URL}/api/v1/social/posts`, postData)

    /* // Clear card after displaying values
    postCard_Container.innerHTML = ''

    const newPostTitle = document.createElement('h5')
    newPostTitle.classList.add('card-title')
    newPostTitle.innerText = postData.title

    const newPostElement = document.createElement('p')
    newPostElement.classList.add('card-text')
    newPostElement.innerText = postData.body

    const newPostPhoto = document.createElement('img')
    newPostPhoto.classList.add('card-img-bottom')
    newPostPhoto.src = postData.media

    postCard_Container.appendChild(newPostTitle)
    postCard_Container.appendChild(newPostElement)
    postCard_Container.appendChild(newPostPhoto) */

    // Clear input fields
    newPost_Title.value = ''
    newPost_MessageField.value = ''
    newPost_ImageField.value = ''
  } catch (error) {
    console.error('Failed to post message:', error)
  }
})

// Post message API call // Updated
async function postMessage(url, postData) {
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
