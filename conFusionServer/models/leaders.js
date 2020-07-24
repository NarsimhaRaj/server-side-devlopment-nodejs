const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default:false      
    },
    description: {
        type: String,
        required: true      
    }
},{
    timestamps: true
});


module.exports = mongoose.model('Leader', leaderSchema);