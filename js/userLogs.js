const API_BASE_URL = 'https://api.noroff.dev'

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

/**
 * Asynchronously registers a new user with the provided user data. On successful registration,
 * displays a success message; otherwise, shows an error message.
 *
 * @async
 * @function registerUser
 * @param {string} url - The endpoint URL for user registration.
 * @param {Object} data - An object containing the user's registration information, including email, name, and password.
 * @returns {Promise<Object>} The response JSON object from the registration API call.
 * @throws {Error} Logs an error to the console if the registration request fails.
 */

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

/**
 * Asynchronously logs in a user with the provided credentials. On successful login,
 * stores the access token in local storage and redirects to the feed page. On failure,
 * displays an error message.
 *
 * @async
 * @function loginUser
 * @param {string} url - The endpoint URL for user login.
 * @param {Object} data - An object containing the user's login credentials, including email and password.
 * @returns {Promise<Object>} The response JSON object from the login API call.
 * @throws {Error} Logs an error to the console if the login request fails.
 */

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
}

/**
 * Asynchronously fetches data from a given URL, using an access token stored in local storage for authorization.
 * This function is used to fetch protected resources that require authentication.
 *
 * @async
 * @function fetchWithToken
 * @param {string} url - The URL from which to fetch data.
 * @returns {Promise<Object>} The response JSON object from the fetch API call.
 * @throws {Error} Logs an error to the console if the fetch request fails.
 */

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
}
