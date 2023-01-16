<template>
  <div>
    <template>
      <v-container fluid>
        <v-row>
          <v-col class="pa-0 ma-0" cols="12">
            <SubmittalSearch />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-data-iterator
              :items="submittals.submittals"
              item-key="_id"
              :items-per-page.sync="itemsPerPage"
              :page.sync="page"
              :search="search"
              :sort-by="sortBy"
              :sort-desc="sortDesc"
              hide-default-footer
            >
              <template v-slot:header>
                <v-toolbar dark color="purple darken-3" class="mb-1">
                  <v-text-field
                    v-model="search"
                    clearable
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Filter"
                  ></v-text-field>
                  <template>
                    <v-spacer></v-spacer>
                    <v-select
                      v-model="sortBy"
                      flat
                      solo-inverted
                      hide-details
                      :items="keys"
                      prepend-inner-icon="mdi-sort"
                      label="Sort by"
                    ></v-select>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="sortDesc" mandatory>
                      <v-btn large depressed color="blue" :value="false">
                        <v-icon>mdi-arrow-up</v-icon>
                      </v-btn>
                      <v-btn large depressed color="blue" :value="true">
                        <v-icon>mdi-arrow-down</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </template>
                </v-toolbar>
                <v-toolbar dark color="blue darken-3" class="mb-1">
                  <v-btn-toggle
                    v-model="submittalFilter.coreType"
                    dense
                    background-color="primary"
                    dark
                    multiple
                  >
                    <v-btn
                      color="purple"
                      v-for="core in coreTypes"
                      :key="core"
                      :value="core"
                    >
                      {{ core }}
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn
                    dense
                    color="red darken-3"
                    @click="() => submittalFilter.coreType = coreTypes"
                  >
                    All
                  </v-btn>                
                  <v-btn
                    dense
                    color="red darken-3"
                    @click="() => submittalFilter.coreType = []"
                  >
                    None
                  </v-btn>
                  <v-btn-toggle
                    v-model="submittalFilter.owner"
                    dense
                    background-color="primary"
                    dark
                    multiple
                  >
                    <v-btn
                      color="green"
                      v-for="owner in owners"
                      :key="owner"
                      :value="owner"
                    >
                      {{ owner }}
                    </v-btn>
                  </v-btn-toggle>
                  <v-btn-toggle
                    dense
                    background-color="primary"
                    multiple
                  >                    
                  <v-btn
                      dense
                      color="grey darken-3"
                      @click="submittalFilter2.peerReviewNeeded = !submittalFilter2.peerReviewNeeded"
                    >
                      Peer Review Needed
                    </v-btn>
                    <v-btn
                      dense
                      color="grey darken-3"
                      @click="submittalFilter2.nrInformed = !submittalFilter2.nrInformed"
                    >
                      NR Informed
                    </v-btn>
                  </v-btn-toggle>
                  {{ submittalFilter.coreType }}
                  {{ submittalFilter.owner }}
                  {{ submittalFilter.peerReviewNeeded }}
                  {{ sortDesc }}
                  <!-- {{ filteredSubmittals }} -->
                </v-toolbar>
              </template>

              <template v-slot:default="{ items }">
                <v-row>
                  <v-col
                    v-for="(item) in items"
                    :key="item._id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    v-show="filteredSubmittals.includes(item)"
                  >
                    <Submittal :submittal="item" />
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
            </v-col>
          </v-row>
      </v-container>
    </template>

    <v-container fluid class="my-1">
      <v-data-table
        :headers="headers"
        :items="submittals.submittals"
        :sort-by="['submittalID', 'owner']"
        :sort-desc="[false, true]"
        multi-sort
        show-expand
        :expanded.sync="expanded"
      >
        <template v-slot:item.submittalID="props">
          <v-edit-dialog
            :return-value.sync="props.item.submittalID"
          >
            {{ props.item.submittalID }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.submittalID"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>          
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            More info about {{ item.submittalID }}
          </td>
        </template>

        <template v-slot:item.priority="{ item }">
        <v-simple-checkbox
          v-model="item.priority"
        ></v-simple-checkbox>
      </template>
      </v-data-table>
    </v-container>
  </div>
</template>


<!-- https://terabytetiger.com/lessons/moving-from-vue-2-to-vue-3-composition-api -->
<script setup>
  import Submittal from './Submittal.vue';
  import SubmittalSearch from './SubmittalSearch.vue';
  import draggable from 'vuedraggable';
  import { useSubmittalsStore } from '../stores/SubmittalsStore'
  import { useProjectsStore } from '../stores/ProjectsStore'
  import { ref, computed } from 'vue'
  import filter from 'lodash/filter';

  const submittals = useSubmittalsStore();
  submittals.getSubmittals();

  const projects = useProjectsStore();
  projects.getProjects();

  // console.log(JSON.stringify(projects.projects));

  // Data
  const itemsPerPageArray = [4, 8, 12];
  const search = ref('');
  const submittalFilter = ref({
    coreType: ['A', 'B', 'C', 'D'],
    owner: []
  });  
  const submittalFilter2 = ref({
    peerReviewNeeded: false,
    nrInformed: false
  });
  const sortDesc = ref(false);
  const page = ref(1);
  const itemsPerPage = ref(10);
  const sortBy = ref('submittalID');
  const keys = [
    { text: 'Submittal ID', value: 'submittalID' },
    { text: 'Need Date', value: 'needDate' },
    { text: 'Owner', value: 'owner' },
    { text: 'Contract', value: 'contract' }
  ];
  const expanded = ref([]);
  const singleExpand = ref(false);
  const max25chars = v => v.length <= 25 || 'Input too long!';
  const pagination = ref({});
  const headers = [
    {
      text: 'Submittal',
      align: 'start',
      value: 'submittalID',
    },
    { text: 'Need Date', value: 'needDate' },
    { text: 'Owner', value: 'owner' },
    { text: 'Priority', value: 'priority' },
    { text: '', value: 'data-table-expand' }
  ];
  const coreTypes = [
    'A',
    'B',
    'C',
    'D'
  ];
  const owners = [
    'Blahsievsky',
    'Blaherson',
    'McBlah',
  ];
  
  const drag = false;

  // Methods
  const close = () => {
    console.log('Dialog closed')
  }

  const selectAllNone = (prop, allNone) => {
    if(allNone = 'all')
    {
      submittalFilter.value[prop] = prop
    }
    else
    {
      submittalFilter.value.prop = []
    }
  }

  const sortUpdate = (project) => {
    // console.log('priority: ' + JSON.stringify(project.prioritySubmittals));
    // console.log('unranked: ' + JSON.stringify(project.unrankedSubmittals));

    projects.updateSubmittalPriorities(project);
    // emit('update-submittal-priorities', project)
  }

  // Computed
  const filteredSubmittals = computed(() => {

    return submittals.submittals.filter((s) => {
      var someArray = [];
      for(const key in submittalFilter.value){
        someArray.push(submittalFilter.value[key].some((i) => {
          return s[key] === i;
        }));
      }

      var everyArray = [];
      for(const key in submittalFilter2.value){
        if(submittalFilter2.value[key]) {
          everyArray.push(s[key] === submittalFilter2.value[key])
        }
        console.log(submittalFilter2.value[key]);
      }

      return [someArray.some(sA => sA)].concat(everyArray).every(e => e);
    });


  });  
</script>

<style scoped>
  .v-select.fit {
    width: min-content;
  }
  .v-select.fit  .v-select__selection--comma {
      text-overflow: unset;
  }

  .handle {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
  }
  .draggable-item {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
    user-select: none;
  }
  .nondraggable-item {
    user-select: none;
  }
  .ghost {
  opacity: 0.5;
  background: darkcyan;
}
  .flip-list-move {
  transition: transform 0.5s;
}
  .no-move {
    transition: transform 0s;
  }
</style>