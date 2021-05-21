let fs = require('fs');
let pdfDoc = require('pdfkit');
let employeeFileName = "employeeDetails"
let Employees = new Array();
let errors = 0;

function load() {

    document.getElementById("newEmp").addEventListener("click", () => {
        populateEmployeeDetails()
        document.getElementById("newEmpContent").style.display = "block";
        document.getElementById("genInvContent").style.display = "none";
        document.getElementById("modEmpContent").style.display = "none";
    })

    document.getElementById("modEmp").addEventListener("click", () => {
        populateEmployeeDetails()
        populateModEmployeeTable()
        document.getElementById("newEmpContent").style.display = "none";
        document.getElementById("genInvContent").style.display = "none";
        document.getElementById("modEmpContent").style.display = "block";
    })

    document.getElementById("genInv").addEventListener("click", () => {
        populateEmployeeDetails()
        document.getElementById("newEmpContent").style.display = "none";
        document.getElementById("genInvContent").style.display = "block";
        document.getElementById("modEmpContent").style.display = "none";
    })
}

function insertIntoFile() {
    validateNewEmp()
    if (errors == 0) {
        var firstname = document.getElementById("fname").value;
        var lastname = document.getElementById("lname").value;
        var pay = document.getElementById("pay").value;
        var net = document.getElementById("net").value;
        var companyname = document.getElementById("cname").value;
        var address = document.getElementById("addr1").value + "*" + document.getElementById("addr2").value + "*" + document.getElementById("addr3").value;
        var data = firstname + "~" + lastname + "~" + pay + "~" + net + "~" + companyname + "~" + address + "\n";
        fs.appendFile(employeeFileName, data, () => { console.log("Employee Record Inserted" + data) });
        document.getElementById("message").setAttribute("class", "success");
        document.getElementById("message").innerHTML = "Successfully inserted the emplyee data!";
        clearFields();
    }
}

function populateEmployeeDetails() {
    if (fs.existsSync(employeeFileName)) {
        let data = fs.readFileSync(employeeFileName, 'utf8').split('\n')
        data.forEach((contact, index) => {
            if (contact != "" && !Employees.includes(contact)) {
                Employees.push(contact)
            }
        })
    } else {
        console.log("File Doesn\'t Exist. Creating new file.")
        fs.writeFile(filename, '', (err) => {
            if (err)
                console.log(err)
        })
    }

    document.querySelectorAll('.modEmpOptions').forEach(function(a) {
        a.remove()
    })
    document.querySelectorAll('.newEmpOptions').forEach(function(a) {
        a.remove()
    })

    Employees.forEach((value, index, array) => {
        var arr = value.split("~");
        var optionMod = document.createElement("option");
        optionMod.setAttribute("value", index)
        optionMod.setAttribute("class", "modEmpOptions")
        var text = document.createTextNode(arr[0] + " " + arr[1]);
        optionMod.appendChild(text);
        document.getElementById("modEmployeeList").add(optionMod);

        var optionNewEmp = document.createElement("option");
        optionNewEmp.setAttribute("value", index)
        optionNewEmp.setAttribute("class", "newEmpOptions")
        var text2 = document.createTextNode(arr[0] + " " + arr[1]);
        optionNewEmp.appendChild(text2);
        document.getElementById("employeeList").add(optionNewEmp);
    })
}

function populateInvoice() {

    validateGenInv();
    if (errors === 0) {
        var index = document.getElementById("employeeList").value;
        var employee = Employees[index].split("~");
        var name = employee[0] + " " + employee[1];
        var pay = employee[2];
        var net = employee[3];
        var companyName = employee[4];
        var address = employee[5].split("*")
        var invoiceNum = document.getElementById("invoiceNum").value
        var invdate = document.getElementById("invDate").value
        var Desc = document.getElementById("desc1").value

        var date = invdate.split("-");
        invdate = new Date(date[0], date[1] - 1, date[2]);
        var dueDate = new Date(date[0], date[1] - 1, date[2]);;
        dueDate.setDate(dueDate.getDate() + parseInt(net, 10));

        var hours = document.getElementById("hours1").value

        let pdf = new pdfDoc({ size: 'A4' });
        let textSize = 16;
        pdf.pipe(fs.createWriteStream('/Users/sai/Downloads/' + name + '.pdf'));
        let invPosx = 250
        let swiftPosx = 75
        let swiftPosy = 100
        let invNoPosx = 350
        pdf.fillColor("#000080").font('./fonts/AsapCondensed-SemiBold.ttf').fontSize(30).text("INVOICE", invPosx, 50)

        pdf.fillColor("black").font('./fonts/AsapCondensed-SemiBold.ttf').fontSize(textSize).text("Swift Technologies Inc.", swiftPosx, swiftPosy);
        pdf.font('./fonts/AsapCondensed-Regular.ttf').text("580 Decker dr", swiftPosx, swiftPosy + 20);
        pdf.text("Suite 205", swiftPosx, swiftPosy + 40);
        pdf.text("Irving TX 75062", swiftPosx, swiftPosy + 60);
        pdf.text("Ph: (425) 559-1234\n\n", swiftPosx, swiftPosy + 80);

        pdf.fillColor("black").font('./fonts/AsapCondensed-SemiBold.ttf').fontSize(textSize).text("Bill To:", swiftPosx, swiftPosy + 110);
        pdf.font('./fonts/AsapCondensed-Medium.ttf').text(companyName, swiftPosx, swiftPosy + 130);
        pdf.text(address[0], swiftPosx, swiftPosy + 150);
        pdf.text(address[1], swiftPosx, swiftPosy + 170);
        pdf.text(address[2], swiftPosx, swiftPosy + 190);

        const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
        pdf.text("Invoice #:  " + invoiceNum, invNoPosx, swiftPosy);
        pdf.text("Invoice Date:  " + invdate.toLocaleDateString("en-US", options), invNoPosx, swiftPosy + 25);
        pdf.text("Due Date:  " + dueDate.toLocaleDateString("en-US", options), invNoPosx, swiftPosy + 50);

        pdf.font('./fonts/AsapCondensed-SemiBold.ttf').text("Name of Employee:   ", invNoPosx, 180);
        pdf.font('./fonts/AsapCondensed-Medium.ttf').text(name, invNoPosx, 205);

        let initRectx = 50
        let initRecty = 325
        pdf.rect(initRectx, initRecty, 500, 25).lineWidth(2).fillOpacity(0.75).fillAndStroke("#000080", "black");
        pdf.rect(initRectx, initRecty, 500, 425).lineWidth(2).stroke();
        pdf.rect(initRectx, initRecty, 250, 425).lineWidth(2).stroke();
        pdf.rect(initRectx + 250, initRecty, 75, 425).lineWidth(2).stroke();
        pdf.rect(initRectx + 325, initRecty, 75, 425).lineWidth(2).stroke();
        pdf.rect(initRectx + 325, initRecty + 425, 175, 25).lineWidth(2).stroke();

        pdf.fill("white").fillOpacity(1).text("Description", 125, initRecty + 2);
        pdf.text("Rate", 320, initRecty + 2);
        pdf.text("Hours", 390, initRecty + 2);
        pdf.text("Amount", 475, initRecty + 2);

        pdf.fill("black").text(Desc, initRectx + 5, initRecty + 50);
        var myObj = {
            style: "currency",
            currency: "USD"
        }
        pdf.text("$ " + pay, 320, initRecty + 50);
        pdf.text(hours, 390, initRecty + 50);
        pdf.text(" " + (hours * pay).toLocaleString("en-US", myObj), 452, initRecty + 50);
        pdf.text("Total:     " + (hours * pay).toLocaleString("en-US", myObj), 400, initRecty + 426);

        pdf.end()
        document.getElementById("genMessage").setAttribute("class", "success");
        document.getElementById("genMessage").innerHTML = "Successfully Generated PDF!";
        clearFields();
    }
}

function validateNewEmp() {
    var firstname = document.getElementById("fname").value;
    var lastname = document.getElementById("lname").value;
    var pay = document.getElementById("pay").value;
    var net = document.getElementById("net").value;
    var companyname = document.getElementById("cname").value;
    var addr1 = document.getElementById("addr1").value;
    var addr2 = document.getElementById("addr2").value;

    if (firstname === "" || firstname === undefined) {
        document.getElementById("message").setAttribute("class", "error");
        document.getElementById("message").innerHTML = "******Plese Enter First Name******";
        errors = 1;
    } else if (lastname === "" || lastname === undefined) {
        document.getElementById("message").setAttribute("class", "error");
        document.getElementById("message").innerHTML = "******Plese Enter Last Name******";
        errors = 1;
    } else if (pay === "" || pay === undefined) {
        document.getElementById("message").innerHTML = "******Plese Enter Pay******";
        document.getElementById("message").setAttribute("class", "error");
        errors = 1;
    } else if (net === "" || net === undefined) {
        document.getElementById("message").setAttribute("class", "error");
        document.getElementById("message").innerHTML = "******Plese Enter Net******";
        errors = 1;
    } else if (companyname === "" || companyname === undefined) {
        errors = 1;
        document.getElementById("message").setAttribute("class", "error");
        document.getElementById("message").innerHTML = "******Plese Enter Company Name******";
    } else if (addr1 === "" || addr1 === undefined) {
        errors = 1;
        document.getElementById("message").setAttribute("class", "error");
        document.getElementById("message").innerHTML = "******Plese Enter Address1******";
    } else if (addr2 === "" || addr2 === undefined) {
        errors = 1;
        document.getElementById("message").setAttribute("class", "error");
        document.getElementById("message").innerHTML = "******Plese Enter Address2******";
    } else {
        errors = 0;
    }
}

function clearFields() {
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("pay").value = "";
    document.getElementById("net").value = "";
    document.getElementById("cname").value = "";
    document.getElementById("addr1").value = "";
    document.getElementById("addr2").value = "";
    document.getElementById("addr3").value = "";
    document.getElementById("invoiceNum").value = "";
    document.getElementById("invDate").value = "";
    document.getElementById("desc1").value = "";
    document.getElementById("hours1").value = "";
}

function validateGenInv() {
    var invoiceNum = document.getElementById("invoiceNum").value;
    var invdate = document.getElementById("invDate").value;
    var Desc = document.getElementById("desc1").value;
    var hours = document.getElementById("hours1").value;
    var index = document.getElementById("modEmployeeList").value;
    if (invoiceNum === "" || invoiceNum === undefined) {
        errors = 1;
        document.getElementById("genMessage").setAttribute("class", "error");
        document.getElementById("genMessage").innerHTML = "******Please Enter Invoice Number******";
    } else if (invdate === "" || invdate === undefined) {
        errors = 1;
        document.getElementById("genMessage").setAttribute("class", "error");
        document.getElementById("genMessage").innerHTML = "******Plese Enter Invoice Date******";
    } else if (Desc === "" || Desc === undefined) {
        errors = 1;
        document.getElementById("genMessage").setAttribute("class", "error");
        document.getElementById("genMessage").innerHTML = "******Plese Enter Description******";
    } else if (hours === "" || hours === undefined) {
        errors = 1;
        document.getElementById("genMessage").setAttribute("class", "error");
        document.getElementById("genMessage").innerHTML = "******Plese Enter Hours******";
    } else if (index === undefined || Employees.length <= 0) {
        errors = 1;
        document.getElementById("genMessage").setAttribute("class", "error");
        document.getElementById("genMessage").innerHTML = "******Please Select An Employee******";
    } else {
        errors = 0;
    }
}

function populateModEmployeeTable() {
    var index = document.getElementById("modEmployeeList").value;
    var employee = ["", "", "", "", ""];
    var address = ["", "", ""]
    if (index != undefined && Employees.length > 0) {
        employee = Employees[index].split("~");
        address = employee[5].split("*");
    }
    document.getElementById("modfname").value = employee[0];
    document.getElementById("modlname").value = employee[1];
    document.getElementById("modpay").value = employee[2];
    document.getElementById("modnet").value = employee[3];
    document.getElementById("modcname").value = employee[4];
    document.getElementById("modaddr1").value = address[0];
    document.getElementById("modaddr2").value = address[1];
    document.getElementById("modaddr3").value = address[2];
}

function insertModEmpIntoFile() {
    var index = document.getElementById("modEmployeeList").value;
    if (Employees.length > 0 && index != undefined) {
        var employee = Employees[index].split("~");
        var name = employee[0] + " " + employee[1]
        var firstname = document.getElementById("modfname").value;
        var lastname = document.getElementById("modlname").value;
        var pay = document.getElementById("modpay").value;
        var net = document.getElementById("modnet").value;
        var companyname = document.getElementById("modcname").value;
        var address = document.getElementById("modaddr1").value + "*" + document.getElementById("modaddr2").value + "*" + document.getElementById("modaddr3").value;
        var data = firstname + "~" + lastname + "~" + pay + "~" + net + "~" + companyname + "~" + address;
        Employees.splice(index, 1);
        Employees.push(data);
        document.getElementById("message").setAttribute("class", "success");
        document.getElementById("message").innerHTML = "Successfully inserted the emplyee data!";

        fs.writeFileSync("employeeDetails", Employees.join("\n") + "\n", 'utf-8');
        populateEmployeeDetails();
        populateModEmployeeTable();
        document.getElementById("modMessage").setAttribute("class", "success")
        document.getElementById("modMessage").innerHTML = "*******Modified Employee " + name + "******"
    } else {
        document.getElementById("modMessage").setAttribute("class", "error")
        document.getElementById("modMessage").innerHTML = "*******Please Select An Employee********"
    }
}

function removeEmpFromFile() {
    var index = document.getElementById("modEmployeeList").value;
    if (Employees.length > 0 && index != undefined) {
        var employee = Employees[index].split("~");
        var name = employee[0] + " " + employee[1]
        Employees.splice(index, 1);
        var data = Employees.join("\n") + "\n";
        fs.writeFileSync("employeeDetails", data, 'utf-8');
        populateEmployeeDetails();
        populateModEmployeeTable();
        document.getElementById("modMessage").setAttribute("class", "error")
        document.getElementById("modMessage").innerHTML = "*******Removed Employee " + name + "******"
    } else {
        document.getElementById("modMessage").setAttribute("class", "error")
        document.getElementById("modMessage").innerHTML = "*******Please Select An Employee********"
    }
}