const mongoose = require('mongoose');
const AddNewAddress = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        Address: [
            {
                name: {
                    type: String,
                    required: true
                },
                addressType: {
                    type: String,
                    required: true
                },
                pincode: {
                    type: Number,
                    required: true
                },
                contact: {
                    type: Number,
                    required: true
                },
                HouseNo: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                fullAddress: {
                    type: String,
                    required: true
                }
            }
        ]
    });

module.exports = mongoose.model("Address", AddNewAddress)