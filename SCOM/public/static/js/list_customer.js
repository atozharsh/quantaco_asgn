$(document).ready(function() {
      var accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        window.location.href = "http://127.0.0.1:8000";
      }
      $("#getListLink").click(function(event) {
        event.preventDefault();

        var apiUrl = "http://127.0.0.1:8000/customer";

        $.ajax({
          url: apiUrl,
          type: "GET",
          headers: {
            "Authorization": "Bearer " + accessToken
          },
          success: function(data) {
            // Display the list of customers
            displayCustomerList(data);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error:", errorThrown);
            alert("An error occurred while fetching the customer list.");
          }
        });
      });

      function displayCustomerList(customerList) {
        var $customerList = $("#customerList");

        $customerList.empty();

        customerList.forEach(function(customer) {
          $customerList.append("<li> <a href=\"#\" >" + customer.first_name + " " + customer.last_name+ " </a> </li>");
        });
      }
    });