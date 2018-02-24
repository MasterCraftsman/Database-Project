var ready = function (fn) {

    // Sanity check
    if (typeof fn !== 'function') return;

    if (document.readyState === 'complete') {
        return fn();
    }

    document.addEventListener('DOMContentLoaded', fn, false);
};

function ajax(method, url, body) {

    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        method = String(method).toUpperCase();
        req.open(method, url);
        
        if (method === 'POST' || method === 'PUT') {
            req.setRequestHeader('Content-Type', 'application/json');
        }

        req.onload = function () {
            if (Number(req.status) === 200) {
                var res = req.response || req.responseText;
                resolve(res);
            } else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function () {
            reject(Error('Network Error'));
        };

        if (body) {
            req.send(JSON.stringify(body));
        } else {
            req.send();
        }
    });
}

function getAllProducts() {
    return ajax('GET', 'http://' + window.location.host + '/products/')
        .catch(function (err) {
            console.error(err);
        });
}

function addProduct(prod) {
    return ajax('POST', 'http://' + window.location.host + '/products/', prod)
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
    getAllRetailLocations().then(function (data) {
        locations = JSON.parse(data);
        locations.forEach(function (loc) {
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

function newProdSubmit(event) {
    event.stopPropagation();
    var prodName = this.querySelector('input#prodName').value;
    var prodDept = this.querySelector('input#prodDept').value;
    var prodPrice = this.querySelector('input#prodPrice').value;
    var prodWeight = this.querySelector('input#prodWeight').value;
    var product = {
        'pName': prodName,
        'pDepartment': prodDept,
        'pCost': prodPrice,
        'pWeight': prodWeight
    };
    console.log(product);
    addProduct(product).then(function(data) {
        console.log(data);
    });
}

function toggleNewRow(event) {
    console.log(this);
    var newRow = document.getElementById('newProdRetailRow');
    if(newRow.style.display === 'flex') {
        newRow.style.display = 'none';
    } else {
        newRow.style.display = 'flex';
    }
}

ready(function () {
    loadProductsTable();
    loadRetailTable();

    document.getElementById('newProdForm').addEventListener('submit', newProdSubmit);
    document.getElementById('newProdRetailBtn').addEventListener('click', toggleNewRow);
});
