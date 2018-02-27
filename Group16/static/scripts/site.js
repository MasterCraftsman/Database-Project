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
    document.getElementById('editProdForm').addEventListener('submit', editProductForm.submit);
    document.getElementById('editProdForm').addEventListener('reset', editProductForm.reset);
    document.getElementById('editRetailForm').addEventListener('submit', editRetailForm.submit);
    document.getElementById('editRetailForm').addEventListener('reset', editRetailForm.reset);
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

function addLocation(loc) {

}

function editLocation(loc, id) {
    return ajax('PUT', 'http://' + window.location.host + '/retail/' + id, loc)
        .catch(function (err) {
            console.error(err);
        });
}

class EditForm {
    constructor(div_container, form_id) {
        this.div_container = document.getElementById(div_container);
        this.form_id = form_id;
        this.form = document.getElementById(form_id);
    }

    show() {
        var row = document.querySelector('#editRow');
        if (row.style.display === 'none') {
            row.style.display = 'flex';
        }
        if (this.div_container.style.visibility === 'hidden') {
            this.div_container.style.visibility = 'visible';
        }
    }

    hide() {
        var row = document.querySelector('#editRow');
        if (row.style.display === 'flex') {
            row.style.display = 'none';
        }
        if (this.div_container.style.visibility === 'visible') {
            this.div_container.style.visibility = 'hidden';
        }
    }
}

class EditProductForm extends EditForm {

    set product(product) {
        this._product = product;
    }

    get product() {
        return this._product;
    }

    loadData(tds) {
        var product = {
            'pID': tds[0].innerHTML,
            'pName': tds[1].innerHTML,
            'pDepartment': tds[2].innerHTML,
            'pCost': Number(tds[3].innerHTML),
            'pWeight': tds[4].innerHTML
        };
        this.product = product;
    }

    populateForm() {
        if (this.product) {
            this.form.querySelector('#prodId').value = this.product.pID;
            this.form.querySelector('#prodName').value = this.product.pName;
            this.form.querySelector('#prodDept').value = this.product.pDepartment;
            this.form.querySelector('#prodCost').value = Number(this.product.pCost);
            this.form.querySelector('#prodWeight').value = this.product.pWeight;
        } else {
            alert('No product selected!');
        }
    }

    updateProduct() {
        var product = {
            'pID': this.form.querySelector('#prodId').value,
            'pName': this.form.querySelector('#prodName').value,
            'pDepartment': this.form.querySelector('#prodDept').value,
            'pCost': this.form.querySelector('#prodCost').value,
            'pWeight': this.form.querySelector('#prodWeight').value
        };
        this.product = product;
    }

    submit() {
        event.preventDefault();
        event.stopPropagation();
        editProductForm.updateProduct();
        var prod = editProductForm.product;
        editProductForm.form.reset();
        editProductForm.hide();
        editProduct(prod, prod.pID).then(function (data) {
            console.log(data);
            loadProductsTable();
        });
    }

    reset() {
        editProductForm.hide();
    }
}

class EditRetailForm extends EditForm {

    set location(location) {
        this._location = location;
    }

    get location() {
        return this._location;
    }

    loadData(tds) {
        var location = {
            'rID': tds[0].innerHTML,
            'rName': tds[1].innerHTML,
            'rStreet': tds[2].innerHTML,
            'rCity': tds[3].innerHTML,
            'rState': tds[4].innerHTML,
            'rZip': Number(tds[5].innerHTML)
        };
        this.location = location;
    }

    populateForm() {
        if (this.location) {
            this.form.querySelector('#retailId').value = this.location.rID;
            this.form.querySelector('#retailName').value = this.location.rName;
            this.form.querySelector('#retailStreet').value = this.location.rStreet;
            this.form.querySelector('#retailCity').value = this.location.rCity;
            this.form.querySelector('#retailState').value = this.location.rState;
            this.form.querySelector('#retailZip').value = Number(this.location.rZip);
        } else {
            alert('No location selected!');
        }
    }

    updateLocation() {
        var location = {
            'rID': this.form.querySelector('#retailId').value,
            'rName': this.form.querySelector('#retailName').value,
            'rStreet': this.form.querySelector('#retailStreet').value,
            'rCity': this.form.querySelector('#retailCity').value,
            'rState': this.form.querySelector('#retailState').value,
            'rZip': Number(this.form.querySelector('#retailZip').value)
        };
        this.location = location;
    }

    submit() {
        event.stopPropagation();
        event.preventDefault();
        editRetailForm.updateLocation();
        var loc = editRetailForm.location;
        editRetailForm.form.reset();
        editRetailForm.hide();
        editLocation(loc, loc.rID).then(function (data) {
            console.log(data);
            loadRetailTable();
        });
    }

    reset() {
        editRetailForm.hide();
    }
}

function loadProductsTable() {
    var prodTable = document.getElementById('products_table');
    var prodTableBody = prodTable.querySelector('tbody');
    while (prodTableBody.firstChild) {
        prodTableBody.removeChild(prodTableBody.firstChild);
    }
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
        var updateBtns = prodTable.querySelectorAll('button.update');
        updateBtns.forEach(function (btn) {
            btn.removeEventListener('click', updateProdBtn);
            btn.addEventListener('click', updateProdBtn);
        });
        var deleteBtns = prodTable.querySelectorAll('button.delete');
        deleteBtns.forEach(function (btn) {
            btn.removeEventListener('click', toggleProdDelete);
            btn.addEventListener('click', toggleProdDelete);
        });
    });
}

function loadRetailTable() {
    var retailTable = document.getElementById('retail_table');
    var retailTableBody = retailTable.querySelector('tbody');
    while (retailTableBody.firstChild) {
        retailTableBody.removeChild(retailTableBody.firstChild);
    }
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
        var updateBtns = retailTable.querySelectorAll('button.update');
        updateBtns.forEach(function (btn) {
            btn.removeEventListener('click', updateRetailBtn);
            btn.addEventListener('click', updateRetailBtn);
        });
        var deleteBtns = retailTable.querySelectorAll('button.delete');
        deleteBtns.forEach(function (btn) {
            //btn.removeEventListener('click', toggleRetailDelete);
            //btn.addEventListener('click', toggleRetailDelete);
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

function updateProdBtn(event) {
    var tr = this.parentElement.parentElement;
    editProductForm.show();
    editProductForm.loadData(tr.children);
    editProductForm.populateForm();
}

function updateRetailBtn(event) {
    var tr = this.parentElement.parentElement;
    editRetailForm.show();
    editRetailForm.loadData(tr.children);
    editRetailForm.populateForm();
}

function toggleProdDelete(event) {
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

function toggleNewRow(event) {
    var newRow = document.getElementById('newProdRetailRow');
    if (newRow.style.display === 'flex') {
        newRow.style.display = 'none';
    } else {
        newRow.style.display = 'flex';
    }
}

ready(function () {
    loadProductsTable();
    loadRetailTable();

    window.editProductForm = new EditProductForm('editProdDiv', 'editProdForm');
    window.editRetailForm = new EditRetailForm('editRetailDiv', 'editRetailForm');
    addListeners();
});
