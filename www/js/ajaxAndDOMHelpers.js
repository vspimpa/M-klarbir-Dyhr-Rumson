/**
 * DOM manipulating functions
 *
 */

// clear a form
function clearForm(model) {
  var modelForm = $('form[name="' + model + '"]');
  // remove id if any
  modelForm.removeAttr('id');
  // clear input and select values
  modelForm.find('input, select').val('');
}
  
// render all lists with content from DB
function renderAll() {
  getModelAndRenderList('product');
  getModelAndRenderList('shelf');
  getModelAndRenderList('warehouse');
}

// get a model list with new content
// and render it
function getModelAndRenderList(model) {
  get(model).done(function(documents) {
    console.log("new", model, "data");
    renderDocuments(model, documents);
  });
}

// build lists
function renderDocuments(model, documents) {
  console.log("rendering ", model, documents);
  // find this models list in the DOM
  var list = $('.' + model + 'Panel ul'),
      select = $('select[name="' + model +'"]');

  // empty the list, and any selects
  list.html('');
  // but dont remove selects default "none" option element
  select.find('option:not([name="default"])').remove();

  var listItem;
  for (var i = 0; i < documents.length; i++) {
    var oneDocument = documents[i];
    // create a list item, and append it to the correct list
    // give it an id which is <nameOfModel>-<documentId> (model + '-' + oneDocument._id)
    listItem = $('<li class="list-group-item" id="' + model + '-' + oneDocument._id + '">' +
                  '<div class="btn-group pull-right">' +
                    '<button class="btn btn-xs btn-default editBtn" title="Edit">' +
                      '<span class="glyphicon glyphicon-edit"></span>' +
                    '</button>' +
                    '<button class="btn btn-xs btn-danger deleteBtn" title="Delete">' +
                      '<span class="glyphicon glyphicon-remove"></span>' +
                    '</button>' +
                  '</div>' +
                  '<h4 class="list-group-item-heading">' + oneDocument.name + '</h4>' +
                  '<p class="list-group-item-text"></p>' +
                '</li>');

    // add any additional list content
    if (oneDocument.quantity) {
      listItem.find('p').append('<strong>Quantity: </strong> ' + oneDocument.quantity + '<br>');
    }
    if (oneDocument.shelf) {
      listItem.find('p').append('<strong>Shelf: </strong> ' + oneDocument.shelf.name + '<br>');
    }
    if (oneDocument.warehouse) {
      listItem.find('p').append('<strong>Warehouse: </strong> ' + oneDocument.warehouse.name + '<br>');
    }
    if (oneDocument.address) {
      listItem.find('p').append('<strong>Address: </strong> ' + oneDocument.address + '<br>');
    }
    list.append(listItem);


    // if there is a select for this model
    // rebuild its option list as well
    // if there is no select in DOM,
    // jQuery will simply do nothing
    var optionText = oneDocument.name;
    if (oneDocument.warehouse) {
      // show warehouse name on all shelves to make it clearer
      optionText += ' | ' + oneDocument.warehouse.name;
    }
    select.append('<option value="' + oneDocument._id + '">' +
                    optionText +
                  '</option>');
  }
}


/**
 * Ajax functions
 *
 */

// ajax helper
function doAjax(model, method, id, data) {
  var url = '/api/' + model;

  // if we have an id, add it to the URL
  if (id) {
    url += '/' + id;
  }

  // if we have no data, make it an empty object
  if (!data) {
    data = {};
  }

  return $.ajax({
    // type of request (POST, GET, PUT, DELETE)
    method: method,
    // destination of request
    url: url,
    // type of response
    dataType: 'json',
    // possible data payload
    data: data
  });
}

// Create (POST)
function create(model, data) {
  return doAjax(model, 'POST', false, data);
}

// Read (GET)
function get(model, id) {
  // use mongresto populate (if allowed by model)
  if (!id && model == 'product') {
    id = JSON.stringify({_populate: 'shelf shelf.warehouse'});
  }
  if (!id && model == 'shelf') {
    id = JSON.stringify({_populate: 'warehouse'});
  }
  return doAjax(model, 'GET', id);
}

// Update (PUT)
function update(model, id, data) {
  return doAjax(model, 'PUT', id, data);
}

// Delete (DELETE)
function destroy(model, id) {
  return doAjax(model, 'DELETE', id);
}