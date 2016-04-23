module.exports = function(mongoose){

  // Shelf mongoose schema
  var Shelf = mongoose.Schema({
    name: {type: String, required: true},
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true
    }
  });

  // make combination of name & shelf unique using an index
  Shelf.index({ name: 1, warehouse: 1}, { unique: true });

  // Create & return model
  return mongoose.model("Shelf", Shelf);
};