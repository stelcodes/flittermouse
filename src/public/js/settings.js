const Croppie = require('croppie')
const request = require('superagent')

console.log('script loaded')

document.addEventListener('DOMContentLoaded', () => {
  const displayNameInput = document.querySelector('#displayNameInput')
  const displayNameHelp = document.querySelector('#displayNameHelp')
  const bioTextArea = document.querySelector('#bioTextArea')
  const bioHelp = document.querySelector('#bioHelp')
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
    request
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
})

// $('.actionUpload').on('click', function () {
//   basic.croppie('result', 'blob').then(function (blob) {
//     var formData = new FormData()
//     formData.append('filename', 'testFileName.png')
//     formData.append('blob', blob)
//     var MyAppUrlSettings = {
//       MyUsefulUrl: '@Url.Action("GetImage","Create")'
//     }

//     var request = new XMLHttpRequest()
//     request.open('POST', MyAppUrlSettings.MyUsefulUrl)
//     request.send(formData)
//   })
// })
