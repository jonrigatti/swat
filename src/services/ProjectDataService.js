import http from "../http-common";

class ProjectDataService {
    getAll() {
        return http.get("/projects");
    }

    get(id) {
        return http.get(`/projects/${id}`);
    }

    create(data) {
        return http.post("/projects", data);
    }

    update(id, data) {        
        console.log('Update beginning: ' + JSON.stringify(data));
        return http.put(`/projects/${id}`, data)
        .then(function (response) {
            console.log('Then: ' + JSON.stringify(data));
            console.log(response);
        });
    }

    delete(id) {
        return http.delete(`/projects/${id}`);
    }

    findByName(name) {
        return http.get(`/projects?name=${name}`);
    }
}

export default new ProjectDataService();