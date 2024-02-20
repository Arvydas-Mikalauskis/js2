/* const API_BASE_URL = 'https://api.noroff.dev'

// Register User

document.addEventListener('DOMContentLoaded', function () {
  const registerUserForm = document.getElementById('registrationForm')

  registerUserForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const registerEmail = document.getElementById('registerEmail').value
    const registerName = document.getElementById('registerName').value
    const registerPassword = document.getElementById('registerPassword').value

    const registerUserData = {
      email: registerEmail,
      name: registerName,
      password: registerPassword,
    }

    await registerUser(
      `${API_BASE_URL}/api/v1/social/auth/register`,
      registerUserData
    )
  })
})

async function registerUser(url, data) {
  const signUp_Success = document.getElementById('accountCreated_Message')
  const signUp_errorMessage = document.getElementById(
    'registerAcc_ErrorMessage'
  )
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const response = await fetch(url, postData)
    console.log(response)
    const json = await response.json()
    console.log(json)

    if (response.ok) {
      const json = await response.json()
      console.log(json)
      signUp_Success.removeAttribute('hidden')
    } else {
      signUp_errorMessage.removeAttribute('hidden')
      console.error('Registration failed', response.statusText)
    }
    return json
  } catch (error) {
    console.log(error)
  }
}

//Log in Account

document.addEventListener('DOMContentLoaded', function () {
  const logInForm = document.getElementById('logInForm')

  logInForm.addEventListener('submit', async function (e) {
    e.preventDefault()

    const email = document.getElementById('logIn_Email').value
    const password = document.getElementById('logIn_Password').value

    const userLogin = {
      email: email,
      password: password,
    }

    await loginUser(`${API_BASE_URL}/api/v1/social/auth/login`, userLogin)
  })
})

async function loginUser(url, data) {
  const loginErrror_Message = document.getElementById('logInErrorMessage')

  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const response = await fetch(url, postData)
    console.log(response)
    const json = await response.json()
    console.log(json)

    if (response.ok) {
      const accessToken = json.accessToken
      localStorage.setItem('accessToken', accessToken)
      window.location.href = 'feed.html'
    } else {
      loginErrror_Message.textContent =
        'Error: Wrong email or password. Please try again.'
    }

    return json
  } catch (error) {
    console.log(error)
  }
} */

// Fetch posts
/* 
async function fetchWithToken(url) {
  try {
    const token = localStorage.getItem('accessToken')
    const getData = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, getData)
    console.log(response)
    const json = await response.json()
    console.log(json)
  } catch (error) {
    console.log(error)
  }
} */
/* 
fetchWithToken(API_BASE_URL + '/api/v1/social/posts')
 */
