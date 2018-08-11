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
    asanaController.projects
      .getByTeamId($("#teams").val())
      .then(function(response) {
        addOptions(response.data, $("#projects"));
      })
      .catch(function(response) {
        alert("Error: " + response.responseText);
      });
  });



  //On Project Change => We load all the tasks
  $("#projects").change(function() {
    asanaController.projects
      .getTasks($("#projects").val())
      .then(function(response) {
        $("#chartTitle").text(
          "BurnUp: " +
            $("#projects")
              .find(":selected")
              .text()
        );
        chartController.init(response);

        let day = ("0" + chartController.minDate.getDate()).slice(-2);
        let month = ("0" + (chartController.minDate.getMonth() + 1)).slice(-2);
        let year = chartController.minDate.getFullYear();
        let date = year + "-" + month + "-" + day;
        $("#beginDate").val(date);

        day = ("0" + chartController.maxDate.getDate()).slice(-2);
        month = ("0" + (chartController.maxDate.getMonth() + 1)).slice(-2);
        year = chartController.maxDate.getFullYear();
        date = year + "-" + month + "-" + day;
        $("#endDate").val(date);

        chartController.drawChart();
      });
  });


  $("#beginDate").change(function(){
    var date = new Date(this.value + "T00:00");
    chartController.minDate = date;
    chartController.drawChart();
  });

  $("#endDate").change(function(){
    var date = new Date(this.value + "T00:00");
    chartController.maxDate = date;
    chartController.drawChart();
  });
});
