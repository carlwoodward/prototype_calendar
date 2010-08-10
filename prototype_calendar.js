var PrototypeCalendar = Class.create({
  initialize: function(date, container, insert_callback, click_callback) {
    var self = this;
    self.date = new Date(date.getFullYear(), date.getMonth(), 1);
    self.container = container;
    self.insert_callback = insert_callback == null ? function(){} : insert_callback;
    self.click_callback = click_callback == null ? function(){} : click_callback;
  },
  
  // protocol: movement
  
  change_month_link: function(class, name, set_date_func) {
    var self = this;
    var span = new Element('span').update(name);
    var a = new Element('a', {'href': 'javascript: void(0)'}).addClassName(class).update(span);
    a.observe('click', function(e) {
      e.stop();
      set_date_func();
      self.render();
    });
    return a;
  },
  
  prev_link: function() {
    var self = this;
    return self.change_month_link('previous', 'Previous', function() { self.date = self.previous_month(); });
  },
  
  next_link: function() {
    var self = this;
    return self.change_month_link('next', 'Next', function() { self.date = self.next_month(); });
  },
  
  // protocol: rendering
  
  render: function() {
    var self = this;
    var calendar = new Element('div').addClassName('prototype_calendar');
    self.container.update('');
    self.render_month_title(calendar);
    self.render_day_titles(calendar);
    self.render_days(calendar);
    self.container.insert(calendar);
  },
  
  render_month_title: function(calendar) {
    var self = this;
    var div = new Element('div').addClassName('month_title');
    var h3 = new Element('h3').update(self.month_name() + ' ' + self.date.getFullYear().toString());
    div.insert(self.prev_link());
    div.insert(h3);
    div.insert(self.next_link());
    calendar.insert(div);
  },
  
  render_day_titles: function(calendar) {
    var self = this;
    var ul = new Element('ul').addClassName('titles');
    self.days_titles().each(function(day) {
      ul.insert(new Element('li').update(day));
    });
    calendar.insert(ul);
  },
  
  render_days: function(calendar) {
    var self = this;
    var ul = new Element('ul').addClassName('days');
    var clear_count = 0;
    var d = self.clone_date();
    self.insert_days(ul, clear_count, d);
    calendar.insert(ul);
  },
  
  insert_days: function(ul, clear_count, date) {
    var self = this;
    for(var i = 0; i < date.getDay(); i++) { ul.insert(self.blank_day()); clear_count += 1; }
    while(date < self.next_month()) {
      var formatted_date = formatDate(date, 'yyyy/MM/dd')
      var li = new Element('li').addClassName('day').update(self.get_link(date));
      li.setAttribute('data-date', formatted_date);
      self.add_clear_and_callbacks(li, date, clear_count);
      ul.insert(li);
      date = self.next_date(date);
      clear_count += 1;
    }
  },
  
  blank_day: function() {
    return new Element('li').addClassName('blank').update('&nbsp;');
  },
  
  // protocol: helpers
  
  get_link: function(date) {
    var self = this;
    var a = new Element('a', {'href': 'javascript:void(0);'}).update(date.getDate());
    a.observe('click', function(ev) {
      ev.stop();
      self.click_callback(date, a);
    });
    return a;
  },
  
  add_clear_and_callbacks: function(li, date, clear_count) {
    var self = this;
    if(clear_count % 7 == 0) li.addClassName('clear');
    self.insert_callback(date, li);
  },
  
  next_date: function(date) {
    var self = this;
    return new Date(self.date.getFullYear(), self.date.getMonth(), date.getDate() + 1);
  },
  
  clone_date: function() {
    var self = this;
    return new Date(self.date.getFullYear(), self.date.getMonth(), 1);
  },
  
  previous_month: function() {
    var self = this;
    return new Date(self.date.getFullYear(), self.date.getMonth() - 1, 1);
  },
  
  next_month: function() {
    var self = this;
    return new Date(self.date.getFullYear(), self.date.getMonth() + 1, 1);
  },
  
  months: function() {
    var self = this;
    return $A(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
  },
  
  days_titles: function() {
    var self = this;
    return $A(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  },
  
  month_name: function() {
    var self = this;
    return self.months()[self.date.getMonth()];
  }
});