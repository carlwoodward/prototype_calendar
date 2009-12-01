# How To

<pre><code>
  var c = new PrototypeCalendar(new Date(), $('container'), function(date, li) {li.addClassName('test');}, function(date) {alert(date)});
  c.render();
</pre></code>

## Parameters

- Start date
- Container to insert item into
- Callback called when an item is being inserted. You can add a class to the li if an date has any items on it
- Callback called when a user clicks on a date. Passes you the date so you can do any filtering.