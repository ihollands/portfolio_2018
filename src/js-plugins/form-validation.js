// -----------------------------------------------------------------------------
// Hyperform
//
// Hyperform is a pure JS implementation of the HTML 5 form validation API.
//
// Docs: https://hyperform.js.org/docs
// -----------------------------------------------------------------------------
import hyperform from 'hyperform';

export default () => {

  if ($('form').length) {

    // Add required for radios that have [data-required] set to true on the <fieldset>
    $('form .radios[data-required="true"]').map((index, el) => {
      $(el).find('input').first().prop('required', true);
    });

    // Add required for checkboxes that have [data-required] set to true on the <fieldset>
    $('form .checks[data-required="true"]').map((index, el) => {
      $(el).find('input').prop('required', true);
    });

    // Override email validation message for invalid email address
    $('form input[type="email"]').map((index, el) => {
      // setMessage takes three parameters (element, validator, message)
      hyperform.setMessage(el, 'typeMismatch', 'Please enter a valid email address.');
    });

    // Override validation message for checkboxes
    $('input[type="checkbox"]').map((index, el) => {
      // setMessage takes three parameters (element, validator, message)
      hyperform.setMessage(el, 'valueMissing', 'Please select at least one of these options.');
    });

    // Call hyperform
    hyperform(window, {
      classes: {
        warning: 'error-message',
        validated: '-validated',
        valid: '-valid',
        invalid: '-invalid'
      }
    });

    $('form')
      // Move error messages for checks and radios after the label instead of after the input
      .on('validate', (e) => {
        setTimeout(() => {

          $(e.currentTarget).find('.radios[data-required="true"]').map((index, el) => {

            $(el).find('.error-message').map((index, el) => {
              if (index === 0) {
                $(el).insertAfter($(el).parents('fieldset').find('legend'));
              } else {
                $(el).remove();
              }
            });

          });

          $(e.currentTarget).find('.checks[data-required="true"]').map((index, el) => {

            $(el).find('.error-message').map((index, el) => {
              if (index === 0) {
                $(el).insertAfter($(el).parents('fieldset').find('legend'));
              } else {
                $(el).remove();
              }
            });

          });

        }, 50);
      })
      // JS to enable required checkbox groups
      .on('change', '.checks[data-required="true"] input', (e) => {
        setTimeout(() => {
          $(e.currentTarget).parents('fieldset').find('.check .error-message').remove();
          if ($(e.currentTarget).parents('fieldset').find('input:checked').length) {
            $(e.currentTarget).parents('fieldset').find('.error-message').hide();
            $(e.currentTarget).parents('fieldset').find('input').prop('required', false);
          } else {
            $(e.currentTarget).parents('fieldset').find('.error-message').show();
            $(e.currentTarget).parents('fieldset').find('input').prop('required', true);
          }
        }, 50);
      })
      // Remove error-messages for radios after one is selected
      .on('change', '.radios[data-required="true"] input', (e) => {
        setTimeout(() => {
          $(e.currentTarget).parents('fieldset').find('.radio .error-message').remove();
        }, 50);
      })
    ;

  }
};
