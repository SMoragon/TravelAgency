$(function () {

  var nombreDest= String($("#dest_name").prop("textContent")).trimStart().trimEnd().toLowerCase();

  $("#send_comment").on("click", () => {
   
    var text = $("#comment_text").val();

    if (text.trim() !== "") {
      $.ajax({
        method: "POST",
        url: "/escribir_comentario/",
        contentType: "application/json",
        data: JSON.stringify({
          nombreDest: nombreDest,
          comment: text,
        }),
        success: function (data, textStatus, jqHXR) {  
          var messageHeader = $("<div>").addClass("d-flex flex-wrap flex-row");
            var user = $("<div>").prop("textContent",(data.user)).addClass("row mx-md-3 mx-1 comment-user");
            var time = $("<div>").prop("textContent","("+data.date+")").addClass("row mx-md-3 mx-1 comment-date");
          messageHeader.append(user).append(time);
          var messageBody = $("<div>").prop("textContent",text).addClass("my-3 mx-3");
          var commentContainer=$("<div>").addClass("my-2 mx-md-4 mx-1 container rounded comment-container");
          commentContainer.append(messageHeader).append(messageBody)
          commentContainer.hide()
          $("#comments_section").prepend(commentContainer)
          commentContainer.slideDown(500)
        },
        error: function (jqHXR, textStatus, errorThrown) {  
            if(jqHXR.responseText==="No logged") window.location.href = "/you_must_login";
            else alert(errorThrown, textStatus)
            
        }
      });
    }
  });

  $("#cancel_comment").on("click", () => {
    $("#comment_text").val("")
  });

  $("#itinerary_but").on("click",()=>{
  console.log("AJAX: ",nombreDest)
    $.ajax({
      method: "GET",
      url: "/ver_itinerario/"+nombreDest,
      contentType: "application/json",
      success: function (data, textStatus, jqHXR) {  
        var activity_list=$("#activity_list")
        var act_container= $("<div>")
        data.activities.forEach(activity => {
          act_container.append($("<li>").prop("textContent",activity.actividad))
        });
        activity_list.replaceWith(act_container)
      },
      error: function (jqHXR, textStatus, errorThrown) {  
          if(jqHXR.responseText==="No logged") window.location.href = "/you_must_login";
          else alert(errorThrown, textStatus)
          
      }
    });

  })

});
