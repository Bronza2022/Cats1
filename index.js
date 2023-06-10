console.log('work')
const $wr = document.querySelector('[data-wr]')
const $createCatForm = document.forms.createCatForm
const $modalWr = document.querySelector('[data-modalWr]')
const $modalContent = document.querySelector('[data-modalContent]')

console.log($modalContent, $modalWr)

const ACTIONS = {
  DETAIL: 'detail',
  DELETE: 'delete',
}

const getCatHTML = (cat) => `
    <div data-cat-id="${cat.id}" class="card mb-3 mx-2" style="width: 18rem">
      <img src="${cat.image}" class="card-img-top" alt="${cat.name}"/>
      <div class="card-body">
        <h5 class="card-title">${cat.name}</h5>
        <p class="card-text">${cat.description}</p>
        <button data-action="${ACTIONS.DETAIL}" type="button" class="btn btn-primary">Detail</button>
        <button data-action="${ACTIONS.DELETE}" type="button" class="btn btn-danger">Delete</button>
        </div>
    </div>
    `

fetch('https://cats.petiteweb.dev/api/single/Bronza2022/show')
  .then((res) => res.json())
  .then((data) => {
    $wr.insertAdjacentHTML(
      'afterbegin',
      data.map((cat) => getCatHTML(cat)).join(''),
    )
  })

$wr.addEventListener('click', (e) => {
  if (e.target.dataset.action === ACTIONS.DELETE) {
    const $catWr = e.target.closest('[data-cat-id]')
    const catId = $catWr.dataset.catId

    fetch(`https://cats.petiteweb.dev/api/single/bronza2022/delete/${catId}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.status === 200) {
        return $catWr.remove()
      }
      alert(`Удаление кота с id = ${catId} не удалось`)
    })
  }
})

const submitCreateCatHandler = (e) => {
  e.preventDefault()

  let formDataObject = Object.fromEntries(new FormData(e.target).entries())

  formDataObject = {
    ...formDataObject,
    id: +formDataObject.id,
    rate: +formDataObject.rate,
    age: +formDataObject.age,
    favorite: !!formDataObject.favorite,
  }

  fetch('https://cats.petiteweb.dev/api/single/Bronza2022/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject),
  }).then((res) => {
    if (res.status === 200) {
      return $wr.insertAdjacentHTML(
        'afterbegin',
        getCatHTML(formDataObject),
      )
    }
    throw Error('Ошибка при создании кота')
  }).catch(alert)
}

const clickModalWrHandler = (e) => {
  if (e.target === $modalWr) {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $createCatForm.removeEventListener('submit', submitCreateCatHandler)
  }
}

const openModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal
  if (targetModalName === 'createCat') {
    $modalWr.classList.remove('hidden')
    $modalWr.addEventListener('click', clickModalWrHandler)
    $createCatForm.addEventListener('submit', submitCreateCatHandler)
  }
}

document.addEventListener('click', openModalHandler)

document.addEventListener('keydown', (e) => {
  console.log(e)

  if (e.key === 'Escape') {
    $modalWr.classList.add('hidden')
    $modalWr.removeEventListener('click', clickModalWrHandler)
    $createCatForm.removeEventListener('submit', submitCreateCatHandler)
  }
})
// ----------------