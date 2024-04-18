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
    
    // Add click event listener for delete buttons
    $('#appointmentTable tbody').on('click', '.delete-btn', function () {
        var row = $(this).closest('tr');
        var data = table.row(row).data();
        var appointmentID = data[0]; // Assuming AppointmentID is in the first column
        // Perform deletion action here, for example, an AJAX call
        $.ajax({
            type: 'POST',
            url: 'svltaction?tc=SP_DELETE_APPOINTMENT',
            data: { appointmentID: appointmentID },
            success: function(response) {
                // If deletion is successful, remove the row from the DataTable
                table.row(row).remove().draw();
                alert('Appointment deleted successfully!');
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert('Error deleting appointment. Please try again later.');
            }
        });
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
