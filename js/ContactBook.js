/// <reference path="jquery-3.1.1.min.js" />
/// <reference path="Drag_and_Drop.js"/> 

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;

$(document).ready(function () {
    contactsNamespace.initialize();
});

(function () {
    this.contactsNamespace = this.contactsNamespace || {};
    var ns = this.contactsNamespace;
    var currentRecord;
    var db;

    ns.initialize = function () {
        $("#btnSave").on('click', ns.save);
        var request = indexedDB.open("IftekharDB", 1);

        request.onupgradeneeded = function (response) {
            var options = { keypath: "id", autoIncrement: true };
            response.currentTarget.result.createObjectStore("contacts", options);
        }
        request.onsuccess = function (response) {
            db = request.result;
            ns.display();
        }        
    }

    ns.display = function () {
        $("#currentAction").html('Survey Report');
        currentRecord = { key: null, contact: {} };
        displayCurrentRecord();

        var trans = db.transaction('contacts', 'readonly');
        var request = trans.objectStore("contacts").openCursor();
        var results = [];

        request.onsuccess = function (response) {
            var cursor = response.target.result;
            if (!cursor) {
                bindToGrid(results);
                return;
            }
            results.push({ key: cursor.key, contact: cursor.value });
            cursor.continue();
        }        
    }

    function bindToGrid(results) {
        var html = "";
        for (var i = 0; i < results.length; i++) {
            var key = results[i].key;
            var contact = results[i].contact;

            html += '<tr><td>' + contact.Name + '</td>';
            html += '<td>' + contact.email + '</td>';
            html += '<td>' + contact.age + '</td>';
            html += '<td>' + contact.role + '</td>';
            html += '<td>' + contact.recommed + '</td>';
            html += '<td>' + contact.myCheckbox + '</td>';
            html += '<td>' + contact.comment + '</td>';
            html += '<td>' + contact.target + '</td>';

            html += '<td><a class="edit" href="javascript:void(0)" data-key=' + key + '>Edit</a></td></tr>';
            console.log();
        }

        html = html || '<tr><td colspan="8">No Records Available!!!</td></tr>'
        $("#contacts tbody").html(html);
        $('#contacts a.edit').on('click', ns.loadContact);
    }

    ns.loadContact = function () {
        var key = parseInt($(this).attr('data-key'));
        var trans = db.transaction('contacts', 'readonly');
        var store = trans.objectStore("contacts");
        var request = store.get(key);

        request.onsuccess = function (response) {
            $("#currentAction").html('Edit Contact');
            currentRecord = { key: key, contact: response.target.result }
            displayCurrentRecord();
        }        
    }

    function displayCurrentRecord() {
        var contact = currentRecord.contact;
        $("#name").val(contact.Name);
        $("#email").val(contact.email);
        $("#age").val(contact.age);
        $("#role").val(contact.role);
        $("#recommed").val(contact.recommed);
        $("#myCheckbox").val(contact.myCheckbox);
        $("#comment").val(contact.comment);
        $("#target").val(contact.target);

    }

    ns.save = function () {
        var contact = currentRecord.contact;
        contact.Name = $("#name").val();
        contact.email = $("#email").val();
        contact.age = $("#age").val();
        contact.role = $("#role").val();
        contact.comment = $("#comment").val();

        contact.recommed = $("input[name='radio']:checked").map(function() {
            return $(this).val();
        }).get();
        
        contact.myCheckbox = $("input[name='inp']:checked").map(function() {
            return $(this).val();
        }).get();

        contact.target = document.querySelector("#image_input");
        var uploaded_image ="";

        contact.target.addEventListener("change", function(){
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                uploaded_image = reader.result;
                return $(this).val();
            })
        }).get();

        var trans = db.transaction('contacts', 'readwrite');
        var contacts = trans.objectStore("contacts");
        var request = currentRecord.key != null
            ? contacts.put(contact, currentRecord.key)
            : contacts.add(contact);

        request.onsuccess = function (response) {
            ns.display();
            uploaded_image = "";
        }
    }
})();





