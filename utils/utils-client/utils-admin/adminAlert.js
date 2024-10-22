const { default: Swal } = require("sweetalert2");


function adminAlert(type, title, message) {
  
    
        Swal.fire({
            icon: type,
            title: title,
            text: message,
            confirmButtonText: 'Okay',
            background: '#222222', // 333 Dark background color
            color: '#fff', // Text color
            customClass: {
                popup: 'dark-popup', // Custom class for the popup
                title: 'dark-title', // Custom class for the title
                icon: 'dark-icon', // Custom class for the icon
                confirmButton: 'dark-confirm-button' // Custom class for the button
            }
        });
  
}



module.exports = {
adminAlert
};