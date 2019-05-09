const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const employeeSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        name: {type: String, required: true},
        dob: {type: Date, required: true},
        salary: {type: Number, required: true},
        skills: [{type: String, required: true}],
        profilePhoto: String
    }
);
employeeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Employee', employeeSchema);