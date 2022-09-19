<template>
  <div id="app">
    <v-app dark>
      <Header title="Submittal Workflow and Tracking" @toggle-add-submittal="toggleAddSubmittal" :showAddSubmittal="showAddSubmittal" />
      <Submittals :submittals="submittals" :projects="projects" @delete-submittal="deleteSubmittal" @update-submittal="updateSubmittal" @update-submittal-priorities="updateSubmittalPriorities" @dynamic-query="getDynamicQuery" @create-SDF="createSDF" @create-PDF="createPDF"/>
    </v-app>
  </div>
</template>

<script>
  import Header from './components/Header'
  import Submittals from './components/Submittals'
  import SubmittalDataService from './services/SubmittalDataService'
  import ProjectDataService from './services/ProjectDataService'
  import ServerDataService from './services/ServerDataService'

  export default {
    name: 'App',
    components: {
      Header,
      Submittals,
    },
    data() {
      return {
        submittals: [],
        projects: []
      }
    },
    methods: {
      addSubmittal(submittal) {
        this.submittals = [...this.submittals, submittal]
      },
      deleteSubmittal(id) {
        if(confirm('Delete submittal?')) {
          this.submittals = this.submittals.filter((submittal) => submittal.id !== id)
        }
      },
      getSubmittals() {
        SubmittalDataService.getAll()
          .then(response => {
            this.submittals = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      },
      getOpenSubmittals() {
        SubmittalDataService.getOpen()
        .then(response => {
          this.submittals = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
      },
      getClosedSubmittals() {
        SubmittalDataService.getClosed()
        .then(response => {
          this.submittals = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
      },
      getSubmittalsByViolation(cat) {
        SubmittalDataService.findByViolationCategory(cat)
          .then(response => {
            this.submittals = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      },      
      getSubmittalsByOwner(owner) {
        SubmittalDataService.findByOwner(owner)
          .then(response => {
            this.submittals = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      },
      updateSubmittal(submittal) {
        SubmittalDataService.update(submittal._id, submittal)
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
        console.log(submittal._id)
      },
      updateSubmittalPriorities(project) {
        ProjectDataService.update(project._id, project)
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
        console.log(project._id)
      },
      getDynamicQuery(query)
      {
        SubmittalDataService.findDynamic(query)
          .then(response => {
            this.submittals = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      },      
      getProjects() {
          ProjectDataService.getAll()
            .then(response => {
              this.projects = response.data;
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        },
      testDirectory() {
          ServerDataService.testDir()
            .then(response => {
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        },
      createSDF(submittal) {
          ServerDataService.createSDF(submittal._id, submittal)
            .then(response => {
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        },
      createPDF(submittal) {
          ServerDataService.createPDF(submittal._id, submittal)
            .then(response => {
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
    },
    created() {
      this.getSubmittals();
      this.getProjects();
      // Edge setting to allow local links: https://docs.microsoft.com/en-us/deployedge/microsoft-edge-policies#intranetfilelinksenabled
      // this.getClosedSubmittals();
      // this.getSubmittalsByOwner('Blaherson');
      // this.getSubmittalsByViolation('Hockey');
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Poppins', sans-serif;
  }
</style>
