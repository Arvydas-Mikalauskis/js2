import {
  fetchWithToken,
  displayMessage,
  deletePost,
  updatePost,
  API_BASE_URL,
  commentOnPost,
} from './apiCalls.js'
import { eventHandlers } from './eventHandlers.js'
//

// Limits on displayed posts
let currentOffset = 0
const limit = 10

/**
 * Dynamically creates and displays a single post in the UI. The function constructs the post's
 * HTML structure, fills it with data from `postData`, and appends it to the 'feedPosts_Container'.
 * It also sets up event listeners for post interaction buttons such as update, delete, upvote,
 * downvote, and commenting.
 *
 * @param {Object} postData - An object containing the data for a single post, including title, body, and media URL.
 */

function displayPost(postData) {
  const feedPosts_Container = document.getElementById('feedPosts_Container')

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

  const bottomButtons_Container = document.createElement('div')
  bottomButtons_Container.classList.add('reactionButtons')
  postContainer.appendChild(bottomButtons_Container)

  const upvoteBtn = document.createElement('button')
  upvoteBtn.classList.add('upVote_Btn')
  upvoteBtn.innerHTML = `<i class="bi bi-arrow-up-square fa-xl"></i>`
  bottomButtons_Container.appendChild(upvoteBtn)

  const voteText = document.createElement('p')
  voteText.classList.add('vote_text')
  voteText.innerText = 'Vote'
  bottomButtons_Container.appendChild(voteText)

  const downvoteBtn = document.createElement('button')
  downvoteBtn.innerHTML = `<i class="bi bi-arrow-down-square fa-xl"></i>`
  downvoteBtn.classList.add('downVote_Btn')
  bottomButtons_Container.appendChild(downvoteBtn)

  const comment_Container = document.createElement('div')
  comment_Container.innerHTML = `
  <hr />
  <form id='commentForm'>
    <div class="input-group mb-3">
      <input type="text" class="form-control" id='commentInput' placeholder="Comment" aria-label="Comment">
      <div class="input-group-append">
        <button class="btn" id='commentBtn' type="submit"><i class="bi bi-send-check fa-lg"></i></button>
      </div>
    </div>
  </form>`
  comment_Container.classList.add('commentForm')
  postContainer.appendChild(comment_Container)

  postContainer.addEventListener('click', (e) => {
    if (
      !e.target.closest(
        '.deletePost_Btn, .updatePost_Btn, .reactionButtons, .commentForm'
      )
    ) {
      openPost(postData)
    }
  })

  // Comment on post // Dont know how to show on comments on feed
  const commentForm = postContainer.querySelector('#commentForm')
  const commentInput = postContainer.querySelector('#commentInput')

  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const commentBody = commentInput.value.trim()

    if (commentBody) {
      await commentOnPost(postData.id, commentBody)
      commentInput.value = ''
    }
  })

  feedPosts_Container.appendChild(postContainer)
}

/**
 * Iterates over an array of post data objects and displays each post by calling `displayPost`.
 * Before displaying new posts, it clears any existing posts from the 'feedPosts_Container'.
 *
 * @param {Object[]} posts - An array of post data objects to be displayed.
 */

function displayPosts(posts) {
  feedPosts_Container.innerHTML = ''

  posts.forEach((posts) => {
    displayPost(posts)
  })
}

/**
 * Displays the details of a single post in a modal. The function updates the modal's content
 * with the provided post data and then shows the modal.
 *
 * @param {Object} postData - An object containing the details of the post to be displayed in the modal.
 */

function openPost(postData) {
  document.getElementById('openPost_title').innerText = postData.title
  document.getElementById('openModal_body').innerText = postData.body
  document.getElementById('openPost_Image').src = postData.media

  const openPost = new bootstrap.Modal(
    document.getElementById('showSinglePost_Modal')
  )
  openPost.show()
}

/**
 * Populates the 'Edit Post' modal with the data of the post to be updated. It sets up the input fields
 * with the current post data and prepares the 'Save Changes' button with an event listener to update
 * the post upon clicking.
 *
 * @param {Object} postData - An object containing the current data of the post to be updated.
 */

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

/**
 * Closes the 'Edit Post' modal. This function is called after a post has been successfully
 * updated or when the user decides to cancel the edit operation.
 */

function closeUpdatePost_Modal() {
  const modalContainer = document.getElementById('editPostModal')

  const modalInstance = bootstrap.Modal.getInstance(modalContainer)
  modalInstance.hide()
}

export {
  displayPost,
  displayPosts,
  openPost,
  updateModal_Data,
  closeUpdatePost_Modal,
}
