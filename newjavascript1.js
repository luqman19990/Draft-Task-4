var selectedAppointmentID;

$(document).ready(function () {
    // on-click button for inserting appointments
    $('#submit-btn').click(function () {
        if (!validateEmail($('#Email').val())) {
            alert("Enter a valid email address.");
            return;
        }
        insertAppt();
    });

    // on-click button for deleting appointments
    $('#delete-btn').click(function () {
        var appointmentID = $('#DeleteAppointmentID').val();
        if (!validateID(appointmentID)) {
            alert("Enter a valid appointment ID.");
            return;
        }
        deleteAppointment();
    });

    // on-click button for updating appointments
    $('#update-btn').click(function () {
        if (!validateEmail($('#Email').val())) {
            alert("Enter a valid email address.");
            return;
        }
        if (!validateID(selectedAppointmentID)) {
            alert("No appointment selected for update.");
            return;
        }
        updateAppt();
    });

    // on-click button for filtering appointments
    $('#filter-btn').click(function () {
        var name = $('#Name').val();
        var gender = $('#Gender').val();
        viewApptNew(name, gender);
    });

    // Event listener to store the appointment ID when a row is clicked
    $('#appointmentTable tbody').on('click', 'tr', function () {
        var data = $('#appointmentTable').DataTable().row(this).data();
        selectedAppointmentID = data[0];
        $('#TitleID').val(data[2]); 
        $('#GenderID').val(data[3].trim()); 
        $('#FirstName').val(data[1].split(' ')[0]);
        $('#LastName').val(data[1].split(' ')[1]);
        $('#Email').val(data[7]); 
        $('#AppointmentDate').val(data[6]); 
        
    });
    
    $('#appointmentTable tbody').on('click', '.delete-btn', function () {
        var data = $('#appointmentTable').DataTable().row($(this).parents('tr')).data();
        var appointmentID = data[0];

        deleteAppointment(appointmentID);
    });
});

// Function to insert appointment
function insertAppt() {
    var TitleID = $('#TitleID option:selected').val();
    var FirstName = $('#FirstName').val();
    var LastName = $('#LastName').val();
    var GenderID = $('#GenderID option:selected').val();
    var Email = $('#Email').val();
    var AppointmentDate = $('#AppointmentDate').val();
    var AppointmentTime = $('#AppointmentTime').val();

    $.ajax({
        type: 'POST',
        url: 'svltaction?tc=SP_INSERT_APPOINTMENT',
        data: {
            TitleID: TitleID,
            FirstName: FirstName,
            LastName: LastName,
            GenderID: GenderID,
            Email: Email,
            AppointmentDate: AppointmentDate,
            AppointmentTime: AppointmentTime
        },
        success: function(resp) {
            console.log(resp);
            alert("Appointment inserted successfully!");
        }
    });
}

// Function to delete appointment
function deleteAppointment(appointmentID) {
    $.ajax({
        type: 'POST',
        url: 'svltaction?tc=SP_DELETE_APPOINTMENT',
        data: { 
            AppointmentID: appointmentID 
        },
        success: function(resp) {
            alert("Appointment deleted successfully!");
            // Reload the DataTable after deletion
            $('#appointmentTable').DataTable().ajax.reload();
        }
    });
}

// Function to update appointment
function updateAppt() {
    var TitleID = $('#TitleID').val();
    var FirstName = $('#FirstName').val();
    var LastName = $('#LastName').val();
    var GenderID = $('#GenderID').val();
    var Email = $('#Email').val();
    var AppointmentDate = $('#AppointmentDate').val();
    var AppointmentTime = $('#AppointmentTime').val();

    $.ajax({
        type: 'POST',
        url: 'svltaction?tc=SP_UPDATE_APPOINTMENT',
        data: {
            AppointmentID: selectedAppointmentID, // Use the global variable here
            TitleID: TitleID,
            FirstName: FirstName,
            LastName: LastName,
            GenderID: GenderID,
            Email: Email,
            AppointmentDate: AppointmentDate,
            AppointmentTime: AppointmentTime
        },
        success: function(resp) {
            alert("Appointment updated successfully!");
            // Clear the form after successful update
            clearForm();
        }
    });
}
// Function to view appointments with filtering
function viewApptNew(name, gender) {
    if ($.fn.DataTable.isDataTable('#appointmentTable')) {
        $('#appointmentTable').DataTable().destroy();
    }

    $('#appointmentTable').DataTable({
        "ajax": {
            "url": "svltaction?tc=SP_VIEW_APPOINTMENT",
            "type": "POST",
            "data": {
                "Name": name,
                "Gender": gender
            },
            "dataSrc": function(json) {
                return json.r.slice(1); 
            }
        },
        "columns": [
            { "title": "AppointmentID", "visible": false },
            { "title": "Name" },
            { "title": "TitleID" },
            { "title": "GenderID" },
            { "title": "Title" },
            { "title": "Gender" },
            { "title": "AppointmentDate" },
            { "title": "Email" },
            // Add a new column for the delete button
            {
                "title": "Action",
                "data": null,
                "defaultContent": "<button class='btn btn-danger delete-btn'>Delete</button>"
            }
        ],
        "initComplete": function(settings, json) {
            alert("Appointments loaded successfully!");
        }
    });
}

// Function for email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function for ID validation
function validateID(appointmentID) {
    var existingAppointmentIDs = $('#appointmentTable').DataTable().rows().data().pluck(0).toArray();
    return existingAppointmentIDs.includes(appointmentID);
}

// Function to clear the form after successful update
function clearForm() {
    $('#TitleID').val('');
    $('#FirstName').val('');
    $('#LastName').val('');
    $('#GenderID').val('');
    $('#Email').val('');
    $('#AppointmentDate').val('');
    $('#AppointmentTime').val('');
}
