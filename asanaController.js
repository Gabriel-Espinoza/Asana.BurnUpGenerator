var asanaController = {
  baseUri: "http://cors.io/?https://app.asana.com/api/1.0/",
  token: "",
  callApi: function(localizedUuri, parameters, requestType) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        type:
          typeof requestType === "undefined" || requestType === null
            ? "GET"
            : requestType,
        url: asanaController.baseUri + localizedUuri,
        data:
          typeof parameters === "undefined" || parameters === null
            ? ""
            : parameters,
        beforeSend: function(request) {
          request.setRequestHeader(
            "Authorization",
            "Bearer " + asanaController.token
          );
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
      return asanaController.callApi(
        "teams/" + teamId + "/projects",
        "opt_fields=name,notes"
      );
    },
    getTasks: function(projectId) {
      return asanaController.callApi(
        "projects/" + projectId + "/tasks",
        "opt_expand=(this%7Csubtasks%2B)"
      );
    },
    get: function(projectId){
      return asanaController.callApi("projects/"+projectId, "opt_fields=name,notes");
    },
    updateDates: function(projectId, data) {
      asanaController.projects.get(projectId)
        .then(function(project){
          return asanaController.callApi(
            "projects/" + projectId,
            "notes=" + jsonInNotesParser.serializeObject(project.data.notes, data),
            "PUT"
          );
        });
    }
  },
  workspaces: {
    get: function() {
      return asanaController.callApi("workspaces/");
    }
  },
  teams: {
    getByWorkspaceId: function(workspaceId) {
      return asanaController.callApi("organizations/" + workspaceId + "/teams/");
    }
  },

};

jsonInNotesParser = {
  jsonSeparator: "============= EOD =============",
  serializeObject(notes, dataToSerialize)
  {
    let jsonData = JSON.stringify(dataToSerialize);
    let authorNotes = "";
    if(notes.indexOf(asanaController.jsonSeparator) >= 0)
      authorNotes = notes.substring(0, notes.indexOf(jsonInNotesParser.jsonSeparator))
    return encodeURIComponent(authorNotes +"\n"+ jsonInNotesParser.jsonSeparator +"\n"+ jsonData);
  },
  deserializeObject(stringObject)
  {
    let jsonString =null;
    if(stringObject.indexOf(jsonInNotesParser.jsonSeparator) >= 0)
      jsonString = stringObject.substring(stringObject.indexOf(jsonInNotesParser.jsonSeparator)+jsonInNotesParser.jsonSeparator.length, stringObject.length);
    return JSON.parse(jsonString);
  }
}
