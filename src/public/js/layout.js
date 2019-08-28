const ajax = require('superagent')
// const baseUrl = 'http:localhost:3000'

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.navbar-burger')
  const menu = document.querySelector('.navbar-menu')
  burger.addEventListener('click', () => {
    menu.classList.toggle('is-active')
    burger.classList.toggle('is-active')
  })

  const login = document.querySelector('#login')
  const loginModal = document.querySelector('#login-modal')
  const loginModalBackground = document.querySelector('#login-modal .modal-background')
  const loginModalClose = document.querySelector('#login-modal .modal-close')
  const loginModalCancel = document.querySelector('#login-modal #cancel')
  const toggleLoginModal = () => { loginModal.classList.toggle('is-active') }

  login.addEventListener('click', toggleLoginModal)
  loginModalBackground.addEventListener('click', toggleLoginModal)
  loginModalClose.addEventListener('click', toggleLoginModal)
  loginModalCancel.addEventListener('click', toggleLoginModal)

  const loginForm = document.querySelector('#login-modal form')
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault()
    ajax.post('/login')
      .send({ username: event.target. })
      .then(res => console.log(res))
  })

  const signup = document.querySelector('#signup')
  const signupModal = document.querySelector('#signup-modal')
  const signupModalBackground = document.querySelector('#signup-modal .modal-background')
  const signupModalClose = document.querySelector('#signup-modal .modal-close')
  const signupModalCancel = document.querySelector('#signup-modal #cancel')
  const toggleSignupModal = () => { signupModal.classList.toggle('is-active') }

  signup.addEventListener('click', toggleSignupModal)
  signupModalBackground.addEventListener('click', toggleSignupModal)
  signupModalClose.addEventListener('click', toggleSignupModal)
  signupModalCancel.addEventListener('click', toggleSignupModal)

  const signupForm = document.querySelector('#signup-modal form')
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(event)
  })
})
