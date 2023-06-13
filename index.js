console.log('work')
const $wr = document.querySelector('[data-wr]')
const $modalWr = document.querySelector('[data-modalWr]') // 2.8 Здесь будем обращаться напрямую к элементам
const $modalContent = document.querySelector('[data-modalContent]') // 2.9 Здесь будем обращаться напрямую к элементам

const CREATE_FORM_LS_KEY = 'CREATE_FORM_LS_KEY' // 6.11

console.log($modalContent, $modalWr) // 2.10 Проверяем, нашли мы элементы или нет.

const getCreateCatFormHTML = () => `<h3 class="text-center mb-3">Create new cat</h3>
        <form name="createCatForm">

        <div class="mb-3">
          <input type="number" name="id" required placeholder="Id" class="form-control"/>
        </div>
  
        <div class="mb-3">
          <input type="text" name="name" required placeholder="Name" class="form-control"/>
        </div>
  
        <div class="mb-3">
          <input type="number" name="age" placeholder="Age" class="form-control"/>
        </div>
  
        <div class="mb-3">
          <input type="text" name="description" placeholder="Description" class="form-control"/>
        </div>
  
        <div class="mb-3">
          <input type="text" name="image" placeholder="Image url" class="form-control"/>
        </div>
  
        <div class="mb-3">
          <input type="range" name="rate" min="1" max="10" />
        </div>
  
        <div class="mb-3 form-check">
          <input type="checkbox" name="favorite" class="form-check-input" id="exampleCheck1"/>
          <label class="form-check-label" for="exampleCheck1">favorite</label>
        </div>
        <button type="submit" class="btn btn-primary">Add</button>
        </form>` // 5.1

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
        <button data-action="${ACTIONS.DETAIL}" 
        type="button" 
        class="btn btn-primary">Detail</button>
        <button data-action="${ACTIONS.DELETE}" 
        type="button" 
        class="btn btn-danger">Delete</button>
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

const formatCreateFormData = (formDataObject) => {  // 6.3
return {                    
     ...formDataObject,
    id: +formDataObject.id,
    rate: +formDataObject.rate,
    age: +formDataObject.age,
    favorite: !!formDataObject.favorite,
  }
}


const submitCreateCatHandler = (e) => { // 2.12 Создадим 'const submitCreatCatHandler'
  e.preventDefault()

  let formDataObject = formatCreateFormData(Object.fromEntries(new FormData(e.target).entries())) // 6.4

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

const clickModalWrHandler = (e) => { // 4.1
  if (e.target === $modalWr) { // 4.5
    $modalWr.classList.add('hidden') // 4.6  Закрываем модалку
    $modalWr.removeEventListener('click', clickModalWrHandler) // 4.7
    $modalContent.innerHTML = '' // 5.5 Когда модалка закрывается, чистится все содержимое.
  }
}

const openModalHandler = (e) => { // 2.3 Открытие модального окна. Функция, которую мы укажем по событию (e)
  const targetModalName = e.target.dataset.openmodal // 2.4. 'dataset' будет называться 'openmodal'
 
  if (targetModalName === 'createCat') { // 2.5 «Если это строка 'createCat', то будем делать какие-то действия.
    $modalWr.classList.remove('hidden') // 2.11 по умолчанию есть класс 'hidden' и его надо удалить
    $modalWr.addEventListener('click', clickModalWrHandler) // 4.2

    $modalContent.insertAdjacentHTML('afterbegin', getCreateCatFormHTML()) // 5.2
    const $createCatForm = document.forms.createCatForm // 5.3, 6.16

    const dataFromLS = localStorage.getItem(CREATE_FORM_LS_KEY)  //  6.10

    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS)    // 6.13
    console.log({ preparedDataFromLS })  // 6.14

    if (preparedDataFromLS) {                     // 6.15
      Object.keys(preparedDataFromLS).forEach((key) => {
        $createCatForm[key].value = preparedDataFromLS[key]
      })
    }

    //const $createCatForm = document.forms.createCatForm // 5.3   6.9 
    $createCatForm.addEventListener('submit', submitCreateCatHandler) // 2.13, 5.4 обработчик события
    $createCatForm.addEventListener('change', () => { // 6.1       6.17
      //console.log(changeEvent) // 6.6 удаляем
      const formattedData = formatCreateFormData(Object.fromEntries(new FormData($createCatForm).entries())) // 6.5
    
      localStorage.setItem(CREATE_FORM_LS_KEY, JSON.stringify(formattedData)) // 6.8, 6.12
      //console.log({ formattedData }); // 6.7 удаляем
    })
  }
}

document.addEventListener('click', openModalHandler) // 2.2 обработчик события, который отвечает за обработку 'click' и вызывает функцию 'openModalHandler'.

document.addEventListener('keydown', (e) => { // 3.1 Вешаем обработчик события, которым отлавливаем событие 'keydown'.
  console.log(e)

  if (e.key === 'Escape') {
    $modalWr.classList.add('hidden') // 3.2 Чтобы закрыть модалку добавляем класс 'hidden'.
    $modalWr.removeEventListener('click', clickModalWrHandler) // 4.3
    $modalContent.innerHTML = '' // 5.5 Когда модалка закрывается, чистится все содержимое.
  }
})

// 2. Функция открытия модалки (п. 2.2-2.13)
// 3. функция закрытия модалки клавишей Esc (п. 3.1-3.2)
// 4. функция закрытия модалки кликом по размытой области (п. 4.1-4.8)
// 5. функция, когда при закрытии модалки ее содержимое удаляется (п. 5.1-)
// 6. функция, когда при закрытии модалки ее содержимое сохраняется с помощью json stringeFi (п. 6.1-)
