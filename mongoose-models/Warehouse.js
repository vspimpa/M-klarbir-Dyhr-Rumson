module.exports = function(mongoose){

  // Warehouse mongoose schema
  var Warehouse = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    address: {type: String, required: true}
  });

  // Create & return model
  return mongoose.model("Warehouse", Warehouse);
};