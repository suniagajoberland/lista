
      const cart = {};
      const phoneNumber = "+584143693311";
      const cartButton = document.getElementById("cart-button");
      const cartDetails = document.getElementById("cart-details");
      const cartCount = document.getElementById("cart-count");
      const cartItemsContainer = document.getElementById("cart-items");
      const cartTotal = document.getElementById("cart-total");
      const whatsappOrderBtn = document.getElementById("whatsapp-order");
      const whatsappForm = document.getElementById("whatsapp-form");

      function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        let totalQuantity = 0;
        for (const id in cart) {
          const item = cart[id];
          total += item.price * item.quantity;
          totalQuantity += item.quantity;

          const div = document.createElement("div");
          div.className = "cart-item";

          const detailsDiv = document.createElement("div");
          detailsDiv.className = "cart-item-details";
          detailsDiv.textContent = `${item.name} - $${item.price} x`;

          const qtyInput = document.createElement("input");
          qtyInput.type = "number";
          qtyInput.min = 1;
          qtyInput.value = item.quantity;
          qtyInput.className = "cart-item-quantity";
          qtyInput.setAttribute(
            "aria-label",
            `Cantidad de ${item.name} en el carrito`
          );
          qtyInput.onchange = (e) => {
            let val = parseInt(e.target.value);
            if (isNaN(val) || val < 1) {
              val = 1;
              e.target.value = 1;
            }
            cart[id].quantity = val;
            updateCartDisplay();
          };

          const subtotalSpan = document.createElement("span");
          subtotalSpan.textContent = ` = $${(
            item.price * item.quantity
          ).toFixed(2)} USD`;

          const removeBtn = document.createElement("button");
          removeBtn.textContent = "X";
          removeBtn.className = "cart-remove-btn";
          removeBtn.setAttribute(
            "aria-label",
            `Eliminar ${item.name} del carrito`
          );
          removeBtn.onclick = () => {
            delete cart[id];
            updateCartDisplay();
          };

          detailsDiv.appendChild(qtyInput);
          detailsDiv.appendChild(subtotalSpan);
          div.appendChild(detailsDiv);
          div.appendChild(removeBtn);
          cartItemsContainer.appendChild(div);
        }
        cartTotal.textContent = `Total: $${total.toFixed(2)} USD`;
        cartCount.textContent = totalQuantity;
        whatsappOrderBtn.disabled =
          totalQuantity === 0 || !whatsappForm.checkValidity();
      }

      function addToCart(product) {
        const id = product.getAttribute("data-id");
        const name = product.getAttribute("data-name");
        const price = Number(product.getAttribute("data-price"));
        const qtyInput = product.querySelector(".quantity-input");
        let quantity = parseInt(qtyInput.value);
        if (isNaN(quantity) || quantity < 1) {
          quantity = 1;
          qtyInput.value = 1;
        }
        if (cart[id]) {
          cart[id].quantity += quantity;
        } else {
          cart[id] = { name, price, quantity };
        }
        updateCartDisplay();
      }

      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.onclick = (e) => {
          const product = e.target.closest(".product");
          addToCart(product);
        };
      });

      cartButton.onclick = () => {
        cartDetails.style.display =
          cartDetails.style.display === "block" ? "none" : "block";
      };

      // Habilitar/deshabilitar botón de enviar según validación formulario y carrito
      whatsappForm.addEventListener("input", () => {
        whatsappOrderBtn.disabled =
          Object.keys(cart).length === 0 || !whatsappForm.checkValidity();
      });

      whatsappForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (Object.keys(cart).length === 0) {
          alert("El carrito está vacío.");
          return;
        }
        if (!whatsappForm.checkValidity()) {
          whatsappForm.reportValidity();
          return;
        }
        let message = "Hola, quiero realizar el siguiente pedido:%0A";
        for (const id in cart) {
          const item = cart[id];
          message += `${item.name} - Cantidad: ${item.quantity} - Subtotal: $${(
            item.price * item.quantity
          ).toFixed(2)} USD%0A`;
        }
        message += `${cartTotal.textContent}%0A%0A`;
        message += "Datos del comprador:%0A";
        message += `Nombre completo: ${encodeURIComponent(
          whatsappForm.fullName.value
        )}%0A`;
        message += `Cédula: ${encodeURIComponent(
          whatsappForm.cedula.value
        )}%0A`;
        message += `Dirección: ${encodeURIComponent(
          whatsappForm.direccion.value
        )}%0A`;
        message += `Teléfono: ${encodeURIComponent(
          whatsappForm.telefono.value
        )}%0A`;
        message += "%0APor favor envíenme más información. Gracias.";

        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappURL, "_blank");

        // **Nuevas líneas para limpiar el carrito**
        whatsappForm.reset();
        for (const key in cart) {
          delete cart[key];
        }
        updateCartDisplay();

        // **NUEVA LÍNEA:** Oculta el contenedor del carrito
        cartDetails.style.display = "none";
      });

      // WhatsApp consulta por producto
      document.querySelectorAll(".btn-whatsapp-product").forEach((button) => {
        button.onclick = (e) => {
          const product = e.target.closest(".product");
          const name = product.getAttribute("data-name");
          const message = encodeURIComponent(
            `Hola, quiero consultar sobre el producto: ${name}. Por favor envíenme más información.`
          );
          const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
          window.open(whatsappURL, "_blank");
        };
      });

      // Modal ficha técnica
      const techModal = document.getElementById("tech-modal");
      const techContent = document.getElementById("tech-content");
      const closeModalBtn = document.querySelector(".close-modal");
      const btnFabricante = document.getElementById("btn-fabricante");
      let currentFabricanteUrl = "";

      document.querySelectorAll(".btn-tech").forEach((button) => {
        button.onclick = (e) => {
          const product = e.target.closest(".product");
          const techText = product.getAttribute("data-tech");
          currentFabricanteUrl = product.getAttribute("data-fabricante") || "";
          techContent.textContent = techText;
          techModal.style.display = "block";
          btnFabricante.style.display = currentFabricanteUrl ? "block" : "none";
        };
      });

      closeModalBtn.onclick = () => {
        techModal.style.display = "none";
      };

      window.onclick = (event) => {
        if (event.target == techModal) {
          techModal.style.display = "none";
        }
      };

      btnFabricante.onclick = () => {
        if (currentFabricanteUrl) {
          window.open(currentFabricanteUrl, "_blank", "noopener");
        }
      };

      // Inicializa el carrito vacío
      updateCartDisplay();
