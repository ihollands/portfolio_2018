// -----------------------------------------------------------------------------
// Component Includes
// -----------------------------------------------------------------------------
import formValidation from './js-plugins/form-validation';
import siteHeader from './components/site-header/site-header';

(($) => {

  // Document Ready
  $(() => {

    siteHeader();

    formValidation();

  });

})($);
