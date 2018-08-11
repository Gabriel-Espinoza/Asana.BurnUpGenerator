var asanaController = {
  baseUri: "https://app.asana.com/api/1.0/",
  token: "",

  callApi: function(localizedUuri, parameters){
    return new Promise(function(resolve, reject) {
      $.ajax({
          type: "GET",
          url: asanaController.baseUri + localizedUuri,
          data: typeof(parameters) === "undefined" || parameters === null ? "" : parameters,
          beforeSend: function(request) {
            request.setRequestHeader("Authorization", "Bearer " + asanaController.token);
          },
          success: function(msg) {
            resolve(msg);
          },
          error: function(msg) {
            reject(msg);
          }
        });
    });
  },

  projects: {
    getByTeamId: function(teamId) {
      return asanaController.callApi("teams/"+teamId+"/projects/");
    },
    getTasks: function(projectId){
      return asanaController.callApi("projects/"+projectId+"/tasks", "opt_expand=(this%7Csubtasks%2B)");
    }
  },
  workspaces: {
    get: function() {
      return asanaController.callApi("workspaces/");
    },
  },
  teams:{
    getByWorkspaceId: function(workspaceId){
        return asanaController.callApi("organizations/"+workspaceId+"/teams/");
    }
  }
  
};
