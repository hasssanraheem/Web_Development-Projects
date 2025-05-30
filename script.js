$(document).ready(function() {
    // Cart functionality
    let cart = [];
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    
    // Update cart count in navbar
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        $('.cart-count').text(totalItems);
        
        // Enable/disable checkout button
        if (totalItems > 0) {
            $('.checkout-btn').removeClass('disabled');
        } else {
            $('.checkout-btn').addClass('disabled');
        }
    }
    
    // Update cart modal content
    function updateCartModal() {
        const $cartItems = $('.cart-items');
        const $emptyCartMessage = $('.empty-cart-message');
        
        if (cart.length === 0) {
            $emptyCartMessage.show();
            $cartItems.html('');
            return;
        }
        
        $emptyCartMessage.hide();
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div>
                        <h6>${item.name}</h6>
                        <p>${item.color} | Qty: ${item.quantity}</p>
                        <p>$${itemTotal.toFixed(2)}</p>
                        <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
        });
        
        cartHTML += `
            <div class="d-flex justify-content-between mt-3">
                <h5>Total:</h5>
                <h5>$${total.toFixed(2)}</h5>
            </div>
        `;
        
        $cartItems.html(cartHTML);
    }
    
    // Add to cart
    $('.add-to-cart').click(function() {
        const color = $('.color-option.active').data('color');
        const quantity = parseInt($('.quantity-input').val());
        
        const product = {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 199.99,
            color: color.charAt(0).toUpperCase() + color.slice(1),
            quantity: quantity,
            image: 'https://via.placeholder.com/100x100'
        };
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.id && item.color === product.color);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push(product);
        }
        
        updateCartCount();
        
        // Show success message
        const toastHTML = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto">Success</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to your cart
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(toastHTML);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            $('.toast').remove();
        }, 3000);
    });
    
    // Add related products to cart
    $('.add-to-cart-sm').click(function() {
        const card = $(this).closest('.card');
        const name = card.find('.card-title').text();
        const price = parseFloat(card.find('.card-text').text().replace('$', ''));
        
        const product = {
            id: Math.floor(Math.random() * 1000),
            name: name,
            price: price,
            color: 'Default',
            quantity: 1,
            image: 'https://via.placeholder.com/100x100'
        };
        
        cart.push(product);
        updateCartCount();
        
        // Show success message
        const toastHTML = `
            <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto">Success</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast