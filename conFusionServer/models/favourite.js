const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dishes'
    }]
}, {
    timestamps: true
});

var Dishes = mongoose.model('Favourite', favouriteSchema);

module.exports = Dishes;