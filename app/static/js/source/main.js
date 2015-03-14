(function(){


  $(document).ready(initialize);


  function initialize(){
    $( ".toggle" ).click(toggleStudentForm);
    $( ".toggleAccount").click(toggleAccountForm);
    $( ".togglePayment").click(togglePaymentForm)
  }

  function toggleStudentForm(){
    $(".addStudent").toggle();
  }

  function toggleAccountForm(){
    $(".newAccount").toggle();
  }

  function togglePaymentForm(){
    $(".paymentForm").toggle();
  }


})();
