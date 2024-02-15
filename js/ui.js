import {
  fetchWithToken,
  displayMessage,
  deletePost,
  updatePost,
  API_BASE_URL,
} from './apiCalls.js'
import { eventHandlers } from './eventHandlers.js'
//

// Limits on displayed posts
let currentOffset = 0
const limit = 10

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

// note to myself - dont mix with displayPost function // this one for multiple arr
function displayPosts(posts) {
  feedPosts_Container.innerHTML = ''

  posts.forEach((posts) => {
    displayPost(posts)
  })
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

/* // Make a post
const newPost_Title = document.getElementById('newPost_Title')
const newPost_MessageField = document.getElementById('newPost_Message')
const newPost_ImageField = document.getElementById('imageURL_Input')
const feedPosts_Container = document.getElementById('feedPosts_Container') */
/* 
// Post message functions // single post
document
  .getElementById('postMessage_Button')
  .addEventListener('click', async () => {
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
  }) */

export {
  displayPost,
  displayPosts,
  openPost,
  updateModal_Data,
  closeUpdatePost_Modal,
}
