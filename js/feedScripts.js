// Fetch posts
const API_BASE_URL = 'https://api.noroff.dev'
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

// Single post that user posts
function displayPost(postData) {
  const postContainer = document.createElement('div')
  postContainer.classList.add('post-card')

  const postCard_Top = document.createElement('div')
  postCard_Top.classList.add('postCard_Top')
  postContainer.appendChild(postCard_Top)

  const newPostTitle = document.createElement('h5')
  newPostTitle.classList.add('card-title')
  newPostTitle.innerText = postData.title
  postCard_Top.appendChild(newPostTitle)

  const topButtons_Container = document.createElement('div')
  topButtons_Container.classList.add('topButtons')
  postCard_Top.appendChild(topButtons_Container)

  const updatePost_Btn = document.createElement('button')
  updatePost_Btn.classList.add('updatePost_Btn')
  updatePost_Btn.innerHTML = `<i class="bi bi-pencil"></i>`
  updatePost_Btn.setAttribute('data-bs-toggle', 'modal')
  updatePost_Btn.setAttribute('data-bs-target', '#editPostModal')
  topButtons_Container.appendChild(updatePost_Btn)

  updatePost_Btn.addEventListener('click', () => {
    updateModal_Data(postData)
  })

  const deletePost_Btn = document.createElement('button')
  deletePost_Btn.classList.add('deletePost_Btn')
  deletePost_Btn.innerHTML = `<i class="bi bi-x-circle"></i>`
  topButtons_Container.appendChild(deletePost_Btn)

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

  postContainer.addEventListener('click', (e) => {
    if (!e.target.closest('.deletePost_Btn, .updatePost_Btn')) {
      openPost(postData)
    }
  })

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

// update post function
function updateModal_Data(postData) {
  document.getElementById('updatedPost_Title').value = postData.title
  document.getElementById('updatedPost_Message').value = postData.body
  document.getElementById('updatePost_Media').value = postData.media

  const saveChangesBtn = document.getElementById('savePost_Changes')
  saveChangesBtn.removeEventListener('click', handleSaveChanges)

  function handleSaveChanges() {
    const updatedPostData = {
      title: document.getElementById('updatedPost_Title').value,
      body: document.getElementById('updatedPost_Message').value,
      media: document.getElementById('updatePost_Media').value,
    }

    updatePost(postData.id, updatedPostData)
  }
  saveChangesBtn.addEventListener('click', handleSaveChanges)
}

// Close modal for edit post
function closeUpdatePost_Modal() {
  const modalContainer = document.getElementById('editPostModal')

  const modalInstance = bootstrap.Modal.getInstance(modalContainer)
  modalInstance.hide()
}

// Open post by id in modal
function openPost(postData) {
  document.getElementById('openPost_title').innerText = postData.title
  document.getElementById('openModal_body').innerText = postData.body
  document.getElementById('openPost_Image').src = postData.media

  const openPost = new bootstrap.Modal(
    document.getElementById('showSinglePost_Modal')
  )
  openPost.show()
}

// Filter posts
document
  .getElementById('select_Filter')
  .addEventListener('change', async (e) => {
    const selectedOption = e.target.value

    switch (selectedOption) {
      case 'newest':
        // Fetch and display posts sorted by date in descending order (newest first)
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
        // Fetch and display posts sorted by date in ascending order (oldest first)
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
        // Fetch all posts and filter client-side for those with media
        const allPosts = await fetchWithToken(
          API_BASE_URL + '/api/v1/social/posts',
          100
        ) // Adjust limit as needed
        const postsWithMedia = allPosts.filter((post) => post.media)
        displayPosts(postsWithMedia)
        break

      default:
        // No filter or sort selected, or handle the 'none' option
        const defaultPosts = await fetchWithToken(
          API_BASE_URL + '/api/v1/social/posts',
          limit,
          0
        )
        displayPosts(defaultPosts)
    }

    currentOffset = limit
  })
