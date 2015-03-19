(function(){


  $(document).ready(initialize);

  function initialize(){
    $( ".toggle" ).click(toggleStudentForm);
    $( ".toggleAccount").click(toggleAccountForm);
    $( ".togglePayment").click(togglePaymentForm);
    $( ".studentList tr" ).on("dblclick", editStudent);
    $( ".accountList tr" ).on("dblclick", editAccount);
    $( ".editRemove a" ).on("click", removeStudent);
    $( ".editAccount a" ).on("click", removeAccount);
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
