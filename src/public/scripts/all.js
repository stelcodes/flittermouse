const ajax = require('superagent')
const Croppie = require('croppie')
const L = require('leaflet')

// const baseUrl = 'http:localhost:3000'

document.addEventListener('DOMContentLoaded', () => {
  // NAV
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
  const loginModalCancel = document.querySelector('#login-modal .cancel')
  const toggleLoginModal = () => {
    loginModal.classList.toggle('is-active')
    loginUsernameEmailInput.value = ''
    loginPasswordInput.value = ''
    loginPasswordInput.classList.remove('is-danger')
    loginUsernameEmailInput.classList.remove('is-danger')
    loginHelp.innerText = ''
  }

  if (login) {
    login.addEventListener('click', toggleLoginModal)
    loginModalBackground.addEventListener('click', toggleLoginModal)
    loginModalClose.addEventListener('click', toggleLoginModal)
    loginModalCancel.addEventListener('click', toggleLoginModal)
  }

  const loginForm = document.querySelector('#login-modal form')
  const loginPasswordInput = document.getElementById('loginPasswordInput')
  const loginUsernameEmailInput = document.getElementById('loginUsernameEmailInput')
  const loginHelp = document.getElementById('loginHelp')
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault()
      console.log(event)
      const password = event.target.elements.password.value
      const usernameEmail = event.target.elements.usernameEmail.value
      console.log({ usernameEmail, password })
      ajax.post('/login')
        .send({ usernameEmail, password })
        .then(res => {
          console.log(res)
          if (res.body.success) window.location.reload()
          else {
            loginPasswordInput.classList.add('is-danger')
            loginUsernameEmailInput.classList.add('is-danger')
            loginHelp.innerText = 'No accounts found with that username/email and password combination'
          }
        })
    })

    loginForm.addEventListener('input', (event) => {
      loginPasswordInput.classList.remove('is-danger')
      loginUsernameEmailInput.classList.remove('is-danger')
      loginHelp.innerText = ''
    })
  }

  const navSignupButton = document.getElementById('navSignupButton')
  const signupModal = document.getElementById('signupModal')
  const signupModalBackground = document.querySelector('#signupModal .modal-background')
  const signupModalClose = document.querySelector('#signupModal .modal-close')
  const signupModalCancel = document.querySelector('#signupModal .cancel')
  const signupPasswordInput = document.getElementById('signupPasswordInput')
  const signupEmailInput = document.getElementById('signupEmailInput')
  const signupUsernameInput = document.getElementById('signupUsernameInput')
  const signupSubmit = document.getElementById('signupSubmit')
  const signupUsernameError = document.getElementById('signupUsernameError')
  const signupEmailError = document.getElementById('signupEmailError')
  const signupPasswordError = document.getElementById('signupPasswordError')
  const toggleSignupModal = () => {
    signupModal.classList.toggle('is-active')
    signupPasswordInput.value = ''
    signupEmailInput.value = ''
    signupUsernameInput.value = ''
    signupUsernameInput.classList.remove('is-danger')
    signupEmailInput.classList.remove('is-danger')
    signupPasswordInput.classList.remove('is-danger')
    signupPasswordError.innerText = ''
    signupEmailError.innerText = ''
    signupUsernameError.innerText = ''
  }

  if (navSignupButton) {
    navSignupButton.addEventListener('click', toggleSignupModal)
    signupModalBackground.addEventListener('click', toggleSignupModal)
    signupModalClose.addEventListener('click', toggleSignupModal)
    signupModalCancel.addEventListener('click', toggleSignupModal)
  }

  const signupForm = document.querySelector('#signupModal form')
  if (signupForm) {
    signupUsernameInput.oninput = (event) => {
      signupUsernameInput.classList.remove('is-danger')
      signupUsernameError.innerText = ''
    }
    signupEmailInput.oninput = (event) => {
      signupEmailInput.classList.remove('is-danger')
      signupEmailError.innerText = ''
    }
    signupPasswordInput.oninput = (event) => {
      signupPasswordInput.classList.remove('is-danger')
      signupPasswordError.innerText = ''
    }
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault()
      signupSubmit.classList.add('is-loading')
      console.log(event)
      const formElems = event.target.elements
      const requestBody = {
        username: formElems.username.value,
        email: formElems.email.value,
        password: formElems.password.value
      }
      ajax
        .post('/signup')
        .send(requestBody)
        .then(res => {
          console.log(res)
          if (res.body.success) {
            signupModal.classList.remove('is-active')
            window.location.assign('/home')
          } else if (res.body.invalidInputFields) {
            res.body.invalidInputFields.forEach(error => {
              if (error.name === 'username') {
                signupUsernameInput.classList.add('is-danger')
                signupUsernameError.innerText = error.message
              }
              if (error.name === 'email') {
                signupEmailInput.classList.add('is-danger')
                signupEmailError.innerText = error.message
              }
              if (error.name === 'password') {
                signupPasswordInput.classList.add('is-danger')
                signupPasswordError.innerText = error.message
              }
            })
          }
          signupSubmit.classList.remove('is-loading')
        })
      console.log(requestBody)
    })
  }

  const logout = document.querySelector('nav .logout')
  if (logout) {
    logout.addEventListener('click', (event) => {
      ajax.post('/logout')
        .send({ })
        .then(res => {
          console.log(res)
          if (res.body.success) window.location.replace('/')
        })
    })
  }

  // EVENTS
  const updateAttendanceButton = document.querySelector('button.update-attendance')
  if (updateAttendanceButton) {
    const urlKey = updateAttendanceButton.getAttribute('urlKey')
    updateAttendanceButton.addEventListener('click', event => {
      updateAttendanceButton.classList.toggle('is-loading')
      if (updateAttendanceButton.classList.contains('is-link')) {
        ajax.post('/users/attend')
          .send({ urlKey })
          .then(res => {
            console.log(res)
            if (res.body.success) {
              updateAttendanceButton.innerHTML = 'Remove RSVP'
              updateAttendanceButton.classList.remove('is-link')
              updateAttendanceButton.classList.add('is-warning')
            } else if (res.body.needToLogin) {
              toggleLoginModal()
            }
            updateAttendanceButton.classList.toggle('is-loading')
          })
      }
      if (updateAttendanceButton.classList.contains('is-warning')) {
        ajax.delete('/users/attend')
          .send({ urlKey })
          .then(res => {
            console.log(res)
            if (res.body.success) {
              updateAttendanceButton.innerHTML = 'RSVP'
              updateAttendanceButton.classList.add('is-link')
              updateAttendanceButton.classList.remove('is-warning')
            } else if (res.body.needToLogin) {
              toggleLoginModal()
            }
            updateAttendanceButton.classList.toggle('is-loading')
          })
      }
    })
  }

  // USERS
  const userFollowButton = document.getElementById('userFollowButton')
  if (userFollowButton) {
    userFollowButton.onmouseover = (event) => {
      if (userFollowButton.getAttribute('isFollowing')) {
        userFollowButton.classList.remove('is-primary')
        userFollowButton.classList.add('is-danger')
        userFollowButton.innerText = 'Unfollow'
      }
    }
    userFollowButton.onmouseout = (event) => {
      if (userFollowButton.getAttribute('isFollowing')) {
        userFollowButton.classList.add('is-primary')
        userFollowButton.classList.remove('is-danger')
        userFollowButton.innerText = 'Following'
      }
    }
    userFollowButton.onclick = (event) => {
      const targetUserId = userFollowButton.getAttribute('targetUserId')
      if (!userFollowButton.getAttribute('isFollowing')) {
        ajax
          .post('/users/follow')
          .send({ targetUserId })
          .then(res => {
            if (res.body.success) {
              userFollowButton.classList.add('is-outlined')
              userFollowButton.innerText = 'Following'
              userFollowButton.setAttribute('isFollowing', true)
              document.activeElement.blur()
            } else if (res.body.needToLogin) {
              toggleLoginModal()
            }
            console.log(res)
          })
      } else {
        ajax
          .delete('/users/follow')
          .send({ targetUserId })
          .then(res => {
            if (res.body.success) {
              userFollowButton.classList.add('is-primary')
              userFollowButton.classList.remove('is-danger')
              userFollowButton.classList.remove('is-outlined')
              userFollowButton.innerText = 'Follow'
              userFollowButton.removeAttribute('isFollowing')
              document.activeElement.blur()
            }
            console.log(res)
          })
      }
    }
  }

  // SETTINGS - PROFILE INFO FORM
  const displayNameInput = document.querySelector('#displayNameInput')
  const displayNameHelp = document.querySelector('#displayNameHelp')
  const bioTextArea = document.querySelector('#bioTextArea')
  const bioHelp = document.querySelector('#bioHelp')
  if (displayNameInput && displayNameHelp && bioTextArea && bioHelp) {
    displayNameInput.addEventListener('input', (event) => {
      const inputLength = event.target.value.length
      displayNameHelp.textContent = inputLength + '/40'
      if (inputLength > 40) {
        displayNameInput.classList.add('is-danger')
        displayNameHelp.classList.add('is-danger')
      } else {
        displayNameInput.classList.remove('is-danger')
        displayNameHelp.classList.remove('is-danger')
      }
    })
    bioTextArea.addEventListener('input', (event) => {
      const inputLength = event.target.value.length
      bioHelp.textContent = inputLength + '/160'
      if (inputLength > 160) {
        bioTextArea.classList.add('is-danger')
        bioHelp.classList.add('is-danger')
      } else {
        bioTextArea.classList.remove('is-danger')
        bioHelp.classList.remove('is-danger')
      }
    })

    const fileInput = document.getElementById('fileInput')
    const cropContainer = document.getElementById('croppie')
    const cropModal = document.getElementById('cropModal')
    const cropModalClose = document.getElementById('cropModalClose')
    const acceptCrop = document.getElementById('acceptCrop')
    const cancelCrop = document.getElementById('cancelCrop')
    const settingsAvatar = document.getElementById('settingsAvatar')
    const updateProfileForm = document.getElementById('updateProfileForm')
    const updateProfileButton = document.getElementById('updateProfileButton')
    const navAvatar = document.getElementById('navAvatar')
    let avatarBlob = null

    const closeCropModal = (event) => { cropModal.classList.remove('is-active') }
    cropModalClose.addEventListener('click', closeCropModal)
    cancelCrop.addEventListener('click', closeCropModal)

    const crop = new Croppie(cropContainer, {
      viewport: { width: 200, height: 200, type: 'circle' },
      boundary: { width: 300, height: 300 }
    })
    const readFile = (input) => {
      console.log('readFile triggered')
      if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.addEventListener('load', (event) => {
          crop.bind({ url: event.target.result, zoom: 0 })
        })
        reader.readAsDataURL(input.files[0])
      }
    }
    fileInput.addEventListener('change', (event) => {
      readFile(event.target)
      cropModal.classList.add('is-active')
    })

    acceptCrop.addEventListener('click', () => {
      crop.result({ type: 'base64', size: { width: 200, height: 200 } }).then(image => {
        settingsAvatar.setAttribute('src', image)
      })
      crop.result({ type: 'blob', size: { width: 200, height: 200 } }).then(image => {
        console.log(image)
        avatarBlob = image
      })
      cropModal.classList.remove('is-active')
    })

    updateProfileForm.addEventListener('input', (event) => {
      console.log('form input event')
      updateProfileButton.removeAttribute('disabled')
    })

    updateProfileForm.addEventListener('submit', (event) => {
      event.preventDefault()
      console.log(avatarBlob)
      const form = new FormData()
      if (avatarBlob) {
        var mimeTypes = ['image/jpeg', 'image/png']
        // Validate MIME type
        if (mimeTypes.indexOf(avatarBlob.type) === -1) {
          alert('Error : Incorrect file type')
          return
        }
        // Max 2 Mb allowed
        if (avatarBlob.size > 2 * 1024 * 1024) {
          alert('Error : Exceeded size 2MB')
          return
        }
        form.append('avatar', avatarBlob)
      }
      form.append('displayName', event.target.elements.displayName.value)
      form.append('bio', event.target.elements.bio.value)
      form.forEach((value, key) => {
        console.log(key, value)
      })
      updateProfileButton.classList.add('is-loading')
      ajax
        .post('/users/update')
        .send(form)
        .then(res => {
          console.log(res)
          updateProfileButton.setAttribute('disabled', true)
          if (res.body.avatarUrl) navAvatar.setAttribute('src', res.body.avatarUrl)
          updateProfileButton.classList.remove('is-loading')
        })
        .catch(console.error)
    })
  }

  // SETTINGS - PRIVACY FORM
  const updatePrivacyForm = document.getElementById('updatePrivacyForm')
  const updatePrivacyButton = document.getElementById('updatePrivacyButton')
  if (updatePrivacyForm && updatePrivacyForm) {
    updatePrivacyForm.addEventListener('input', (event) => {
      updatePrivacyButton.removeAttribute('disabled')
    })
    updatePrivacyForm.addEventListener('submit', (event) => {
      event.preventDefault()
      updatePrivacyButton.classList.add('is-loading')
      const formElems = event.target.elements
      const requestBody = {
        displayNameVisibility: formElems.displayNameVisibility.value,
        avatarVisibility: formElems.avatarVisibility.value,
        bioVisibility: formElems.bioVisibility.value,
        emailVisibility: formElems.emailVisibility.value,
        attendingVisibility: formElems.attendingVisibility.value,
        followingVisibility: formElems.followingVisibility.value
      }
      console.log(requestBody)
      ajax
        .post('/settings/privacy')
        .send(requestBody)
        .then(res => {
          console.log(res)
          updatePrivacyButton.classList.remove('is-loading')
          updatePrivacyButton.setAttribute('disabled', true)
        })
    })
  }

  // EVENT CARDS
  const eventCards = document.querySelectorAll('.event-card')
  eventCards.forEach(eventCard => {
    eventCard.addEventListener('click', event => {
      console.log(eventCard.attributes)
      window.location.assign(eventCard.attributes.url.value)
    })
  })

  // MAP
  const mapElem = document.getElementById('map')
  if (mapElem) {
    // set up the map
    const lat = mapElem.attributes.lat.value
    const lon = mapElem.attributes.lon.value
    const map = new L.Map('map', { scrollWheelZoom: false })

    // create the tile layer with correct attribution
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    const osm = new L.TileLayer(osmUrl, { minZoom: 10, maxZoom: 17, attribution: osmAttrib })
    // start the map in South-East England
    map.addLayer(osm)
    L.Icon.Default.prototype.options.imagePath = '/images/'
    L.marker([lat, lon]).addTo(map)
    map.setView(new L.LatLng(lat, lon), 17)
  }

  // SEARCH
  const searchResults = document.querySelectorAll('.searchResult')
  searchResults.forEach(searchResult => {
    searchResult.addEventListener('click', event => {
      console.log(searchResult.attributes)
      window.location.assign(searchResult.attributes.url.value)
    })
  })

  // LANDING
  const landingHeroFadeText = document.getElementById('landingHeroFadeText')
  const landingHeroImage = document.getElementById('landingHeroImage')
  if (landingHeroFadeText) {
    const textStates = ['action', 'support', 'power', 'events']
    let nextTextState = 0
    const imageStates = [
      'https://eventz.nyc3.cdn.digitaloceanspaces.com/3.jpg',
      'https://eventz.nyc3.cdn.digitaloceanspaces.com/2.jpg',
      'https://eventz.nyc3.cdn.digitaloceanspaces.com/4.jpg',
      'https://eventz.nyc3.cdn.digitaloceanspaces.com/1.jpg'
    ]
    let nextImageState = 0
    landingHeroFadeText.addEventListener('animationend', (event) => {
      landingHeroFadeText.classList.remove('delay-2s')
      if (nextTextState === textStates.length) return
      if (landingHeroFadeText.classList.contains('fadeOutUp')) {
        landingHeroFadeText.innerText = textStates[nextTextState++]
        setTimeout(() => {
          landingHeroFadeText.classList.remove('fadeOutUp')
          landingHeroFadeText.classList.add('fadeInDown')
        }, 200)
      } else {
        setTimeout(() => {
          landingHeroFadeText.classList.remove('fadeInDown')
          landingHeroFadeText.classList.add('fadeOutUp')
        }, 3000)
      }
    })
    landingHeroImage.addEventListener('animationend', (event) => {
      landingHeroImage.classList.remove('delay-2s')
      if (nextImageState === imageStates.length) return
      if (landingHeroImage.classList.contains('fadeOut')) {
        landingHeroImage.setAttribute('src', imageStates[nextImageState++])
        setTimeout(() => {
          landingHeroImage.classList.remove('fadeOut')
          landingHeroImage.classList.add('fadeIn')
        }, 200)
      } else {
        setTimeout(() => {
          landingHeroImage.classList.remove('fadeIn')
          landingHeroImage.classList.add('fadeOut')
        }, 3000)
      }
    })
  }
})
