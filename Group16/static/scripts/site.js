var ready = function (fn) {

    // Sanity check
    if (typeof fn !== 'function') return;

    if (document.readyState === 'complete') {
        return fn();
    }

    document.addEventListener('DOMContentLoaded', fn, false);
};

function ajax(method, url) {

    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(String(method).toUpperCase(), url);

        req.onload = function () {
            if (Number(req.status) === 200) {
                resolve(req.response);
            } else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function () {
            reject(Error('Network Error'));
        };

        req.send();
    });
}

function getAllProducts() {
    return ajax('GET', 'http://' + window.location.host + '/products/')
        .catch(function (err) {
            console.error(err);
        });
}

function getAllRetailLocations() {
    return ajax('GET', 'http://' + window.location.host + '/retail/')
        .catch(function (err) {
            console.error(err);
        });
}

function loadProductsTable() {
    var prodTable = document.getElementById('products_table');
    var prodTableBody = prodTable.firstElementChild;
    getAllProducts().then(function (data) {
        products = JSON.parse(data);
        products.forEach(function (prod) {
            var tr = document.createElement('tr');
            tr.appendChild(createTd(prod.pID));
            tr.appendChild(createTd(prod.pName));
            tr.appendChild(createTd(prod.pDepartment));
            tr.appendChild(createTd(prod.pCost));
            tr.appendChild(createTd(prod.pWeight));
            prodTableBody.appendChild(tr);
        });

    });
}

function loadRetailTable() {
    var retailTable = document.getElementById('retail_table');
    var retailTableBody = retailTable.firstElementChild;
    getAllRetailLocations().then(function(data) {
        locations = JSON.parse(data);
        locations.forEach(function(loc) {
           var tr = document.createElement('tr');
            tr.appendChild(createTd(loc.rID));
            tr.appendChild(createTd(loc.rName));
            tr.appendChild(createTd(loc.rStreet));
            tr.appendChild(createTd(loc.rCity));
            tr.appendChild(createTd(loc.rState));
            tr.appendChild(createTd(loc.rZip));
            retailTableBody.appendChild(tr);
        });
    });
}

function createTd(inner_text) {
    var td = document.createElement('td');
    td.innerHTML = inner_text;
    return td;
}

ready(function () {
    loadProductsTable();
    loadRetailTable();
});
