const apiHost = 'http://127.0.0.1:8000';
const customerApiUrl = `${apiHost}/customer`;

function logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = apiHost;
    }


function displayCustomerList(customerList) {
        console.log(customerList);
        var $customerList = $("#customerList");
        $customerList.empty();
        customerList.forEach(function(customer) {
          $customerList.append("<li> <a href=\"#\" class=\"customerLink\" data-customer-id=\""+ customer.id + "\" onclick=\"handleCustomerLinkClick(this)\" >" + customer.first_name + " " + customer.last_name+ " </a> </li>");
        });
      }
function clearFormFields() {
    // Assuming the form fields have IDs corresponding to the keys in the API response
    $('#first_name').val('');
    $('#last_name').val('');
    $('#date_of_birth').val('');
    $('#phone_number').val('');
    $('#email').val('');
    $('#address').val('');
    $('#gender').val('');
    $('#id').text('');
    $('#created_at').text('');
    $('#modified_at').text('');
    $('#is_active').prop('checked', false);
    $("#createBtn").prop('disabled', false);
    $("#updateBtn").prop('disabled', true);
    $("#deleteBtn").prop('disabled', true);
    // Clear any previous error messages
    clearErrorDiv();
    clearSuccessDiv();
}

async function fetchDataAndDisplayList(customerApiUrl) {
    try {
        const apiResult = await makeAuthenticatedApiCall(customerApiUrl, 'GET');

        displayCustomerList(apiResult);

    } catch (error) {
        console.error('Error fetching data and displaying list:', error);
    }
}

async function makeAuthenticatedApiCall(apiUrl, type, payload={}, success_msg="") {
    console.log(apiUrl);
    const accessToken = sessionStorage.getItem('accessToken');
    const csrfToken = $('#customerForm input[name="csrfmiddlewaretoken"]').val();

    if (!accessToken) {
        console.error('Access token not available. User may not be logged in.');
        return;
    }

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        "X-CSRFToken": csrfToken,
    };
    console.log(payload);
    const requestOptions = {
        method: type,
        headers: headers,
        ...(Object.keys(payload).length > 0 && { body: JSON.stringify(payload) }),
    };
    console.log(requestOptions);
    try {
        const response = await fetch(apiUrl, requestOptions);
        console.log(response);
        if (response.status === 403) {
            console.log(response);
            await refreshAccessToken();
//            return makeAuthenticatedApiCall(apiUrl, type, payload);
            const response = await fetch(apiUrl, requestOptions);
            console.log(response);
        }
//        clearErrorDiv();


        if (response.status === 400) {
            const responseData = await response.json();
            console.log("Error...!!!", responseData);
            displayErrorMessages(responseData);
        }
        if (!response.ok) {
            const responseData = await response.json();
            console.error(`Error: ${response.status} - ${response.statusText}`);
//            logout();
            displayErrorMessages(responseData);
        }
        else{
            if(success_msg != ""){
                displaySuccessMessage(success_msg);
            }
        }
        try{
            const responseData = await response.json();
            console.log(responseData);
            return responseData;
        } catch (error){
            console.log("No Response body");
        }


    } catch (error) {
        console.error('Error making API call: 3', error);
    }
}

async function refreshAccessToken() {
    // Assuming you have a refresh token stored in session
    const refreshToken = sessionStorage.getItem('refreshToken');
    const refreshApiUrl = `${apiHost}/api/token/refresh/`;

    const refreshHeaders = {
        'Content-Type': 'application/json',
    };

    const refreshRequestOptions = {
        method: 'POST',
        headers: refreshHeaders,
        body: JSON.stringify({ 'refresh': refreshToken })
    };

    try {
        const refreshResponse = await fetch(refreshApiUrl, refreshRequestOptions);

        if (!refreshResponse.ok) {
            console.error(`Error refreshing access token: ${refreshResponse.status} - ${refreshResponse.statusText}`);
            logout();
            return;
        }

        const newAccessToken = await refreshResponse.json();
        sessionStorage.setItem("accessToken", newAccessToken.access);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}

$(document).ready(function() {

      clearFormFields();
      var accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        logout();
      }

      fetchDataAndDisplayList(customerApiUrl);

      $("#getListLink").click(function(event) {
        event.preventDefault();

        fetchDataAndDisplayList(customerApiUrl);

      });


    });

$(document).ready(function() {
    $('#logout-link').on('click', function(event) {
        event.preventDefault();
        logout();
    });
});
function clearErrorDiv() {
    // Clear the errorDiv
    const errorDiv = $('#errorDiv');
    errorDiv.empty();
    errorDiv.hide();
}

function clearSuccessDiv() {
    // Clear the errorDiv
    const successDiv = $('#successDiv');
    successDiv.empty();
    successDiv.hide();
}

function displaySuccessMessage(msg){
const successDiv = $('#successDiv');
    successDiv.empty();
        const success_msg = `<p> ${msg} </p>`;
        successDiv.append(success_msg);
    successDiv.show();
}

function displayErrorMessages(errors) {
    // Display error messages in the errorDiv
    const errorDiv = $('#errorDiv');
    errorDiv.empty();

    for (const [field, messages] of Object.entries(errors)) {
        const errorMessage = `<p>${field}: ${messages.join(', ')}</p>`;
        errorDiv.append(errorMessage);
    }
    errorDiv.show();
}

function handleCustomerLinkClick(link) {
    console.log("Function Called.")
    const customerId = $(link).data('customer-id');
    const apiUrl = `${apiHost}/customer/${customerId}`;
    console.log(apiUrl);
    makeAuthenticatedApiCall(apiUrl, 'GET')
        .then(response => {
            console.log('API Response:', response);
            updateFormFields(response);
        })
        .catch(error => {
            console.error('Error making API call: 4', error);
        });
}


function updateFormFields(data) {
    clearFormFields();
    $('#first_name').val(data.first_name);
    $('#last_name').val(data.last_name);
    $('#date_of_birth').val(data.date_of_birth);
    $('#phone_number').val(data.phone_number);
    $('#email').val(data.email);
    $('#address').val(data.address);
    $('#gender').val(data.gender);
    $('#id').text(data.id);
    $('#created_at').text(data.created_at);
    $('#modified_at').text(data.modified_at);
    $('#is_active').prop('checked', data.is_active);
    $("#createBtn").prop('disabled', true);
    $("#updateBtn").prop('disabled', false);
    $("#deleteBtn").prop('disabled', false);
}

function createCustomer() {
    event.preventDefault();
    const formData = {
        "first_name": $('#first_name').val(),
        "last_name": $('#last_name').val(),
        "date_of_birth": $('#date_of_birth').val(),
        "phone_number": $('#phone_number').val(),
        "email": $('#email').val(),
        "address": $('#address').val(),
        "gender": $('#gender').val(),
        "is_active": $('#is_active').prop('checked'),
    };
    const apiUrl = `${apiHost}/customer/`;
    makeAuthenticatedApiCall(apiUrl, 'POST', formData, 'Customer Object created Successfully!')
        .then(response => {
            console.log('Object created successfully:', response);
            fetchDataAndDisplayList(customerApiUrl);
        })
        .catch(error => {
            if (error.status === 400 && error.response) {
                displayErrorMessages(error.response);
            } else {
                console.error('Error making API call: 5', error);
            }
        });
}

function updateCustomer() {
    event.preventDefault();
    var id = $('#id').text();
    const formData = {
        "first_name": $('#first_name').val(),
        "last_name": $('#last_name').val(),
        "date_of_birth": $('#date_of_birth').val(),
        "phone_number": $('#phone_number').val(),
        "email": $('#email').val(),
        "address": $('#address').val(),
        "gender": $('#gender').val(),
        "is_active": $('#is_active').prop('checked'),
    };
    const apiUrl = `${apiHost}/customer/${id}/`;
    makeAuthenticatedApiCall(apiUrl, 'PUT', formData, 'Record Updated Successfully!')
        .then(response => {
            console.log('Object updated successfully:', response);
            fetchDataAndDisplayList(customerApiUrl);
        })
        .catch(error => {
            if (error.status === 400 && error.response) {
                displayErrorMessages(error.response);
            } else {
                console.error('Error making API call 1:', error);
            }
        });
}

function deleteCustomer() {
    event.preventDefault();
    var id = $('#id').text();
    clearFormFields();
    const formData = { };
    const apiUrl = `${apiHost}/customer/${id}/`;
    makeAuthenticatedApiCall(apiUrl, 'DELETE',formData,'Record Deleted Successfully!')
        .then(response => {
            console.log('Object deleted successfully:', response);
            fetchDataAndDisplayList(customerApiUrl);
        })
        .catch(error => {
            if (error.status === 400 && error.response) {
                displayErrorMessages(error.response);
            } else {
                console.error('Error making API call 2:', error);
            }
        });
}


