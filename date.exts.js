Date.addDays = function (date, amount) {
    var tzOff = date.getTimezoneOffset() * 60 * 1000,
      t = date.getTime(),
      d = new Date(),
      tzOff2;

    t += (1000 * 60 * 60 * 24) * amount;
    d.setTime(t);

    tzOff2 = d.getTimezoneOffset() * 60 * 1000;
    if (tzOff != tzOff2) {
      var diff = tzOff2 - tzOff;
      t += diff;
      d.setTime(t);
    }

    return d;
  }