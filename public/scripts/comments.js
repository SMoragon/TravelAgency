$(function () {
  $("#send_comment").on("click", () => {
   
    var text = $("#comment_text").val();

    if (text.trim() !== "") {
      $.ajax({
        method: "POST",
        url: "/escribir_comentario/",
        contentType: "application/json",
        data: JSON.stringify({
          nombreDest: $("#dest_name").val(),
          comment: text,
        }),
        success: function (data, textStatus, jqHXR) {  
          var messageHeader = $("<div>").addClass("d-flex flex-row");
            var user = $("<div>").val(jqHXR.session.user).addClass("row mx-3");
            var time = $("<div>").val(data.date).addClass("row mx-3");
          messageHeader.append(user).append(time);
          var messageBody = $("<div>").val(text).addClass("my-2");
          var commentContainer=$("<div>").val(text).addClass("my-2");
          commentContainer.append(messageHeader).append(messageBody)
          $("#comments_section").append(commentContainer).slideDown(2000)
        },
        error: function (jqHXR, textStatus, errorThrown) {  
            if(jqHXR.responseText) alert(jqHXR.responseText);
            else alert(errorThrown)
            
        }
      });
    }
  });
});
