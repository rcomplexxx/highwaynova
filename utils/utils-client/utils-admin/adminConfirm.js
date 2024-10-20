const { default: Swal } = require("sweetalert2");


async function adminConfirm(message) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: message,
      confirmButtonText: 'Okay',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      background: '#333',
      color: '#fff',
      customClass: {
        popup: 'dark-popup',
        title: 'dark-title',
        icon: 'dark-icon',
        confirmButton: 'dark-confirm-button',
        cancelButton: 'dark-cancel-button'
      }
    });
  
    return result.isConfirmed ? true : false;
  }



module.exports = {
adminConfirm
};