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
            if (Number(req.status) === 200 || Number(req.status) === 201) {
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
    document.getElementById('newProdForm').addEventListener('submit', newProductForm.submit);
    document.getElementById('newProdForm').addEventListener('reset', newProductForm.reset);
    document.getElementById('newProdBtn').addEventListener('click', newProdBtn);
    document.getElementById('newRetailForm').addEventListener('submit', newRetailForm.submit);
    document.getElementById('newRetailForm').addEventListener('reset', newRetailForm.reset);
    document.getElementById('newRetailBtn').addEventListener('click', newRetailBtn);
    document.getElementById('newSalesForm').addEventListener('submit', newSalesForm.submit);
    document.getElementById('newSalesForm').addEventListener('reset', newSalesForm.reset);
    document.getElementById('newSalesBtn').addEventListener('click', newSalesBtn);
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

function getProductById(id) {
    return ajax('GET', 'http://' + window.location.host + '/products/' + id)
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

function getLocationById(id) {
    return ajax('GET', 'http://' + window.location.host + '/retail/' + id)
        .catch(function (err) {
            console.error(err);
        });
}

function addLocation(loc) {
    return ajax('POST', 'http://' + window.location.host + '/retail/', loc)
        .catch(function (err) {
            console.error(err);
        });
}

function editLocation(loc, id) {
    return ajax('PUT', 'http://' + window.location.host + '/retail/' + id, loc)
        .catch(function (err) {
            console.error(err);
        });
}

function deleteLocation(id) {
    return ajax('DELETE', 'http://' + window.location.host + '/retail/' + id)
        .catch(function (err) {
            console.error(err);
        });
}

function getAllSales() {
    return ajax('GET', 'http://' + window.location.host + '/sells/')
        .catch(function (err) {
            console.error(err);
        });
}

function addSale(sale) {
    return ajax('POST', 'http://' + window.location.host + '/sells/', sale)
        .catch(function (err) {
            console.error(err);
        });
}

class NewForm {
    constructor(div_container, form_id) {
        this.div_container = document.getElementById(div_container);
        this.form_id = form_id;
        this.form = document.getElementById(form_id);
    }

    show() {
        var row = document.querySelector('#newRow');
        if (row.style.display === 'none') {
            row.style.display = 'flex';
        }
        if (this.div_container.style.visibility === 'hidden') {
            this.div_container.style.visibility = 'visible';
        }
    }

    hide() {
        var row = document.querySelector('#newRow');
        if (row.style.display === 'flex') {
            row.style.display = 'none';
        }
        if (this.div_container.style.visibility === 'visible') {
            this.div_container.style.visibility = 'hidden';
        }
    }
}

class NewProductForm extends NewForm {
    set product(product) {
        this._product = product;
    }

    get product() {
        return this._product;
    }

    updateProduct() {
        var product = {
            //'pID': this.form.querySelector('#prodId').value,
            'pName': this.form.querySelector('#prodName').value,
            'pDepartment': this.form.querySelector('#prodDept').value,
            'pCost': Number(this.form.querySelector('#prodCost').value),
            'pWeight': this.form.querySelector('#prodWeight').value
        };
        this.product = product;
    }

    submit() {
        event.preventDefault();
        event.stopPropagation();
        newProductForm.updateProduct();
        var prod = newProductForm.product;
        newProductForm.form.reset();
        newProductForm.hide();
        addProduct(prod).then(function (data) {
            console.log(data);
            loadProductsTable();
        });
    }

    reset() {
        newProductForm.hide();
    }
}

class NewRetailForm extends NewForm {
    set location(location) {
        this._location = location;
    }

    get location() {
        return this._location;
    }

    updateLocation() {
        var location = {
            //'rID': this.form.querySelector('#retailId').value,
            'rName': this.form.querySelector('#retailName').value,
            'rStreet': this.form.querySelector('#retailStreet').value,
            'rCity': this.form.querySelector('#retailCity').value,
            'rState': this.form.querySelector('#retailState').value,
            'rZip': Number(this.form.querySelector('#retailZip').value)
        };
        this.location = location;
    }

    submit() {
        event.preventDefault();
        event.stopPropagation();
        newRetailForm.updateLocation();
        var loc = newRetailForm.location;
        console.log(loc);
        newProductForm.form.reset();
        newProductForm.hide();
        addLocation(loc).then(function (data) {
            console.log(data);
            loadRetailTable();
        });
    }

    reset() {
        newRetailForm.hide();
    }
}

class NewSalesForm extends NewForm {

    show() {
        if (this.div_container.style.visibility === 'hidden') {
            this.div_container.style.visibility = 'visible';
        }
    }

    hide() {
        if (this.div_container.style.visibility === 'visible') {
            this.div_container.style.visibility = 'hidden';
        }
    }

    get sale() {
        return this._sale;
    }

    set sale(sale) {
        this._sale = sale;
    }

    loadProductSelector() {
        getAllProducts().then(function (data) {
            var products = JSON.parse(data);
            buildSelector('prodSelector', products);
        });
    }

    loadLocationSelector() {
        getAllRetailLocations().then(function (data) {
            var locations = JSON.parse(data);
            buildSelector('locSelector', locations);
        });
    }

    updateSale() {
        var sale = {
            'Sales_Price': Number(this.form.querySelector('#salesPrice').value),
            'Qty': Number(this.form.querySelector('#salesQty').value),
/*            'Date': new Date().toLocaleString('en-US', {
                hour12: false
            }),*/
            'Date': new Date().toISOString(),
            'Retail_Locations_rID': this.form.querySelector('#locSelector').value,
            'Products_pID': this.form.querySelector('#prodSelector').value
        };
        console.log(sale);
        this.sale = sale;
    }

    submit() {
        event.stopPropagation();
        event.preventDefault();
        newSalesForm.updateSale();
        var sale = newSalesForm.sale;
        newSalesForm.form.reset();
        newSalesForm.hide();
        addSale(sale).then(function(data) {
           console.log(data);
            loadSalesTable();
        });
    }

    reset() {
        newSalesForm.hide();
    }
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
            btn.removeEventListener('click', toggleRetailDelete);
            btn.addEventListener('click', toggleRetailDelete);
        });
    });
}

function loadSalesTable() {
    var salesTable = document.getElementById('sales_table');
    var salesTableBody = salesTable.querySelector('tbody');
    while (salesTableBody.firstChild) {
        salesTableBody.removeChild(salesTableBody.firstChild);
    }
    var prods, locs;
    // uggggghhhhh
    getAllProducts().then(function (data) {
        prods = JSON.parse(data);
        getAllRetailLocations().then(function (data) {
            locs = JSON.parse(data);
            getAllSales().then(function (data) {
                sales = JSON.parse(data);
                sales.forEach(function (sale) {
                    var tr = document.createElement('tr');
                    tr.appendChild(createTd(sale.transactionID));
                    if (prods) {
                        var p = prods.find(function (el) {
                            return Number(el.pID) === Number(sale.Products_pID);
                        });
                        tr.appendChild(createTd(p.pName));
                    } else {
                        tr.appendChild(createTd(sale.Products_pID));
                    }
                    if (locs) {
                        var l = locs.find(function (el) {
                            return Number(el.rID) === Number(sale.Retail_Locations_rID);
                        });
                        tr.appendChild(createTd(l.rName));
                    } else {
                        tr.appendChild(createTd(sale.Retail_Locations_rID));
                    }
                    tr.appendChild(createTd(sale.Sales_Price));
                    tr.appendChild(createTd(sale.Qty));
                    var d = new Date(sale.Date);
                    tr.appendChild(createTd(d.toLocaleDateString()));
                    salesTableBody.appendChild(tr);
                });
            });
        });
    });
    /*    getAllSales().then(function (data) {
            sales = JSON.parse(data);
            var prod, loc;
            sales.forEach(function (sale) {
                getProductById(sale.Products_pID).then(function (data) {
                    prod = JSON.parse(data);
                    getLocationById(sale.Retail_Locations_rID).then(function (data) {
                        loc = JSON.parse(data);
                        var tr = document.createElement('tr');
                        tr.appendChild(createTd(sale.transactionID));
                        tr.appendChild(createTd(prod[0].pName));
                        tr.appendChild(createTd(loc[0].rName));
                        tr.appendChild(createTd(sale.Sales_Price));
                        tr.appendChild(createTd(sale.Qty));
                        var d = new Date(sale.Date);
                        tr.appendChild(createTd(d.toLocaleDateString()));
                        salesTableBody.appendChild(tr);
                    });
                });

            });
        });*/
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

function buildSelector(id, objs) {
    var selector = document.getElementById(id);
    if (selector) {
        objs.forEach(function (obj) {
            var opt = document.createElement('option');
            var i = obj.rID || obj.pID;
            var n = obj.rName || obj.pName;
            opt.value = i;
            opt.innerHTML = n;
            selector.appendChild(opt);
        });
    }
}

function newProdBtn() {
    newProductForm.show();
}

function newRetailBtn() {
    newRetailForm.show();
}

function newSalesBtn() {
    newSalesForm.show();
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
            //location.reload();
            loadProductsTable();
        });
    }
}

function toggleRetailDelete(event) {
    var tr = this.parentElement.parentElement;
    var td_list = tr.children;
    var id = td_list[0].innerHTML;
    var name = td_list[1].innerHTML;
    var message = 'Are you sure you want to delete ' + name + '?';
    if (confirm(message)) {
        deleteLocation(id).then(function (data) {
            console.log(data);
            loadRetailTable();
        });
    }
}

ready(function () {
    loadProductsTable();
    loadRetailTable();
    loadSalesTable();

    window.editProductForm = new EditProductForm('editProdDiv', 'editProdForm');
    window.editRetailForm = new EditRetailForm('editRetailDiv', 'editRetailForm');
    window.newProductForm = new NewProductForm('newProdDiv', 'newProdForm');
    window.newRetailForm = new NewRetailForm('newRetailDiv', 'newRetailForm');
    window.newSalesForm = new NewSalesForm('newSalesDiv', 'newSalesForm');
    addListeners();
    newSalesForm.loadProductSelector();
    newSalesForm.loadLocationSelector();
});
