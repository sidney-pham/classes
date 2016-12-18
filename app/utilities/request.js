export function get(url, cb) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() { 
    if (this.readyState == 4) {
      if (this.status == 200) {
        cb(null, this.responseText);
      } else {
        cb(this.status || 403, this.responseText);
      }
    }
  }
  req.open('GET', url, true);
  req.send(null);
}

export function post(url, data, cb) {
  let req = new XMLHttpRequest();
  let params = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');

  req.onreadystatechange = function() { 
    if (this.readyState == 4) {
      if (this.status == 200) {
        cb(null, this.responseText);
      } else {
        cb(this.status || 403, this.responseText);
      }
    }
  }

  req.open('POST', url, true);

  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  req.setRequestHeader('Content-Length', params.length);

  req.send(params);
}
