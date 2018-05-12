// throttle function
export default (fn, threshhold, scope) => {
  threshhold || (threshhold = 250);
  let last,
      deferTimer;

  return function() {
    const context = scope || this,
          now = +new Date(),
          args = arguments;

    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};
