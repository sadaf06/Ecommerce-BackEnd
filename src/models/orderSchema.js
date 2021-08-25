const mongoose = require("mongoose");

const OrderDetails = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            buyPrice: {
                type: Number,
                required: true
            }
        }
    ],
    deliveryAddress: {
        type: String,
        required: true
    },
    deliveryAddressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address.Address",
        required: true
    },
    paymentMode: { type: String, required: true },
    PaymentStatus: { type: String, required: true },
    orderStatus: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("Order", OrderDetails)