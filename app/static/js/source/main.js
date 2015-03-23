(function(){


  $(document).ready(initialize);

  function initialize(){
    $( ".toggle" ).click(toggleStudentForm);
    $( ".toggleAccount").click(toggleAccountForm);
    $( ".togglePayment").click(togglePaymentForm);
    $( ".studentList tr" ).on("dblclick", editStudent);
    $( ".accountList tr" ).on("dblclick", editAccount);
    $( ".paymentList tr" ).on("dblclick", editPayment);
    $( ".editRemove a" ).on("click", removeStudent);
    $( ".editAccount a" ).on("click", removeAccount);
    $( ".editPayment a" ).on("click", removePayment);
    $( ".printReceipt").click(printReceipt);
  }


  function printReceipt(){
    var printContents = document.getElementById("receipt").innerHTML;
    var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
  }

  function removePayment(){
    if ($(this).attr("class") === "removePayment"){
      var result = confirm("Are you sure you want to delete this Payment?")
      if (result){
        var paymentId = $(this).data("id").replace(/(^"|"$)/g, '');
        var studentId = $(this).data("studentid").replace(/(^"|"$)/g, '');
        var url = window.location.origin + "/payments/" + paymentId + "/" + studentId;
        $.ajax({
          url: url,
          type: 'DELETE',
          success: confirmRemove
        });
      }
    }
  }


  function removeAccount(){
    if ($(this).attr("class") === "removeAccount"){
      var result = confirm("Are you sure you want to delete this Account?")
      if (result){
        var accountId = $(this).data("id").replace(/(^"|"$)/g, '');
        var url = window.location.origin + "/accounts/" + accountId;
        $.ajax({
        url: url,
        type: 'DELETE',
        success: confirmRemove
        });
      }
    }
  }

  function removeStudent(){
    if ($(this).attr("class") === "removeStudent"){
      var result = confirm("Are you sure you want to delete this student?")
      if (result){
        var studentId = $(this).data("id").replace(/(^"|"$)/g, '');
        var url = window.location.origin + "/students/" + studentId;
        $.ajax({
        url: url,
        type: 'DELETE',
        success: confirmRemove
        });
      }
    }
  }

  function confirmRemove(data){
    window.location.reload();
  }

  function editPayment(){
    $(".paymentForm").toggle();
    var paymentId = $( this ).data("paymentid");
    paymentId = paymentId.replace(/(^"|"$)/g, '');
    var url = window.location.origin + "/payment/" + paymentId;
    $.getJSON(url, editPaymentForm);
  }

  function editAccount(){
    $(".newAccount").toggle();
    var accountId = $( this ).data("accountid");
    accountId = accountId.replace(/(^"|"$)/g, '');
    var url = window.location.origin + "/account/" + accountId;
    $.getJSON(url, editAccountForm);
  }

  function editStudent(){
    $(".addStudent").toggle();
    var studentId = $( this ).data("studentid");
    studentId = studentId.replace(/(^"|"$)/g, '');
    var url = window.location.origin + "/student/" + studentId;
    $.getJSON(url, editStudentForm);
  }

  function editPaymentForm(data){
    data = data.data;
    console.log(data);
    $(".id").val(data._id);
    $(".amount").val(data.amount);
    $(".amount").attr("max", 2500);
    $(".endDate").val(data.endDate);
    $(".addAccount button").text("Save");
  }

  function editAccountForm(data){
    data = data.data;
    var moment = data.moment;
    $(".id").val(data._id);
    $(".cohort").val(data.cohort);
    $(".startDate").val(data.startDate);
    $(".endDate").val(data.endDate);
    $(".addAccount button").text("Save");
  }

  function editStudentForm(data){
    data = data.data;
    $(".id").val(data._id);
    $(".firstName").val(data.firstName);
    $(".lastName").val(data.lastName);
    $(".phone").val(data.phone);
    $(".email").val(data.email);
    $(".city").val(data.city);
    $(".state").val(data.state);
    $(".street").val(data.street);
    $(".zip").val(data.zip);
    $(".addStudent button").text("Save");
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
