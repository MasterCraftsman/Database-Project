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

function addListeners() {
    document.getElementById('newProdForm').addEventListener('submit', newProdSubmit);
    document.getElementById('newProdRetailBtn').addEventListener('click', toggleNewRow);
    document.getElementById('editProdForm').addEventListener('submit', editProdSubmit);
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

function editProduct(prod, id) {
    return ajax('PUT', 'http://' + window.location.host + '/products/' + id, prod)
        .catch(function (err) {
            console.error(err);
        });
}

function deleteProduct(id) {
    return ajax('DELETE', 'http://' + window.location.host + '/products/' + id)
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
    var prodTableBody = prodTable.querySelector('tbody');
    getAllProducts().then(function (data) {
        products = JSON.parse(data);
        products.forEach(function (prod) {
            var tr = document.createElement('tr');
            tr.appendChild(createTd(prod.pID));
            tr.appendChild(createTd(prod.pName));
            tr.appendChild(createTd(prod.pDepartment));
            tr.appendChild(createTd(prod.pCost));
            tr.appendChild(createTd(prod.pWeight));
            var td_update = document.createElement('td');
            td_update.appendChild(createUpdateButton());
            tr.appendChild(td_update);
            var td_delete = document.createElement('td');
            td_delete.appendChild(createDeleteButton());
            tr.appendChild(td_delete);
            prodTableBody.appendChild(tr);
        });
        var updateBtns = document.querySelectorAll('button.update');
        updateBtns.forEach(function (btn) {
            btn.removeEventListener('click', toggleProductForm);
            btn.addEventListener('click', toggleProductForm);
        });
        var deleteBtns = document.querySelectorAll('button.delete');
        deleteBtns.forEach(function (btn) {
            btn.removeEventListener('click', toggleDeleteForm);
            btn.addEventListener('click', toggleDeleteForm);
        });
    });
}

function loadRetailTable() {
    var retailTable = document.getElementById('retail_table');
    var retailTableBody = retailTable.querySelector('tbody');
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
            var td_update = document.createElement('td');
            td_update.appendChild(createUpdateButton());
            tr.appendChild(td_update);
            var td_delete = document.createElement('td');
            td_delete.appendChild(createDeleteButton());
            tr.appendChild(td_delete);
            retailTableBody.appendChild(tr);
        });
    });
}

function createTd(inner_text) {
    var td = document.createElement('td');
    td.innerHTML = inner_text;
    return td;
}

function createUpdateButton() {
    var button = document.createElement('button');
    button.innerHTML = 'Update';
    button.classList.add('btn');
    button.classList.add('btn-success');
    button.classList.add('btn-sm');
    button.classList.add('update');
    return button;
}

function createDeleteButton() {
    var button = document.createElement('button');
    button.innerHTML = 'Delete';
    button.classList.add('btn');
    button.classList.add('btn-danger');
    button.classList.add('btn-sm');
    button.classList.add('delete');
    return button;
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
    addProduct(product).then(function (data) {
        console.log(data);
    });
}

function toggleProductForm(event) {
    var tr = this.parentElement.parentElement;
    showProdDiv();
    loadProdEditForm(tr.children);
}

function loadProdEditForm(tds) {
    var form = document.getElementById('editProdForm');
    form.querySelector('#prodId').value = tds[0].innerHTML;
    form.querySelector('#prodName').value = tds[1].innerHTML;
    form.querySelector('#prodDept').value = tds[2].innerHTML;
    form.querySelector('#prodPrice').value = Number(tds[3].innerHTML);
    form.querySelector('#prodWeight').value = tds[4].innerHTML;
}

function editProdSubmit(event) {
    event.stopPropagation();
    console.log(this);
    var prodId = this.querySelector('input#prodId').value;
    var prodName = this.querySelector('input#prodName').value;
    var prodDept = this.querySelector('input#prodDept').value;
    var prodPrice = this.querySelector('input#prodPrice').value;
    var prodWeight = this.querySelector('input#prodWeight').value;
    var product = {
        'pID': Number(prodId),
        'pName': prodName,
        'pDepartment': prodDept,
        'pCost': Number(prodPrice),
        'pWeight': prodWeight
    };
    this.reset();
    editProduct(product, prodId).then(function (data) {
        console.log(data);
    });
}

function toggleDeleteForm(event) {
    var tr = this.parentElement.parentElement;
    var td_list = tr.children;
    var id = td_list[0].innerHTML;
    var name = td_list[1].innerHTML;
    var message = 'Are you sure you want to delete ' + name + '?';
    if (confirm(message)) {
        deleteProduct(id).then(function (data) {
            console.log(data);
            location.reload();
        });
    }
}

function showProdDiv() {
    var editProdDiv = document.getElementById('editProdDiv');
    if (editProdDiv.style.visibility === 'hidden') {
        editProdDiv.style.visibility = 'visible';
    }
}

function toggleNewRow(event) {
    var newRow = document.getElementById('newProdRetailRow');
    if (newRow.style.display === 'flex') {
        newRow.style.display = 'none';
    } else {
        newRow.style.display = 'flex';
    }
}

ready(function () {
    addListeners();
    loadProductsTable();
    loadRetailTable();
});
