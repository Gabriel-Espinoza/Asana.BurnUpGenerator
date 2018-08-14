$(function() {
  function addOptions(data, $target) {
    $.each(data, function(key, value) {
      $target.append(
        $("<option></option>")
          .attr("value", value.id)
          .text(value.name)
      );
    });
  }

  //On Click => We load workspaces
  $("#submitToken").click(function() {
    asanaController.token = $("#token").val();
    asanaController.workspaces
      .get()
      .then(function(response) {
        addOptions(response.data, $("#workspaces"));
      })
      .catch(function(response) {
        alert("Token failed: " + response);
      });
  });

  //On Workspace Change => We load Workspace's Teams
  $("#workspaces").change(function() {
    asanaController.teams
      .getByWorkspaceId($("#workspaces").val())
      .then(function(response) {
        addOptions(response.data, $("#teams"));
      })
      .catch(function(response) {
        alert("Error: " + response.responseText);
      });
  });

  //On Team Change => We load Team's projects
  $("#teams").change(function() {
    asanaController.projects.getByTeamId($("#teams").val())
      .then(function(response) {
        // addOptions(response.data, $("#projects"));

        $.each(response.data, function(key, value) {
          let obj = jsonInNotesParser.deserializeObject(response.data[key].notes);
          
          $("#projects").append(
            $("<option></option>")
              .attr("value", value.id)
              .text(value.name)
              .data("data-jsonNotes", obj)
          );
        });
      });
  });



  //On Project Change => We load all the tasks
  $("#projects").change(function() {
    asanaController.projects.getTasks($("#projects").val())
      .then(function(response) {

        //actualizamos título del BurnUp
        $("#chartTitle").text("BurnUp: " +$("#projects").find(":selected").text());
        chartController.init(response);

        //actualizamos la fecha "desde" del gráfico. Si existe en la metadata
        let day, month, year, date, auxDate;
        let metadata = $("#projects").find(":selected").data("data-jsonNotes");
        if(metadata == null || typeof(metadata.beginDate) === 'undefined')
        {
          auxDate = chartController.minDate;
          day = ("0" + auxDate.getDate()).slice(-2);
          month = ("0" + (auxDate.getMonth() + 1)).slice(-2);
          year = auxDate.getFullYear();
          date = year + "-" + month + "-" + day;
        }
        else {
          auxDate = new Date(metadata.beginDate + "T00:00");
          day = ("0" + auxDate.getDate()).slice(-2);
          month = ("0" + (auxDate.getMonth() + 1)).slice(-2);
          year = auxDate.getFullYear();
          date = year + "-" + month + "-" + day;
          chartController.minDate = auxDate;
        }
        $("#beginDate").val(date);


        if(metadata == null || typeof(metadata.endDate) === 'undefined')
        {
          auxDate = chartController.maxDate;
          day = ("0" + auxDate.getDate()).slice(-2);
          month = ("0" + (auxDate.getMonth() + 1)).slice(-2);
          year = auxDate.getFullYear();
          date = year + "-" + month + "-" + day;
        }
        else{
          auxDate = new Date(metadata.endDate + "T00:00");
          day = ("0" + auxDate.getDate()).slice(-2);
          month = ("0" + (auxDate.getMonth() + 1)).slice(-2);
          year = auxDate.getFullYear();
          date = year + "-" + month + "-" + day;
          chartController.maxDate = auxDate;
        }
        $("#endDate").val(date);

        chartController.drawBurnUp();
      });
  });


  $("#beginDate").change(function(){
    var date = new Date(this.value + "T00:00");
    chartController.minDate = date;

    asanaController.projects.updateDates($("#projects").val(),  {beginDate: $("#beginDate").val(), endDate:$("#endDate").val()});
    chartController.drawBurnUp();
  });

  $("#endDate").change(function(){
    var date = new Date(this.value + "T00:00");
    chartController.maxDate = date;
    asanaController.projects.updateDates($("#projects").val(),  {beginDate: $("#beginDate").val(), endDate:$("#endDate").val()});
    chartController.drawBurnUp();
  });
});
