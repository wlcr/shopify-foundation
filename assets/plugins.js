$.fn.extend({
    updateCartAJAX: function (options) {
        var settings = {
			item:        '.line-item-container',
			item_total:  '.line-item-total',
			item_qty:    '.line-item-qty',
			subtotal:    '.cart-total-price',
			item_remove: '.item-remove'        	
        };
        settings = jQuery.extend(settings, options);

        return this.each(function(){
        	var item = settings.item,
        		item_total = settings.item_total,
        		item_qty = settings.item_qty,
        		subtotal = settings.subtotal;

            // Change line item quantity
            $(item_qty).change(function() {
                var qty = $(this).val(),
                    this_item = $(this).closest(item),
                    variant_id = this_item.find('.variant-id').text(),
                    this_item_total = this_item.find(item_total);
                $.ajax({
                    type: 'POST',
                    url: '/cart/change.js',
                    dataType: 'json',
                    data: {
                        quantity: qty,
                        id: variant_id
                    },
                    success: function(cart) {
                        if ( qty == 0 ) {
                            this_item.remove();
                        } else {
                            $.each(cart.items,function(index,row) {
                                if ( variant_id == row.variant_id ) this_item_total.html( '$' + parseFloat(row.line_price / 100).toFixed(2) );
                            });
                        }
                        $(subtotal).html( '$' + parseFloat(cart.total_price / 100).toFixed(2) );
                        $('.cart-icon .count').text(cart.item_count);
                        if (cart.item_count == 0 ) {
                        	$('.empty-msg').removeClass('hidden');
                        	$('#cart-form').addClass('hidden');
                        }
                    },
                    error: function(response) {
                        alert(response);
                    }
                });
            });
 
            // Remove line item
            $(settings.item_remove).click(function(e) {
                e.preventDefault();
                $(this).closest(item).find(item_qty).val(0);
                $(this).closest(item).find(item_qty).trigger('change');
            });

        });
    }
});
