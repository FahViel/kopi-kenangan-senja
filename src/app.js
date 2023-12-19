// Convert to IDR
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

document.addEventListener('alpine:init', () => {
  Alpine.data('products', () => ({
    items: [
      { id: 1, name: 'Robusta Brazil', img: '1.jpg', price: 20000 },
      { id: 2, name: 'Arabica Blend', img: '2.jpg', price: 30000 },
      { id: 3, name: 'Prismo Raso', img: '3.jpg', price: 40000 },
      { id: 4, name: 'Aceh Gayo', img: '4.jpg', price: 50000 },
      { id: 5, name: 'Americano', img: '5.jpg', price: 60000 },
    ],
  }))

  Alpine.store('cart', {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // check if there's same item
      const cartItem = this.items.find((item) => item.id === newItem.id)

      // if cart empty
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price })
        this.quantity++
        this.total += newItem.price
      } else {
        // if cart not empty, then check item is different or not
        this.items = this.items.map((item) => {
          // if item is different
          if (item.id !== newItem.id) {
            return item
          } else {
            // if there's item, push quantity and item total price
            item.quantity++
            item.total = item.price * item.quantity

            this.quantity++
            this.total += item.price

            return item
          }
        })
      }
    },

    remove(id) {
      // take items that gonna get removed
      const cartItem = this.items.find((item) => item.id === id)

      // if items more than 1
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          // if items is different than id
          if (item.id !== id) {
            return item
          } else {
            item.quantity--
            item.total = item.price * item.quantity
            this.quantity--
            this.total -= item.price

            return item
          }
        })
      } else if (cartItem.quantity === 1) {
        // if there's item 1 left
        this.items = this.items.filter((item) => item.id !== id)
        this.quantity--
        this.total -= cartItem.price
      }
    },
  })
})

//  Form Validation
const checkoutButton = document.querySelector('.checkout-button')
// checkoutButton.disabled = false

const form = document.querySelector('#checkoutForm')

// form.addEventListener('keyup', () => {
//   for (let i = 0; i < form.elements.length; i++) {
//     if (form.elements[i].value.length !== 0) {
//       checkoutButton.classList.remove('disabled')
//       checkoutButton.classList.add('disabled')
//     } else {
//       return false
//     }
//   }

//   checkoutButton.disabled = false
//   checkoutButton.classList.remove('disabled')
// })

// send data when checkout button clicked
checkoutButton.addEventListener('click', async function (e) {
  e.preventDefault()
  const formData = new FormData(form)
  const data = new URLSearchParams(formData)
  const objData = Object.fromEntries(data)

  // get transaction token
  try {
    const response = await fetch('php/placeOrder.php', {
      method: 'POST',
      body: data,
    })
    const token = await response.text()
    // console.log(token)
    window.snap.pay(token)
  } catch (err) {
    console.log(err.message)
  }
})
