/**
 * Please check js/ajaxAndDOMHelpers.js
 * for all other functions
 *
 */

// waiting for the DOM to finish loading (DOM Ready)
$(function () {
  // DOM is now loaded (ready);
  console.log("DOM ready!");

  // render all lists once on DOM ready
  renderAll();



  /**
   * Form submit handler
   *
   */

  // all forms submit the same way
  $('form').submit(function(event) {
    event.preventDefault();

    // all form inputs
    var inputs = $(this).find('input, select'),
        // the form name attribute
        formName = $(this).attr('name'),
        // all input data will be collected here
        formData = {};

    // use jQuery .each() to loop inputs,
    // and save their values in the formData object
    inputs.each(function() {
      var oneInput = $(this);
      formData[oneInput.attr('name')] = oneInput.val();
    });

    // all collected form data, grouped by input[name]
    console.log("submitting", formName, "formData", formData);

    // product quantities need to be summed up
    if (formName == "product") {
      // make sure quantity is a number (could be empty string)
      formData.quantity = formData.quantity/1;
      // add new quantity to current in stock
      formData.quantity += formData.newQuantity/1;
    }

    // Send to db
    if (formData._id) {
      // get the current model id
      formModelId = formData._id;
      console.log("updating " + formName + ' ' + formModelId);
      update(formName, formModelId, formData).done(function() {
        // clear the form on success
        clearForm(formName);
        renderAll(); // refresh lists
      }).fail(function(err) {
        alert("Something went wrong, message:\n" + err.responseJSON._error.errmsg);
      });
    } else {
      // remove empty _id to not confuse backend
      delete formData._id;
      console.log("creating " + formName);
      create(formName, formData).done(function() {
        // clear the form on success
        clearForm(formName);
        renderAll(); // refresh lists
      }).fail(function(err) {
        alert("Something went wrong, message:\n" + err.responseJSON._error.errmsg);
      });
    }
  });
  


  /**
   * Dynamic click handlers for model lists (edit/delete)
   *
   */
  
  // edit documents
  $('.list-group').on('click', '.editBtn', function() {
    // find out which item was clicked
    var listItemClicked = $(this).parents('.list-group-item'),
        // remember, id is <nameOfModel>-<documentId> (model + '-' + oneDocument._id)
        listItemId = listItemClicked.attr('id').split('-'), // split with '-'
        listModel = listItemId[0],
        documentId = listItemId[1];

    // click the correct nav item to show the form
    $('a[href="' + listModel + '"]').click();

    // fill the correct form with data from the database
    get(listModel, documentId).done(function(oneDocument) {
      // find any input or select with a name attribute equal to i
      // and give it the value of the property on the document (oneDocument[i])
      for (var i in oneDocument) {
        $('form[name="' + listModel + '"]')
          .find('input[name="' + i + '"], select[name="' + i + '"]')
          .val(oneDocument[i]);
      }
    });
  });

  // delete documents
  $('.list-group').on('click', '.deleteBtn', function() {
    // find out which item was clicked
    var listItemClicked = $(this).parents('.list-group-item'),
        // remember, id is <nameOfModel>-<documentId> (model + '-' + oneDocument._id)
        listItemId = listItemClicked.attr('id').split('-'), // split with '-'
        listModel = listItemId[0],
        documentId = listItemId[1];

    // delete document in database and then re-render all lists
    destroy(listModel, documentId)
    .done(function() {
      renderAll(); // render all lists again
    })
    .fail(function() {
      renderAll(); // render all lists again
    });
  });



  /**
   * User nav click handlers
   *
   */

  // remember current form, starts on form[name="warehouse"]
  var currentForm = 'warehouse';
  // show/hide forms on click()
  $('.formPanel a').click(function(event) {
    // prevent link default behaviour
    event.preventDefault();

    // empty form user is leaving
    clearForm(currentForm);
    // set current form to new value
    var panelToShow = $(this).attr('href');
    currentForm = panelToShow;
    // hide all forms in the panel
    $('.formPanel').find('form').hide();
    // then show the correct one
    $('.formPanel').find('.' + panelToShow + 'Form').show();

    // add .active class to link parent
    $('.formPanel li').removeClass('active');
    $(this).parent().addClass('active');
  });
});