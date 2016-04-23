module.exports = function(mongoose){

  // Product mongoose schema
  var Product = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    quantity: {type: Number, required: true},
    shelf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shelf',
      required: true
    }
  });

  // Create & return model
  return mongoose.model("Product", Product);
};