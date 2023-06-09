var dataList = document.getElementById('ingredients');
var request = new XMLHttpRequest();

request.onreadystatechange = function(response) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      var jsonOptions = JSON.parse(request.responseText);
      jsonOptions.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item;
        dataList.appendChild(option);
      });
    }
  }
};


// Set up and make the request.
request.open('GET', '/api/ingredients', true);
request.send();