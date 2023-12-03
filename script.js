const listProducts = document.querySelector(".container");
const selectedProd = document.querySelector(".selected-items");
let totalPrice = document.querySelector(".price");
let itemNumber = document.querySelector(".number-of-items");
const productsBundle = document.querySelector(".adder");
const body = document.querySelector(".bundle-product");
const openSelect = document.querySelector(".show-text");

let listProArr = [];
let selectProdArr = [];
document.addEventListener("DOMContentLoaded", () => {
  openSelect.addEventListener("click", () => {
    console.log("clicked");
    body.classList.toggle("open");
  });
});

let priceOfItems = 0;
const getData = async () => {
  try {
    const result = await fetch("http://172.16.4.47:5500/product.json");
    const data = await result.json();
    listProArr = data;
    addIntoHTML();
    // if (localStorage.getItem("prod")) {
    //   selectProdArr = JSON.parse(localStorage.getItem("prod"));
    //   addIntoHTML();
    // }
  } catch (e) {
    console.warn(e.message);
  }
};
getData();

const addIntoHTML = () => {
  listProducts.innerHTML = ``;
  if (listProArr.length > 0) {
    listProArr.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("cards");
      newProduct.innerHTML = `<img
      src=${product.src}
      class="card-images"
    
    />
    <div class="card-body">
      <p class="card-title">${product.name}</p>
      <div class="card-footer">
        <div class="product-price">
          <strong>Price:</strong> <span class="price">${product.price}</span>
        </div>
        <button class="card-button">Add</button>
      </div>
    </div>`;
      listProducts.appendChild(newProduct);
    });
  }
};
listProducts.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("card-button")) {
    let id_product = positionClick.closest(".cards").getAttribute("data-id");

    addToBunddle(id_product);
  }
});

const addToBunddle = (product_id) => {
  let positionThisProductInCart = selectProdArr.findIndex(
    (value) => value.product_id == product_id
  );

  let totalQuantity = selectProdArr.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (selectProdArr.length === 0 && totalQuantity < 8) {
    selectProdArr = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (selectProdArr.length > 0 && totalQuantity < 8) {
    if (positionThisProductInCart < 0) {
      selectProdArr.push({
        product_id: product_id,
        quantity: 1,
      });
    } else {
      selectProdArr[positionThisProductInCart].quantity += 1;
    }
  } else {
    // Optionally, you can provide a message or take other actions when the limit is reached.
    console.log("Cannot add more items. Limit reached.");
  }

  addCartToHTML();
};

const addCartToHTML = () => {
  selectedProd.innerHTML = "";

  let totalQuantity = 0;
  let totalPrice2 = 0;

  // Create elements for total quantity and total price
  const totalQuantityElement = document.createElement("div");
  const totalPriceElement = document.createElement("div");
  totalQuantityElement.classList.add("total-quantity");
  totalPriceElement.classList.add("total-price");

  if (selectProdArr.length > 0 && totalQuantity <= 8) {
    selectProdArr.forEach((item) => {
      totalQuantity = totalQuantity + item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("items");
      newItem.dataset.id = item.product_id;

      let positionProduct = listProArr.findIndex(
        (value) => value.id == item.product_id
      );
      let info = listProArr[positionProduct];
      selectedProd.appendChild(newItem);
      newItem.innerHTML = `
              <div>
                <img src="${info.src}"  class="item-image">
              </div>
              <div>
                <p class="item-name">${info.name}</p>
                <p class="total-price">${info.price * item.quantity}</p>
              </div>
              <div class="quantity">
              <span class="minus"><</span>
              <span>${item.quantity}</span>
              <span class="plus">></span>
          </div>
            `;
      selectedProd.appendChild(newItem);

      totalPrice2 += Math.floor(info.price * item.quantity);
    });

    totalQuantityElement.innerHTML = `Total Quantity: ${totalQuantity}`;
    totalPriceElement.innerHTML = `Total Price: ${totalPrice2}`;

    const newFooter = document.querySelector(".numbers");
    newFooter.innerHTML = "";
    newFooter.appendChild(totalQuantityElement);
    newFooter.appendChild(totalPriceElement);
    productsBundle.appendChild(newFooter);
    priceOfItems = totalPrice2;
  }
};

const selectedItemsElement = document.querySelector(".selected-items");

selectedItemsElement.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});

const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = selectProdArr.findIndex(
    (value) => value.product_id == product_id
  );

  let totalQuantity = selectProdArr.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (positionItemInCart >= 0) {
    let info = selectProdArr[positionItemInCart];
    switch (type) {
      case "plus":
        if (totalQuantity + 1 <= 8) {
          selectProdArr[positionItemInCart].quantity += 1;
        } else {
          // Optionally, you can provide a message or take other actions when the limit is reached.
          console.log("Cannot add more items. Limit reached.");
        }
        break;

      default:
        let changeQuantity = selectProdArr[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          selectProdArr[positionItemInCart].quantity = changeQuantity;
        } else {
          selectProdArr.splice(positionItemInCart, 1);
        }
        break;
    }
  }

  addCartToHTML();
};

const buyProduct = () => {
  let totalQuantity = selectProdArr.reduce(
    (total, item) => total + item.quantity,
    0
  );
  if (totalQuantity >= 0) {
    alert(
      "buy" +
        " " +
        "total Quanity of :" +
        totalQuantity +
        " " +
        "At the price of :" +
        priceOfItems
    );
  } else {
    alert("NO items are inserted");
  }
};
