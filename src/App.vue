<template>
<div class="container">
    <Header title="Submittal Workflow and Tracking" @toggle-add-submittal="toggleAddSubmittal" :showAddSubmittal="showAddSubmittal" />
    <div v-show="showAddSubmittal">
      <AddSubmittal @add-submittal="addSubmittal" />
    </div>
    <Submittals :submittals="submittals" @delete-submittal="deleteSubmittal" @toggle-priority="togglePriority" />
</div>
</template>

<script>
  import Header from './components/Header'
  import Submittals from './components/Submittals'
  import AddSubmittal from './components/AddSubmittal'

  export default {
    name: 'App',
    components: {
      Header,
      AddSubmittal,
      Submittals,
    },
    data() {
      return {
        submittals: [],
        showAddSubmittal: false
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
      toggleAddSubmittal() {
        this.showAddSubmittal = !this.showAddSubmittal;
      },
      togglePriority(id) {
        this.submittals = this.submittals.map((submittal) => 
          submittal.id === id ? { ...submittal, priority: !submittal.priority } : submittal
        );
        console.log(id);
      }
    },
    created() {
      this.submittals = [
        {
          id: 1,
          submittalID: 'Submittal 1',
          needDate: 'asdfasd date 1',
          priority: true,
        },
        {
          id: 2,
          submittalID: 'Submittal 2',
          needDate: 'asdfasd date 2',
          priority: false,
        },
        {
          id: 3,
          submittalID: 'Submittal 3',
          needDate: 'asdfasd date 3',
          priority: false,
        }
      ]
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
  .container {
    max-width: 500px;
    margin: 30px auto;
    overflow: auto;
    min-height: 300px;
    border: 1px solid steelblue;
    padding: 30px;
    border-radius: 5px;
  }
  .btn {
    display: inline-block;
    background: #000;
    color: #fff;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    font-size: 15px;
    font-family: inherit;
  }
  .btn:focus {
    outline: none;
  }
  .btn:active {
    transform: scale(0.98);
  }
  .btn-block {
    display: block;
    width: 100%;
  }
</style>
